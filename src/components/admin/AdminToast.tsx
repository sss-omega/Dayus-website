"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          zIndex: 9999,
          pointerEvents: "none"
        }}
      >
        {toasts.map((t) => {
          // Yellow branding colors matching DAUYS
          let bgColor = "rgba(15, 15, 15, 0.9)";
          let borderColor = "var(--accent-color, #ffcc00)";
          let glowColor = "rgba(255, 204, 0, 0.15)";
          let icon = "⚡";

          if (t.type === "error") {
            borderColor = "#ff3366";
            glowColor = "rgba(255, 51, 102, 0.15)";
            icon = "🚨";
          } else if (t.type === "info") {
            borderColor = "#00e6ff";
            glowColor = "rgba(0, 230, 255, 0.15)";
            icon = "ℹ️";
          } else if (t.type === "warning") {
            borderColor = "#ff9900";
            glowColor = "rgba(255, 153, 0, 0.15)";
            icon = "⚠️";
          } else if (t.type === "success") {
            // Default elegant gold checkmark
            borderColor = "#ffcc00";
            glowColor = "rgba(255, 204, 0, 0.25)";
            icon = "✅";
          }

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                background: bgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px ${glowColor}`,
                backdropFilter: "blur(12px)",
                padding: "16px 20px",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "0.92rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "320px",
                maxWidth: "450px",
                animation: "toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{icon}</span>
              <span style={{ flex: 1, lineHeight: "1.4" }}>{t.message}</span>
              
              {/* Progress Indicator line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "3px",
                  background: borderColor,
                  width: "100%",
                  animation: "toast-progress 4s linear forwards"
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Inject Toast animations style tag */}
      <style jsx global>{`
        @keyframes toast-slide-in {
          from {
            transform: translateX(100%) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
