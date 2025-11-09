
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import uuid
from src.extractors import detect_and_extract_text
from src.summarizer import summarize
from src.translator import translate_text
from src.tts_engine import synthesize_to_file

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

@app.route('/api/summarize', methods=['POST'])
def summarize_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    mode = request.form.get('mode', 'standard')
    language = request.form.get('language', 'en')

    _, ext = os.path.splitext(file.filename)
    temp_filename = os.path.join(UPLOAD_FOLDER, str(uuid.uuid4()) + ext)
    file.save(temp_filename)

    try:
        text = detect_and_extract_text(temp_filename)
        original_summary = summarize(text, mode)
        translated_summary = translate_text(original_summary, language)
    finally:
        os.remove(temp_filename)

    return jsonify({
        "originalSummary": original_summary,
        "translatedSummary": translated_summary
    })

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio_endpoint():
    data = request.get_json()
    text = data.get('translatedSummary')
    lang = data.get('language')

    if not text or not lang:
        return jsonify({"error": "Missing text or language"}), 400

    output_filename = os.path.join(RESULTS_FOLDER, f"summary_{uuid.uuid4()}.mp3")
    audio_path = synthesize_to_file(text, lang, output_filename)
    
    # Return the URL to the audio file
    audio_url = f"/results/{os.path.basename(audio_path)}"
    return jsonify({"audioUrl": audio_url})

@app.route('/results/<filename>')
def serve_audio(filename):
    return send_from_directory(RESULTS_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
