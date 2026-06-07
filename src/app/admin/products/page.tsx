import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import GlitchText from "@/components/GlitchText";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true } })
  ]);

  async function handleProduct(formData: FormData) {
    "use server";
    const action = formData.get("action");
    if (action === "create") {
      const name = formData.get("name") as string;
      const descriptionRu = formData.get("descriptionRu") as string;
      const descriptionKk = formData.get("descriptionKk") as string;
      const priceStr = formData.get("price") as string;
      const imageFile = formData.get("imageFile") as File | null;
      const kaspiLink = formData.get("kaspiLink") as string;
      const categoryIdStr = formData.get("categoryId") as string;

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
          },
        });
      }
    } else if (action === "delete") {
      const id = parseInt(formData.get("id") as string, 10);
      await prisma.product.delete({ where: { id } });
    }
    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/product/[id]", "layout");
  }

  return (
    <section id="products" style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '25px', color: '#fff', borderBottom: '1px solid rgba(255,204,0,0.15)', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <GlitchText speed={1.5}>Товары / Тауарлар</GlitchText>
      </h2>
      <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>Добавить новый товар / Жаңа тауар қосу</h3>
        {categories.length === 0 ? (
          <p style={{ color: "#ff3366", fontWeight: 600 }}>Сначала создайте категорию / Алдымен санат жасаңыз.</p>
        ) : (
          <form action={handleProduct} className="grid-form" encType="multipart/form-data">
            <input type="hidden" name="action" value="create" />
            <div className="form-group">
              <label>Категория / Санат</label>
              <select name="categoryId" className="form-control" required>
                <option value="">Выберите категорию / Санатты таңдаңыз</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Название товара / Тауар атауы</label>
              <input type="text" name="name" className="form-control" required placeholder="например, Shure SM7B" />
            </div>
            <div className="form-group">
              <label>Цена (₸) / Бағасы (₸)</label>
              <input type="number" name="price" className="form-control" placeholder="например, 250000" />
            </div>
            <div className="form-group">
              <label>Загрузка фотографии / Сурет жүктеу</label>
              <input type="file" name="imageFile" accept="image/*" className="form-control" required style={{ paddingTop: '8px' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Описание (на русском) / Сипаттама (орысша)</label>
              <textarea name="descriptionRu" className="form-control" rows={3} required placeholder="Описание микрофона на русском языке..."></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Описание (на казахском) / Сипаттама (қазақша)</label>
              <textarea name="descriptionKk" className="form-control" rows={3} required placeholder="Микрофонның қазақ тіліндегі сипаттамасы..."></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Ссылка на Kaspi.kz / Kaspi.kz сілтемесі</label>
              <input type="url" name="kaspiLink" className="form-control" placeholder="https://kaspi.kz/shop/..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>Добавить товар / Тауарды қосу</button>
            </div>
          </form>
        )}
      </div>

      <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)' }}>
        <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>Существующие товары / Қолданыстағы тауарлар</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {products.length === 0 ? (
            <p style={{ color: "#666" }}>Товаров пока нет / Тауарлар әлі жоқ.</p>
          ) : (
            products.map((p) => {
              let displayDesc = p.description || "";
              if (p.description && p.description.startsWith("{")) {
                try {
                  const descObj = JSON.parse(p.description);
                  displayDesc = descObj.ru || descObj.kk || p.description;
                } catch (e) {}
              }
              return (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '1.2rem' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>{p.category.name} | {p.price ? `${p.price.toLocaleString()} KZT` : "Цена по запросу"}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px', fontStyle: 'italic', WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{displayDesc}</div>
                  </div>
                  <form action={handleProduct}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" style={{ padding: '8px 20px', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Удалить / Жою</button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
