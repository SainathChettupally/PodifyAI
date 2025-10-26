# PodifyAI — Document‑to‑Podcast Assistant

PodifyAI converts documents into focused, listenable summaries. Upload a file, pick a summary depth, and get a clean text summary with an option to generate audio.

## Supported formats
PDF, DOCX, PPTX, TXT, MD, HTML, CSV

## Setup
```bash
pip install -r requirements.txt
```

## Quick start
Put a sample file in `data/` (optional) and run the setup notebook:

```bash
jupyter notebook notebooks/setup.ipynb
```

Launch the demo UI:

```bash
streamlit run ui/app.py
```

## Structure
- `src/` text extraction, summarization, TTS
- `ui/` Streamlit app
- `notebooks/` setup notebook
- `docs/` blueprint and visuals
- `results/` outputs
