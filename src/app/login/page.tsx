"use client";

import { loginAction } from "./actions";
import GlitchText from "@/components/GlitchText";

export default function LoginPage() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const success = await loginAction(formData);
    
    if (success) {
      window.location.href = "/admin";
    } else {
      alert("Неверный логин или пароль / Логин немесе құпия сөз қате");
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden', margin: 0 }}>
      <div className="admin-form" style={{ width: '100%', maxWidth: '420px', textAlign: 'center', background: 'rgba(20, 20, 20, 0.45)', padding: '45px', borderRadius: '24px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 5, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <h1 style={{ marginBottom: '15px', color: 'var(--accent-color)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
          <GlitchText speed={1.5}>Басқару / Вход</GlitchText>
        </h1>
        <p style={{ marginBottom: '35px', color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>Введите логин и пароль / Логин мен құпия сөзді енгізіңіз</p>
        <form onSubmit={handleSubmit} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <input 
            type="text" 
            name="username" 
            placeholder="Логин / Пайдаланушы аты" 
            className="form-control" 
            required 
            autoComplete="username"
            style={{ textAlign: 'center', fontSize: '1.2rem', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Пароль / Құпия сөз" 
            className="form-control" 
            required 
            autoComplete="current-password"
            style={{ textAlign: 'center', fontSize: '1.2rem', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 800 }}>Войти / Кіру</button>
        </form>
      </div>
    </div>
  );
}
