"""
Standalone CLI for testing the Torterm RAG chatbot.
Run from the backend/ directory:
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
    print("ERROR: GEMINI_API_KEY not found in .env")
    sys.exit(1)

_client = genai.Client(api_key=api_key)

from chatbot.rag import retrieve_products, format_products_for_prompt

SYSTEM_PROMPT = """คุณคือ "ต้อเติม" (Torterm) ผู้เชี่ยวชาญด้านการออกแบบและปรับปรุงบ้านภายนอก
คุณช่วยแนะนำวัสดุก่อสร้างและของตกแต่งจาก HomePro

กฎสำคัญ:
- แนะนำเฉพาะสินค้าที่อยู่ในรายการ "สินค้าที่เกี่ยวข้อง" ด้านล่างเท่านั้น
- ถ้าไม่มีสินค้าที่ตรงกับความต้องการ ให้บอกผู้ใช้ตรงๆ ว่ายังไม่มีสินค้านั้นในระบบ
- บอกราคาเป็นบาทเสมอ
- ตอบเป็นภาษาไทย เป็นมิตร และกระชับ"""


def chat(user_message: str) -> str:
    relevant_products = retrieve_products(user_message, n_results=5)
    products_block = format_products_for_prompt(relevant_products)

    prompt = f"""{SYSTEM_PROMPT}

สินค้าที่เกี่ยวข้อง (จากฐานข้อมูล HomePro):
{products_block}

คำถาม/ความต้องการของลูกค้า: "{user_message}"

กรุณาแนะนำสินค้าที่เหมาะสมจากรายการด้านบน พร้อมอธิบายว่าเหมาะสมอย่างไร"""

    response = _client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text


if __name__ == "__main__":
    print("=" * 60)
    print("ยินดีต้อนรับสู่ ต้อเติม (Torterm) - ที่ปรึกษาปรับปรุงบ้าน")
    print("พิมพ์ 'exit' เพื่อออก")
    print("=" * 60 + "\n")

    while True:
        user_input = input("คุณ: ").strip()
        if not user_input:
            continue
        if user_input.lower() == "exit":
            break

        print("\n[ต้อเติมกำลังคิด...]\n" + "-" * 40)
        try:
            reply = chat(user_input)
            print(f"ต้อเติม:\n{reply}")
        except RuntimeError as e:
            print(f"Error: {e}")
        print("=" * 60 + "\n")
