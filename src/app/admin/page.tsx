import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import GlitchText from "@/components/GlitchText";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

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
    <section id="settings" style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '25px', color: '#fff', borderBottom: '1px solid rgba(255,204,0,0.15)', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <GlitchText speed={1.5}>Настройки / Баптаулар</GlitchText>
      </h2>
      <div className="admin-form" style={{ background: 'rgba(20, 20, 20, 0.45)', border: '1px solid var(--border-color)', backdropFilter: 'blur(15px)' }}>
        <form action={saveSettings} className="grid-form">
          <div className="form-group">
            <label>Название сайта (Логотип) / Сайт атауы (Логотип)</label>
            <input type="text" name="headerTitle" defaultValue={settings?.headerTitle || "DAUYS"} className="form-control" />
          </div>
          <div className="form-group">
            <label>Текст копирайта (Подвал) / Авторлық құқық мәтіні (Төменгі колонтитул)</label>
            <input type="text" name="footerText" defaultValue={settings?.footerText || "© 2026 DAUYS. Все права защищены."} className="form-control" />
          </div>
          <div className="form-group">
            <label>Главный заголовок сайта / Сайттың басты тақырыбы</label>
            <input type="text" name="heroTitle" defaultValue={settings?.heroTitle || "Мир Истинного Звука"} className="form-control" />
          </div>
          <div className="form-group">
            <label>Подзаголовок сайта / Сайттың ішкі тақырыбы</label>
            <textarea name="heroDesc" defaultValue={settings?.heroDesc || "Премиальные микрофоны и акустические системы."} className="form-control" rows={2}></textarea>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary" style={{ borderRadius: '10px', padding: '12px 24px' }}>Сохранить настройки / Баптауларды сақтау</button>
          </div>
        </form>
      </div>
    </section>
  );
}
