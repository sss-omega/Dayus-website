"use client";

import React, { useState, useEffect } from "react";

interface AiKnowledge {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  visitorId?: string;
  createdAt: string;
  messages: ChatMessage[];
}

export default function AdminAiPage() {
  const [activeTab, setActiveTab] = useState<"knowledge" | "dialogs">("knowledge");
  
  // Knowledge state
  const [knowledges, setKnowledges] = useState<AiKnowledge[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [contentVal, setContentVal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingK, setIsLoadingK] = useState(true);

  // Dialogs state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isLoadingD, setIsLoadingD] = useState(true);

  // Load Knowledge base
  const fetchKnowledge = async () => {
    setIsLoadingK(true);
    try {
      const res = await fetch("/api/admin/ai-knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingK(false);
    }
  };

  // Load Chat logs
  const fetchDialogs = async () => {
    setIsLoadingD(true);
    try {
      const res = await fetch("/api/admin/chat-sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (data.length > 0 && !selectedSessionId) {
          setSelectedSessionId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingD(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
    fetchDialogs();
  }, []);

  // Handle Save Knowledge Base entry
  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentVal.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          content: contentVal
        })
      });

      if (res.ok) {
        setContentVal("");
        setEditId(null);
        fetchKnowledge();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Knowledge Base entry
  const handleDeleteKnowledge = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту инструкцию?")) return;

    try {
      const res = await fetch(`/api/admin/ai-knowledge?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        fetchKnowledge();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare edit
  const startEdit = (k: AiKnowledge) => {
    setEditId(k.id);
    setContentVal(k.content);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setContentVal("");
  };

  // Selected session chat messages
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, margin: 0 }}>ИИ Ассистент & Консультант</h1>
          <p style={{ color: "#777", fontSize: "0.95rem", marginTop: "5px" }}>Управление знаниями искусственного интеллекта и переписками клиентов</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "15px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "30px", paddingBottom: "1px" }}>
        <button
          onClick={() => setActiveTab("knowledge")}
          style={{
            background: "transparent",
            border: "none",
            color: activeTab === "knowledge" ? "var(--accent-color)" : "#888",
            borderBottom: activeTab === "knowledge" ? "2px solid var(--accent-color)" : "2px solid transparent",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s"
          }}
        >
          База знаний и Инструкции ИИ
        </button>
        <button
          onClick={() => setActiveTab("dialogs")}
          style={{
            background: "transparent",
            border: "none",
            color: activeTab === "dialogs" ? "var(--accent-color)" : "#888",
            borderBottom: activeTab === "dialogs" ? "2px solid var(--accent-color)" : "2px solid transparent",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s"
          }}
        >
          Переписки клиентов c ИИ ({sessions.length})
        </button>
      </div>

      {/* CONTENT TAB 1: KNOWLEDGE BASE */}
      {activeTab === "knowledge" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
          
          {/* Form */}
          <div style={{ background: "rgba(20, 20, 20, 0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, marginTop: 0, marginBottom: "15px" }}>
              {editId ? "Редактировать инструкцию / данные" : "Добавить новые инструкции для ИИ"}
            </h3>
            <form onSubmit={handleSaveKnowledge}>
              <textarea
                value={contentVal}
                onChange={(e) => setContentVal(e.target.value)}
                placeholder="Введите подробные инструкции, характеристики новых микрофонов, правила синхронизации, цены или часто задаваемые вопросы..."
                rows={8}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: "0.92rem",
                  outline: "none",
                  resize: "vertical"
                }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end" }}>
                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      border: "1px solid #444",
                      color: "#aaa",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Отмена
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!contentVal.trim() || isSaving}
                  style={{
                    padding: "10px 25px",
                    borderRadius: "8px",
                    backgroundColor: "var(--accent-color, #ffcc00)",
                    border: "none",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: 700,
                    opacity: (!contentVal.trim() || isSaving) ? 0.5 : 1
                  }}
                >
                  {isSaving ? "Сохранение..." : editId ? "Обновить данные" : "Добавить в базу знаний"}
                </button>
              </div>
            </form>
          </div>

          {/* List of Knowledge Entries */}
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>Загруженные данные в ИИ</h3>
            {isLoadingK ? (
              <p style={{ color: "#777" }}>Загрузка базы знаний...</p>
            ) : knowledges.length === 0 ? (
              <p style={{ color: "#777" }}>База знаний пока пуста. Добавьте инструкции выше, чтобы ИИ мог консультировать клиентов.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {knowledges.map((k) => (
                  <div
                    key={k.id}
                    style={{
                      background: "rgba(20, 20, 20, 0.3)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: "10px",
                      padding: "20px",
                      position: "relative"
                    }}
                  >
                    <div style={{ color: "#e0e0e0", fontSize: "0.92rem", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                      {k.content}
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#666" }}>
                        Обновлено: {new Date(k.updatedAt).toLocaleString()}
                      </span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => startEdit(k)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--accent-color)",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.85rem"
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteKnowledge(k.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ff3366",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.85rem"
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* CONTENT TAB 2: DIALOGS LOGS */}
      {activeTab === "dialogs" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "25px", height: "600px" }}>
          
          {/* Sessions List */}
          <div style={{ background: "rgba(20, 20, 20, 0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "15px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
              Список чатов
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }} className="admin-chat-sessions-list">
              {isLoadingD ? (
                <p style={{ color: "#777", padding: "10px" }}>Загрузка диалогов...</p>
              ) : sessions.length === 0 ? (
                <p style={{ color: "#777", padding: "10px", fontSize: "0.85rem" }}>Диалогов клиентов с ИИ пока нет.</p>
              ) : (
                sessions.map((s) => {
                  const isActive = s.id === selectedSessionId;
                  const lastMessage = s.messages[s.messages.length - 1];
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSessionId(s.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: isActive ? "rgba(255,204,0,0.08)" : "transparent",
                        borderLeft: isActive ? "3px solid var(--accent-color)" : "3px solid transparent",
                        cursor: "pointer",
                        marginBottom: "8px",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: 700 }}>
                          ID: {s.id.substring(0, 8)}...
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#555" }}>
                          {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#ccc", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {lastMessage ? lastMessage.text : "Начат диалог"}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "3px" }}>
                        Сообщений: {s.messages.length}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Session Conversation History */}
          <div style={{ background: "rgba(10, 10, 10, 0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {selectedSession ? (
              <>
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(20, 20, 20, 0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, color: "#fff", fontSize: "0.95rem" }}>Диалог с клиентом</h4>
                    <span style={{ fontSize: "0.75rem", color: "#777" }}>Сессия: {selectedSession.id}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#777" }}>
                    Создана: {new Date(selectedSession.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* History list */}
                <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
                  {selectedSession.messages.map((m) => {
                    const isAi = m.sender === "ai";
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isAi ? "flex-start" : "flex-end"
                        }}
                      >
                        <span style={{ fontSize: "0.7rem", color: "#555", marginBottom: "4px" }}>
                          {isAi ? "ИИ Ассистент" : "Покупатель"} • {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                        <div
                          style={{
                            maxWidth: "75%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            backgroundColor: isAi ? "rgba(255,255,255,0.03)" : "rgba(255,204,0,0.1)",
                            color: "#e0e0e0",
                            fontSize: "0.88rem",
                            lineHeight: "1.5",
                            border: isAi ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,204,0,0.2)",
                            whiteSpace: "pre-line"
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#555", fontSize: "0.95rem" }}>
                Выберите диалог из списка слева для просмотра переписки.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
