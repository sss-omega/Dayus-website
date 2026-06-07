import prisma from "@/lib/prisma";
import { Category, Product } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: true,
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } })
  ]);

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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffcc00', textTransform: 'uppercase' }}>Demo Collection</h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>This is how your site will look once you add products in the admin panel.</p>
          </div>
          
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image">
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                  Demo
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo1.png" alt="Demo Speaker 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="product-info">
                <h3 className="product-title">Aetherion X-1</h3>
                <p className="product-desc">High-end floorstanding speaker with pure titanium tweeters and deep bass resonance. Perfect for large living rooms.</p>
                <span className="price-tag">450,000 KZT</span>
                <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  Demo Mode
                </button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, zIndex: 10, textTransform: 'uppercase' }}>
                  Demo
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo2.png" alt="Demo Speaker 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="product-info">
                <h3 className="product-title">Aetherion Bookshelf</h3>
                <p className="product-desc">Compact wireless bookshelf speaker. Brings audiophile quality to your desktop with stunning aesthetics.</p>
                <span className="price-tag">210,000 KZT</span>
                <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  Demo Mode
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
                          В наличии
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
                        <p className="product-desc">{product.description || 'No description available.'}</p>
                        <span className="price-tag">
                          {product.price ? `${product.price.toLocaleString()} KZT` : 'Price on request'}
                        </span>
                        {product.kaspiLink ? (
                          <a href={product.kaspiLink} target="_blank" rel="noopener noreferrer" className="btn-kaspi">
                            Buy on Kaspi.kz
                          </a>
                        ) : (
                          <button className="btn-kaspi" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                            Not Available Online
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
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>Premium Quality</h3>
            <p style={{ color: '#aaa' }}>Only the highest grade materials and finest acoustic engineering.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>Fast Delivery</h3>
            <p style={{ color: '#aaa' }}>Order via Kaspi.kz and get your speakers delivered straight to your door.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '15px' }}>Warranty Included</h3>
            <p style={{ color: '#aaa' }}>12 months official warranty on all our sound systems.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
