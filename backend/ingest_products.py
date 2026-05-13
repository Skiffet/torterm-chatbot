"""
One-time script to embed all scraped products and store them in ChromaDB.
Run this ONCE after scraping, and again whenever you scrape new products.

Usage:
    cd backend
    python ingest_products.py          # ingest if DB is empty
    python ingest_products.py --force  # re-ingest everything (wipe & rebuild)
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()

from google import genai

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found.")
    print("  1. Go to https://aistudio.google.com/app/apikey and create a free key.")
    print("  2. Create a file called .env in the backend/ folder.")
    print("  3. Add this line: GEMINI_API_KEY=your_key_here")
    sys.exit(1)

# Initialize client so rag.py picks it up via _get_client()
os.environ["GEMINI_API_KEY"] = api_key

from chatbot.rag import ingest_products

if __name__ == "__main__":
    force = "--force" in sys.argv
    ingest_products(force=force)
