import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from src.tts_engine import synthesize_to_file

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def get_client():
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    return genai.Client(api_key=GEMINI_API_KEY)

def generate_gemini_summary(text, mode="standard", language="en"):
    try:
        client = get_client()
        
        prompts = {
            "quick": "Summarize the following text in 3-5 concise bullet points:",
            "standard": "Provide a standard 1-paragraph summary of the following text:",
            "deep": "Provide a detailed summary of the following text, including key takeaways and section breakdowns:"
        }
        
        prompt_intro = prompts.get(mode, prompts["standard"])
        
        if language != "en":
            prompt_intro += f" (Please respond in {language})"

        full_prompt = f"{prompt_intro}\n\n{text}"

        # Use gemini-2.5-flash (CONFIRMED WORKING)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        
        return response.text
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise ValueError("Gemini API rate limit exceeded. Please wait a moment and try again, or use Standard (DistilBART) mode.")
        else:
            raise e

def generate_gemini_tts(text, voice="Puck", output_path="results/gemini_audio.mp3", language="en"):
    try:
        client = get_client()
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Using the dedicated TTS model: gemini-2.5-flash-tts
        response = client.models.generate_content(
            model="gemini-2.5-flash-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice
                        )
                    )
                )
            )
        )
        
        with open(output_path, "wb") as f:
            f.write(response.candidates[0].content.parts[0].inline_data.data)
            
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print(f"⚠️ Gemini TTS rate limit exceeded. Falling back to standard TTS.")
        else:
            print(f"⚠️ Gemini TTS Failed: {e}. Falling back to standard TTS.")
        # Fallback to standard gTTS with the correct language
        synthesize_to_file(text, language, output_path)
    
    return output_path
