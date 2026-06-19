"use client";

import React, { useState, useEffect } from "react";
import DarkVeil from "@/components/DarkVeil";

interface Category {
  id: number;
  name: string;
}

interface ProductFormWithPreviewProps {
  categories: Category[];
  actionUrl: any; // Next.js Server Action
  t: {
    category: string;
    selectCategory: string;
    productName: string;
    price: string;
    uploadPhoto: string;
    descRu: string;
    descKk: string;
    specsRu: string;
    specsKk: string;
    specsPlaceholder: string;
    kaspiLink: string;
    addProduct: string;
    noImage: string;
  };
  locale: "ru" | "kk";
}

export default function ProductFormWithPreview({
  categories,
  actionUrl,
  t,
  locale
}: ProductFormWithPreviewProps) {
  // State for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [descriptionKk, setDescriptionKk] = useState("");
  const [specsRu, setSpecsRu] = useState("");
  const [specsKk, setSpecsKk] = useState("");
  const [kaspiLink, setKaspiLink] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Preview options state
  const [previewTab, setPreviewTab] = useState<"card" | "details">("card");
  const [previewLang, setPreviewLang] = useState<"ru" | "kk">(locale);

  // Handle file preview conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
    }
  };

  // Parse specifications text
  const getParsedSpecs = () => {
    const specsText = previewLang === "ru" ? specsRu : specsKk;
    if (!specsText.trim()) return [];
    return specsText
      .split("\n")
      .map((line) => {
        const parts = line.split(":");
        const key = parts[0]?.trim() || "";
        const value = parts.slice(1).join(":")?.trim() || "";
        return { key, value };
      })
      .filter((item) => item.key && item.value);
  };

  const previewDesc = previewLang === "ru" ? descriptionRu : descriptionKk;
  const parsedSpecs = getParsedSpecs();

  return (
    <div className="admin-form-container" style={{
      display: "grid",
      gridTemplateColumns: "1fr 400px",
      gap: "30px",
      alignItems: "start"
    }}>
      {/* Form Section */}
      <div className="admin-form" style={{
        background: "rgba(20, 20, 20, 0.45)",
        border: "1px solid var(--border-color)",
        backdropFilter: "blur(15px)",
        padding: "30px",
        borderRadius: "16px",
        margin: 0
      }}>
        <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>{t.addProduct}</h3>
        <form action={actionUrl} className="grid-form" encType="multipart/form-data">
          <input type="hidden" name="action" value="create" />
          
          <div className="form-group">
            <label>{t.category}</label>
            <select
              name="categoryId"
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">{t.selectCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t.productName}</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={locale === "kk" ? "мысалы, Shure SM7B" : "например, Shure SM7B"}
            />
          </div>

          <div className="form-group">
            <label>{t.price}</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={locale === "kk" ? "мысалы, 250000" : "например, 250000"}
            />
          </div>

          <div className="form-group">
            <label>{t.uploadPhoto}</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              className="form-control"
              required
              onChange={handleImageChange}
              style={{ paddingTop: "8px" }}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>{t.descRu}</label>
            <textarea
              name="descriptionRu"
              className="form-control"
              rows={3}
              value={descriptionRu}
              onChange={(e) => setDescriptionRu(e.target.value)}
              required
              placeholder="Описание микрофона на русском языке..."
            ></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>{t.descKk}</label>
            <textarea
              name="descriptionKk"
              className="form-control"
              rows={3}
              value={descriptionKk}
              onChange={(e) => setDescriptionKk(e.target.value)}
              required
              placeholder="Микрофонның қазақ тіліндегі сипаттамасы..."
            ></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>{t.specsRu}</label>
            <textarea
              name="specsRu"
              className="form-control"
              rows={4}
              value={specsRu}
              onChange={(e) => setSpecsRu(e.target.value)}
              placeholder={t.specsPlaceholder}
              style={{ resize: "vertical" }}
            ></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>{t.specsKk}</label>
            <textarea
              name="specsKk"
              className="form-control"
              rows={4}
              value={specsKk}
              onChange={(e) => setSpecsKk(e.target.value)}
              placeholder={t.specsPlaceholder}
              style={{ resize: "vertical" }}
            ></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>{t.kaspiLink}</label>
            <input
              type="url"
              name="kaspiLink"
              className="form-control"
              value={kaspiLink}
              onChange={(e) => setKaspiLink(e.target.value)}
              placeholder="https://kaspi.kz/shop/..."
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-primary" style={{ padding: "12px 24px", borderRadius: "10px" }}>
              {t.addProduct}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div style={{
        position: "sticky",
        top: "100px",
        background: "rgba(25, 25, 25, 0.65)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "20px",
        backdropFilter: "blur(15px)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--accent-color)", letterSpacing: "1px" }}>
            ⚡ LIVE PREVIEW
          </span>
          {/* Language Switcher for Preview */}
          <div style={{ display: "flex", gap: "5px", background: "rgba(0,0,0,0.3)", padding: "3px", borderRadius: "8px" }}>
            <button
              onClick={() => setPreviewLang("ru")}
              style={{
                border: "none",
                background: previewLang === "ru" ? "var(--accent-color)" : "transparent",
                color: previewLang === "ru" ? "#000" : "#fff",
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >RU</button>
            <button
              onClick={() => setPreviewLang("kk")}
              style={{
                border: "none",
                background: previewLang === "kk" ? "var(--accent-color)" : "transparent",
                color: previewLang === "kk" ? "#000" : "#fff",
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >KK</button>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>
          <button
            onClick={() => setPreviewTab("card")}
            style={{
              flex: 1,
              padding: "8px",
              background: previewTab === "card" ? "rgba(255,204,0,0.15)" : "transparent",
              border: previewTab === "card" ? "1px solid var(--accent-color)" : "1px solid transparent",
              color: previewTab === "card" ? "var(--accent-color)" : "#888",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "bold",
              transition: "all 0.2s"
            }}
          >
            Карточка (Сетка)
          </button>
          <button
            onClick={() => setPreviewTab("details")}
            style={{
              flex: 1,
              padding: "8px",
              background: previewTab === "details" ? "rgba(255,204,0,0.15)" : "transparent",
              border: previewTab === "details" ? "1px solid var(--accent-color)" : "1px solid transparent",
              color: previewTab === "details" ? "var(--accent-color)" : "#888",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "bold",
              transition: "all 0.2s"
            }}
          >
            Детали (Страница)
          </button>
        </div>

        {/* Preview Container */}
        <div>
          {previewTab === "card" ? (
            /* Catalog Card View */
            <div className="product-card" style={{ maxWidth: "100%", cursor: "default" }}>
              <div className="product-card-inner">
                <div className="darkveil-container">
                  <DarkVeil />
                </div>
                <div className="product-image">
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(0, 230, 115, 0.9)",
                    color: "#000",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    zIndex: 10
                  }}>
                    {previewLang === "ru" ? "В НАЛИЧИИ" : "БАР"}
                  </div>
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", background: "#111", fontSize: "0.8rem" }}>
                      {t.noImage}
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-title" style={{ fontSize: "1.2rem", minHeight: "1.4em" }}>
                    {name || (previewLang === "ru" ? "Название товара" : "Тауар атауы")}
                  </h3>
                  <p className="product-desc" style={{
                    WebkitLineClamp: 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "3.2em",
                    fontSize: "0.85rem",
                    color: "#aaa"
                  }}>
                    {previewDesc || (previewLang === "ru" ? "Описание на русском..." : "Қазақша сипаттамасы...")}
                  </p>
                  <span className="price-tag">
                    {price ? `${parseFloat(price).toLocaleString()} KZT` : (previewLang === "ru" ? "Цена по запросу" : "Бағасы сұраныс бойынша")}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                    <button className="btn-kaspi" style={{ width: "100%", opacity: 0.8 }} disabled>
                      {previewLang === "ru" ? "Подробнее" : "Толығырақ"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Product Details Page View */
            <div style={{
              background: "#0d0c0c",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "15px",
              color: "#fff"
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#050505",
                marginBottom: "15px"
              }}>
                <div className="darkveil-container">
                  <DarkVeil />
                </div>
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", fontSize: "0.8rem" }}>
                    {t.noImage}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <span style={{
                  background: "rgba(255,204,0,0.1)",
                  color: "var(--accent-color)",
                  border: "1px solid rgba(255,204,0,0.2)",
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold"
                }}>
                  PREVIEW CATEGORY
                </span>
                <span style={{
                  background: "rgba(0, 230, 115, 0.15)",
                  color: "#00e673",
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold"
                }}>
                  {previewLang === "ru" ? "В НАЛИЧИИ" : "БАР"}
                </span>
              </div>

              <h4 style={{
                fontSize: "1.3rem",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "10px",
                fontFamily: "var(--font-outfit, inherit)"
              }}>
                {name || (previewLang === "ru" ? "Название товара" : "Тауар атауы")}
              </h4>

              <div style={{
                fontSize: "1.2rem",
                color: "var(--accent-color)",
                fontWeight: 800,
                marginBottom: "12px"
              }}>
                {price ? `${parseFloat(price).toLocaleString()} KZT` : (previewLang === "ru" ? "Цена по запросу" : "Бағасы сұраныс бойынша")}
              </div>

              <p style={{
                fontSize: "0.85rem",
                color: "#aaa",
                lineHeight: "1.4",
                marginBottom: "15px",
                maxHeight: "100px",
                overflowY: "auto",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "10px"
              }}>
                {previewDesc || (previewLang === "ru" ? "Описание на русском..." : "Қазақша сипаттамасы...")}
              </p>

              <div>
                <h5 style={{ fontSize: "0.8rem", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {previewLang === "ru" ? "Характеристики:" : "Сипаттамалары:"}
                </h5>
                {parsedSpecs.length > 0 ? (
                  <div style={{ display: "grid", gap: "6px" }}>
                    {parsedSpecs.map((spec, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "4px" }}>
                        <span style={{ color: "#aaa" }}>{spec.key}</span>
                        <span style={{ color: "#fff", fontWeight: "bold" }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "#555", fontStyle: "italic" }}>
                    {previewLang === "ru" ? "Характеристики не указаны" : "Сипаттамалары көрсетілмеген"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
