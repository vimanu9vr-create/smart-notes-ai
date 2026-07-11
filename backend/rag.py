import os
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter

vector_store = None
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def process_text(text):
    global vector_store
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(text)
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    vector_store = FAISS.from_texts(chunks, embeddings)


def ask_question(question):
    global vector_store

    if vector_store is None:
        return "Please upload a PDF first."

    docs = vector_store.similarity_search(question, k=4)
    if not docs:
        return "No relevant information found in the PDF."

    context = "\n\n".join([doc.page_content for doc in docs])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer questions based only on the provided context. Be concise and accurate.",
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}",
            },
        ],
    )
    return response.choices[0].message.content.strip()
