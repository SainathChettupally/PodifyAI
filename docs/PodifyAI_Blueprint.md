# PodifyAI — Technical Blueprint

## Problem Context & Summary
Information overload slows down reading and decision‑making. PodifyAI converts uploaded documents into concise summaries with an audio option. Users can choose Quick, Standard, or Deep modes to match time and depth.

## Dataset
- Source: user‑uploaded files (PDF, DOCX, PPTX, TXT, MD, HTML, CSV)
- Access: local extraction (PyMuPDF, python‑docx, python‑pptx, HTML parsing)
- Preprocessing: whitespace cleanup, sentence‑level normalization, length control
- Privacy: local processing for the demo

## Planned Architecture
Upload → Extract → Clean → Summarize (DistilBART) → (TTS) → UI

Components:
- Summarization: distilbart‑cnn (fast baseline)
- Extraction: format‑aware extractors
- UI: Streamlit

## UI Plan
- Input: file upload + mode selector (Quick/Standard/Deep)
- Output: on‑screen text summary, optional audio file
- Wireframe: simple single‑page view with upload, options, and results

## Innovation & Challenges
- Multi‑format ingestion path with a single summarization core
- Risks: long documents (solve via chunking); latency (small model first); voice quality (swap-in neural TTS later)

## Timeline (Oct 20 → Dec 11)
- Week 1: extraction + baseline summary
- Weeks 2–3: TTS + UI modes
- Weeks 4–5: tuning and basic evaluation
- Weeks 6–7: polish + final report/demo

## Responsible AI
- Neutral phrasing
- Clear model notes in README/UI
- Efficiency: smaller model and basic optimization
