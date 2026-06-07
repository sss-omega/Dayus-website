import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { MetricsTracker } from "@/components/MetricsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAUYS | Премиум аудио және микрофондар",
  description: "Аудиофилдер мен кәсіби мамандарға арналған премиум микрофондар мен дыбыс жүйелері.",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <div className="particles-container">
          <div className="note note-1">♪</div>
          <div className="note note-2">♫</div>
          <div className="note note-3">♩</div>
          <div className="note note-4">♬</div>
          <div className="note note-5">♪</div>
          <div className="note note-6">♫</div>
        </div>
        {children}
        <CookieBanner />
        <MetricsTracker />
      </body>
    </html>
  );
}
