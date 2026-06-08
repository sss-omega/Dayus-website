import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dither from "@/components/Dither";
import GlitchText from "@/components/GlitchText";
import AdminNav from "@/components/AdminNav";
import { logoutAction } from "@/app/login/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("admin_session");
  if (!session || session.value !== "authenticated") {
    redirect("/login");
  }

  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', margin: 0, position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Dither */}
      <div className="dither-bg-container">
        <Dither
          waveColor={[0.95, 0.75, 0.1]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'rgba(10, 10, 10, 0.85)', padding: '30px', borderRight: '1px solid var(--border-color)', position: 'sticky', top: 0, height: '100vh', backdropFilter: 'blur(25px)', zIndex: 10 }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 15px rgba(255, 204, 0, 0.3)' }}>
          <GlitchText speed={1.2}>
            {locale === "kk" ? "Басқару панелі" : "Панель управления"}
          </GlitchText>
        </h2>

        <div style={{ marginBottom: '35px' }}>
          <LanguageSwitcher currentLang={locale} />
        </div>
        
        <AdminNav />

        <form action={logoutAction} style={{ position: 'absolute', bottom: '30px', width: 'calc(100% - 60px)' }}>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #ff3366', color: '#ff3366', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s' }} className="btn-logout-hover">
            {locale === "kk" ? "Шығу" : "Выйти"}
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
        {children}
      </main>
    </div>
  );
}
