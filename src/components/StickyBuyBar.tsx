"use client";

import Link from "next/link";

interface StickyBuyBarProps {
  name: string;
  price: number | null;
  kaspiLink: string | null;
  imageUrl: string | null;
  buyLabel: string;
  priceLabel: string;
}

export default function StickyBuyBar({ name, price, kaspiLink, imageUrl, buyLabel, priceLabel }: StickyBuyBarProps) {
  const visible = true;

  return (
    <div
      className="sticky-buy-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
        background: "rgba(8,8,8,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,204,0,0.15)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.6)",
      }}
    >
      {/* Left: product info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="sticky-buy-img"
            style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,204,0,0.2)", flexShrink: 0 }}
          />
        )}
        <div className="sticky-buy-info" style={{ minWidth: 0 }}>
          <div className="sticky-buy-name" style={{ fontWeight: 800, color: "#fff", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
            {name}
          </div>
          <div className="sticky-buy-price" style={{ color: "#ffcc00", fontWeight: 900, fontSize: "1.2rem", fontFamily: "Outfit, sans-serif" }}>
            {price ? `${price.toLocaleString()} KZT` : priceLabel}
          </div>
        </div>
      </div>

      {/* Right: buy button */}
      {kaspiLink ? (
        <a
          href={kaspiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-buy-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            background: "linear-gradient(90deg, #ffcc00 0%, #ffaa00 100%)",
            color: "#000",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: "0.95rem",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textDecoration: "none",
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(255,204,0,0.35)",
            transition: "box-shadow 0.3s, transform 0.3s",
          }}
        >
          {buyLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      ) : null}
    </div>
  );
}
