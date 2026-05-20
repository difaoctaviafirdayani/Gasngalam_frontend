// src/pages/Profile.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Profile() {
  const { user, showToast } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (form.password && form.password !== form.password_confirmation) {
      showToast('Password konfirmasi tidak cocok!');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await api.put('/user/profile', payload);
      showToast('Profil berhasil disimpan!');
      setForm(f => ({ ...f, password: '', password_confirmation: '' }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    fontSize: 13, fontFamily: 'Inter,sans-serif',
    color: 'var(--text)', background: 'var(--white)',
  };

  return (
    <div className="content" style={{ maxWidth: 480, paddingTop: 28 }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--brand)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 800, color: 'var(--white)',
          flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>{user?.email}</div>
          <span
            className="badge badge-green"
            style={{ marginTop: 4, display: 'inline-flex' }}
          >
            {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="form-card">
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Edit Profil</div>

        <div className="fg">
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Nama Lengkap</label>
          <input style={inp} value={form.name} onChange={set('name')} placeholder="Nama kamu" />
        </div>

        <div className="fg">
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Email</label>
          <input style={{ ...inp, background: 'var(--bg)', color: 'var(--text3)' }} value={form.email} disabled />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0 14px', paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 12 }}>
            Ganti Password <span style={{ fontWeight: 400 }}>(kosongkan jika tidak ingin diubah)</span>
          </div>
          <div className="fg">
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Password Baru</label>
            <input style={inp} type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 karakter" />
          </div>
          <div className="fg">
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Konfirmasi Password</label>
            <input style={inp} type="password" value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="Ulangi password baru" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}