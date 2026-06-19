"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import StickyBuyBar from "@/components/StickyBuyBar";
import ProductPromoPlayer from "@/components/ProductPromoPlayer";

interface ProductClientProps {
  product: {
    id: number;
    name: string;
    price: number | null;
    imageUrl: string | null;
    galleryUrls?: string[];
    kaspiLink: string | null;
    category: { name: string };
  };
  displayDesc: string;
  specs: { key: string; value: string }[];
  relatedProducts: Array<{
    id: number;
    name: string;
    price: number | null;
    imageUrl: string | null;
    description: string | null;
  }>;
  locale: string;
  t: Record<string, string>;
}

function FeatureSection({
  stat, statLabel, title, desc, imgSrc, reverse, accent,
}: {
  stat: string; statLabel: string; title: string; desc: string;
  imgSrc: string; reverse?: boolean; accent?: boolean;
}) {
  return (
    <section className={`pdp-feature ${accent ? "pdp-feature-accent" : "pdp-feature-dark"} reveal-section`}>
      <div className={`pdp-feature-inner container ${reverse ? "pdp-feature-reverse" : ""}`}>
        <div className="pdp-feature-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={title} className="pdp-feature-img" loading="lazy" />
        </div>
        <div className="pdp-feature-text">
          <div className="pdp-feature-stat">{stat}</div>
          <div className="pdp-feature-stat-label">{statLabel}</div>
          <h2 className="pdp-feature-title">{title}</h2>
          <p className="pdp-feature-desc">{desc}</p>
        </div>
      </div>
    </section>
  );
}

export default function ProductClient({
  product, displayDesc, specs, relatedProducts, locale, t,
}: ProductClientProps) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-section");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const isHandheld = product.name.toLowerCase().includes("handheld");
  const isDOne = product.name.toLowerCase().includes("d-one");
  const isDS8 = product.name.toLowerCase().includes("ds8");
  const feat1Img = "/microphones/20250419084600.jpg";
  const feat2Img = "/photo_2026-06-17_12-38-13.jpg";
  const feat3Img = "/photo_2026-06-17_12-38-09.jpg";
  const feat4Img = "/photo_2026-06-17_12-38-14.jpg";

  return (
    <div style={{ paddingBottom: 120 }}>
      <StickyBuyBar
        name={product.name}
        price={product.price}
        kaspiLink={product.kaspiLink}
        imageUrl={product.imageUrl}
        buyLabel={t.buyBtn}
        priceLabel={t.priceReq}
      />

      <section className="pdp-hero">
        <div className="container" style={{ width: "100%" }}>
          <Link href="/" className="back-btn-link" style={{ marginBottom: 24, display: "inline-block" }}>
            {t.backToStore}
          </Link>
          <div className="pdp-hero-content">
            <div className="pdp-hero-left">
              <div className="pdp-hero-badges">
              <span className="badge-category">{product.category.name}</span>
              <span className="badge-stock">
                <span className="dot-glowing" />
                {t.inStock}
              </span>
            </div>
            <h1 className="pdp-hero-title">
              <GlitchText speed={0.8}>{product.name}</GlitchText>
            </h1>
            <div className="pdp-stat-pills">
              {["UHF", "80M", "8H+", "2.4G"].map((s) => (
                <div key={s} className="pdp-stat-pill">{s}</div>
              ))}
            </div>
            <p className="pdp-hero-desc">{displayDesc.slice(0, 220)}</p>
            <div className="pdp-hero-price-row">
              <span className="pdp-hero-price">
                {product.price ? `${product.price.toLocaleString()} KZT` : t.priceReq}
              </span>
              {product.kaspiLink && (
                <a href={product.kaspiLink} target="_blank" rel="noopener noreferrer" className="pdp-buy-btn">
                  {t.buyBtn}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="pdp-hero-right">
            <ProductPromoPlayer
              imageUrl={product.imageUrl || "/microphones/20250419084630_v2.jpg"}
              videoUrl={isHandheld ? "/video_2026-06-15_16-13-36.mp4" : null}
              locale={locale}
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </section>

      {isDOne && (
        <>
          {/* ── FEATURE 1 ── */}
          <FeatureSection
            stat={t.feat1Stat} statLabel={t.feat1StatLabel}
            title={t.feat1Title} desc={t.feat1Desc}
            imgSrc={feat1Img}
          />

          {/* ── FEATURE 2 ── */}
          <FeatureSection
            stat={t.feat2Stat} statLabel={t.feat2StatLabel}
            title={t.feat2Title} desc={t.feat2Desc}
            imgSrc={feat2Img} reverse accent
          />

          {/* ── FEATURE 3: full-width battery ── */}
          <section className="pdp-feature pdp-feature-full reveal-section">
            <div className="pdp-feat-full-inner container">
              <div className="pdp-feat-full-text">
                <div className="pdp-feature-stat" style={{ fontSize: "5rem" }}>{t.feat3Stat}</div>
                <div className="pdp-feature-stat-label" style={{ marginBottom: 20 }}>{t.feat3StatLabel}</div>
                <h2 className="pdp-feature-title">{t.feat3Title}</h2>
                <p className="pdp-feature-desc" style={{ maxWidth: 520, margin: "0 auto" }}>{t.feat3Desc}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feat3Img} alt={t.feat3Title} className="pdp-feat-full-img" loading="lazy" />
            </div>
          </section>

          {/* ── FEATURE 4 ── */}
          <FeatureSection
            stat={t.feat4Stat} statLabel={t.feat4StatLabel}
            title={t.feat4Title} desc={t.feat4Desc}
            imgSrc={feat4Img}
          />
        </>
      )}

      {isDS8 && (
        <>
          <FeatureSection
            stat="35 Гц" statLabel={locale === "ru" ? "Глубокий бас" : "Терең бас"}
            title={locale === "ru" ? "Мощные низкие частоты" : "Қуатты төмен жиіліктер"}
            desc={locale === "ru" ? "8-дюймовый сабвуфер с длинным ходом диффузора обеспечивает мощные и насыщенные низкие частоты." : "Диффузордың ұзын жүрісі бар 8 дюймдік сабвуфер қуатты төмен жиіліктерді қамтамасыз етеді."}
            imgSrc="/photo_2026-06-20_00-37-38.jpg"
          />

          <FeatureSection
            stat="25 мм" statLabel={locale === "ru" ? "Шелковый купол" : "Жібек күмбез"}
            title={locale === "ru" ? "Кристальная чистота" : "Кристалдай тазалық"}
            desc={locale === "ru" ? "Сателлитные колонки оснащены 5-дюймовым среднечастотным динамиком и 25-мм твитером – звучание кристально прозрачное." : "Сателлиттік колонкалар 5 дюймдік ОЖ-динамикпен және 25 мм твитермен жабдықталған – дыбыс мөлдір таза."}
            imgSrc="/photo_2026-06-20_00-37-39.jpg" reverse accent
          />

          <section className="pdp-feature pdp-feature-full reveal-section">
            <div className="pdp-feat-full-inner container">
              <div className="pdp-feat-full-text">
                <div className="pdp-feature-stat" style={{ fontSize: "5rem" }}>180 Вт</div>
                <div className="pdp-feature-stat-label" style={{ marginBottom: 20 }}>{locale === "ru" ? "Общая мощность" : "Жалпы қуаты"}</div>
                <h2 className="pdp-feature-title">{locale === "ru" ? "Полный контроль" : "Толық басқару"}</h2>
                <p className="pdp-feature-desc" style={{ maxWidth: 520, margin: "0 auto" }}>
                  {locale === "ru" ? "Регулируйте громкость, баланс высоких частот, уровень сабвуфера, а также управляйте микрофонным входом и реверберацией." : "Дыбыс деңгейін, жоғары жиіліктер балансын, сабвуфер деңгейін, сондай-ақ микрофон мен реверберацияны басқарыңыз."}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo_2026-06-20_00-37-40.jpg" alt="DAUYS DS8 Control" className="pdp-feat-full-img" loading="lazy" />
            </div>
          </section>
        </>
      )}

      {/* ── SPECS TABLE ── */}
      {specs.length > 0 && (
        <section className="pdp-specs-section reveal-section">
          <div className="container">
            <h2 className="pdp-section-heading">{t.specifications}</h2>
            <div className="pdp-specs-table">
              {specs.map((spec, i) => (
                <div key={i} className="pdp-spec-row">
                  <span className="pdp-spec-key">{spec.key}</span>
                  <span className="pdp-spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MANUAL ACCORDIONS ── */}
      {isDOne && (
        <section className="pdp-manual-section reveal-section">
          <div className="container">
            <h2 className="pdp-section-heading">{t.manualTitle}</h2>
            <div style={{ marginTop: 30 }}>
              <details className="manual-accordion" open>
                <summary>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    <span>{t.setupSection}</span>
                  </div>
                </summary>
                <div className="manual-content">
                  {locale === "ru" ? (
                    <ol>
                      <li><strong>Антенны:</strong> Перпендикулярно приёмнику, отступ от стен более 1 м.</li>
                      <li><strong>Питание:</strong> Адаптер 12V DC → разъём приёмника.</li>
                      <li><strong>MIX OUT:</strong> Jack 6.3 мм → микшер или акустика.</li>
                      <li><strong>XLR:</strong> Разъёмы A/B → микшерный пульт (балансный).</li>
                    </ol>
                  ) : (
                    <ol>
                      <li><strong>Антенналар:</strong> Қабылдағышқа перпендикуляр, қабырғадан 1 м.</li>
                      <li><strong>Қорек:</strong> 12V DC адаптер → қабылдағыш ұяшығы.</li>
                      <li><strong>MIX OUT:</strong> Jack 6.3 мм → микшер немесе акустика.</li>
                      <li><strong>XLR:</strong> A/B ұяшықтары → микшерлік пульт.</li>
                    </ol>
                  )}
                </div>
              </details>
              <details className="manual-accordion">
                <summary>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
                      <path d="M12 2v20M17 5a9 9 0 0 0-10 0M19 8a6 6 0 0 0-14 0M21 11a3 3 0 0 0-18 0" />
                    </svg>
                    <span>{t.syncSection}</span>
                  </div>
                </summary>
                <div className="manual-content">
                  {locale === "ru" ? (
                    <ol>
                      <li>Выключите передатчик.</li>
                      <li>Выберите «СОПРЯЖЕНИЕ» в меню приёмника.</li>
                      <li>Включите передатчик рядом с приёмником (до 20 м).</li>
                      <li>Дождитесь «УСПЕШНАЯ СИНХРОНИЗАЦИЯ».</li>
                      <li><strong>SKIP AUTO:</strong> автоматически подбирает чистую частоту при помехах.</li>
                    </ol>
                  ) : (
                    <ol>
                      <li>Таратқышты өшіріңіз.</li>
                      <li>Мәзірден «СОПРЯЖЕНИЕ» таңдаңыз.</li>
                      <li>Таратқышты жақын (20 м) қосыңыз.</li>
                      <li>«УСПЕШНАЯ СИНХРОНИЗАЦИЯ» хабарламасын күтіңіз.</li>
                      <li><strong>SKIP AUTO:</strong> кедергіде таза жиілікті автоматты таңдайды.</li>
                    </ol>
                  )}
                </div>
              </details>
              <details className="manual-accordion">
                <summary>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
                      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    <span>{t.screenSection}</span>
                  </div>
                </summary>
                <div className="manual-content">
                  <ul>
                    {locale === "ru" ? (
                      <>
                        <li><strong>Громкость:</strong> Ручки A/B — независимая регулировка каналов.</li>
                        <li><strong>Эхо (ECHO):</strong> Короткое нажатие ручки, диапазон 1–100.</li>
                        <li><strong>Задержка (DELAY):</strong> Кнопка A/B, диапазон 1–100.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Дыбыс:</strong> A/B тұтқалары — дербес реттеу.</li>
                        <li><strong>Жаңғырық (ECHO):</strong> Тұтқаны қысқа басу, 1–100.</li>
                        <li><strong>Кешігу (DELAY):</strong> A/B түймесі, 1–100.</li>
                      </>
                    )}
                  </ul>
                </div>
              </details>
              <details className="manual-accordion">
                <summary>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>{t.powerSection}</span>
                  </div>
                </summary>
                <div className="manual-content">
                  <ul>
                    {locale === "ru" ? (
                      <>
                        <li><strong>Усиление (GAIN):</strong> от −10 до +10 дБ.</li>
                        <li><strong>Мощность (TX POW):</strong> H (80м), M (средняя), L (низкая).</li>
                        <li><strong>Батарея:</strong> 18650 (3.7В), зарядка Type-C, 8+ часов.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Күшейту (GAIN):</strong> −10-нан +10 дБ.</li>
                        <li><strong>Қуат (TX POW):</strong> H (80м), M, L.</li>
                        <li><strong>Батарея:</strong> 18650 (3.7В), Type-C, 8+ сағат.</li>
                      </>
                    )}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="pdp-cta-section reveal-section">
        <div className="container">
          <div className="cta-box-premium">
            <h2 className="cta-title">
              <GlitchText speed={1.0}>{t.buyBottomTitle}</GlitchText>
            </h2>
            <p className="cta-desc">{t.buyBottomDesc}</p>
            {product.kaspiLink ? (
              <a href={product.kaspiLink} target="_blank" rel="noopener noreferrer" className="btn-kaspi-cta">
                {t.buyBottomBtn}
              </a>
            ) : (
              <button className="btn-kaspi-cta" disabled style={{ opacity: 0.5 }}>{t.notAvail}</button>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {relatedProducts.length > 0 && (
        <section style={{ paddingBottom: 60 }}>
          <div className="container">
            <h2 className="pdp-section-heading" style={{ marginBottom: 32 }}>
              {locale === "ru" ? "Другие продукты" : "Басқа өнімдер"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {relatedProducts.map((rel) => {
                let relDesc = rel.description || "";
                if (relDesc.startsWith("{")) {
                  try { const d = JSON.parse(relDesc); relDesc = d[locale] || d.ru || ""; } catch (_e) { /* ignore */ }
                }
                return (
                  <Link key={rel.id} href={`/product/${rel.id}`} style={{ textDecoration: "none" }}>
                    <div className="pdp-related-card">
                      {rel.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rel.imageUrl} alt={rel.name} className="pdp-related-img" loading="lazy" />
                      )}
                      <div className="pdp-related-info">
                        <h3 className="pdp-related-title">{rel.name}</h3>
                        <p className="pdp-related-desc">{relDesc.slice(0, 120)}</p>
                        <span className="hcard-price" style={{ fontSize: "1.4rem" }}>
                          {rel.price ? `${rel.price.toLocaleString()} KZT` : t.priceReq}
                        </span>
                      </div>
                      <div className="pdp-related-arrow">→</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic footer copyright integrated into product page */}
      <div style={{ paddingBottom: '30px', paddingTop: '35px', marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
        <div className="container" style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} DAUYS. {locale === "kk" ? "Барлық құқықтар қорғалған." : "Все права защищены."}
        </div>
      </div>
    </div>
  );
}
