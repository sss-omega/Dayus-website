import prisma from "@/lib/prisma";
import { Category, Product } from "@prisma/client";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const translations = {
  ru: {
    demoTitle: "Демо-Коллекция",
    demoDesc: "Так будет выглядеть ваш сайт после добавления товаров в админке.",
    demoBtn: "ДЕМО-РЕЖИМ",
    inStock: "В НАЛИЧИИ",
    priceReq: "Цена по запросу",
    buyBtn: "Купить на Kaspi.kz",
    notAvail: "Нет в наличии",
    noDesc: "Нет описания",
    premium: "Премиум качество",
    premiumDesc: "Только лучшие материалы и акустика.",
    fastDelivery: "Быстрая доставка",
    fastDeliveryDesc: "Заказывайте через Kaspi.kz с доставкой на дом.",
    warranty: "Гарантия включена",
    warrantyDesc: "12 месяцев официальной гарантии."
  },
  kk: {
    demoTitle: "Демо-Топтама",
    demoDesc: "Тауарларды қосқаннан кейін сайтыңыз осылай көрінеді.",
    demoBtn: "ДЕМО-РЕЖИМ",
    inStock: "БАР",
    priceReq: "Бағасы сұраныс бойынша",
    buyBtn: "Kaspi.kz-тен сатып алу",
    notAvail: "Қолжетімсіз",
    noDesc: "Сипаттама жоқ",
    premium: "Премиум сапа",
    premiumDesc: "Тек ең жақсы материалдар мен акустика.",
    fastDelivery: "Жылдам жеткізу",
    fastDeliveryDesc: "Kaspi.kz арқылы үйге жеткізумен тапсырыс беріңіз.",
    warranty: "Кепілдік бар",
    warrantyDesc: "12 айлық ресми кепілдік."
  }
};

export default async function Home() {
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
  const heroTitle = settings?.heroTitle || "Experience True Sound";
  const heroDesc = settings?.heroDesc || "Premium audio speakers designed for audiophiles. Find your perfect sound today.";

  return (
    <main style={{ animation: 'fadeIn 1s ease-in-out' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container" style={{ animation: 'slideUp 1s ease-out' }}>
          <h1>{heroTitle}</h1>
          <p>{heroDesc}</p>
        </div>
      </section>

      {/* Show beautiful demo if no products are added yet */}
      {!hasAnyProducts && (
        <section className="container" style={{ marginBottom: '100px', animation: 'fadeIn 1.5s ease-in-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffcc00', textTransform: 'uppercase' }}>{t.demoTitle}</h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>{t.demoDesc}</p>
          </div>
          
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image">
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                  {t.demoBtn}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo1.png" alt="Demo Speaker 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="product-info">
                <h3 className="product-title">Aetherion X-1</h3>
                <p className="product-desc">High-end floorstanding speaker with pure titanium tweeters and deep bass resonance. Perfect for large living rooms.</p>
                <span className="price-tag">450,000 KZT</span>
                <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  {t.demoBtn}
                </button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                  {t.demoBtn}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo2.png" alt="Demo Speaker 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="product-info">
                <h3 className="product-title">Aetherion Bookshelf</h3>
                <p className="product-desc">Compact wireless bookshelf speaker. Brings audiophile quality to your desktop with stunning aesthetics.</p>
                <span className="price-tag">210,000 KZT</span>
                <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  {t.demoBtn}
                </button>
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
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '30px', borderBottom: '1px solid rgba(255, 204, 0, 0.2)', paddingBottom: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {category.name}
                </h2>
                <div className="product-grid">
                  {category.products.map((product: Product) => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image">
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                          {t.inStock}
                        </div>
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            loading="lazy"
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', background: '#111' }}>
                            NO IMAGE
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">{product.description || t.noDesc}</p>
                        <span className="price-tag">
                          {product.price ? `${product.price.toLocaleString()} KZT` : t.priceReq}
                        </span>
                        {product.kaspiLink ? (
                          <a href={product.kaspiLink} target="_blank" rel="noopener noreferrer" className="btn-kaspi">
                            {t.buyBtn}
                          </a>
                        ) : (
                          <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                            {t.notAvail}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
