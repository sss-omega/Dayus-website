import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import GlitchText from "@/components/GlitchText";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const translations = {
  ru: {
    title: "Категории",
    addNewCategory: "Добавить новую категорию",
    categoryName: "Название категории",
    categoryPlaceholder: "например, Микрофоны",
    addCategory: "Добавить категорию",
    existingCategories: "Существующие категории",
    noCategories: "Категорий пока нет.",
    delete: "Удалить"
  },
  kk: {
    title: "Санаттар",
    addNewCategory: "Жаңа санат қосу",
    categoryName: "Санат атауы",
    categoryPlaceholder: "мысалы, Микрофондар",
    addCategory: "Санатты қосу",
    existingCategories: "Қолданыстағы санаттар",
    noCategories: "Санаттар әлі жоқ.",
    delete: "Жою"
  }
};

export default async function AdminCategoriesPage() {
  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = translations[locale];

  const categories = await prisma.category.findMany();

  async function handleCategory(formData: FormData) {
    "use server";
    const action = formData.get("action");
    if (action === "create") {
      const name = formData.get("name") as string;
      if (name) await prisma.category.create({ data: { name } });
    } else if (action === "delete") {
      const id = parseInt(formData.get("id") as string, 10);
      await prisma.product.deleteMany({ where: { categoryId: id } }); // delete related products first
      await prisma.category.delete({ where: { id } });
    }
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  }

  return (
    <section id="categories" style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '25px', color: '#fff', borderBottom: '1px solid rgba(255,204,0,0.15)', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <GlitchText speed={1.5}>{t.title}</GlitchText>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', margin: 0 }}>
          <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>{t.addNewCategory}</h3>
          <form action={handleCategory}>
            <input type="hidden" name="action" value="create" />
            <div className="form-group">
              <label>{t.categoryName}</label>
              <input type="text" name="name" className="form-control" required placeholder={t.categoryPlaceholder} />
            </div>
            <button type="submit" className="btn-primary" style={{ borderRadius: '10px' }}>{t.addCategory}</button>
          </form>
        </div>

        <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', margin: 0 }}>
          <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>{t.existingCategories}</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.length === 0 ? (
              <p style={{ color: "#666" }}>{t.noCategories}</p>
            ) : (
              categories.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{c.name}</span>
                  <form action={handleCategory}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" style={{ background: 'transparent', color: '#ff3366', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>{t.delete}</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
