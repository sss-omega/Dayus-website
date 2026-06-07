"use client";

import { useEffect, useState } from "react";

const bannerTexts = {
  ru: {
    message: "Мы используем cookies для сбора метрик и улучшения рекомендаций.",
    btnText: "Принять"
  },
  kk: {
    message: "Біз метрикаларды жинау және ұсыныстарды жақсарту үшін cookies файлдарын пайдаланамыз.",
    btnText: "Қабылдау"
  }
};

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [locale, setLocale] = useState("ru");

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }

    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLocale(match[2] === "kk" ? "kk" : "ru");
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  const t = bannerTexts[locale as "ru" | "kk"];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(15, 15, 15, 0.95)',
      padding: '16px 28px',
      borderRadius: '16px',
      border: '1px solid var(--accent-color)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      zIndex: 9999,
      backdropFilter: 'blur(20px)'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc', fontWeight: 500 }}>
        {t.message}
      </p>
      <button onClick={accept} style={{
        padding: '10px 22px',
        background: 'var(--accent-color)',
        color: '#000',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '800',
        cursor: 'pointer',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        transition: 'all 0.3s'
      }}>
        {t.btnText}
      </button>
    </div>
  );
}
