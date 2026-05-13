from __future__ import annotations

import os
import base64
import requests as http_requests
from google import genai
from google.genai import types
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .rag import retrieve_products, format_products_for_prompt

load_dotenv()
_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_HF_TOKEN = os.getenv("HF_TOKEN", "")

# HuggingFace FLUX.1-schnell for renovation concept visualization
_HF_MODEL_URL = (
    "https://router.huggingface.co/hf-inference/models/"
    "black-forest-labs/FLUX.1-schnell"
)

# ─── Prompts ─────────────────────────────────────────────────────────────────

_CHAT_SYSTEM = """คุณคือ "ต้อเติม" (Torterm) ผู้เชี่ยวชาญด้านการออกแบบและปรับปรุงบ้านภายนอก
คุณช่วยแนะนำวัสดุก่อสร้างและของตกแต่งจาก HomePro

กฎสำคัญ:
- แนะนำเฉพาะสินค้าที่อยู่ในรายการ "สินค้าที่เกี่ยวข้อง" เท่านั้น
- ถ้าไม่มีสินค้าที่ตรงกับความต้องการ ให้บอกตรงๆ
- บอกราคาเป็นบาทเสมอ
- ตอบเป็นภาษาไทย เป็นมิตร กระชับ"""

_VISION_PROMPT = """คุณคือ "ต้อเติม" ที่ปรึกษาปรับปรุงบ้านภายนอกจาก HomePro

ดูรูปบ้านหลังนี้และความต้องการของลูกค้า แล้วแนะนำว่าแต่ละส่วนของบ้านควรใช้วัสดุอะไร

กฎสำคัญ:
- ใช้เฉพาะสินค้าจากรายการ "สินค้าแนะนำ" ด้านล่างเท่านั้น
- ระบุชื่อสินค้า ราคา และบอกว่าใช้ที่ส่วนไหนของบ้าน
- บอกเหตุผลสั้นๆ ว่าทำไมวัสดุนั้นถึงเหมาะ
- คำนวณค่าใช้จ่ายโดยประมาณรวม
- ตอบเป็นภาษาไทย เป็นมิตร"""


# ─── Image generation helper ─────────────────────────────────────────────────

def _build_image_prompt(user_message: str, products: list[dict]) -> str:
    """Turn the renovation request + products into an SD-friendly English prompt."""
    material_names = ", ".join(
        p["name"].split(" ")[0] + " " + p.get("brand", "")
        for p in products[:3]
    )
    return (
        f"photorealistic exterior house renovation, modern Thai house, "
        f"{user_message}, white walls, clean modern style, "
        f"materials: {material_names}, "
        f"architectural photography, bright daylight, high quality, 4k"
    )


def _generate_renovation_image(prompt: str) -> tuple[str | None, str]:
    """
    Call HuggingFace SDXL to generate a renovation concept image.
    Returns (base64_string, mime_type) or (None, "") on failure.
    """
    if not _HF_TOKEN:
        return None, ""

    try:
        resp = http_requests.post(
            _HF_MODEL_URL,
            headers={"Authorization": f"Bearer {_HF_TOKEN}"},
            json={"inputs": prompt},
            timeout=60,
        )
        if resp.status_code == 200 and resp.headers.get("content-type", "").startswith("image/"):
            b64 = base64.b64encode(resp.content).decode("utf-8")
            mime = resp.headers.get("content-type", "image/jpeg").split(";")[0]
            return b64, mime
        # Model still loading (503) or quota hit — return None gracefully
        return None, ""
    except Exception:
        return None, ""


# ─── Endpoints ───────────────────────────────────────────────────────────────

@api_view(["POST"])
def chat_endpoint(request):
    """Text-only chat: user describes what they want, bot recommends products."""
    user_message = request.data.get("message", "").strip()
    if not user_message:
        return Response({"error": "Message is required"}, status=400)

    try:
        relevant_products = retrieve_products(user_message, n_results=5)
    except RuntimeError as e:
        return Response({"error": str(e)}, status=503)

    products_block = format_products_for_prompt(relevant_products)
    prompt = (
        f"{_CHAT_SYSTEM}\n\n"
        f"สินค้าที่เกี่ยวข้อง (จากฐานข้อมูล HomePro):\n{products_block}\n\n"
        f"คำถาม/ความต้องการของลูกค้า: \"{user_message}\"\n\n"
        f"กรุณาแนะนำสินค้าที่เหมาะสม พร้อมอธิบายว่าเหมาะสมอย่างไร"
    )
    response = _client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return Response({"bot_response": response.text, "products": relevant_products})


@api_view(["POST"])
def analyze_house(request):
    """
    Main Torterm endpoint.

    1. Receives house photo + renovation description
    2. RAG → finds the 5 most relevant HomePro products
    3. Gemini Vision → analyzes the photo and explains which material
       goes on which part of the house (with prices)
    4. HuggingFace SDXL → generates a renovation concept image
       (requires HF_TOKEN in .env — free at huggingface.co)

    Request:  multipart/form-data
        image   — house photo (jpg / png / webp)
        message — e.g. "อยากได้สไตล์โมเดิร์น สีขาว ดูสะอาด"

    Response JSON:
        analysis          — Thai text: per-area material breakdown + cost estimate
        products          — matched HomePro product objects (name, price, image, url)
        renovated_image   — base64 concept image (null if HF_TOKEN not set)
        renovated_mime    — mime type of the generated image
        image_prompt      — the English prompt sent to Stable Diffusion
    """
    image_file = request.FILES.get("image")
    user_message = request.data.get("message", "").strip()

    if not image_file:
        return Response({"error": "House photo is required (field: 'image')"}, status=400)
    if not user_message:
        return Response({"error": "Renovation description is required (field: 'message')"}, status=400)

    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/heic"}
    mime_type = image_file.content_type or "image/jpeg"
    if mime_type not in allowed_types:
        return Response({"error": f"Unsupported image type: {mime_type}"}, status=400)

    image_bytes = image_file.read()
    if len(image_bytes) > 20 * 1024 * 1024:
        return Response({"error": "Image too large. Please use a photo under 20 MB."}, status=400)

    # ── Step 1: RAG ──────────────────────────────────────────────────────────
    try:
        relevant_products = retrieve_products(user_message, n_results=5)
    except RuntimeError as e:
        return Response({"error": str(e)}, status=503)

    products_block = format_products_for_prompt(relevant_products)

    # ── Step 2: Gemini Vision — analyze photo + recommend materials ───────────
    vision_prompt = (
        f"{_VISION_PROMPT}\n\n"
        f"ความต้องการของลูกค้า: \"{user_message}\"\n\n"
        f"สินค้าแนะนำจาก HomePro:\n{products_block}"
    )
    vision_response = _client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            vision_prompt,
        ],
    )

    # ── Step 3: HuggingFace SDXL — generate renovation concept image ──────────
    image_prompt = _build_image_prompt(user_message, relevant_products)
    renovated_image_b64, renovated_mime = _generate_renovation_image(image_prompt)

    return Response({
        "analysis": vision_response.text,
        "products": relevant_products,
        "renovated_image": renovated_image_b64,      # base64 string or null
        "renovated_mime": renovated_mime or None,
        "image_prompt": image_prompt,                 # for debugging / display
    })
