"use client";

import { loginAction } from "./actions";
import Dither from "@/components/Dither";
import GlitchText from "@/components/GlitchText";

export default function LoginPage() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const success = await loginAction(formData);
    
    if (success) {
      // Force a full page reload to the admin dashboard
      // This guarantees the browser has stored the cookie and will send it.
      window.location.href = "/admin";
    } else {
      alert("Неверный пароль / Құпия сөз қате");
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden', margin: 0 }}>
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

      <div className="admin-form" style={{ width: '100%', maxWidth: '420px', textAlign: 'center', background: 'rgba(20, 20, 20, 0.45)', padding: '45px', borderRadius: '24px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 5, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <h1 style={{ marginBottom: '15px', color: 'var(--accent-color)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
          <GlitchText speed={1.5}>Басқару / Вход</GlitchText>
        </h1>
        <p style={{ marginBottom: '35px', color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>Введите пароль администратора / Әкімші құпия сөзін енгізіңіз</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Пароль / Құпия сөз" 
            className="form-control" 
            required 
            style={{ textAlign: 'center', fontSize: '1.2rem', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 800 }}>Войти / Кіру</button>
        </form>
      </div>
    </div>
  );
}
