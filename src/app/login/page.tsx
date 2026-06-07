"use client";

import { loginAction } from "./actions";

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
      alert("Неверный пароль / Invalid password");
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="admin-form" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h1 style={{ marginBottom: '20px', color: 'var(--accent-color)', fontSize: '2rem' }}>Admin Login</h1>
        <p style={{ marginBottom: '30px', color: '#888' }}>Please enter the administrator password.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="form-control" 
            required 
            style={{ textAlign: 'center', fontSize: '1.2rem', padding: '15px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '15px', fontSize: '1.1rem' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
