import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } })
  ]);

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
    revalidatePath("/admin");
  }

  async function handleProduct(formData: FormData) {
    "use server";
    const action = formData.get("action");
    if (action === "create") {
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const priceStr = formData.get("price") as string;
      const imageUrl = formData.get("imageUrl") as string;
      const kaspiLink = formData.get("kaspiLink") as string;
      const categoryIdStr = formData.get("categoryId") as string;

      if (name && categoryIdStr) {
        await prisma.product.create({
          data: {
            name,
            description: description || null,
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
    revalidatePath("/admin");
  }

  async function saveSettings(formData: FormData) {
    "use server";
    const headerTitle = formData.get("headerTitle") as string;
    const footerText = formData.get("footerText") as string;
    const heroTitle = formData.get("heroTitle") as string;
    const heroDesc = formData.get("heroDesc") as string;

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { headerTitle, footerText, heroTitle, heroDesc },
      create: { id: 1, headerTitle, footerText, heroTitle, heroDesc }
    });
    revalidatePath("/");
    revalidatePath("/admin");
  }

  return (
    <div className="container admin-container">
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem", color: "var(--accent-color)" }}>Admin Dashboard</h1>

      {/* Site Settings */}
      <div className="admin-form" style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>Site Settings (Header/Footer)</h2>
        <form action={saveSettings} className="grid-form">
          <div className="form-group">
            <label>Header Title / Logo Text</label>
            <input type="text" name="headerTitle" defaultValue={settings?.headerTitle || "DAUYS"} className="form-control" />
          </div>
          <div className="form-group">
            <label>Footer Copyright Text</label>
            <input type="text" name="footerText" defaultValue={settings?.footerText || "© 2026 DAUYS. All rights reserved."} className="form-control" />
          </div>
          <div className="form-group">
            <label>Hero Title (Main Page)</label>
            <input type="text" name="heroTitle" defaultValue={settings?.heroTitle || "Experience True Sound"} className="form-control" />
          </div>
          <div className="form-group">
            <label>Hero Subtitle</label>
            <textarea name="heroDesc" defaultValue={settings?.heroDesc || "Premium audio speakers designed for audiophiles."} className="form-control" rows={2}></textarea>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn-primary">Save Settings</button>
          </div>
        </form>
      </div>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Categories */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="admin-form">
            <h2 style={{ marginBottom: "20px", color: "#fff" }}>Create Category</h2>
            <form action={handleCategory}>
              <input type="hidden" name="action" value="create" />
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" name="name" className="form-control" required placeholder="e.g. Floorstanding Speakers" />
              </div>
              <button type="submit" className="btn-primary">Add Category</button>
            </form>
          </div>

          <div className="admin-form">
            <h2 style={{ marginBottom: "20px", color: "#fff" }}>Existing Categories</h2>
            {categories.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#111', marginBottom: '10px', borderRadius: '8px' }}>
                <span>{c.name}</span>
                <form action={handleCategory}>
                  <input type="hidden" name="action" value="delete" />
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" style={{ background: 'transparent', color: '#ff3366', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>DELETE</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <div className="admin-form">
            <h2 style={{ marginBottom: "20px", color: "#fff" }}>Create Product</h2>
            {categories.length === 0 ? (
              <p style={{ color: "#ff3366" }}>Please create a category first.</p>
            ) : (
              <form action={handleProduct}>
                <input type="hidden" name="action" value="create" />
                <div className="grid-form">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="categoryId" className="form-control" required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" name="name" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Price (KZT)</label>
                    <input type="number" name="price" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" name="imageUrl" className="form-control" placeholder="https://..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Description</label>
                    <textarea name="description" className="form-control" rows={3}></textarea>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Kaspi.kz Link</label>
                    <input type="url" name="kaspiLink" className="form-control" placeholder="https://kaspi.kz/shop/..." />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Product</button>
              </form>
            )}
          </div>

          <div className="admin-form">
            <h2 style={{ marginBottom: "20px", color: "#fff" }}>Existing Products</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#111', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>{p.category.name} | {p.price} KZT</div>
                  </div>
                  <form action={handleProduct}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" style={{ padding: '8px 16px', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
