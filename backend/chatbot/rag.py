from __future__ import annotations

import os
import json
import chromadb
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CHROMA_DIR = Path(__file__).resolve().parent.parent / "chroma_db"
COLLECTION_NAME = "homepro_products"

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def _get_collection() -> chromadb.Collection:
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def _embed(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list:
    result = _client.models.embed_content(
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
    """Embed all products and store in ChromaDB. Returns number ingested."""
    collection = _get_collection()

    if not force and collection.count() > 0:
        print(f"ChromaDB already has {collection.count()} products. Use --force to re-ingest.")
        return 0

    products = _load_all_products()
    print(f"Ingesting {len(products)} products...")

    ids, embeddings, documents, metadatas = [], [], [], []

    for i, p in enumerate(products):
        text = " ".join(filter(None, [
            p.get("name", ""),
            p.get("description", "")[:500],
            p.get("category", ""),
            p.get("brand", ""),
        ]))
        ids.append(str(p.get("sku", i)))
        embeddings.append(_embed(text, task_type="RETRIEVAL_DOCUMENT"))
        documents.append(text)
        metadatas.append({
            "name": p.get("name", ""),
            "price": str(p.get("price", "")),
            "original_price": str(p.get("original_price", "")),
            "category": p.get("category", ""),
            "brand": p.get("brand", ""),
            "image": p["images"][0] if p.get("images") else "",
            "url": p.get("url", ""),
        })
        print(f"  [{i + 1}/{len(products)}] {p.get('name', '')[:60]}")

    collection.upsert(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
    print(f"\nDone! {len(products)} products stored.")
    return len(products)


def retrieve_products(query: str, n_results: int = 5) -> list[dict]:
    """Return the most relevant products for a query using vector similarity."""
    collection = _get_collection()

    if collection.count() == 0:
        raise RuntimeError(
            "ChromaDB is empty. Run `python ingest_products.py` first."
        )

    results = collection.query(
        query_embeddings=[_embed(query, task_type="RETRIEVAL_QUERY")],
        n_results=min(n_results, collection.count()),
        include=["metadatas", "distances"],
    )

    return [
        {**meta, "similarity_score": round(1 - dist, 3)}
        for meta, dist in zip(results["metadatas"][0], results["distances"][0])
    ]


def format_products_for_prompt(products: list[dict]) -> str:
    """Format product list as a readable text block for Gemini prompts."""
    lines = []
    for p in products:
        price_text = f"{p['price']} บาท"
        if p.get("original_price") and p["original_price"] != p["price"]:
            price_text += f" (ลดจาก {p['original_price']} บาท)"
        lines.append(
            f"- ชื่อ: {p['name']}\n"
            f"  หมวดหมู่: {p['category']} | แบรนด์: {p.get('brand', '-')}\n"
            f"  ราคา: {price_text}\n"
            f"  รูป: {p.get('image', '-')}\n"
        )
    return "\n".join(lines)
