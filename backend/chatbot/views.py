from __future__ import annotations

import os
import base64
import traceback
from dotenv import load_dotenv
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .prompts import build_chat_prompt, build_vision_prompt
from .rag import retrieve_products, format_products_for_prompt

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_GEMINI_MODEL = "gemini-2.5-flash"
_GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image"


def _renovate_image(
    image_bytes: bytes,
    mime_type: str,
    message: str,
    products: list[dict],
) -> tuple[str | None, str | None]:
    """Edit the uploaded house photo using Gemini img2img.
    Keeps the same house structure/angle and applies the renovation style.
    Returns (base64_string, mime_type) or (None, None) on failure."""
    materials = ", ".join(
        f"{p['name']} by {p.get('brand', '')}" for p in products[:4]
    )
    prompt = (
        f"Renovate this exact house: {message}. "
        f"Keep the same house structure, roof shape, camera angle, perspective, "
        f"trees, and surroundings — only change the exterior finish and materials. "
        f"Apply these materials: {materials}. "
        f"Photorealistic, high-quality architectural visualization."
    )
    try:
        response = _client.models.generate_content(
            model=_GEMINI_IMAGE_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                        types.Part.from_text(text=prompt),
                    ],
                )
            ],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"]
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                b64 = base64.b64encode(part.inline_data.data).decode("utf-8")
                return b64, part.inline_data.mime_type
    except Exception:
        print(f"[Torterm] Image renovation failed:\n{traceback.format_exc()}")
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
    1. RAG — find matching products from the catalog
    2. Gemini Vision — analyze photo, recommend which material goes where + cost estimate
    3. Gemini img2img — edit the uploaded house photo to show the renovation result
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

    products_block = format_products_for_prompt(products)

    # Step 2: Gemini Vision — recommend which material goes on which part + cost
    vision_prompt = build_vision_prompt(message, products_block)
    analysis = _client.models.generate_content(
        model=_GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            vision_prompt,
        ],
    ).text

    # Step 3: Gemini img2img — renovate the actual uploaded house photo
    renovated_image, renovated_mime = _renovate_image(image_bytes, mime_type, message, products)

    return Response({
        "analysis": analysis,
        "products": products,
        "renovated_image": renovated_image,
        "renovated_mime": renovated_mime,
    })
