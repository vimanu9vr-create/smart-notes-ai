# 🧠 Smart Notes AI

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://smart-notes-ai-kappa.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> An AI-powered smart notes application with backend intelligence and a modern frontend. Take notes, get AI-powered insights, summaries, and organisation — all in one place.

🔗 **[Try it live → smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)**

---

## ✨ Features

- 📝 **Smart note taking** — create and organise notes with AI assistance
- 🤖 **AI summarisation** — get instant summaries of long notes
- 🔍 **Intelligent search** — find notes using natural language
- 📂 **Auto-categorisation** — AI organises notes into relevant categories
- 💡 **Insight generation** — AI extracts key points and action items
- 🌐 **Fully deployed** — live on Vercel, accessible anywhere

---

## 🏗️ Architecture

```
Frontend (JavaScript + CSS)          Backend (Python + FastAPI)
┌─────────────────────────┐          ┌──────────────────────────┐
│  React/Vanilla JS UI    │◀────────▶│  FastAPI REST API        │
│  Note editor            │   HTTP   │  LLM integration         │
│  Dashboard              │          │  Note processing engine  │
│  Search interface       │          │  AI summarisation        │
└─────────────────────────┘          └──────────────────────────┘
                                                  │
                                      ┌───────────▼──────────────┐
                                      │    LLM APIs              │
                                      │  (Claude / GPT-4)        │
                                      └──────────────────────────┘
```

---

## 🚀 Quick Start

### Run locally

```bash
git clone https://github.com/vimanu9vr-create/smart-notes-ai.git
cd smart-notes-ai
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env    # Add your API keys
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Or visit the live version directly: **[smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)**

---

## 📁 Project Structure

```
smart-notes-ai/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── routes/           # API route handlers
│   ├── services/         # AI processing services
│   └── requirements.txt
├── frontend/
│   ├── src/              # UI components
│   ├── styles/           # CSS styling
│   └── index.html
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | JavaScript, CSS, HTML |
| **Backend** | Python, FastAPI |
| **AI** | LLM APIs (Claude / GPT-4) |
| **Deployment** | Vercel |

---

## 🌐 Deployment

Frontend is deployed on **Vercel** at [smart-notes-ai-kappa.vercel.app](https://smart-notes-ai-kappa.vercel.app)

---

## 👨‍💻 Author

**Vignesh A** — AI Engineer · Full-Stack AI Applications

[![Email](https://img.shields.io/badge/Email-Vimanu9.vr%40gmail.com-red?logo=gmail)](mailto:Vimanu9.vr@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-vimanu9vr--create-black?logo=github)](https://github.com/vimanu9vr-create)

*Certified in Agentic AI, Generative AI for Everyone, and AI Prompting for Everyone by DeepLearning.AI (Andrew Ng)*
