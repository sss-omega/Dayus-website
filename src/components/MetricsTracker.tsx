"use client";

import { useEffect } from "react";

export function MetricsTracker() {
  useEffect(() => {
    // A simple mock for tracking clicks/views to build recommendations
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.product-card')) {
        const titleElement = target.closest('.product-card')?.querySelector('.product-title');
        if (titleElement) {
          const product = titleElement.textContent;
          console.log(`[Metrics] User viewed product: ${product}`);
          // In a real app, this would be sent to the backend
          const views = JSON.parse(localStorage.getItem('product_views') || '[]');
          views.push({ product, time: new Date().toISOString() });
          localStorage.setItem('product_views', JSON.stringify(views));
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // Invisible tracker
}
