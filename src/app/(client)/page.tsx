import prisma from "@/lib/prisma";
import { Category, Product } from "@prisma/client";
import { cookies } from "next/headers";
import Link from "next/link";
import DarkVeil from "@/components/DarkVeil";
import GlitchText from "@/components/GlitchText";
import { runSetupIfNeeded } from "@/lib/setup";
import CategoryFilter from "@/components/CategoryFilter";
import SoundWaveVisualizer from "@/components/SoundWaveVisualizer";

export const dynamic = 'force-dynamic';

const translations = {
  ru: {
    demoTitle: "Демо-Коллекция",
    demoDesc: "Так будет выглядеть ваш сайт после добавления товаров в админке.",
    demoBtn: "ДЕМО-РЕЖИМ",
    inStock: "В НАЛИЧИИ",
    priceReq: "Цена по запросу",
    buyBtn: "Купить на Kaspi.kz",
    detailsBtn: "Подробнее",
    notAvail: "Нет в наличии",
    noDesc: "Нет описания",
    noImage: "НЕТ ИЗОБРАЖЕНИЯ",
    premium: "Премиум качество",
    premiumDesc: "Только лучшие материалы и акустика.",
    fastDelivery: "Быстрая доставка",
    fastDeliveryDesc: "Заказывайте через Kaspi.kz с доставкой на дом.",
    warranty: "Гарантия включена",
    warrantyDesc: "12 месяцев официальной гарантии.",
    demo1Title: "Aetherion X-1 (Напольная Акустика)",
    demo1Desc: "Напольная акустическая система премиум-класса с твитерами из чистого титана и глубоким басом. Идеально для больших помещений.",
    demo2Title: "Aetherion Bookshelf (Полочная Акустика)",
    demo2Desc: "Компактная беспроводная полочная колонка. Привносит аудиофильское качество звука на ваш рабочий стол в элегантном исполнении."
  },
  kk: {
    demoTitle: "Демо-Топтама",
    demoDesc: "Тауарларды қосқаннан кейін сайтыңыз осылай көрінеді.",
    demoBtn: "ДЕМО-РЕЖИМ",
    inStock: "БАР",
    priceReq: "Бағасы сұраныс бойынша",
    buyBtn: "Kaspi.kz-тен сатып алу",
    detailsBtn: "Толығырақ",
    notAvail: "Қолжетімсіз",
    noDesc: "Сипаттама жоқ",
    noImage: "СУРЕТ ЖОҚ",
    premium: "Премиум сапа",
    premiumDesc: "Тек ең жақсы материалдар мен акустика.",
    fastDelivery: "Жылдам жеткізу",
    fastDeliveryDesc: "Kaspi.kz арқылы үйге жеткізумен тапсырыс беріңіз.",
    warranty: "Кепілдік бар",
    warrantyDesc: "12 айлық ресми кепілдік.",
    demo1Title: "Aetherion X-1 (Едендік Акустика)",
    demo1Desc: "Таза титан твиттерлері мен терең басы бар жоғары деңгейлі едендік акустикалық жүйе. Үлкен бөлмелер үшін өте қолайлы.",
    demo2Title: "Aetherion Bookshelf (Сөрелік Акустика)",
    demo2Desc: "Ықшам сымсыз сөрелік колонка. Тамаша эстетикасымен жұмыс үстеліңізге аудиофильдік дыбыс сапасын әкеледі."
  }
};

export default async function Home() {
  // Trigger setup/seed check on page load
  await runSetupIfNeeded();

  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = translations[locale];

  const hasAnyProducts = categories.some(cat => cat.products.length > 0);
  return (
    <main style={{ animation: 'fadeIn 1s ease-in-out' }}>

      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden', padding: '120px 0 90px 0' }}>
        <SoundWaveVisualizer color="#ffcc00" secondaryColor="#d95d24" />
        <div className="container" style={{ position: 'relative', zIndex: 2, animation: 'slideUp 1s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="hero-logo-container" style={{ marginBottom: '20px' }}>
            <img
              src="/dauys_logo.svg?v=3"
              alt="DAUYS"
              className="hero-logo"
              style={{
                width: '100%',
                maxWidth: '480px',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
          {/* Subtitle / Slogan */}
          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.25rem)',
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.75)',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {locale === "ru" ? "Искусство Безупречного Звука" : "Кемел Дыбыс Өнері"}
          </div>
        </div>
      </section>

      {/* About / Intro Section */}
      <section className="about-intro-section container" style={{ marginBottom: '50px', marginTop: '20px', animation: 'fadeIn 1.2s ease-in-out' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 204, 0, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
          border: '1px solid rgba(255, 204, 0, 0.08)',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.0rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {locale === "ru" ? "ПРОФЕССИОНАЛЬНОЕ БЕСПРОВОДНОЕ ЗВУКОВОЕ ОБОРУДОВАНИЕ" : "КӘСІБИ СЫМСЫЗ ДЫБЫС ЖАБДЫҚТАРЫ"}
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#bbb',
            lineHeight: '1.8',
            maxWidth: '900px',
            margin: '0 auto 30px'
          }}>
            {locale === "ru" 
              ? "DAUYS — это передовые беспроводные микрофонные системы нового поколения. Мы занимаемся разработкой и производством высококлассного звукового оборудования для сцены, телевидения, театров и масштабных презентаций. Наши системы сочетают в себе безупречную цифровую передачу звука с динамическим диапазоном более 96 дБ, стабильный прием на расстоянии до 80 метров и непревзойденную автономность с удобной зарядкой Type-C. DAUYS обеспечивает кристальную чистоту вашего голоса и полную свободу движения на сцене."
              : "DAUYS — жаңа буынның озық сымсыз микрофон жүйелері. Біз сахна, теледидар, театрлар және ауқымды презентациялар үшін жоғары деңгейлі дыбыс жабдықтарын әзірлеумен және өндірумен айналысамыз. Жүйелеріміз 96 дБ-ден жоғары динамикалық диапазонмен мінсіз цифрлық дыбыс беруді, 80 метрге дейінгі қашықтықта тұрақты қабылдауды және Type-C арқылы ыңғайлы зарядтаумен ерекше автономды жұмысты үйлестіреді."
            }
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,204,0,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{locale === "ru" ? "Премиум Стандарты" : "Премиум Стандарттар"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,204,0,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{locale === "ru" ? "8+ Часов Автономии" : "8+ Сағат Автономиялылық"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,204,0,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{locale === "ru" ? "80м Дальность Передачи" : "80м Тасымалдау Қашықтығы"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Advantages Section */}
      <section className="container" style={{ marginBottom: '80px', animation: 'fadeIn 1.4s ease-in-out' }}>
        <h3 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          background: 'linear-gradient(135deg, #fff 0%, #ffcc00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {locale === "ru" ? "ТЕХНОЛОГИИ ПРЕВОСХОДСТВА" : "ОЗЫҚ ТЕХНОЛОГИЯЛАР"}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '25px'
        }}>
          {/* Card 1 */}
          <div className="tech-card" style={{
            background: 'rgba(25, 25, 25, 0.4)',
            border: '1px solid rgba(255, 204, 0, 0.08)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="22" x2="5" y2="8" />
                <circle cx="5" cy="5" r="2" fill="var(--accent-color)" />
                <line x1="19" y1="22" x2="19" y2="8" />
                <circle cx="19" cy="5" r="2" fill="var(--accent-color)" />
                <path d="M9 10a4 4 0 0 1 6 0" />
                <path d="M7 13a7 7 0 0 1 10 0" />
              </svg>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
              {locale === "ru" ? "True Diversity прием" : "True Diversity қабылдау"}
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {locale === "ru" 
                ? "Две независимые антенны и тюнеры автоматически выбирают лучший сигнал, гарантируя отсутствие обрывов звука на расстоянии до 80 метров."
                : "Екі тәуелсіз антенна мен тюнерлер ең жақсы сигналды автоматты түрде таңдап, 80 метрге дейінгі қашықтықта дыбыстың үзілуін болдырмайды."}
            </p>
          </div>

          {/* Card 2 */}
          <div className="tech-card" style={{
            background: 'rgba(25, 25, 25, 0.4)',
            border: '1px solid rgba(255, 204, 0, 0.08)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="var(--accent-color)" />
              </svg>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
              {locale === "ru" ? "Сверхнизкая задержка" : "Аса төмен кідіріс"}
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {locale === "ru" 
                ? "Задержка передачи звука составляет менее 3 миллисекунд. Идеально для живых выступлений, телевещания и театральных постановок."
                : "Дыбыстың берілу кідірісі 3 миллисекундтан аз. Жанды дауыста өнер көрсету, теледидар және театрландырылған қойылымдар үшін өте қолайлы."}
            </p>
          </div>

          {/* Card 3 */}
          <div className="tech-card" style={{
            background: 'rgba(25, 25, 25, 0.4)',
            border: '1px solid rgba(255, 204, 0, 0.08)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="16" height="14" rx="2" ry="2" />
                <line x1="22" y1="11" x2="22" y2="13" />
                <line x1="6" y1="9" x2="6" y2="15" />
                <line x1="10" y1="9" x2="10" y2="15" />
                <line x1="14" y1="9" x2="14" y2="15" />
              </svg>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
              {locale === "ru" ? "Литиевые батареи 18650" : "18650 литий батареялары"}
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {locale === "ru" 
                ? "Забудьте о пальчиковых батарейках. Микрофоны питаются от перезаряжаемых литиевых аккумуляторов 18650 с быстрой зарядкой Type-C."
                : "Саусақ батареяларын ұмытыңыз. Микрофондар Type-C жылдам зарядтауы бар қайта зарядталатын 18650 литий аккумуляторларынан қуат алады."}
            </p>
          </div>

          {/* Card 4 */}
          <div className="tech-card" style={{
            background: 'rgba(25, 25, 25, 0.4)',
            border: '1px solid rgba(255, 204, 0, 0.08)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
              {locale === "ru" ? "Аудиофильский диапазон" : "Аудиофильдік диапазон"}
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {locale === "ru" 
                ? "Динамический диапазон свыше 96 дБ и частотная характеристика 40 Гц - 18 кГц обеспечивают студийную чистоту передачи вокала."
                : "96 дБ-ден асатын динамикалық диапазон және 40 Гц - 18 кГц жиілік сипаттамасы вокалдың студиялық сапасын қамтамасыз етеді."}
            </p>
          </div>

        </div>
      </section>

      {/* Show beautiful demo if no products are added yet */}
      {!hasAnyProducts && (
        <section className="container" style={{ marginBottom: '100px', animation: 'fadeIn 1.5s ease-in-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffcc00', textTransform: 'uppercase' }}>
              <GlitchText speed={1.5}>{t.demoTitle}</GlitchText>
            </h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>{t.demoDesc}</p>
          </div>
          
          <div className="product-grid">
            <div className="product-card">
              <div className="product-card-inner">
                <div className="darkveil-container">
                  <DarkVeil
                    hueShift={-145}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.5}
                    scanlineFrequency={0}
                    warpAmount={0}
                    resolutionScale={1}
                  />
                </div>
                <div className="product-image">
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                    {t.demoBtn}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo1.svg" alt="Demo Speaker 1" />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{t.demo1Title}</h3>
                  <p className="product-desc">{t.demo1Desc}</p>
                  <span className="price-tag">450,000 KZT</span>
                  <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    {t.demoBtn}
                  </button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-card-inner">
                <div className="darkveil-container">
                  <DarkVeil
                    hueShift={-145}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.5}
                    scanlineFrequency={0}
                    warpAmount={0}
                    resolutionScale={1}
                  />
                </div>
                <div className="product-image">
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                    {t.demoBtn}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo2.svg" alt="Demo Speaker 2" />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{t.demo2Title}</h3>
                  <p className="product-desc">{t.demo2Desc}</p>
                  <span className="price-tag">210,000 KZT</span>
                  <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    {t.demoBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Actual Products Section */}
      {hasAnyProducts && (
        <section className="container">
          <CategoryFilter 
            categories={categories} 
            locale={locale} 
            t={t} 
          />
        </section>
      )}

      {/* Features / Info Section */}
      <section style={{ backgroundColor: 'var(--card-bg)', padding: '80px 0 30px', marginTop: '40px', borderTop: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center', marginBottom: '50px' }}>
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>{t.premium}</h3>
            <p style={{ color: '#aaa' }}>{t.premiumDesc}</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>{t.fastDelivery}</h3>
            <p style={{ color: '#aaa' }}>{t.fastDeliveryDesc}</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>{t.warranty}</h3>
            <p style={{ color: '#aaa' }}>{t.warrantyDesc}</p>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', color: '#555', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} DAUYS. {locale === "kk" ? "Барлық құқықтар қорғалған." : "Все права защищены."}
        </div>
      </section>
    </main>
  );
}
