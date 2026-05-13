"""
One-time script — embeds all scraped products into ChromaDB.
Run whenever you add new scraped data.

Usage:
    cd backend
    python ingest_products.py           # skips if already ingested
    python ingest_products.py --force   # wipes and re-ingests everything
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from chatbot.rag import ingest_products

if __name__ == "__main__":
    ingest_products(force="--force" in sys.argv)
