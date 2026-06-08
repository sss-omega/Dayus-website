import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import GlitchText from "@/components/GlitchText";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const translations = {
  ru: {
    title: "Товары",
    addNewProduct: "Добавить новый товар",
    category: "Категория",
    selectCategory: "Выберите категорию",
    productName: "Название товара",
    price: "Цена (₸)",
    uploadPhoto: "Загрузка фотографии",
    descRu: "Описание (на русском)",
    descKk: "Описание (на казахском)",
    specsRu: "Характеристики (на русском)",
    specsKk: "Характеристики (на казахском)",
    specsPlaceholder: "Формат: Название: Значение (каждое на новой строке)\nнапример:\nДиапазон частот: 20 Гц - 20 кГц\nИмпеданс: 150 Ом",
    kaspiLink: "Ссылка на Kaspi.kz",
    addProduct: "Добавить товар",
    existingProducts: "Существующие товары",
    noProducts: "Товаров пока нет.",
    edit: "Редактировать",
    changePhoto: "Заменить фотографию",
    leaveEmpty: "Оставьте пустым, чтобы сохранить текущее фото",
    saveChanges: "Сохранить изменения",
    deleteProduct: "Удалить товар",
    successCreated: "Товар успешно добавлен на сайт!",
    successUpdated: "Изменения успешно сохранены!",
    successDeleted: "Товар успешно удален!",
    noImage: "НЕТ ИЗОБРАЖЕНИЯ",
    priceOnReq: "Цена по запросу"
  },
  kk: {
    title: "Тауарлар",
    addNewProduct: "Жаңа тауар қосу",
    category: "Санат",
    selectCategory: "Санатты таңдаңыз",
    productName: "Тауар атауы",
    price: "Бағасы (₸)",
    uploadPhoto: "Суретті жүктеу",
    descRu: "Сипаттама (орысша)",
    descKk: "Сипаттама (қазақша)",
    specsRu: "Сипаттамалары (орысша)",
    specsKk: "Сипаттамалары (қазақша)",
    specsPlaceholder: "Форматы: Атауы: Мәні (әрқайсысы жаңа жолда)\nмысалы:\nЖиілік диапазоны: 20 Гц - 20 кГц\nИмпеданс: 150 Ом",
    kaspiLink: "Kaspi.kz сілтемесі",
    addProduct: "Тауарды қосу",
    existingProducts: "Қолданыстағы тауарлар",
    noProducts: "Тауарлар әлі жоқ.",
    edit: "Өңдеу",
    changePhoto: "Суретті ауыстыру",
    leaveEmpty: "Ағымдағы суретті сақтау үшін бос қалдырыңыз",
    saveChanges: "Өзгерістерді сақтау",
    deleteProduct: "Тауарды жою",
    successCreated: "Тауар сайтқа сәтті қосылды!",
    successUpdated: "Өзгерістер сәтті сақталды!",
    successDeleted: "Тауар сәтті жойылды!",
    noImage: "СУРЕТ ЖОҚ",
    priceOnReq: "Бағасы сұраныс бойынша"
  }
};

export default async function AdminProductsPage({ searchParams }: { searchParams?: { success?: string } }) {
  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = translations[locale];

  const [categories, products] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true }, orderBy: { id: "desc" } })
  ]);

  async function handleProduct(formData: FormData) {
    "use server";
    const action = formData.get("action");
    let redirectUrl = "/admin/products";

    if (action === "create") {
      const name = formData.get("name") as string;
      const descriptionRu = formData.get("descriptionRu") as string;
      const descriptionKk = formData.get("descriptionKk") as string;
      const priceStr = formData.get("price") as string;
      const imageFile = formData.get("imageFile") as File | null;
      const kaspiLink = formData.get("kaspiLink") as string;
      const categoryIdStr = formData.get("categoryId") as string;
      const specsRu = formData.get("specsRu") as string;
      const specsKk = formData.get("specsKk") as string;

      let imageUrl = "";
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        imageUrl = `data:${imageFile.type};base64,${base64}`;
      }

      // Merge descriptions into JSON string
      const descriptionObj = {
        ru: descriptionRu || "",
        kk: descriptionKk || ""
      };
      const descriptionJson = JSON.stringify(descriptionObj);

      if (name && categoryIdStr) {
        await prisma.product.create({
          data: {
            name,
            description: descriptionJson,
            price: priceStr ? parseFloat(priceStr) : null,
            imageUrl: imageUrl || null,
            kaspiLink: kaspiLink || null,
            categoryId: parseInt(categoryIdStr, 10),
            specsRu: specsRu || null,
            specsKk: specsKk || null,
          },
        });
        redirectUrl = "/admin/products?success=created";
      }
    } else if (action === "update") {
      const id = parseInt(formData.get("id") as string, 10);
      const name = formData.get("name") as string;
      const descriptionRu = formData.get("descriptionRu") as string;
      const descriptionKk = formData.get("descriptionKk") as string;
      const priceStr = formData.get("price") as string;
      const imageFile = formData.get("imageFile") as File | null;
      const kaspiLink = formData.get("kaspiLink") as string;
      const categoryIdStr = formData.get("categoryId") as string;
      const oldImageUrl = formData.get("oldImageUrl") as string;
      const specsRu = formData.get("specsRu") as string;
      const specsKk = formData.get("specsKk") as string;

      let imageUrl = oldImageUrl;
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        imageUrl = `data:${imageFile.type};base64,${base64}`;
      }

      // Merge descriptions into JSON string
      const descriptionObj = {
        ru: descriptionRu || "",
        kk: descriptionKk || ""
      };
      const descriptionJson = JSON.stringify(descriptionObj);

      if (id && name && categoryIdStr) {
        await prisma.product.update({
          where: { id },
          data: {
            name,
            description: descriptionJson,
            price: priceStr ? parseFloat(priceStr) : null,
            imageUrl: imageUrl || null,
            kaspiLink: kaspiLink || null,
            categoryId: parseInt(categoryIdStr, 10),
            specsRu: specsRu || null,
            specsKk: specsKk || null,
          },
        });
        redirectUrl = "/admin/products?success=updated";
      }
    } else if (action === "delete") {
      const id = parseInt(formData.get("id") as string, 10);
      await prisma.product.delete({ where: { id } });
      redirectUrl = "/admin/products?success=deleted";
    }
    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/product/[id]", "layout");
    redirect(redirectUrl);
  }

  return (
    <section id="products" style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '25px', color: '#fff', borderBottom: '1px solid rgba(255,204,0,0.15)', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <GlitchText speed={1.5}>{t.title}</GlitchText>
      </h2>

      {/* Success Notification */}
      {searchParams?.success && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: searchParams.success === 'deleted' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(0, 230, 115, 0.15)',
          border: searchParams.success === 'deleted' ? '1px solid #ff3366' : '1px solid #00e673',
          color: '#fff',
          fontWeight: '600',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>
            {searchParams.success === 'deleted' ? '🗑️' : '✅'}
          </span>
          <span>
            {searchParams.success === 'created' && t.successCreated}
            {searchParams.success === 'updated' && t.successUpdated}
            {searchParams.success === 'deleted' && t.successDeleted}
          </span>
        </div>
      )}
      
      {/* Create Product Form */}
      <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>{t.addNewProduct}</h3>
        {categories.length === 0 ? (
          <p style={{ color: "#ff3366", fontWeight: 600 }}>
            {locale === "kk" ? "Алдымен санат жасаңыз." : "Сначала создайте категорию."}
          </p>
        ) : (
          <form action={handleProduct} className="grid-form" encType="multipart/form-data">
            <input type="hidden" name="action" value="create" />
            <div className="form-group">
              <label>{t.category}</label>
              <select name="categoryId" className="form-control" required>
                <option value="">{t.selectCategory}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t.productName}</label>
              <input type="text" name="name" className="form-control" required placeholder={locale === "kk" ? "мысалы, Shure SM7B" : "например, Shure SM7B"} />
            </div>
            <div className="form-group">
              <label>{t.price}</label>
              <input type="number" name="price" className="form-control" placeholder={locale === "kk" ? "мысалы, 250000" : "например, 250000"} />
            </div>
            <div className="form-group">
              <label>{t.uploadPhoto}</label>
              <input type="file" name="imageFile" accept="image/*" className="form-control" required style={{ paddingTop: '8px' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.descRu}</label>
              <textarea name="descriptionRu" className="form-control" rows={3} required placeholder="Описание микрофона на русском языке..."></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.descKk}</label>
              <textarea name="descriptionKk" className="form-control" rows={3} required placeholder="Микрофонның қазақ тіліндегі сипаттамасы..."></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.specsRu}</label>
              <textarea name="specsRu" className="form-control" rows={4} placeholder={translations.ru.specsPlaceholder} style={{ resize: 'vertical' }}></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.specsKk}</label>
              <textarea name="specsKk" className="form-control" rows={4} placeholder={translations.kk.specsPlaceholder} style={{ resize: 'vertical' }}></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.kaspiLink}</label>
              <input type="url" name="kaspiLink" className="form-control" placeholder="https://kaspi.kz/shop/..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>{t.addProduct}</button>
            </div>
          </form>
        )}
      </div>

      {/* Existing Products List & Edit Forms */}
      <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)' }}>
        <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>{t.existingProducts}</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {products.length === 0 ? (
            <p style={{ color: "#666" }}>{t.noProducts}</p>
          ) : (
            products.map((p) => {
              // Parse bilingual description for display & edit prefill
              let displayDesc = p.description || "";
              let editDescRu = "";
              let editDescKk = "";
              if (p.description && p.description.startsWith("{")) {
                try {
                  const descObj = JSON.parse(p.description);
                  displayDesc = descObj.ru || descObj.kk || p.description;
                  editDescRu = descObj.ru || "";
                  editDescKk = descObj.kk || "";
                } catch (e) {
                  editDescRu = p.description || "";
                }
              } else {
                editDescRu = p.description || "";
              }

              return (
                <details 
                  key={p.id} 
                  style={{ 
                    background: 'rgba(0,0,0,0.4)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}
                  className="product-details-collapse"
                >
                  <summary 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '15px 20px', 
                      cursor: 'pointer', 
                      listStyle: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', background: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#666', fontWeight: 'bold' }}>
                          {t.noImage}
                        </div>
                      )}
                      <div>
                        <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>
                          {p.category.name} | {p.price ? `${p.price.toLocaleString()} KZT` : t.priceOnReq}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '3px', fontStyle: 'italic', WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {displayDesc}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        {t.edit}
                      </span>
                    </div>
                  </summary>

                  {/* Expanded Edit Form */}
                  <div style={{ padding: '25px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                    <form id={`edit-form-${p.id}`} action={handleProduct} className="grid-form" encType="multipart/form-data">
                      <input type="hidden" name="action" value="update" />
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="oldImageUrl" value={p.imageUrl || ""} />

                      <div className="form-group">
                        <label>{t.category}</label>
                        <select name="categoryId" className="form-control" defaultValue={p.categoryId} required>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>{t.productName}</label>
                        <input type="text" name="name" className="form-control" defaultValue={p.name} required />
                      </div>

                      <div className="form-group">
                        <label>{t.price}</label>
                        <input type="number" name="price" className="form-control" defaultValue={p.price || ""} />
                      </div>

                      <div className="form-group">
                        <label>{t.changePhoto}</label>
                        <input type="file" name="imageFile" accept="image/*" className="form-control" style={{ paddingTop: '8px' }} />
                        <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginTop: '5px' }}>{t.leaveEmpty}</span>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t.descRu}</label>
                        <textarea name="descriptionRu" className="form-control" rows={3} defaultValue={editDescRu} required></textarea>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t.descKk}</label>
                        <textarea name="descriptionKk" className="form-control" rows={3} defaultValue={editDescKk} required></textarea>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t.specsRu}</label>
                        <textarea name="specsRu" className="form-control" rows={4} defaultValue={p.specsRu || ""} placeholder={translations.ru.specsPlaceholder} style={{ resize: 'vertical' }}></textarea>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t.specsKk}</label>
                        <textarea name="specsKk" className="form-control" rows={4} defaultValue={p.specsKk || ""} placeholder={translations.kk.specsPlaceholder} style={{ resize: 'vertical' }}></textarea>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>{t.kaspiLink}</label>
                        <input type="url" name="kaspiLink" className="form-control" defaultValue={p.kaspiLink || ""} placeholder="https://kaspi.kz/shop/..." />
                      </div>
                    </form>

                    {/* Buttons Block aligned side-by-side using form association */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                      <button 
                        type="submit" 
                        form={`edit-form-${p.id}`} 
                        className="btn-primary" 
                        style={{ padding: '12px 24px', borderRadius: '10px' }}
                      >
                        {t.saveChanges}
                      </button>

                      <form action={handleProduct} style={{ margin: 0 }}>
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="id" value={p.id} />
                        <button 
                          type="submit" 
                          style={{ 
                            padding: '12px 24px', 
                            background: '#ff3366', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '10px', 
                            cursor: 'pointer', 
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s'
                          }}
                        >
                          {t.deleteProduct}
                        </button>
                      </form>
                    </div>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
