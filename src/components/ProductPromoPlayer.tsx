"use client";

import React, { useRef, useState, useEffect } from "react";

interface ProductPromoPlayerProps {
  imageUrl: string;
  videoUrl: string | null;
  locale: string;
  productName: string;
}

const captionsData: Record<string, Array<{ start: number; end: number; title: string; desc: string }>> = {
  ru: [
    {
      start: 0,
      end: 2.8,
      title: "DAUYS D-ONE",
      desc: "Премиальная беспроводная микрофонная система нового поколения."
    },
    {
      start: 2.8,
      end: 5.8,
      title: "Умный ресивер",
      desc: "Автоматическое сканирование и подбор чистых частот при помехах."
    },
    {
      start: 5.8,
      end: 8.5,
      title: "Кристальный звук",
      desc: "Низкая задержка и чистая передача голоса на расстоянии до 80 метров."
    }
  ],
  kk: [
    {
      start: 0,
      end: 2.8,
      title: "DAUYS D-ONE",
      desc: "Жаңа буынның премиум сымсыз микрофон жүйесі."
    },
    {
      start: 2.8,
      end: 5.8,
      title: "Ақылды ресивер",
      desc: "Кедергілер кезінде таза жиіліктерді автоматты түрде іздеу."
    },
    {
      start: 5.8,
      end: 8.5,
      title: "Кристалды дыбыс",
      desc: "Төмен кешігу және 80 метрге дейін таза дыбыс беру."
    }
  ]
};

export default function ProductPromoPlayer({
  imageUrl,
  videoUrl,
  locale,
  productName
}: ProductPromoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeCaption, setActiveCaption] = useState<{ title: string; desc: string } | null>(null);

  const captions = captionsData[locale] || captionsData.ru;

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    
    const current = captions.find(
      (c) => currentTime >= c.start && currentTime <= c.end
    );
    
    if (current) {
      setActiveCaption({ title: current.title, desc: current.desc });
    } else {
      setActiveCaption(null);
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Hover play blocked:", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setActiveCaption(null);
    }
  };

  if (!videoUrl) {
    return (
      <div className="promo-player-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={productName} className="pdp-hero-img" />
        <div className="pdp-hero-img-glow" />
      </div>
    );
  }

  return (
    <div 
      className="promo-player-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element (Acts as both static image and player) */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={imageUrl}
        className="promo-video pdp-hero-img"
        playsInline
        muted
        loop
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Text Overlay */}
      <div className={`promo-overlay-text ${activeCaption ? "active" : ""}`}>
        {activeCaption && (
          <>
            <h4 className="promo-overlay-title">{activeCaption.title}</h4>
            <p className="promo-overlay-desc">{activeCaption.desc}</p>
          </>
        )}
      </div>

      <div className="pdp-hero-img-glow" />
    </div>
  );
}
