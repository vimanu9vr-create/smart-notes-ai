import os
import numpy as np
import faiss
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory store
_index: faiss.IndexFlatL2 | None = None
_chunks: list[str] = []


def _chunk_text(text: str, size: int = 1000, overlap: int = 100) -> list[str]:
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start : start + size])
        start += size - overlap
    return chunks


def _embed(texts: list[str]) -> np.ndarray:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    vectors = [d.embedding for d in response.data]
    return np.array(vectors, dtype=np.float32)


def process_text(text: str) -> None:
    global _index, _chunks
    _chunks = _chunk_text(text)
    embeddings = _embed(_chunks)
    dim = embeddings.shape[1]
    _index = faiss.IndexFlatL2(dim)
    _index.add(embeddings)


def ask_question(question: str) -> str:
    if _index is None:
        return "Please upload a PDF first."

    q_vec = _embed([question])
    _, indices = _index.search(q_vec, k=4)
    relevant = [_chunks[i] for i in indices[0] if i < len(_chunks)]

    if not relevant:
        return "No relevant information found in the PDF."

    context = "\n\n".join(relevant)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Answer questions based only on the provided context. Be concise and accurate.",
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}",
            },
        ],
    )
    return response.choices[0].message.content.strip()
