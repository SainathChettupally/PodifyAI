from __future__ import annotations
from pathlib import Path

def synthesize_to_file(text: str, out_path: str = "results/summary_audio.mp3") -> str:
    # Writes a companion .txt to signal audio generation in the demo.
    txt_out = Path(out_path).with_suffix(".txt")
    txt_out.parent.mkdir(parents=True, exist_ok=True)
    txt_out.write_text(text, encoding="utf-8")
    return str(txt_out)
