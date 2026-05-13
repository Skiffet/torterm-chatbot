from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Import your scraper function from the script you already wrote
# (Make sure scraper.py is in the same directory or adjust the import)
from scraper import get_thai_materials 

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

@api_view(['POST'])
def chat_endpoint(request):
    # 1. Get the message sent from the React frontend
    user_request = request.data.get('message', '')
    
    if not user_request:
        return Response({"error": "Message is required"}, status=400)

    # 2. Get the scraped data
    available_materials = get_thai_materials()
    
    # 3. Build the prompt
    prompt = f"""
    You are Torterm, an expert Thai house exterior renovation consultant...
    Available Thai Materials: {available_materials}
    User Request: "{user_request}"
    """
    
    # 4. Generate the response
    response = model.generate_content(prompt)
    
    # 5. Send it back to the web as JSON
    return Response({
        "bot_response": response.text
    })
