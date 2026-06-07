import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import GlitchText from "@/components/GlitchText";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
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
        <GlitchText speed={1.5}>Категории / Санаттар</GlitchText>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', margin: 0 }}>
          <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>Добавить новую категорию / Жаңа санат қосу</h3>
          <form action={handleCategory}>
            <input type="hidden" name="action" value="create" />
            <div className="form-group">
              <label>Название категории / Санат атауы</label>
              <input type="text" name="name" className="form-control" required placeholder="например, Микрофоны" />
            </div>
            <button type="submit" className="btn-primary" style={{ borderRadius: '10px' }}>Добавить категорию / Санатты қосу</button>
          </form>
        </div>

        <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)', margin: 0 }}>
          <h3 style={{ marginBottom: "20px", color: "#fff", fontWeight: 700 }}>Существующие категории / Қолданыстағы санаттар</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.length === 0 ? (
              <p style={{ color: "#666" }}>Категорий пока нет / Санаттар әлі жоқ.</p>
            ) : (
              categories.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{c.name}</span>
                  <form action={handleCategory}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" style={{ background: 'transparent', color: '#ff3366', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>Удалить / Жою</button>
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
