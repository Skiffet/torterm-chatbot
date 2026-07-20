"""
Merges and cleans all raw scraped product JSON files in /data into a single
RAG-ready dataset.

Usage:
    cd scraper
    python clean_data.py
"""
import json
import re
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = DATA_DIR / "cleaned_materials.json"


def clean_text(text: Optional[str]) -> str:
    """Collapse scraped whitespace artifacts (\\t, \\n, \\xa0) into single spaces."""
    if not text:
        return ""
    text = text.replace("\xa0", " ")
    text = re.sub(r"[\t\n\r]+", " ", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


def parse_number(value) -> Optional[float]:
    """Convert a scraped price string to a float, or None if missing/non-numeric."""
    if value is None:
        return None
    text = str(value).replace(",", "").strip()
    if not text:
        return None
    match = re.search(r"\d+(?:\.\d+)?", text)
    return float(match.group()) if match else None


def load_raw_products() -> list[dict]:
    records = []
    for json_file in sorted(DATA_DIR.glob("*.json")):
        if json_file == OUTPUT_FILE:
            continue
        with open(json_file, encoding="utf-8") as f:
            records.extend(json.load(f))
    return records


def build_record(raw: dict) -> dict:
    description = clean_text(raw.get("description"))
    specs = clean_text(raw.get("specs"))

    embedding_text = ". ".join(
        part for part in [raw.get("name"), raw.get("category"), description, specs] if part
    )

    return {
        "id": raw.get("sku"),
        "embedding_text": embedding_text,
        "metadata": {
            "sku": raw.get("sku"),
            "brand": raw.get("brand"),
            "category": raw.get("category"),
            "price": parse_number(raw.get("price")),
            "original_price": parse_number(raw.get("original_price")),
            "url": raw.get("url"),
            "images": raw.get("images") or [],
        },
    }


def main():
    raw_products = load_raw_products()
    total_read = len(raw_products)

    deduped: dict[str, dict] = {}
    for raw in raw_products:
        sku = raw.get("sku")
        if sku and sku not in deduped:
            deduped[sku] = raw

    duplicates_removed = total_read - len(deduped)
    records = [build_record(raw) for raw in deduped.values()]
    missing_price = sum(1 for r in records if r["metadata"]["price"] is None)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Total input records read: {total_read}")
    print(f"Duplicates removed: {duplicates_removed}")
    print(f"Final record count: {len(records)}")
    print(f"Records with missing price: {missing_price}")
    print(f"Written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
