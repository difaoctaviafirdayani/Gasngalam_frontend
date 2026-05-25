import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_destinations: 0, total_users: 0, total_reviews: 0, pending_claims: 0,
  });
  const [recentClaims, setRecentClaims] = useState([]);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => {});
    api.get('/admin/claims', { params: { status: 'pending' } })
      .then(res => setRecentClaims(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => {});
  }, []);

  const cards = [
    { icon: '', num: stats.total_destinations, label: 'Total Wisata',   path: '/admin/wisata', color: '#3B82F6' },
    { icon: '', num: stats.total_users,         label: 'Total User',     path: null,            color: '#10B981' },
    { icon: '', num: stats.total_reviews,        label: 'Total Ulasan',  path: '/admin/ulasan', color: '#8B5CF6' },
    { icon: '', num: stats.pending_claims,       label: 'Klaim Pending', path: '/admin/klaim',  color: '#F59E0B' },
  ];

  return (
    <AdminLayout active="Dashboard">
      <div className="admin-page-title">Hi, Admin! </div>
      <div className="admin-page-sub">Selamat datang di panel admin GasNgalam</div>

      {/* 4 card sejajar + clickable */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {cards.map(({ icon, num, label, path, color }) => (
          <div
            key={label}
            onClick={() => path && navigate(path)}
            style={{
              background: 'var(--white)', borderRadius: 'var(--r)',
              padding: '18px 16px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)',
              cursor: path ? 'pointer' : 'default',
              transition: 'transform .15s, box-shadow .15s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { if (path) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.10)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '12px 12px 0 0' }} />
            <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 5, fontWeight: 500 }}>{label}</div>
            {path && <div style={{ fontSize: 10, color, marginTop: 8, fontWeight: 600, opacity: .7 }}>Lihat detail →</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 11 }}>
        Pengajuan Klaim Terbaru
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Nama Wisata</th>
              <th>Nama Lengkap</th>
              <th>Tanggal Kirim</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recentClaims.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>
                  Belum ada klaim pending
                </td>
              </tr>
            ) : recentClaims.map((k, i) => (
              <tr key={i}>
                <td><strong>{k.destination?.name}</strong></td>
                <td>{k.full_name}</td>
                <td>{new Date(k.created_at).toLocaleDateString('id-ID')}</td>
                <td><span className="badge badge-amber">Pending</span></td>
                <td>
                  <button className="action-btn" onClick={() => navigate('/admin/klaim')}>Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}