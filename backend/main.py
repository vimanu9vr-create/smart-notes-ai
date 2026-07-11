from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .pdf_utils import extract_text_from_pdf
from .rag import process_text, ask_question
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # can't combine credentials=True with origins="*"
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Smart Notes AI running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        text = extract_text_from_pdf(file.file)
        if not text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from this PDF. It may be scanned or image-based.")
        process_text(text)
        return {"message": "PDF processed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/ask")
def ask(q: str):
    try:
        answer = ask_question(q)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
