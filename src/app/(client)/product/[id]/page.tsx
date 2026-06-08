import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import DarkVeil from "@/components/DarkVeil";
import GlitchText from "@/components/GlitchText";
import Dither from "@/components/Dither";

export const dynamic = 'force-dynamic';

const translations = {
  ru: {
    backToStore: "← Назад в магазин",
    inStock: "В НАЛИЧИИ",
    priceReq: "Цена по запросу",
    buyBtn: "Купить на Kaspi.kz",
    notAvail: "Нет в наличии",
    noDesc: "Описание отсутствует",
    specifications: "Характеристики устройства",
    relatedProducts: "Похожие товары",
    type: "Тип",
    frequencyRange: "Диапазон частот",
    sensitivity: "Чувствительность",
    impedance: "Импеданс",
    connector: "Интерфейс подключения",
    pattern: "Диаграмма направленности",
    home: "Главная",
    categories: "Категории"
  },
  kk: {
    backToStore: "← Дүкенге қайту",
    inStock: "БАР",
    priceReq: "Бағасы сұраныс бойынша",
    buyBtn: "Kaspi.kz-тен сатып алу",
    notAvail: "Қолжетімсіз",
    noDesc: "Сипаттама жоқ",
    specifications: "Құрылғының сипаттамалары",
    relatedProducts: "Ұқсас тауарлар",
    type: "Түрі",
    frequencyRange: "Жиілік диапазоны",
    sensitivity: "Сезімталдық",
    impedance: "Импеданс",
    connector: "Қосылу интерфейсі",
    pattern: "Бағытталу диаграммасы",
    home: "Басты бет",
    categories: "Санаттар"
  }
};

// Function to generate high-quality realistic specifications based on name
function getSpecsForProduct(name: string, locale: "ru" | "kk") {
  const isRu = locale === "ru";
  if (name.includes("Condenser") || name.includes("Studio") || name.includes("Classic")) {
    return [
      { key: translations[locale].type, value: isRu ? "Конденсаторный (студийный)" : "Конденсаторлық (студиялық)" },
      { key: translations[locale].frequencyRange, value: "20 Гц - 20 000 Гц" },
      { key: translations[locale].sensitivity, value: "-34 дБ ± 2 дБ" },
      { key: translations[locale].impedance, value: "150 Ом" },
      { key: translations[locale].connector, value: "XLR (3-pin)" },
      { key: translations[locale].pattern, value: isRu ? "Кардиоидная" : "Кардиоидты" },
    ];
  } else if (name.includes("Wireless") || name.includes("Lav") || name.includes("Duo")) {
    return [
      { key: translations[locale].type, value: isRu ? "Беспроводной цифровой" : "Сымсыз цифрлық" },
      { key: translations[locale].frequencyRange, value: "50 Гц - 15 000 Гц" },
      { key: translations[locale].sensitivity, value: "-42 дБ ± 3 дБ" },
      { key: translations[locale].impedance, value: "600 Ом" },
      { key: translations[locale].connector, value: isRu ? "Беспроводной приемник (USB/Jack)" : "Сымсыз қабылдағыш (USB/Jack)" },
      { key: translations[locale].pattern, value: isRu ? "Всенаправленная" : "Барлық бағытты" },
    ];
  } else if (name.includes("Vocal") || name.includes("Dynamic") || name.includes("Stage")) {
    return [
      { key: translations[locale].type, value: isRu ? "Динамический вокальный" : "Динамикалық вокалдық" },
      { key: translations[locale].frequencyRange, value: "40 Гц - 16 000 Гц" },
      { key: translations[locale].sensitivity, value: "-52 дБ ± 2 дБ" },
      { key: translations[locale].impedance, value: "300 Ом" },
      { key: translations[locale].connector, value: "XLR (3-pin)" },
      { key: translations[locale].pattern, value: isRu ? "Суперкардиоидная" : "Суперкардиоидты" },
    ];
  } else {
    return [
      { key: translations[locale].type, value: isRu ? "Студийный микрофон" : "Студиялық микрофон" },
      { key: translations[locale].frequencyRange, value: "30 Гц - 18 000 Гц" },
      { key: translations[locale].sensitivity, value: "-38 дБ ± 2 дБ" },
      { key: translations[locale].impedance, value: "200 Ом" },
      { key: translations[locale].connector, value: "XLR / USB-C" },
      { key: translations[locale].pattern, value: isRu ? "Кардиоидная" : "Кардиоидты" },
    ];
  }
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  // Get related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    take: 3
  });

  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = translations[locale];

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

  // Parse custom specifications if they exist in the DB, otherwise fall back to auto-generated specs
  const customSpecsText = locale === "kk" ? product.specsKk : product.specsRu;
  let specs = [];
  if (customSpecsText && customSpecsText.trim()) {
    specs = customSpecsText.split("\n").map(line => {
      const parts = line.split(":");
      const key = parts[0]?.trim() || "";
      const value = parts.slice(1).join(":")?.trim() || "";
      return { key, value };
    }).filter(item => item.key && item.value);
  } else {
    specs = getSpecsForProduct(product.name, locale);
  }

  return (
    <main style={{ padding: "40px 0 100px 0", animation: 'fadeIn 1s ease-in-out' }}>
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

      <div className="container">
        {/* Back Link */}
        <Link href="/" className="back-btn-link">
          {t.backToStore}
        </Link>

        {/* Product Details Section */}
        <div className="details-grid">
          {/* Left Side: Product Image inside a premium frame */}
          <div className="details-image-container">
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
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="details-img"
              />
            ) : (
              <div className="no-image-placeholder">
                NO IMAGE
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="details-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span className="badge-category">{product.category.name}</span>
              <span className="badge-stock">
                <span className="dot-glowing"></span>
                {t.inStock}
              </span>
            </div>

            <h1 className="details-title">
              <GlitchText speed={1.2}>{product.name}</GlitchText>
            </h1>

            <div className="details-price-box">
              <span className="price-label">{locale === "ru" ? "Стоимость" : "Құны"}:</span>
              <span className="details-price">
                {product.price ? `${product.price.toLocaleString()} KZT` : t.priceReq}
              </span>
            </div>

            <p className="details-desc">{displayDesc}</p>

            {product.kaspiLink ? (
              <a href={product.kaspiLink} target="_blank" rel="noopener noreferrer" className="btn-kaspi-large">
                {t.buyBtn}
              </a>
            ) : (
              <button className="btn-kaspi-large" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                {t.notAvail}
              </button>
            )}

            {/* Technical Specifications Grid */}
            <div className="specifications-box">
              <h3>{t.specifications}</h3>
              <div className="specs-list">
                {specs.map((spec, i) => (
                  <div key={i} className="spec-row">
                    <span className="spec-key">{spec.key}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '100px' }}>
            <h2 className="section-title">
              <GlitchText speed={1.5}>{t.relatedProducts}</GlitchText>
            </h2>
            <div className="product-grid" style={{ paddingBottom: '0' }}>
              {relatedProducts.map((relProd) => {
                let relDesc = relProd.description || t.noDesc;
                if (relProd.description && relProd.description.startsWith("{")) {
                  try {
                    const descObj = JSON.parse(relProd.description);
                    relDesc = descObj[locale] || descObj.ru || descObj.kk || relProd.description;
                  } catch (e) {}
                }
                return (
                  <div className="product-card" key={relProd.id}>
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
                          {t.inStock}
                        </div>
                        {relProd.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={relProd.imageUrl} 
                            alt={relProd.name} 
                            loading="lazy"
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', background: '#111' }}>
                            NO IMAGE
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{relProd.name}</h3>
                        <p className="product-desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '3.2em' }}>{relDesc}</p>
                        <span className="price-tag">
                          {relProd.price ? `${relProd.price.toLocaleString()} KZT` : t.priceReq}
                        </span>
                        <Link href={`/product/${relProd.id}`} className="btn-kaspi" style={{ textDecoration: 'none', display: 'block' }}>
                          {locale === "ru" ? "Подробнее" : "Толығырақ"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
