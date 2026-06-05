import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { FaBell, FaBellSlash, FaClipboardList, FaSpinner } from 'react-icons/fa';

export default function Notifications() {
  const navigate              = useNavigate();
  const { setNotifCount }     = useApp();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setNotifCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setNotifCount(0);
  };

  const typeIcon = (type) => type === 'claim_status'
    ? <FaClipboardList size={18} />
    : <FaBell size={18} />;

  const statusColor = (data) => {
    if (!data) return null;
    if (data.status === 'approved') return '#27ae60';
    if (data.status === 'rejected') return '#e74c3c';
    return '#f39c12';
  };

  return (
    <div className="content" style={{ maxWidth: 600, paddingTop: 24 }}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaBell size={18} /> Notifikasi
        </h2>
        <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Tandai semua dibaca
        </button>
      </div>

      {loading ? (
        /* Loading state: ikon di tengah atas teks */
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: 14, opacity: 0.5 }} />
          <p style={{ fontWeight: 600, margin: 0 }}>Memuat notifikasi...</p>
        </div>
      ) : notifs.length === 0 ? (
        /* Empty state: ikon di tengah atas teks */
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <FaBellSlash size={52} style={{ marginBottom: 14, opacity: 0.35, display: 'block', margin: '0 auto 14px' }} />
          <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 6px', color: 'var(--text2)' }}>Belum ada notifikasi</p>
          <p style={{ fontSize: 13, margin: 0 }}>Kamu akan menerima notifikasi saat status klaim kamu berubah.</p>
        </div>
      ) : notifs.map(n => (
        <div
          key={n.id}
          onClick={() => !n.is_read && markRead(n.id)}
          style={{
            padding: '14px 16px', borderRadius: 10, marginBottom: 8,
            background: n.is_read ? 'var(--white)' : 'var(--brand)0d',
            border: `1px solid ${n.is_read ? 'var(--border)' : 'var(--brand)33'}`,
            cursor: n.is_read ? 'default' : 'pointer', transition: 'all .2s',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: (n.data && statusColor(n.data)) ? statusColor(n.data) + '22' : 'var(--brand)22',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: (n.data && statusColor(n.data)) || 'var(--brand)',
            }}>
              {typeIcon(n.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ fontWeight: n.is_read ? 600 : 800, fontSize: 14, color: 'var(--text)' }}>{n.title}</div>
                {!n.is_read && <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4, lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 6 }}>
                {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}