"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const [locale, setLocale] = useState("ru");

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLocale(match[2] === "kk" ? "kk" : "ru");
    }
  }, []);

  const links = [
    {
      href: "/admin",
      label: locale === "kk" ? "Баптаулар" : "Настройки",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.3s' }}>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    },
    {
      href: "/admin/categories",
      label: locale === "kk" ? "Санаттар" : "Категории",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.3s' }}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    {
      href: "/admin/products",
      label: locale === "kk" ? "Тауарлар" : "Товары",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'color 0.3s' }}>
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon>
          <polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon>
          <polygon points="12 12 21 6.92 12 1.84 3 6.92 12 12"></polygon>
        </svg>
      )
    }
  ];

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '10px',
              color: isActive ? 'var(--accent-color)' : '#999',
              background: isActive ? 'rgba(255, 204, 0, 0.08)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.92rem',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              textShadow: isActive ? '0 0 10px rgba(255, 204, 0, 0.2)' : 'none',
              boxShadow: isActive ? 'inset 2px 0 8px rgba(255, 204, 0, 0.03)' : 'none'
            }}
            className="admin-nav-link"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
