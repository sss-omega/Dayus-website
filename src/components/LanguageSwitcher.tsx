"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const switchLang = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => switchLang("ru")}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: currentLang === 'ru' ? 'var(--accent-color)' : '#666', 
          fontWeight: currentLang === 'ru' ? 'bold' : 'normal',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        RU
      </button>
      <span style={{ color: '#444' }}>|</span>
      <button 
        onClick={() => switchLang("kk")}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: currentLang === 'kk' ? 'var(--accent-color)' : '#666', 
          fontWeight: currentLang === 'kk' ? 'bold' : 'normal',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        KZ
      </button>
    </div>
  );
}
