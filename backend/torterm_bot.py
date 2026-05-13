import os
import google.generativeai as genai
from dotenv import load_dotenv
from scraper import get_thai_materials

# Load API key from .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API Key not found. Please check your .env file.")

genai.configure(api_key=api_key)

# We use the gemini-2.5-flash model for fast text generation
model = genai.GenerativeModel('gemini-2.5-flash')

def chat_with_torterm(user_request):
    # 1. Get the scraped data (The 'R' in RAG)
    available_materials = get_thai_materials()
    
    # 2. Build the Prompt with System Instructions and Data (The 'A' in RAG)
    prompt = f"""
    You are Torterm, an expert Thai house exterior renovation consultant.
    Your goal is to recommend a design and calculate a rough estimate based on the user's request.
    
    CRITICAL RULE: You MUST ONLY recommend materials from the 'Available Thai Materials' list provided below. 
    Do not invent materials. If a material isn't in the list, tell the user you don't currently have it in stock.

    Available Thai Materials:
    {available_materials}

    User Request: "{user_request}"
    
    Please provide:
    1. A short, friendly confirmation of their design idea.
    2. A list of the specific products from the available materials that fit their request, including prices.
    """
    
    print("\n[Torterm] Thinking...\n" + "-"*40)
    
    # 3. Generate the response (The 'G' in RAG)
    response = model.generate_content(prompt)
    
    return response.text

# --- Testing the Chatbot ---
if __name__ == "__main__":
    print("Welcome to Torterm Developer Test Console!")
    print("Type 'exit' to quit.\n")
    
    while True:
        user_input = input("Homeowner: ")
        if user_input.lower() == 'exit':
            break
            
        bot_response = chat_with_torterm(user_input)
        print(f"\nTorterm Bot:\n{bot_response}\n")
        print("="*60 + "\n")
        