"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid var(--accent-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      zIndex: 9999,
      backdropFilter: 'blur(10px)'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
        Мы используем cookies для сбора метрик и улучшения рекомендаций.
      </p>
      <button onClick={accept} style={{
        padding: '8px 20px',
        background: 'var(--accent-color)',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Принять
      </button>
    </div>
  );
}
