import streamlit as st
from pathlib import Path
import sys
from pathlib import Path

# Ensure src/ is importable when running Streamlit
BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
from src.extractors import detect_and_extract_text, clean_text, truncate_for_demo
from src.summarizer import summarize
from src.tts_engine import synthesize_to_file

st.set_page_config(page_title="PodifyAI", layout="centered")
st.title("PodifyAI — Document to Podcast")

mode = st.radio("Summary mode", ["quick", "standard", "deep"], index=1)
file = st.file_uploader(
    "Upload a file (PDF, DOCX, PPTX, TXT, MD, HTML, CSV)",
    type=["pdf", "docx", "pptx", "txt", "md", "html", "htm", "csv"],
)

if file:
    tmp_path = Path("data") / file.name
    tmp_path.parent.mkdir(exist_ok=True, parents=True)
    with open(tmp_path, "wb") as f:
        f.write(file.read())

    raw = detect_and_extract_text(str(tmp_path))
    text = truncate_for_demo(clean_text(raw), max_chars=5000)

    st.write("### Extracted text (snippet)")
    st.code(text[:1000] + ("…" if len(text) > 1000 else ""))

    if st.button("Summarize"):
        with st.spinner("Summarizing..."):
            summary = summarize(text, mode=mode)
        Path("results").mkdir(exist_ok=True)
        (Path("results") / "sample_summary.txt").write_text(summary, encoding="utf-8")
        st.success("Summary ready")
        st.write("### Summary")
        st.write(summary)

        if st.button("Generate audio"):
            path = synthesize_to_file(summary)
            st.info(f"Saved: {path}")
