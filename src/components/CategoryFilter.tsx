"use client";

import React, { useState, useTransition, useEffect, useRef } from 'react';
import Link from 'next/link';
import GlitchText from './GlitchText';
import { Category, Product } from '@prisma/client';

interface CategoryFilterProps {
  categories: (Category & { products: Product[] })[];
  locale: 'ru' | 'kk';
  t: any;
}

// Hook for scroll-triggered animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function ProductCard({ product, locale, t, index }: { product: Product; locale: string; t: any; index: number }) {
  const { ref, visible } = useScrollReveal();
  const [hovered, setHovered] = useState(false);

  // Parse bilingual description
  let displayDesc = product.description || t.noDesc;
  if (product.description && product.description.startsWith('{')) {
    try {
      const descObj = JSON.parse(product.description);
      displayDesc = descObj[locale] || descObj.ru || descObj.kk || product.description;
    } catch (e) {}
  }

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : `translateY(60px) scale(0.97)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
      }}
    >
      <Link
        href={`/product/${product.id}`}
        className="hcard-link"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`hcard ${hovered ? 'hcard-hovered' : ''}`}>
          {/* Animated rotating border */}
          <div className="hcard-border-glow" />

          <div className="hcard-inner">
            {/* Image side */}
            <div className="hcard-image-wrap">
              <div
                className="hcard-img-badge"
                style={{ background: 'rgba(0,230,115,0.92)' }}
              >
                {t.inStock}
              </div>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="hcard-img"
                  loading="lazy"
                />
              ) : (
                <div className="hcard-no-img">{t.noImage}</div>
              )}
              {/* Overlay shimmer */}
              <div className="hcard-img-shimmer" />
            </div>

            {/* Info side */}
            <div className="hcard-info">
              {/* Number badge */}
              <span className="hcard-num">0{index + 1}</span>

              <h3 className="hcard-title">{product.name}</h3>

              <p className="hcard-desc">{displayDesc}</p>

              <div className="hcard-bottom">
                <span className="hcard-price">
                  {product.price
                    ? `${product.price.toLocaleString()} KZT`
                    : t.priceReq}
                </span>
                <div className="hcard-btn">
                  <span>{t.detailsBtn}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              {/* Decorative line */}
              <div className="hcard-line" style={{ width: hovered ? '100%' : '40%' }} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CategoryFilter({ categories, locale, t }: CategoryFilterProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getFilteredProducts = () => {
    if (activeTab === 'all') {
      return categories.reduce<Product[]>((acc, cat) => [...acc, ...cat.products], []);
    }
    const selectedCategory = categories.find(cat => cat.id.toString() === activeTab);
    return selectedCategory ? selectedCategory.products : [];
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const allLabel = locale === 'kk' ? 'Барлық бөлімдер' : 'Все разделы';
  const allProductsTitle = locale === 'kk' ? 'Барлық тауарлар' : 'Каталог';
  const categoryTitle = activeTab === 'all'
    ? allProductsTitle
    : (categories.find(cat => cat.id.toString() === activeTab)?.name || '');

  const handleTabChange = (tabId: string) => {
    startTransition(() => setActiveTab(tabId));
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page);
      const element = document.getElementById('catalog-section');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div id="catalog-section" style={{ width: '100%', scrollMarginTop: '80px' }}>
      {/* Category Tabs */}
      <div className="category-tabs-container">
        <button
          className={`category-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          {allLabel}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${activeTab === category.id.toString() ? 'active' : ''}`}
            onClick={() => handleTabChange(category.id.toString())}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Title */}
      <h2 className="category-section-title" style={{ animation: 'fadeIn 0.5s ease' }}>
        <GlitchText speed={1.5}>{categoryTitle}</GlitchText>
      </h2>

      {/* Cards Stack */}
      <div
        style={{
          opacity: isPending ? 0.5 : 1,
          transition: 'opacity 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          paddingBottom: '60px',
        }}
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              t={t}
              index={i}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '60px 0', fontSize: '1.2rem' }}>
            {t.noDesc}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
