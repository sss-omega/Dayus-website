import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const dynamic = 'force-dynamic';

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const headerTitle = settings?.headerTitle || "DAUYS";
  
  const localeCookie = cookies().get("NEXT_LOCALE")?.value || "ru";
  
  const defaultFooter = localeCookie === "kk" 
    ? "© 2026 DAUYS. Барлық құқықтар қорғалған." 
    : "© 2026 DAUYS. Все права защищены.";
  const footerText = settings?.footerText || defaultFooter;
  const storeLinkText = localeCookie === "kk" ? "Дүкен" : "Магазин";

  return (
    <>
      <div className="container">
        <header>
          <div className="logo">{headerTitle}</div>
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="/" style={{ fontWeight: 600, color: '#ffcc00' }}>{storeLinkText}</a>
            <LanguageSwitcher currentLang={localeCookie} />
          </nav>
        </header>
      </div>
      {children}
      <footer style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '50px', color: '#666' }}>
        <p>{footerText}</p>
      </footer>
    </>
  );
}
