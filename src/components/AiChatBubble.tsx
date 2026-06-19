"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string | number;
  sender: "user" | "ai";
  text: string;
  createdAt?: Date;
}

interface AiChatBubbleProps {
  locale?: "ru" | "kk";
}

export default function AiChatBubble({ locale = "ru" }: AiChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Localization dict
  const t = {
    ru: {
      placeholder: "Задать вопрос ИИ-помощнику...",
      title: "Ассистент DAUYS",
      online: "Онлайн",
      welcome: "Здравствуйте! Я виртуальный ассистент DAUYS. Задайте мне любой вопрос о настройке, характеристиках или покупке нашего звукового оборудования.",
      error: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз."
    },
    kk: {
      placeholder: "ИИ-көмекшіге сұрақ қою...",
      title: "DAUYS Көмекшісі",
      online: "Желіде",
      welcome: "Сәлеметсіз бе! Мен DAUYS виртуалды көмекшісімін. Маған дыбыстық жабдықтарды орнату, сипаттамалары немесе сатып алу туралы кез келген сұрақ қойыңыз.",
      error: "Хабарлама жіберу кезінде қате орын алды. Қайталап көріңіз."
    }
  }[locale] || {
    placeholder: "Задать вопрос ИИ-помощнику...",
    title: "Ассистент DAUYS",
    online: "Онлайн",
    welcome: "Здравствуйте! Я виртуальный ассистент DAUYS. Задайте мне любой вопрос о настройке, характеристиках или покупке нашего звукового оборудования.",
    error: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз."
  };

  // Restore session & load welcome message
  useEffect(() => {
    const savedSessionId = localStorage.getItem("dauys_ai_session");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      // Fetch session message history
      fetch(`/api/ai/session?id=${savedSessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.messages) {
            setMessages(data.messages);
          } else {
            // fallback
            setMessages([{ id: "welcome", sender: "ai", text: t.welcome }]);
          }
        })
        .catch(() => {
          setMessages([{ id: "welcome", sender: "ai", text: t.welcome }]);
        });
    } else {
      setMessages([{ id: "welcome", sender: "ai", text: t.welcome }]);
    }
  }, [t.welcome]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal("");
    setIsLoading(true);

    // Append user message immediately
    const tempUserMsgId = Date.now();
    setMessages((prev) => [...prev, { id: tempUserMsgId, sender: "user", text: userText }]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId: sessionId,
          currentPath: typeof window !== "undefined" ? window.location.pathname : ""
        })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        if (!sessionId && data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem("dauys_ai_session", data.sessionId);
        }

        let aiText = data.response;
        const redirectMatch = aiText.match(/\[REDIRECT:\s*(.+?)\]/);
        if (redirectMatch && redirectMatch[1]) {
          const url = redirectMatch[1].trim();
          aiText = aiText.replace(/\[REDIRECT:\s*.+?\]/, "").trim();
          setTimeout(() => {
            window.open(url, "_blank");
          }, 1500);
        }

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: aiText }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: t.error }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: t.error }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="ai-chat-btn"
        aria-label="AI Assistant"
        style={{
          position: "fixed",
          bottom: "95px", // sits nicely above mobile nav bars or bottom padding
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--accent-color, #ffcc00)",
          color: "#000",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(255, 204, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(180deg) scale(0.9)" : "scale(1)"
        }}
      >
        {isOpen ? (
          // Close Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Handheld Vocal Singing Microphone Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="8" r="4.5" />
            <line x1="13.5" y1="5.5" x2="18.5" y2="10.5" strokeWidth="1.5" opacity="0.6" />
            <line x1="13.5" y1="10.5" x2="18.5" y2="5.5" strokeWidth="1.5" opacity="0.6" />
            <path d="M11.5 10.5 L13.5 12.5" strokeWidth="3" />
            <line x1="12" y1="12" x2="5" y2="19" strokeWidth="3.5" />
            <line x1="5.5" y1="18.5" x2="3" y2="21" strokeWidth="2" />
          </svg>
        )}
      </button>

      {/* Pulsing indicator loop */}
      {!isOpen && (
        <div
          className="ai-chat-pulse"
          style={{
            position: "fixed",
            bottom: "95px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "2px solid var(--accent-color, #ffcc00)",
            zIndex: 998,
            pointerEvents: "none",
            animation: "ai-pulse-wave 2s infinite"
          }}
        />
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div
          className="ai-chat-window"
          style={{
            position: "fixed",
            bottom: "165px",
            right: "24px",
            maxWidth: "calc(100vw - 48px)",
            maxHeight: "calc(100vh - 200px)",
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            border: "1px solid var(--border-color, rgba(255,255,255,0.08))",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            zIndex: 999,
            animation: "ai-window-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              background: "rgba(20, 20, 20, 0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,204,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,204,0,0.2)"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="16" cy="8" r="4.5" />
                  <line x1="13.5" y1="5.5" x2="18.5" y2="10.5" strokeWidth="1.5" opacity="0.6" />
                  <line x1="13.5" y1="10.5" x2="18.5" y2="5.5" strokeWidth="1.5" opacity="0.6" />
                  <path d="M11.5 10.5 L13.5 12.5" strokeWidth="3" />
                  <line x1="12" y1="12" x2="5" y2="19" strokeWidth="3.5" />
                  <line x1="5.5" y1="18.5" x2="3" y2="21" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{t.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00e673", display: "inline-block" }}></span>
                  <span style={{ fontSize: "0.75rem", color: "#888" }}>{t.online}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                color: "#666",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Scroll Panel */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              scrollBehavior: "smooth"
            }}
          >
            {messages.map((msg, index) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id || index}
                  style={{
                    display: "flex",
                    justifyContent: isAi ? "flex-start" : "flex-end",
                    animation: "ai-message-slide 0.25s ease-out"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: isAi ? "14px 14px 14px 2px" : "14px 14px 2px 14px",
                      backgroundColor: isAi ? "rgba(255, 255, 255, 0.05)" : "var(--accent-color, #ffcc00)",
                      color: isAi ? "#e0e0e0" : "#000",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      border: isAi ? "1px solid rgba(255,255,255,0.03)" : "none",
                      whiteSpace: "pre-line"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start", opacity: 0.8 }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "14px 14px 14px 2px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center"
                  }}
                >
                  <span className="ai-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#888", display: "inline-block", animation: "ai-dot-pulse 1s infinite 0.1s" }} />
                  <span className="ai-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#888", display: "inline-block", animation: "ai-dot-pulse 1s infinite 0.3s" }} />
                  <span className="ai-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#888", display: "inline-block", animation: "ai-dot-pulse 1s infinite 0.5s" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "12px",
              background: "rgba(15, 15, 15, 0.95)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              gap: "8px"
            }}
          >
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: "12px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="16" cy="8" r="4.5" />
                  <line x1="13.5" y1="5.5" x2="18.5" y2="10.5" strokeWidth="1.5" opacity="0.6" />
                  <line x1="13.5" y1="10.5" x2="18.5" y2="5.5" strokeWidth="1.5" opacity="0.6" />
                  <path d="M11.5 10.5 L13.5 12.5" strokeWidth="3" />
                  <line x1="12" y1="12" x2="5" y2="19" strokeWidth="3.5" />
                  <line x1="5.5" y1="18.5" x2="3" y2="21" strokeWidth="2" />
                </svg>
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t.placeholder}
                style={{
                  flex: 1,
                  padding: "10px 14px 10px 36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  outline: "none",
                  width: "100%"
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: inputVal.trim() && !isLoading ? "var(--accent-color, #ffcc00)" : "rgba(255,255,255,0.03)",
                color: inputVal.trim() && !isLoading ? "#000" : "#666",
                border: "none",
                cursor: inputVal.trim() && !isLoading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
