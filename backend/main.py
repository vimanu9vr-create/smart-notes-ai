from fastapi import FastAPI, UploadFile, File
from .pdf_utils import extract_text_from_pdf
from .rag import process_text, ask_question
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # Load environment variables from .env file

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def home():
    return {"message": "Smart Notes AI running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    process_text(text)
    return {"message": "PDF processed successfully"}

@app.get("/ask")
def ask(q:str):
    answer = ask_question(q)
    return {"answer": answer}