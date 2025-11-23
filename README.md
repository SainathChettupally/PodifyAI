# PodifyAI: Document Summarization and Audio Generation (Deliverable 3)

## Project Description and Purpose

PodifyAI is an innovative application designed to transform how users interact with documents by converting textual content into digestible summaries and spoken audio. My core purpose for this project is to provide an accessible and efficient tool for consuming information, particularly for long-form content. It caters specifically to individuals who are "on the go" and require quick access to key insights, for the visually impaired who cannot easily read traditional documents, and for those who encounter language barriers. By automatically summarizing documents and converting these summaries into spoken audio in multiple languages, PodifyAI aims to break down barriers to information consumption.

**Deliverable 3 Update:** This version integrates **Google's Gemini API** to provide advanced, context-aware summarization and high-quality neural Text-to-Speech (TTS) with multiple voice options. It also includes performance profiling and an enhanced user interface.

## Features

*   **Multi-format Document Upload:** Supports PDF, DOCX, PPTX, TXT, HTML, and CSV files via a user-friendly drag-and-drop interface.
*   **Dual-Model Summarization:**
    *   **Standard Mode:** Uses the fast, local `DistilBART` model.
    *   **Advanced Mode (New):** Uses **Google Gemini 1.5 Flash** for superior context understanding and summary quality.
*   **Smart Summarization Modes:**
    *   **Quick:** 3-5 concise bullet points.
    *   **Standard:** A balanced 1-paragraph summary.
    *   **Deep:** Detailed summary with section breakdowns.
*   **Multilingual Translation:** Translates summaries into various target languages (e.g., Spanish, French, German, Hindi).
*   **Advanced Text-to-Speech (TTS):**
    *   **Standard Voice:** Uses `gTTS` (Google Text-to-Speech) for basic audio.
    *   **Gemini Voices (New):** Access to high-quality neural voices like **Puck**, **Charon**, **Kore**, **Fenrir**, and **Aoede**.
*   **Performance Metrics:** Real-time display of processing time for extraction, summarization, and translation.
*   **Modern User Interface:** A sleek, dark-themed React frontend built with Material-UI.

## User Interface

### Main Interface with Gemini Controls
*(Screenshot placeholder)*

### Summarization Results with Metrics
*(Screenshot placeholder)*

## System Architecture

PodifyAI operates with a clear separation of concerns:
*   **Frontend:** A React.js application providing the user interface.
*   **Backend:** A Flask API orchestrating the machine learning pipeline.
*   **ML Pipeline:**
    *   **Extraction:** `PyMuPDF`, `python-docx`, etc.
    *   **Summarization:** `DistilBART` (Local) or `Gemini 1.5 Flash` (Cloud).
    *   **TTS:** `gTTS` (Local) or `Gemini TTS` (Cloud).

## Getting Started

Follow these instructions to set up and run PodifyAI locally.

### Prerequisites

*   Python 3.8+
*   Node.js and npm (or yarn)
*   Git
*   **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone [https://github.com/SainathChettupally/PodifyAI.git]
cd podifyai_deliverable_3
```

### 2. Backend Setup

Navigate to the project root and set up the Python environment:

```bash
# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate # On Windows
# source venv/bin/activate # On macOS/Linux

# Install backend dependencies
pip install -r requirements.txt
```

**Configuration:**
Create a `.env` file in the root directory and add your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

Run the Flask backend API:
```bash
python api.py
```
The backend will start on `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal, navigate to the `frontend` directory:

```bash
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm start
```
The frontend will open in your browser, typically at `http://localhost:3000`.

## Current Results and Known Issues

### Performance Improvements
*   **Gemini vs DistilBART:** Gemini provides significantly more coherent and context-aware summaries, especially for complex documents.
*   **TTS Quality:** Gemini voices are much more natural and less robotic than standard gTTS.

### Known Issues
*   **Gemini TTS Availability:** Access to specific Gemini TTS models may vary by region. The system includes a fallback to `gTTS` if Gemini TTS fails.
*   **Latency:** Cloud-based Gemini generation may be slightly slower than local DistilBART inference depending on network conditions.

## Author

Sainath Chettupally
Email: s.chettupally@ufl.edu
