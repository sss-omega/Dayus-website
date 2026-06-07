import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const password = formData.get("password");
    if (password === "dauys2026") {
      cookies().set("admin_session", "authenticated", {
        httpOnly: true,
        secure: false, // Set to false so it works on local HTTP
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      redirect("/admin");
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="admin-form" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', color: 'var(--accent-color)' }}>Admin Login</h1>
        <p style={{ marginBottom: '30px', color: '#888' }}>Please enter the administrator password.</p>
        <form action={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="form-control" 
            required 
            style={{ textAlign: 'center', fontSize: '1.1rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '15px' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
