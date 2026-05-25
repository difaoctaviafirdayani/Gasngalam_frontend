import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-gasngalam.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const { register, theme } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPass, setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDark = theme === 'dark';
  const gold = '#C9A227';
  const goldLight = '#e8c052';
  const pageBg = isDark ? '#0a0c14' : '#0d1117';
  const cardBg = isDark ? '#0f1320' : '#111827';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.12)';
  const textMuted = 'rgba(255,255,255,0.5)';

  const handleRegister = async () => {
    if (loading) return;
    if (!form.name || !form.email || !form.phone || !form.password) { setError('Semua field harus diisi'); return; }
    if (form.password !== form.confirm) { setError('Password tidak cocok'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter'); return; }
    setError('');
    setLoading(true);
    const ok = await register(form.name, form.email, form.phone, form.password, form.confirm);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Gagal membuat akun. Email mungkin sudah digunakan.');
  };

  const set = k => e => { setForm({ ...form, [k]: e.target.value }); setError(''); };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: inputBg, border: `1.5px solid ${borderColor}`,
    borderRadius: 10, outline: 'none', color: '#fff', fontSize: 13,
    fontFamily: "'Inter',sans-serif", transition: 'border-color .2s, box-shadow .2s', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
    display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.8px',
  };
  const eyeBtnStyle = {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)', background: 'none',
    border: 'none', cursor: 'pointer', color: gold,
    fontSize: 16, padding: 4, display: 'flex', alignItems: 'center',
    transition: 'color .2s',
  };
  const onFocus = e => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.12)'; };
  const onBlur  = e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${gold}, ${goldLight}, ${gold})` }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src={logo}
            alt="GasNgalam"
            style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 6 }}
          />
          <div style={{ fontSize: 9, color: gold, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>Kota Malang</div>
        </div>

        <h2 style={{ fontSize: 21, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 5 }}>Buat Akun Baru</h2>
        <p style={{ fontSize: 13, color: textMuted, textAlign: 'center', marginBottom: 24 }}>Bergabung dan mulai eksplor wisata Malang</p>

        {error && (
          <div style={{ background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e74c3c', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nama Lengkap</label>
          <input autoComplete="name" value={form.name} onChange={set('name')} placeholder="Nama Lengkap" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input autoComplete="email" type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nomor HP</label>
          <input autoComplete="off" type="tel" value={form.phone} onChange={set('phone')} placeholder="08XXXXXXXXXX" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 karakter"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={eyeBtnStyle}
                onMouseEnter={e => e.currentTarget.style.color = goldLight}
                onMouseLeave={e => e.currentTarget.style.color = gold}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Konfirmasi</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Ulangi password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={eyeBtnStyle}
                onMouseEnter={e => e.currentTarget.style.color = goldLight}
                onMouseLeave={e => e.currentTarget.style.color = gold}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: 13,
            background: loading ? 'rgba(201,162,39,0.5)' : gold,
            border: 'none', borderRadius: 10, color: '#0a0c14',
            fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all .2s', marginBottom: 16,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = goldLight; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = gold; }}
        >
          {loading ? 'Memproses...' : 'Daftar Gratis'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: textMuted }}>
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')} style={{ color: gold, fontWeight: 700, cursor: 'pointer' }}>Masuk</span>
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
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.07) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}