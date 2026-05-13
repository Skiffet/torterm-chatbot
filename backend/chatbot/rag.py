from __future__ import annotations

import json
import chromadb
from google import genai
from google.genai import types
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CHROMA_DIR = Path(__file__).resolve().parent.parent / "chroma_db"
COLLECTION_NAME = "homepro_products"

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        import os
        from dotenv import load_dotenv
        load_dotenv()
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client


def _get_collection():
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def _embed(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list:
    result = _get_client().models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    return result.embeddings[0].values


def _load_all_products() -> list[dict]:
    seen_skus: set[str] = set()
    products = []
    for json_file in DATA_DIR.glob("*.json"):
        with open(json_file, encoding="utf-8") as f:
            for product in json.load(f):
                sku = str(product.get("sku", ""))
                if sku and sku in seen_skus:
                    continue
                seen_skus.add(sku)
                products.append(product)
    return products


def ingest_products(force: bool = False) -> int:
    """Embed all products and store in ChromaDB. Returns number of products ingested."""
    collection = _get_collection()

    if not force and collection.count() > 0:
        print(f"ChromaDB already has {collection.count()} products. Use force=True to re-ingest.")
        return 0

    products = _load_all_products()
    print(f"Ingesting {len(products)} products into ChromaDB...")

    ids, embeddings, documents, metadatas = [], [], [], []

    for i, product in enumerate(products):
        text_to_embed = " ".join(filter(None, [
            product.get("name", ""),
            product.get("description", "")[:500],
            product.get("category", ""),
            product.get("brand", ""),
        ]))

        embedding = _embed(text_to_embed, task_type="RETRIEVAL_DOCUMENT")

        ids.append(str(product.get("sku", i)))
        embeddings.append(embedding)
        documents.append(text_to_embed)
        metadatas.append({
            "name": product.get("name", ""),
            "price": str(product.get("price", "")),
            "original_price": str(product.get("original_price", "")),
            "category": product.get("category", ""),
            "brand": product.get("brand", ""),
            "image": product["images"][0] if product.get("images") else "",
            "url": product.get("url", ""),
        })

        print(f"  [{i + 1}/{len(products)}] {product.get('name', '')[:60]}")

    collection.upsert(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
    print(f"\nDone! {len(products)} products stored in ChromaDB.")
    return len(products)


def retrieve_products(query: str, n_results: int = 5) -> list[dict]:
    """Find the most relevant products for a user query."""
    collection = _get_collection()

    if collection.count() == 0:
        raise RuntimeError(
            "ChromaDB is empty. Run `python ingest_products.py` first to embed your data."
        )

    query_embedding = _embed(query, task_type="RETRIEVAL_QUERY")

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
        include=["metadatas", "distances"],
    )

    products = []
    for metadata, distance in zip(results["metadatas"][0], results["distances"][0]):
        products.append({**metadata, "similarity_score": round(1 - distance, 3)})

    return products


def format_products_for_prompt(products: list[dict]) -> str:
    """Format retrieved products as a readable block for the Gemini prompt."""
    lines = []
    for p in products:
        lines.append(
            f"- ชื่อ: {p['name']}\n"
            f"  หมวดหมู่: {p['category']} | แบรนด์: {p.get('brand', '-')}\n"
            f"  ราคา: {p['price']} บาท"
            + (f" (ลดจาก {p['original_price']} บาท)" if p.get("original_price") and p["original_price"] != p["price"] else "")
            + f"\n  ลิงก์รูป: {p.get('image', '-')}\n"
        )
    return "\n".join(lines)
