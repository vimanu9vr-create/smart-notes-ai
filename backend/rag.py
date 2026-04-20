import os
from openai import OpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.chat_models import ChatOpenAI

vector_store = None
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def process_text(text):
    global vector_store

    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)

    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(chunks, embeddings)

def ask_question(question):
    global vector_store

    if vector_store is None:
        return "Please upload a PDF first."

    docs = vector_store.similarity_search(question)

    if not docs:
        return "No relevant information found in the PDF."
    
    context = "\n".join([doc.page_content for doc in docs])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided context."},
            {"role": "user", "content": f"Answer based only on this:\n{context}\n\nQuestion: {question}"}
        ]
    )

    return response.choices[0].message.content.strip()

    