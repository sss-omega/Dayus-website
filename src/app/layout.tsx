import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import prisma from "@/lib/prisma";

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

  return (
    <html lang="en">
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
            <nav style={{ display: 'flex', gap: '20px' }}>
              <a href="/" style={{ fontWeight: 600, color: '#ffcc00' }}>Store</a>
            </nav>
          </header>
        </div>
        {children}
        <footer style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '50px', color: '#666' }}>
          <p>{footerText}</p>
        </footer>
      </body>
    </html>
  );
}
