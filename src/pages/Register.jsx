import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;
    if (!form.name || !form.email || !form.phone || !form.password) {
      return;
    }
    if (form.password !== form.confirm) {
      return;
    }
    setLoading(true);
    const ok = await register(form.name, form.email, form.phone, form.password, form.confirm);
    setLoading(false);
    if (ok) navigate('/');
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <Topbar />
      <div className="auth-wrap">
        <div className="auth-card">
          <div style={{textAlign:'center',marginBottom:20}}>
            <div style={{fontSize:28,marginBottom:8}}>🗺️</div>
            <h2 className="auth-title">Daftar</h2>
            <p className="auth-sub">Bergabung dan mulai eksplor wisata Malang</p>
          </div>
          <div className="fg">
            <label>Nama Lengkap</label>
            <input value={form.name} onChange={set('name')} placeholder="Nama Lengkap" />
          </div>
          <div className="fg">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="Email" />
          </div>
          <div className="fg">
            <label>Nomor HP</label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="08XXXXXXXXXX" />
          </div>
          <div className="form-row">
            <div className="fg">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="Buat Password" />
            </div>
            <div className="fg">
              <label>Konfirmasi</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Konfirmasi Password" />
            </div>
          </div>
          {form.password && form.confirm && form.password !== form.confirm && (
            <p style={{color:'red',fontSize:12,marginBottom:8}}>Password tidak cocok</p>
          )}
          <button
            className="btn-primary"
            style={{width:'100%',justifyContent:'center',marginBottom:12}}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
          <p style={{textAlign:'center',fontSize:12.5,color:'var(--text3)'}}>
            Sudah punya akun? <a className="auth-link" onClick={() => navigate('/login')}>Masuk</a>
          </p>
        </div>
      </div>
    </div>
  );
}
