"""Run: python list_models.py — lists all Gemini models available to your API key."""
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("All models that support generateContent:")
for m in client.models.list():
    name = m.name
    actions = getattr(m, "supported_actions", []) or []
    if "generateContent" in actions:
        print(f"  {name}")

print("\nAll models (full list):")
for m in client.models.list():
    print(f"  {m.name}")
