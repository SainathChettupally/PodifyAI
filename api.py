
import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import uuid
from src.extractors import detect_and_extract_text
from src.summarizer import summarize
from src.translator import translate_text
from src.tts_engine import synthesize_to_file
from src.gemini_service import generate_gemini_summary, generate_gemini_tts

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

@app.route('/api/summarize', methods=['POST'])
def summarize_endpoint():
    start_time = time.time()
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    mode = request.form.get('mode', 'standard')
    language = request.form.get('language', 'en')
    model_type = request.form.get('model_type', 'standard') # 'standard' (DistilBART) or 'gemini'

    _, ext = os.path.splitext(file.filename)
    temp_filename = os.path.join(UPLOAD_FOLDER, str(uuid.uuid4()) + ext)
    file.save(temp_filename)

    try:
        # 1. Extraction
        extract_start = time.time()
        text = detect_and_extract_text(temp_filename)
        extract_time = time.time() - extract_start

        # 2. Summarization
        summary_start = time.time()
        if model_type == 'gemini':
            # Gemini handles translation implicitly if requested, but for consistency with 
            # the existing pipeline structure, we'll ask it to summarize in English first 
            # (or the target language directly if we want to skip the translation step).
            # To keep the "Original" vs "Translated" tabs working as expected:
            # We will generate an English summary first, then translate it.
            # OR we can ask Gemini to generate the summary in the target language directly.
            # Let's stick to the pipeline: Summary (En) -> Translate -> Audio
            
            # Actually, Gemini is smart enough to summarize AND translate. 
            # But the UI expects "originalSummary" and "translatedSummary".
            # Let's generate "originalSummary" in English (or detected lang) first.
            original_summary = generate_gemini_summary(text, mode, "en")
        else:
            original_summary = summarize(text, mode)
        summary_time = time.time() - summary_start

        # 3. Translation
        translate_start = time.time()
        if language != 'en':
            if model_type == 'gemini':
                 # We could use Gemini for translation too, but deep-translator is fast and free.
                 # Let's stick to deep-translator for now to minimize token usage, 
                 # or use Gemini if deep-translator fails. 
                 # For now, keep existing translator for consistency unless user requested Gemini everywhere.
                 # Let's use the existing translator to keep the comparison fair on the "Summarizer" part.
                 translated_summary = translate_text(original_summary, language)
            else:
                translated_summary = translate_text(original_summary, language)
        else:
            translated_summary = original_summary
        translate_time = time.time() - translate_start

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

    total_time = time.time() - start_time

    return jsonify({
        "originalSummary": original_summary,
        "translatedSummary": translated_summary,
        "metrics": {
            "totalTime": round(total_time, 2),
            "extractionTime": round(extract_time, 2),
            "summarizationTime": round(summary_time, 2),
            "translationTime": round(translate_time, 2)
        }
    })

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio_endpoint():
    data = request.get_json()
    text = data.get('translatedSummary')
    lang = data.get('language')
    voice = data.get('voice', 'standard') # 'standard' or Gemini voice name (Puck, Charon, etc.)

    if not text or not lang:
        return jsonify({"error": "Missing text or language"}), 400

    output_filename = os.path.join(RESULTS_FOLDER, f"summary_{uuid.uuid4()}.mp3")
    
    try:
        if voice == 'standard':
            audio_path = synthesize_to_file(text, lang, output_filename)
        else:
            # Use Gemini TTS - pass language for fallback
            audio_path = generate_gemini_tts(text, voice, output_filename, lang)
            
        audio_url = f"/results/{os.path.basename(audio_path)}"
        return jsonify({"audioUrl": audio_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/results/<filename>')
def serve_audio(filename):
    return send_from_directory(RESULTS_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
