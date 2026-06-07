import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CookieBanner } from "@/components/CookieBanner";
import { MetricsTracker } from "@/components/MetricsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Audio Store",
  description: "High-end speakers and audio equipment.",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const headerTitle = settings?.headerTitle || "DAUYS";
  const footerText = settings?.footerText || "© 2026 DAUYS. All rights reserved.";

  const localeCookie = cookies().get("NEXT_LOCALE")?.value || "ru";

  return (
    <html lang={localeCookie}>
      <body className={inter.className}>
        <div className="particles-container">
          <div className="note note-1">♪</div>
          <div className="note note-2">♫</div>
          <div className="note note-3">♩</div>
          <div className="note note-4">♬</div>
          <div className="note note-5">♪</div>
          <div className="note note-6">♫</div>
        </div>
        <div className="container">
          <header>
            <div className="logo">{headerTitle}</div>
            <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <a href="/" style={{ fontWeight: 600, color: '#ffcc00' }}>Store</a>
              <LanguageSwitcher currentLang={localeCookie} />
            </nav>
          </header>
        </div>
        {children}
        <footer style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '50px', color: '#666' }}>
          <p>{footerText}</p>
        </footer>
        <CookieBanner />
        <MetricsTracker />
      </body>
    </html>
  );
}
