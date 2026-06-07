import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = cookies().get("admin_session");
  if (!session || session.value !== "authenticated") {
    redirect("/login");
  }

  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } })
  ]);

  async function handleLogout() {
    "use server";
    cookies().delete("admin_session");
    redirect("/login");
  }

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', margin: '-50px -20px 0 -20px' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#111', padding: '30px', borderRight: '1px solid #222', position: 'sticky', top: 0, height: '100vh' }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '40px', fontSize: '1.5rem' }}>DASHBOARD</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="#settings" style={{ color: '#ccc', fontWeight: 600 }}>⚙️ Site Settings</a>
          <a href="#categories" style={{ color: '#ccc', fontWeight: 600 }}>📁 Categories</a>
          <a href="#products" style={{ color: '#ccc', fontWeight: 600 }}>📦 Products</a>
        </nav>
        <form action={handleLogout} style={{ position: 'absolute', bottom: '30px', width: 'calc(100% - 60px)' }}>
          <button type="submit" style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #ff3366', color: '#ff3366', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        
        {/* Settings Section */}
        <section id="settings" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Site Settings</h2>
          <div className="admin-form" style={{ background: '#111', border: '1px solid #222' }}>
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
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-primary">Save Settings</button>
              </div>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Categories Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div className="admin-form" style={{ background: '#111', border: '1px solid #222', margin: 0 }}>
              <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Add New Category</h3>
              <form action={handleCategory}>
                <input type="hidden" name="action" value="create" />
                <div className="form-group">
                  <label>Category Name</label>
                  <input type="text" name="name" className="form-control" required placeholder="e.g. Floorstanding Speakers" />
                </div>
                <button type="submit" className="btn-primary">Add Category</button>
              </form>
            </div>

            <div className="admin-form" style={{ background: '#111', border: '1px solid #222', margin: 0 }}>
              <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Existing Categories</h3>
              {categories.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: '#000', marginBottom: '10px', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                  <form action={handleCategory}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" style={{ background: 'transparent', color: '#ff3366', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Products Management</h2>
          <div className="admin-form" style={{ background: '#111', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Add New Product</h3>
            {categories.length === 0 ? (
              <p style={{ color: "#ff3366" }}>Please create a category first.</p>
            ) : (
              <form action={handleProduct} className="grid-form">
                <input type="hidden" name="action" value="create" />
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
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea name="description" className="form-control" rows={3}></textarea>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Kaspi.kz Link</label>
                  <input type="url" name="kaspiLink" className="form-control" placeholder="https://kaspi.kz/shop/..." />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn-primary">Add Product</button>
                </div>
              </form>
            )}
          </div>

          <div className="admin-form" style={{ background: '#111', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Existing Products</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#000', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '1.2rem' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>{p.category.name} | {p.price} KZT</div>
                  </div>
                  <form action={handleProduct}>
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" style={{ padding: '8px 20px', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
