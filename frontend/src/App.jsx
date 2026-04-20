import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "https://smart-notes-ai.onrender.com";

// typing effect
const typeText = (text, setMessages) => {
  let i = 0;
  const id = setInterval(() => {
    setMessages(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      copy[copy.length - 1] = {
        ...last,
        content: text.slice(0, i + 1),
      };
      return copy;
    });
    i++;
    if (i === text.length) clearInterval(id);
  }, 12);
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const uploadPDF = async () => {
    if (!file) return alert("Select a PDF");
    const fd = new FormData();
    fd.append("file", file);

    setUploading(true);
    try {
      await axios.post(`${API}/upload`, fd);
      setMessages(prev => [
        ...prev,
        { role: "system", content: "PDF uploaded successfully ✅" },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "system", content: "Upload failed ❌" },
      ]);
    }
    setUploading(false);
  };

  const ask = async () => {
    if (!question) return;

    const q = question;
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.get(`${API}/ask?q=${encodeURIComponent(q)}`);
      // add empty bot msg then type
      setMessages(prev => [...prev, { role: "bot", content: "" }]);
      typeText(res.data.answer, setMessages);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "Error getting response ❌" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.title}>🧠 Smart Notes AI</div>

        <div style={styles.upload}>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            style={styles.file}
          />
          <button onClick={uploadPDF} disabled={uploading} style={styles.btn}>
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>

      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(m.role === "user"
                ? styles.user
                : m.role === "bot"
                ? styles.bot
                : styles.system),
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubble, ...styles.bot }}>
            🤖 Thinking...
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask()}
          placeholder="Ask about your PDF..."
          style={styles.input}
        />
        <button onClick={ask} disabled={loading} style={styles.send}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: 600 },
  upload: { display: "flex", gap: 8, alignItems: "center" },
  file: { color: "#9ca3af" },
  btn: {
    background: "#1f2937",
    color: "#e5e7eb",
    border: "1px solid #374151",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 12px",
    borderRadius: 12,
    lineHeight: 1.4,
  },
  user: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "#fff",
  },
  bot: {
    alignSelf: "flex-start",
    background: "#1f2937",
    border: "1px solid #374151",
  },
  system: {
    alignSelf: "center",
    background: "#111827",
    border: "1px dashed #374151",
    fontSize: 12,
  },
  inputBar: {
    borderTop: "1px solid #1f2937",
    padding: 12,
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#e5e7eb",
  },
  send: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
  },
};