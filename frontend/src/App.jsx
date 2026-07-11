import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "https://smart-notes-ai.onrender.com";

// Upload stages shown to the user
const UPLOAD_STAGES = [
  { after: 0,    text: "Uploading PDF…" },
  { after: 4000, text: "Extracting text…" },
  { after: 9000, text: "Building search index…" },
  { after: 18000, text: "Almost there…" },
];

// ── Typing effect ──────────────────────────────────────────
const typeText = (text, setMessages) => {
  let i = 0;
  const id = setInterval(() => {
    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], content: text.slice(0, i + 1) };
      return copy;
    });
    i++;
    if (i === text.length) clearInterval(id);
  }, 12);
};

// ── Icons ──────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const UploadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="url(#bgrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="bgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa"/>
        <stop offset="100%" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

// ── Suggestions ────────────────────────────────────────────
const SUGGESTIONS = [
  "Summarise this document",
  "What are the key findings?",
  "List the main topics covered",
];

// ── Typing dots ────────────────────────────────────────────
const TypingDots = () => (
  <div className="dots-wrap">
    <span className="dot dot1" />
    <span className="dot dot2" />
    <span className="dot dot3" />
  </div>
);

// ── Upload progress bar ────────────────────────────────────
const UploadProgress = ({ stage, elapsed }) => (
  <div className="upload-progress">
    <div className="up-top">
      <span className="up-stage">{stage}</span>
      <span className="up-elapsed">{elapsed}s</span>
    </div>
    <div className="up-track"><div className="up-bar" /></div>
    <span className="up-hint">First upload may take 30–60 s while the server wakes up</span>
  </div>
);

// ── App ────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages]     = useState([]);
  const [question, setQuestion]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadStage, setUploadStage] = useState("");
  const [elapsed, setElapsed]       = useState(0);
  const [pdfLoaded, setPdfLoaded]   = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const [serverReady, setServerReady] = useState(false);

  const endRef      = useRef(null);
  const fileRef     = useRef(null);
  const stageTimers = useRef([]);
  const elapsedRef  = useRef(null);

  // ── Warm-up ping on mount ────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/health`, { timeout: 60000 })
      .then(() => setServerReady(true))
      .catch(() => {}); // silent — just trying to wake Render
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, uploading]);

  const clearUploadTimers = () => {
    stageTimers.current.forEach(clearTimeout);
    stageTimers.current = [];
    clearInterval(elapsedRef.current);
    elapsedRef.current = null;
  };

  const handleFile = f => {
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
  };

  const uploadPDF = async () => {
    if (!file) { fileRef.current?.click(); return; }

    const fd = new FormData();
    fd.append("file", file);

    setUploading(true);
    setElapsed(0);
    setUploadStage(UPLOAD_STAGES[0].text);

    // Schedule progressive stage messages
    UPLOAD_STAGES.slice(1).forEach(({ after, text }) => {
      stageTimers.current.push(setTimeout(() => setUploadStage(text), after));
    });

    // Tick elapsed seconds
    elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);

    try {
      await axios.post(`${API}/upload`, fd, { timeout: 120000 });
      clearUploadTimers();
      setPdfLoaded(true);
      setMessages(prev => [...prev, {
        role: "system",
        content: `📄 "${file.name}" is ready — ask me anything!`,
      }]);
    } catch (err) {
      clearUploadTimers();
      console.error("[upload error]", err.code, err.message, err.response?.status, err.response?.data);
      const detail = err.response?.data?.detail;
      const msg = err.code === "ECONNABORTED"
        ? "⏱ Upload timed out — the server may be waking up. Please try again."
        : detail
          ? `Upload failed: ${detail}`
          : `Upload failed (${err.code ?? err.message}) — check your connection and try again.`;
      setMessages(prev => [...prev, { role: "system", content: msg }]);
    }

    setUploading(false);
    setUploadStage("");
    setElapsed(0);
  };

  const ask = async (q = question) => {
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/ask?q=${encodeURIComponent(q)}`, { timeout: 60000 });
      setMessages(prev => [...prev, { role: "bot", content: "" }]);
      typeText(res.data.answer, setMessages);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setMessages(prev => [...prev, {
        role: "bot",
        content: detail ? `Error: ${detail}` : "Sorry, couldn't get a response ❌",
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="bg-grid" />
      <div className="bg-glow1" />
      <div className="bg-glow2" />

      {/* ── HEADER ── */}
      <header className="header"
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <div className="logo">
          <div className="logo-icon"><BrainIcon /></div>
          <div>
            <div className="logo-name">Smart Notes AI</div>
            <div className="logo-tag">
              GPT-4o · RAG · PDF
              {serverReady && <span className="server-dot" title="Server ready" />}
            </div>
          </div>
        </div>

        <div className="upload-row">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />

          <button
            className={`file-pill${file ? " has-file" : ""}${dragOver ? " drag-over" : ""}`}
            onClick={() => !uploading && fileRef.current?.click()}
            disabled={uploading}
          >
            <FileIcon />
            <span>{file ? file.name : "Choose PDF…"}</span>
          </button>

          <button
            className={`upload-btn${file && !uploading ? " active" : ""}`}
            onClick={uploadPDF}
            disabled={uploading}
          >
            {uploading
              ? <span className="spinner" />
              : <><UploadIcon /> Upload</>
            }
          </button>

          {pdfLoaded && !uploading && <div className="loaded-badge">✓ Loaded</div>}
        </div>
      </header>

      {/* ── UPLOAD PROGRESS (shown inline in chat) ── */}
      {uploading && (
        <UploadProgress stage={uploadStage} elapsed={elapsed} />
      )}

      {/* ── CHAT ── */}
      <div className="chat">
        {messages.length === 0 && !uploading && (
          <div className="welcome welcome-anim">
            <div className="welcome-orb">🧠</div>
            <h2 className="welcome-title">Ask your PDF anything</h2>
            <p className="welcome-sub">
              Upload a PDF above, then ask questions in plain English.
              The AI answers only from your document — no guessing.
            </p>
            <div className="chips">
              {SUGGESTIONS.map(t => (
                <button key={t} className="chip" onClick={() => ask(t)}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg-row msg-animate ${
            m.role === "user" ? "right" : m.role === "system" ? "center" : "left"
          }`}>
            {m.role === "bot"  && <div className="avatar">🤖</div>}
            <div className={`bubble ${
              m.role === "user" ? "user" : m.role === "bot" ? "bot" : "sys"
            }`}>
              {m.content}
            </div>
            {m.role === "user" && <div className="avatar">👤</div>}
          </div>
        ))}

        {loading && (
          <div className="msg-row left msg-animate">
            <div className="avatar">🤖</div>
            <div className="bubble bot"><TypingDots /></div>
          </div>
        )}

        <div ref={endRef} style={{ height: 1 }} />
      </div>

      {/* ── INPUT BAR ── */}
      <div className="input-wrap">
        <div className="input-bar">
          <input
            className="text-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && ask()}
            placeholder={uploading ? "Please wait while PDF is processing…" : "Ask about your PDF…"}
            disabled={loading || uploading}
          />
          <button
            className={`send-btn${question.trim() && !loading && !uploading ? " active" : ""}`}
            onClick={() => ask()}
            disabled={loading || uploading || !question.trim()}
          >
            <SendIcon />
          </button>
        </div>
        <p className="input-hint">Enter to send · Upload a PDF first for best results</p>
      </div>
    </div>
  );
}
