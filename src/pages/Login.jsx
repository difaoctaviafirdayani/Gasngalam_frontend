import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-gasngalam.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login, theme } = useApp();
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');

  const isDark = theme === 'dark';
  const gold = '#C9A227';
  const goldLight = '#e8c052';
  const pageBg = isDark ? '#0a0c14' : '#0d1117';
  const cardBg = isDark ? '#0f1320' : '#111827';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.12)';
  const textMuted = 'rgba(255,255,255,0.5)';

  const doLogin = async () => {
    if (loading) return;
    if (!email || !pass) { setError('Email dan password harus diisi'); return; }
    setError('');
    setLoading(true);
    const r = await login(email, pass);
    setLoading(false);
    if (r === 'admin') navigate('/admin');
    else if (r === 'user') navigate('/');
    else setError('Email atau password salah. Silakan coba lagi.');
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: inputBg, border: `1.5px solid ${borderColor}`,
    borderRadius: 10, outline: 'none', color: '#fff', fontSize: 13,
    fontFamily: "'Inter',sans-serif", transition: 'border-color .2s, box-shadow .2s', boxSizing: 'border-box',
  };
  const onFocus = e => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.12)'; };
  const onBlur  = e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${gold}, ${goldLight}, ${gold})` }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src={logo}
            alt="GasNgalam"
            style={{
              height: 30,
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              marginBottom: 6,
            }}
          />
          <div style={{ fontSize: 9, color: gold, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>Kota Malang</div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 6 }}>Selamat Datang Kembali</h2>
        <p style={{ fontSize: 13, color: textMuted, textAlign: 'center', marginBottom: 28 }}>Masuk ke akun GasNgalam kamu</p>

        {error && (
          <div style={{ background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e74c3c', marginBottom: 18 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="nama@email.com"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              type="button"
              title={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: gold,
                fontSize: 16, padding: 4, display: 'flex', alignItems: 'center',
                transition: 'color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = goldLight}
              onMouseLeave={e => e.currentTarget.style.color = gold}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          onClick={doLogin}
          disabled={loading}
          style={{
            width: '100%', padding: 13,
            background: loading ? 'rgba(201,162,39,0.5)' : gold,
            border: 'none', borderRadius: 10, color: '#0a0c14',
            fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all .2s', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = goldLight; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = gold; }}
        >
          {loading ? 'Memproses...' : 'Masuk ke GasNgalam'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: textMuted }}>
          Belum punya akun?{' '}
          <span onClick={() => navigate('/register')} style={{ color: gold, fontWeight: 700, cursor: 'pointer' }}>
            Daftar Sekarang
          </span>
        </p>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span
            onClick={() => navigate('/')}
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            Kembali ke Beranda
          </span>
        </div>
      </div>
      <style>{`input::placeholder { color: rgba(255,255,255,0.25) !important; }`}</style>
    </div>
  );
}