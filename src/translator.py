from __future__ import annotations
from deep_translator import GoogleTranslator

def translate_text(text: str, target_lang: str) -> str:
    """Translates text to the target language using Google Translate."""
    if not text:
        return ""
    return GoogleTranslator(source='auto', target=target_lang).translate(text)
