"""
CLI for testing the Torterm chatbot locally.

Usage:
    cd backend
    python torterm_bot.py
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
    sys.exit("ERROR: GEMINI_API_KEY not found in .env")

_client = genai.Client(api_key=api_key)

from chatbot.prompts import build_chat_prompt
from chatbot.rag import retrieve_products, format_products_for_prompt


def chat(message: str) -> str:
    products = retrieve_products(message, n_results=5)
    prompt = build_chat_prompt(message, format_products_for_prompt(products))
    return _client.models.generate_content(model="gemini-2.5-flash", contents=prompt).text


if __name__ == "__main__":
    print("=" * 60)
    print("Torterm — Home Renovation AI Assistant")
    print("Type 'exit' to quit")
    print("=" * 60 + "\n")

    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() == "exit":
            break
        print("\n[Thinking...]\n" + "-" * 40)
        try:
            print(f"Torterm:\n{chat(user_input)}")
        except RuntimeError as e:
            print(f"Error: {e}")
        print("=" * 60 + "\n")
