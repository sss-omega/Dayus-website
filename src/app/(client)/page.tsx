import prisma from "@/lib/prisma";
import { Category, Product } from "@prisma/client";
import { cookies } from "next/headers";
import Link from "next/link";
import DarkVeil from "@/components/DarkVeil";
import GlitchText from "@/components/GlitchText";
import Dither from "@/components/Dither";
import { runSetupIfNeeded } from "@/lib/setup";

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

  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: true,
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } })
  ]);

  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = translations[locale];

  const hasAnyProducts = categories.some(cat => cat.products.length > 0);

  const defaultHeroTitle = locale === "kk" ? "Шынайы Дыбыс Әлемі" : "Мир Истинного Звука";
  const defaultHeroDesc = locale === "kk"
    ? "Аудиофилдер мен кәсіби мамандарға арналған премиум микрофондар мен дыбыс жүйелері."
    : "Акустические системы и микрофоны премиум-класса для аудиофилов и профессионалов.";

  const heroTitle = settings?.heroTitle || defaultHeroTitle;
  const heroDesc = settings?.heroDesc || defaultHeroDesc;

  return (
    <main style={{ animation: 'fadeIn 1s ease-in-out' }}>
      <div className="dither-bg-container">
        <Dither
          waveColor={[0.95, 0.75, 0.1]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container" style={{ animation: 'slideUp 1s ease-out' }}>
          <h1>
            <GlitchText speed={1.2}>{heroTitle}</GlitchText>
          </h1>
          <p>{heroDesc}</p>
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
                  <img src="/demo1.png" alt="Demo Speaker 1" />
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
                  <img src="/demo2.png" alt="Demo Speaker 2" />
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
          {categories.map((category: Category & { products: Product[] }, idx: number) => {
            if (category.products.length === 0) return null;
            return (
              <div key={category.id} style={{ marginBottom: '80px', animation: `fadeIn ${1 + idx * 0.2}s ease-in-out` }}>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '30px', borderBottom: '1px solid rgba(255, 204, 0, 0.15)', paddingBottom: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <GlitchText speed={1.5}>{category.name}</GlitchText>
                </h2>
                <div className="product-grid">
                  {category.products.map((product: Product) => {
                    // Parse bilingual description
                    let displayDesc = product.description || t.noDesc;
                    if (product.description && product.description.startsWith("{")) {
                      try {
                        const descObj = JSON.parse(product.description);
                        displayDesc = descObj[locale] || descObj.ru || descObj.kk || product.description;
                      } catch (e) {
                        // Fallback
                      }
                    }

                    return (
                      <Link href={`/product/${product.id}`} key={product.id} className="product-card">
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
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0, 230, 115, 0.9)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                              {t.inStock}
                            </div>
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                loading="lazy"
                              />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', background: '#111' }}>
                                {t.noImage}
                              </div>
                            )}
                          </div>
                          <div className="product-info">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '3.2em' }}>{displayDesc}</p>
                            <span className="price-tag">
                              {product.price ? `${product.price.toLocaleString()} KZT` : t.priceReq}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                              <button className="btn-kaspi" style={{ width: '100%' }}>
                                {t.detailsBtn}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Features / Info Section */}
      <section style={{ backgroundColor: 'var(--card-bg)', padding: '80px 0', marginTop: '40px', borderTop: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
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
      </section>
    </main>
  );
}
