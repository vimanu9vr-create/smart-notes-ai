# 🧠 Smart Notes AI — RAG-Powered PDF Q&A Chatbot

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://smart-notes-ai-kappa.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C)](https://langchain.com)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-orange)](https://faiss.ai)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> Upload any PDF and ask it questions in plain English. The AI answers using **only the content in that document** — no hallucinations, no guessing.

🔗 **[Try it live → smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)**

---

## 🎯 Problem It Solves

Reading long PDFs — contracts, research papers, manuals, reports — and hunting for specific information wastes hours. Smart Notes AI lets you simply **ask a question** and get a precise answer sourced directly from the document.

---

## ✨ Features

- 📄 **PDF upload** — drop any PDF and start asking questions instantly
- 💬 **Plain English questions** — no special syntax or commands needed
- 🎯 **Grounded answers** — AI only uses content from your document, never invents
- ⚡ **Streaming responses** — answers stream character-by-character for a natural feel
- 🔍 **Semantic search** — finds relevant chunks even when exact words don't match
- 🚫 **No hallucinations** — answers are strictly sourced from uploaded content

---

## 🏗️ Architecture

```
User uploads PDF
      │
      ▼
┌─────────────────────┐
│   FastAPI Backend   │  ← Receives PDF, extracts text via PyPDF
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  LangChain Chunker  │  ← Splits text into overlapping chunks
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  OpenAI Embeddings  │  ← Converts chunks into vector representations
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   FAISS Vector DB   │  ← Stores and indexes all chunk embeddings
└──────────┬──────────┘
           │
     User asks question
           │
           ▼
┌─────────────────────┐
│  Similarity Search  │  ← FAISS finds most relevant chunks
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    GPT-4o-mini      │  ← Synthesises precise answer from chunks only
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   React Frontend    │  ← Streams answer character-by-character
└─────────────────────┘
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/vimanu9vr-create/smart-notes-ai.git
cd smart-notes-ai
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env    # Add OPENAI_API_KEY
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Or use the live version: **[smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)**

---

## ⚙️ Configuration

```env
OPENAI_API_KEY=      # Required for embeddings + GPT-4o-mini
```

---

## 📁 Project Structure

```
smart-notes-ai/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── routes/
│   │   └── chat.py          # PDF upload + Q&A endpoints
│   ├── services/
│   │   ├── pdf_processor.py # PyPDF text extraction
│   │   ├── embedder.py      # OpenAI Embeddings + FAISS indexing
│   │   └── qa_chain.py      # LangChain RAG chain
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Chat UI, PDF uploader
│   │   └── services/        # API calls + streaming
│   └── package.json
├── README.html              # Interactive landing page
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11, FastAPI |
| **PDF Parsing** | PyPDF |
| **RAG Framework** | LangChain |
| **Embeddings** | OpenAI Embeddings |
| **Vector Store** | FAISS |
| **LLM** | GPT-4o-mini |
| **Frontend** | React, TypeScript |
| **Streaming** | Server-Sent Events |
| **Deployment** | Vercel |

---

## 💡 How RAG Works Here

1. **Chunk** — LangChain splits the PDF into overlapping text chunks
2. **Embed** — OpenAI converts each chunk into a vector (numerical representation)
3. **Store** — FAISS indexes all vectors for fast similarity search
4. **Retrieve** — when you ask a question, FAISS finds the most relevant chunks
5. **Generate** — GPT-4o-mini reads only those chunks and synthesises your answer

This ensures the AI **never guesses** — every answer comes directly from your document.

---

## 🌐 Deployment

Live at **[smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)**

---

## 👨‍💻 Author

**Vignesh A** — AI Engineer · RAG Systems · Multi-Agent AI

[![Email](https://img.shields.io/badge/Email-Vimanu9.vr%40gmail.com-red?logo=gmail)](mailto:Vimanu9.vr@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-vimanu9vr--create-black?logo=github)](https://github.com/vimanu9vr-create)
[![Live App](https://img.shields.io/badge/Live-smart--notes--ai-black?logo=vercel)](https://smart-notes-ai-kappa.vercel.app)

*Certified in Agentic AI, Generative AI for Everyone, and AI Prompting for Everyone by DeepLearning.AI (Andrew Ng)*
