from __future__ import annotations
from pathlib import Path
from gtts import gTTS

def synthesize_to_file(text: str, lang: str, out_path: str = "results/summary_audio.mp3") -> str:
    """Synthesizes text to an audio file using gTTS."""
    output_path = Path(out_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    tts = gTTS(text=text, lang=lang)
    tts.save(str(output_path))

    return str(output_path)
