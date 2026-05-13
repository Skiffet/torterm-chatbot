from __future__ import annotations

import os
import base64
import requests as http_requests
from dotenv import load_dotenv
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .prompts import build_chat_prompt, build_vision_prompt
from .rag import retrieve_products, format_products_for_prompt

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_HF_TOKEN = os.getenv("HF_TOKEN", "")
_HF_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
_GEMINI_MODEL = "gemini-2.5-flash"


def _build_image_prompt(message: str, products: list[dict]) -> str:
    materials = ", ".join(
        f"{p['name'].split()[0]} {p.get('brand', '')}".strip()
        for p in products[:3]
    )
    return (
        f"photorealistic exterior house renovation, modern Thai house, "
        f"{message}, white walls, clean modern style, "
        f"materials: {materials}, "
        f"architectural photography, bright daylight, high quality, 4k"
    )


def _generate_image(prompt: str) -> tuple[str | None, str | None]:
    """Call HuggingFace FLUX to generate a renovation concept image.
    Returns (base64_string, mime_type) or (None, None) on failure."""
    if not _HF_TOKEN:
        return None, None
    try:
        resp = http_requests.post(
            _HF_URL,
            headers={"Authorization": f"Bearer {_HF_TOKEN}"},
            json={"inputs": prompt},
            timeout=60,
        )
        content_type = resp.headers.get("content-type", "")
        if resp.status_code == 200 and content_type.startswith("image/"):
            return base64.b64encode(resp.content).decode("utf-8"), content_type.split(";")[0]
    except Exception:
        pass
    return None, None


@api_view(["POST"])
def chat_endpoint(request):
    """Text-only chat — user describes what they want, bot recommends products."""
    message = request.data.get("message", "").strip()
    if not message:
        return Response({"error": "Message is required"}, status=400)

    try:
        products = retrieve_products(message, n_results=5)
    except RuntimeError as e:
        return Response({"error": str(e)}, status=503)

    prompt = build_chat_prompt(message, format_products_for_prompt(products))
    response = _client.models.generate_content(model=_GEMINI_MODEL, contents=prompt)
    return Response({"bot_response": response.text, "products": products})


@api_view(["POST"])
def analyze_house(request):
    """
    Main Torterm endpoint.
    Accepts a house photo + renovation description, then:
      1. Finds matching HomePro products via RAG
      2. Uses Gemini Vision to recommend which material goes where
      3. Generates a renovation concept image via HuggingFace FLUX

    Request: multipart/form-data
        image   — house photo (jpg / png / webp)
        message — e.g. "อยากได้สไตล์โมเดิร์น สีขาว ดูสะอาด"

    Response:
        analysis        — Thai text breakdown by area + cost estimate
        products        — matched HomePro products
        renovated_image — base64 concept image (null if HF_TOKEN not set)
        renovated_mime  — image MIME type
        image_prompt    — English prompt sent to FLUX (useful for debugging)
    """
    image_file = request.FILES.get("image")
    message = request.data.get("message", "").strip()

    if not image_file:
        return Response({"error": "House photo required (field: 'image')"}, status=400)
    if not message:
        return Response({"error": "Renovation description required (field: 'message')"}, status=400)

    mime_type = image_file.content_type or "image/jpeg"
    if mime_type not in {"image/jpeg", "image/png", "image/webp", "image/heic"}:
        return Response({"error": f"Unsupported image type: {mime_type}"}, status=400)

    image_bytes = image_file.read()
    if len(image_bytes) > 20 * 1024 * 1024:
        return Response({"error": "Image must be under 20 MB"}, status=400)

    try:
        products = retrieve_products(message, n_results=5)
    except RuntimeError as e:
        return Response({"error": str(e)}, status=503)

    # Gemini Vision — analyze photo and recommend materials per area
    vision_prompt = build_vision_prompt(message, format_products_for_prompt(products))
    analysis = _client.models.generate_content(
        model=_GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            vision_prompt,
        ],
    ).text

    # HuggingFace FLUX — generate renovation concept image
    image_prompt = _build_image_prompt(message, products)
    renovated_image, renovated_mime = _generate_image(image_prompt)

    return Response({
        "analysis": analysis,
        "products": products,
        "renovated_image": renovated_image,
        "renovated_mime": renovated_mime,
        "image_prompt": image_prompt,
    })
