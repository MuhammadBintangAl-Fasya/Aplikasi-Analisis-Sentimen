import os
import json
import aiohttp
import time
from datetime import datetime
from typing import Dict, List
from dotenv import load_dotenv
import google.generativeai as genai

# --- SYSTEM LOGGER CONFIGURATION ---
def sys_log(level: str, source: str, message: str):
    """Custom logger for cleaner, tech-style output"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    # Design symbols
    indicators = {
        "INFO":  "ii", 
        "SUCCESS": "OK", 
        "WARN":  "!!", 
        "ERROR": "XX", 
        "PROCESS": ">>"
    }
    
    tag = indicators.get(level, "..")
    print(f"[{timestamp}] {tag} | {source.ljust(10)} : {message}")

# Load environment variables
load_dotenv()
sys_log("INFO", "SYSTEM", "Initializing AI Services...")

# --- STEP 1: LOAD KEYS ---
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Check Keys
if GEMINI_API_KEY:
    sys_log("SUCCESS", "AUTH", "Gemini API Key loaded.")
    genai.configure(api_key=GEMINI_API_KEY)
else:
    sys_log("ERROR", "AUTH", "Gemini API Key MISSING in .env")

if HUGGINGFACE_TOKEN:
    sys_log("SUCCESS", "AUTH", "HuggingFace Token loaded.")
else:
    sys_log("ERROR", "AUTH", "HuggingFace Token MISSING in .env")


# --- CONFIGURATION ---
# Menggunakan URL router baru (Stable)
HF_API_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment"
HF_HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}


async def analyze_sentiment(text: str) -> Dict[str, any]:
    """
    Analyze sentiment using Hugging Face (Roberta Model).
    """
    sys_log("PROCESS", "SENTIMENT", f"Analyzing: {text[:30]}...")
    start_time = time.time()
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {"inputs": text}
            
            async with session.post(
                HF_API_URL,
                headers=HF_HEADERS,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    sys_log("WARN", "SENTIMENT", f"API Status {response.status}")
                    raise Exception(f"HF Error: {error_text}")
                
                result = await response.json()
                
                # Handling structure difference
                if isinstance(result, list) and len(result) > 0:
                    predictions = result[0] if isinstance(result[0], list) else result
                    
                    # Cari score tertinggi
                    top_prediction = max(predictions, key=lambda x: x['score'])
                    
                    label = top_prediction['label'].lower()
                    score = top_prediction['score']
                    
                    elapsed = round(time.time() - start_time, 2)
                    sys_log("SUCCESS", "SENTIMENT", f"Result: {label.upper()} ({score:.2f}) [{elapsed}s]")
                    
                    return {
                        "sentiment": label,
                        "score": round(score, 4)
                    }
                else:
                    raise Exception("Invalid response format from HF")
                    
    except Exception as e:
        sys_log("ERROR", "SENTIMENT", f"Analysis Failed: {str(e)[:50]}...")
        return {"sentiment": "neutral", "score": 0.5}


async def extract_key_points(review_text: str, product_name: str) -> List[str]:
    """
    Extract key points using Google Gemini.
    """
    if not GEMINI_API_KEY:
        sys_log("ERROR", "GEMINI", "Aborting: No API Key.")
        return ["Analysis unavailable (Missing API Key)"]

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
Role: Expert Product Analyst.
Product: "{product_name}"
User Review: "{review_text}"

Instruction:
Generate 3-5 key points based on the review.

CRITICAL RULES FOR SHORT REVIEWS:
If the review is VERY SHORT or VAGUE (e.g., "Biasa saja", "Just okay", "Bad", "Good"):
1. Do NOT just repeat the review.
2. You MUST use your external knowledge about {product_name} to deduce WHY the user might feel that way.
   - Example Input: Product "iPhone 15", Review "Biasa saja".
   - Your Inference: The user likely means "Lack of major design changes", "Screen still 60Hz", "Price to performance ratio".
3. If the review is DETAILED, stick strictly to the text provided.

LANGUAGE RULES:
- If review is Indonesian -> Output points in INDONESIAN.
- If review is English -> Output points in ENGLISH.

Format: Return ONLY a raw JSON array of strings.
Example Output: ["Poin 1", "Poin 2", "Poin 3"]"""

        sys_log("PROCESS", "GEMINI", "Extracting points (Smart Context)...")
        response = model.generate_content(prompt)
        
        # Cleaning response
        text_resp = response.text.replace('```json', '').replace('```', '').strip()
        
        try:
            key_points = json.loads(text_resp)
            if isinstance(key_points, list):
                sys_log("SUCCESS", "GEMINI", f"Extracted {len(key_points)} points.")
                return key_points[:5]
            return [text_resp]
        except:
            sys_log("WARN", "GEMINI", "JSON parse failed, using fallback.")
            return [line.strip("- *") for line in text_resp.split('\n') if line.strip()][:3]
            
    except Exception as e:
        sys_log("ERROR", "GEMINI", f"Extraction Error: {str(e)[:50]}...")
        return ["Gagal melakukan analisis"]