import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  FaPencilAlt, FaCommentAlt, FaClipboardList,
  FaSave, FaUser, FaCrown, FaMapMarkerAlt,
  FaStar, FaHeart, FaClock, FaCheckCircle,
  FaTimesCircle, FaQuestionCircle, FaSpinner,
  FaInfoCircle, FaExclamationCircle,
} from 'react-icons/fa';
import { MdSyncAlt } from 'react-icons/md';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return BACKEND_URL + (url.startsWith('/') ? '' : '/') + url;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, showToast, fetchMe, userDetail } = useApp();
  const [tab, setTab] = useState('edit');
  const [form, setForm] = useState({ name: '', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState(new Set());
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (userDetail) {
      setForm(f => ({ ...f, name: userDetail.name || '' }));
      setAvatarPreview(userDetail.avatar_url ? resolveUrl(userDetail.avatar_url) : null);
    }
  }, [userDetail]);

  useEffect(() => {
    if (tab === 'reviews' && !loadedTabs.has('reviews')) {
      setLoadingData(true);
      api.get('/user/reviews')
        .then(res => {
          setReviews(Array.isArray(res.data) ? res.data : []);
          setLoadedTabs(prev => new Set([...prev, 'reviews']));
        })
        .catch(() => {})
        .finally(() => setLoadingData(false));
    }
    if (tab === 'favorites' && !loadedTabs.has('favorites')) {
      setLoadingData(true);
      api.get('/favorites')
        .then(res => {
          setFavorites(Array.isArray(res.data) ? res.data : []);
          setLoadedTabs(prev => new Set([...prev, 'favorites']));
        })
        .catch(() => {})
        .finally(() => setLoadingData(false));
    }
    // claims selalu re-fetch tiap kali tab dibuka — supaya status & catatan admin selalu terbaru
    if (tab === 'claims') {
      setLoadingData(true);
      api.get('/user/claims')
        .then(res => {
          setClaims(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {})
        .finally(() => setLoadingData(false));
    }
  }, [tab]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (form.password && form.password !== form.password_confirmation) {
      showToast('Password konfirmasi tidak cocok!'); return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.password) {
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
      }
      if (avatarFile) formData.append('avatar', avatarFile);
      await api.post('/user/profile', formData);
      showToast('Profil berhasil disimpan!');
      setForm(f => ({ ...f, password: '', password_confirmation: '' }));
      setAvatarFile(null);
      fetchMe();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '';
      if (msg.toLowerCase().includes('avatar')) {
        showToast('Profil berhasil disimpan!');
      } else {
        showToast(msg || 'Gagal menyimpan profil');
      }
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)',
    fontSize: 13, fontFamily: 'Inter,sans-serif',
    color: 'var(--text)', background: 'var(--white)',
    boxSizing: 'border-box',
  };

  const statusBadge = (status) => {
    const map = {
      pending:  [<MdSyncAlt />,     'Pending',   '#f39c12'],
      approved: [<FaCheckCircle />, 'Disetujui', '#27ae60'],
      rejected: [<FaTimesCircle />, 'Ditolak',   '#e74c3c'],
    };
    const [icon, label, color] = map[status] || [<FaQuestionCircle />, 'Unknown', '#999'];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: color + '22', color, border: `1px solid ${color}44`,
        borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 700,
      }}>
        {icon} {label}
      </span>
    );
  };

  const tabs = [
    { key: 'edit',    label: 'Edit Profil',  icon: <FaPencilAlt /> },
    { key: 'reviews', label: 'Ulasan Saya',  icon: <FaCommentAlt /> },
    { key: 'claims',  label: 'Klaim Bisnis', icon: <FaClipboardList /> },
  ];

  return (
    <div className="content" style={{ maxWidth: 640, paddingTop: 28 }}>
      {/* Header Profil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            onClick={() => fileRef.current?.click()}
            title="Klik untuk ganti foto"
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: '#fff',
              cursor: 'pointer', overflow: 'hidden',
              border: '3px solid var(--brand)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.charAt(0) || '?').toUpperCase()
            }
          </div>
          <div
            style={{
              position: 'absolute', bottom: 0, right: 0,
              background: 'var(--brand)', color: '#fff',
              width: 22, height: 22, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, cursor: 'pointer', border: '2px solid var(--white)',
            }}
            onClick={() => fileRef.current?.click()}
          >
            <FaPencilAlt size={10} />
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{userDetail?.name || user}</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>{userDetail?.email}</div>
          <span className="badge badge-green" style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {userDetail?.role === 'admin' ? <><FaCrown size={11} /> Admin</> : <><FaUser size={11} /> User</>}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', fontSize: 12.5, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t.key ? '2px solid var(--brand)' : '2px solid transparent',
              color: tab === t.key ? 'var(--brand)' : 'var(--text3)',
              whiteSpace: 'nowrap',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Edit Profil */}
      {tab === 'edit' && (
        <div className="form-card">
          <div className="fg">
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Nama Lengkap</label>
            <input style={inp} value={form.name} onChange={set('name')} placeholder="Nama kamu" />
          </div>
          <div className="fg">
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Email</label>
            <input style={{ ...inp, background: 'var(--bg)', color: 'var(--text3)' }} value={userDetail?.email || ''} disabled />
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
            <button className="btn-primary" onClick={handleSave} disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {saving
                ? <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</>
                : <><FaSave /> Simpan Perubahan</>}
            </button>
          </div>
        </div>
      )}

      {/* TAB: Ulasan Saya */}
      {tab === 'reviews' && (
        <div>
          {loadingData ? (
            /* Loading: ikon di tengah atas teks */
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: 14, opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Memuat ulasan...</p>
            </div>
          ) : reviews.length === 0 ? (
            /* Empty: ikon di tengah atas teks */
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaCommentAlt size={48} style={{ marginBottom: 14, opacity: 0.3, display: 'block', margin: '0 auto 14px' }} />
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--text2)' }}>Belum ada ulasan</p>
              <p style={{ margin: 0, fontSize: 13 }}>Kamu belum pernah memberikan ulasan.</p>
            </div>
          ) : reviews.map(r => (
            <div key={r.id} className="form-card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => navigate('/destination/' + r.destination_id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.destination?.name || 'Destinasi'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaMapMarkerAlt size={10} /> {r.destination?.location}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', color: '#f5a623', fontWeight: 700 }}>
                  <FaStar size={13} /> {r.rating}
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8, marginBottom: 0 }}>{r.comment}</p>
              <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaClock size={10} /> {new Date(r.created_at).toLocaleDateString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Favorit */}
      {tab === 'favorites' && (
        <div>
          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: 14, opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Memuat favorit...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaHeart size={48} style={{ marginBottom: 14, opacity: 0.3, display: 'block', margin: '0 auto 14px' }} />
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--text2)' }}>Belum ada favorit</p>
              <p style={{ margin: 0, fontSize: 13 }}>Belum ada destinasi favorit.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
              {favorites.map(f => {
                const d = f.destination || f;
                return (
                  <div key={f.id} className="dest-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/destination/' + (f.destination_id || d.id))}>
                    <div className="card-img" style={{ overflow: 'hidden' }}>
                      {d.photo_full_url
                        ? <img src={resolveUrl(d.photo_full_url)} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#3498db,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaMapMarkerAlt size={30} color="#fff" />
                          </div>
                      }
                    </div>
                    <div className="card-body">
                      <div className="card-name" style={{ fontSize: 12 }}>{d.name}</div>
                      <div className="card-loc" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <FaMapMarkerAlt size={9} /> {d.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Klaim Bisnis */}
      {tab === 'claims' && (
        <div>
          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: 14, opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Memuat data...</p>
            </div>
          ) : claims.length === 0 ? (
            /* Empty: ikon di tengah atas teks */
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
              <FaClipboardList size={48} style={{ marginBottom: 14, opacity: 0.3, display: 'block', margin: '0 auto 14px' }} />
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--text2)' }}>Belum ada klaim</p>
              <p style={{ margin: 0, fontSize: 13 }}>Kamu belum pernah mengajukan klaim bisnis.</p>
            </div>
          ) : claims.map(c => (
            <div key={c.id} className="form-card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.destination?.name || 'Destinasi'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaMapMarkerAlt size={10} /> {c.destination?.location}
                  </div>
                </div>
                {statusBadge(c.status)}
              </div>

              {/* Catatan alasan penolakan admin — ditampilkan menonjol jika status rejected */}
              {c.status === 'rejected' && (
                <div style={{
                  marginTop: 10,
                  background: '#fdf0f0',
                  border: '1px solid #f5c6c6',
                  borderRadius: 8,
                  padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: '#c0392b', fontWeight: 700, fontSize: 12 }}>
                    <FaExclamationCircle size={13} /> Alasan Penolakan
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#7b2a2a', lineHeight: 1.55 }}>
                    {c.admin_notes
                      ? c.admin_notes
                      : 'Admin tidak memberikan catatan spesifik. Silakan hubungi kami untuk informasi lebih lanjut.'}
                  </p>
                </div>
              )}

              {/* Catatan admin untuk status selain rejected (info biasa) */}
              {c.admin_notes && c.status !== 'rejected' && (
                <div style={{
                  marginTop: 10,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'flex', alignItems: 'flex-start', gap: 7,
                }}>
                  <FaInfoCircle size={13} style={{ color: 'var(--brand)', marginTop: 1, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                    <strong>Catatan Admin:</strong> {c.admin_notes}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaClock size={10} /> {new Date(c.created_at).toLocaleDateString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}