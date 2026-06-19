import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import AiChatBubble from "@/components/AiChatBubble";

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
      <div className="sticky-header-wrapper">
        <div className="container">
          <header className="main-header">
            <div className="logo header-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dauys_logo_transparent_cropped.png" alt="DAUYS" className="header-logo-img" />
              <span className="header-logo-text">{headerTitle}</span>
            </div>
            <nav className="header-nav">
              <a href="/" className="header-store-link">{storeLinkText}</a>
              <LanguageSwitcher currentLang={localeCookie} />
            </nav>
          </header>
        </div>
      </div>
      <div className="main-content-wrapper">
        {children}
      </div>
      <AiChatBubble locale={localeCookie as "ru" | "kk"} />
    </>
  );
}
