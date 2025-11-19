import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const API_URL = "http://localhost:8000/api/v1/chat";

function formatDate(date) {
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const ejercicio = location.state?.ejercicio;

  // Initial message depending on whether it comes from an exercise
  const initialMessage = ejercicio
    ? {
        role: "bot",
        content: `Do you need help with "${ejercicio.nombre}"? Tell me what you need.`,
        timestamp: new Date(),
      }
    : {
        role: "bot",
        content: "Ask me anything",
        timestamp: new Date(),
      };

  const [input, setInput] = useState("");
  const [history, setHistory] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const now = new Date();
    // 1. Add the user's message immediately
    setHistory(prev => [
      ...prev,
      { role: "user", content: input, timestamp: now }
    ]);
    setInput(""); // Clear the input immediately

    const updatedHistory = [
      ...history,
      { role: "user", content: input, timestamp: now }
    ];

    const filteredHistory = updatedHistory.map((msg) => ({
      role: msg.role === "bot" ? "assistant" : msg.role,
      content: msg.content,
    }));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: input,
          history: filteredHistory,
        }),
      });
      const data = await response.json();
      // 2. Add the bot's response when it arrives
      setHistory(prev => [
        ...prev,
        {
          role: "bot",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setHistory(prev => [
        ...prev,
        {
          role: "bot",
          content: "Error connecting to the server.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleBack = () => navigate(-1);

  return (
    <div style={{
      background: "#fff",
      minHeight: "100vh",
      maxWidth: 450,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        maxWidth: 450,
        margin: "0 auto",
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        zIndex: 10,
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 12px"
      }}>
        <button onClick={handleBack} style={{ background: "none", border: "none", padding: 0, marginRight: 8 }}>
          <svg width="24" height="24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
        </button>
        <span style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 22, color: "#8A2BE2" }}>HyperFit</span>
        <span style={{ width: 24 }}></span>
      </header>

      {/* Bot name */}
      <div style={{
        marginTop: 56,
        textAlign: "center",
        padding: "12px 0 4px 0"
      }}>
        <span style={{
          background: "#8A2BE2",
          color: "#fff",
          borderRadius: 12,
          padding: "4px 18px",
          fontWeight: 500,
          fontSize: 15,
        }}>HyperBot</span>
      </div>

      {/* Chat area */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 0 80px 0",
          background: "#fff",
        }}
      >
        {history.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            margin: "8px 16px"
          }}>
            {/* Date/time only for the first message of the group */}
            {(idx === 0 || history[idx - 1].role !== msg.role) && (
              <span style={{
                fontSize: 11,
                color: "#aaa",
                marginBottom: 2,
                marginLeft: msg.role === "user" ? "auto" : 0,
                marginRight: msg.role === "user" ? 0 : "auto"
              }}>
                {formatDate(msg.timestamp || new Date())}
              </span>
            )}
            <div style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end"
            }}>
              {/* Icon */}
              <span style={{
                margin: "0 6px",
                display: "flex",
                alignItems: "center"
              }}>
                {msg.role === "user" ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#222"><circle cx="12" cy="12" r="10" /></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#e0e0e0" /><path d="M8 16h8M9 9h6v3a3 3 0 11-6 0V9z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </span>
              {/* Bubble */}
              <span style={{
                background: msg.role === "user" ? "#111" : "#f4f4f4",
                color: msg.role === "user" ? "#fff" : "#222",
                borderRadius: 16,
                padding: "10px 16px",
                fontSize: 15,
                maxWidth: 260,
                wordBreak: "break-word",
                marginBottom: 2,
                boxShadow: msg.role === "user" ? "0 1px 2px rgba(0,0,0,0.08)" : "none"
              }}>
                {msg.content}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#888", margin: "8px 16px" }}>
            <svg width="18" height="18" style={{ verticalAlign: "middle", marginRight: 6 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#8A2BE2" strokeWidth="2" /></svg>
            The bot is typing...
          </div>
        )}
      </div>

      {/* Fixed input at bottom */}
      <div style={{
        position: "fixed",
        bottom: 56,
        left: 0,
        right: 0,
        maxWidth: 450,
        margin: "0 auto",
        background: "#fff",
        borderTop: "1px solid #e0e0e0",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        zIndex: 10,
        gap: 8
      }}>
        {/* Emoji icon */}
        <button style={{ background: "none", border: "none", padding: 0, fontSize: 20, color: "#888" }}>
          <span role="img" aria-label="emoji">😊</span>
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Message..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 18,
            border: "1px solid #e0e0e0",
            fontSize: 15,
            outline: "none",
            background: "#fafafa"
          }}
          disabled={loading}
        />
        {/* Mic icon */}
        <button style={{ background: "none", border: "none", padding: 0 }}>
          <svg width="22" height="22" fill="#888" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0014 0v-2" stroke="#888" strokeWidth="2" fill="none" /></svg>
        </button>
        {/* Send */}
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            background: "#8A2BE2",
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: "8px 16px",
            fontWeight: 500,
            fontSize: 15,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer"
          }}
        >
          <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2z" /></svg>
        </button>
      </div>

      {/* Bottom navigation bar */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 450,
        margin: "0 auto",
        background: "#fff",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 0",
        zIndex: 10
      }}>
        <Link to="/dashboard" className="nav-item active" style={{ textAlign: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12 }}>Home</span>
        </Link>
        <Link to="/coming-soon" className="nav-item" style={{ textAlign: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21L16.65 16.65"
              stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12 }}>Search</span>
        </Link>
        <Link to="/user-profile" className="nav-item" style={{ textAlign: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12 }}>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default Chatbot;
