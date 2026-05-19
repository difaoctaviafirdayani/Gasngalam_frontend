import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate  = useNavigate();
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (loading) return;
    setLoading(true);
    const r = await login(email, pass);
    setLoading(false);
    if (r === 'admin') navigate('/admin');
    else if (r === 'user') navigate('/');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
          <h2 className="auth-title">Masuk</h2>
          <p className="auth-sub">Selamat datang kembali di GasNgalam</p>
        </div>

        <div className="fg">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Masukkan email kamu"
          />
        </div>

        <div className="fg">
          <label>Password</label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Masukkan password"
            onKeyDown={e => e.key === 'Enter' && doLogin()}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 12, marginTop: 4 }}
          onClick={doLogin}
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text3)' }}>
          Belum punya akun?{' '}
          <a className="auth-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}