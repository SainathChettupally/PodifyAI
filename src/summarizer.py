from __future__ import annotations
from typing import Literal
from transformers import pipeline

_SUMMARIZER = None

def get_summarizer():
    global _SUMMARIZER
    if _SUMMARIZER is None:
        _SUMMARY_MODEL = "sshleifer/distilbart-cnn-12-6"
        _SUMMARIZER = pipeline("summarization", model=_SUMMARY_MODEL)
    return _SUMMARIZER

MODE_TO_TARGET = {
    "quick": 120,      # ~1 min audio
    "standard": 320,   # ~2–3 min audio
    "deep": 650        # ~5–7 min audio
}

Mode = Literal["quick", "standard", "deep"]

def summarize(text: str, mode: Mode = "standard") -> str:
    tgt = MODE_TO_TARGET.get(mode, 180)
    sm = get_summarizer()
    out = sm(
    text,
    max_length=tgt,
    min_length=max(30, tgt // 3),
    do_sample=False,
    truncation=True   
)
    return out[0]["summary_text"].strip()
