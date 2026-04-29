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

  return (
    <AdminLayout active="Dashboard">
      <div className="admin-page-title">Hi, Admin! 👋</div>
      <div className="admin-page-sub">Selamat datang di panel admin GasNgalam</div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-num">{stats.total_destinations}</div>
          <div className="stat-label">Total Wisata</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-num">{stats.total_users}</div>
          <div className="stat-label">Total User</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-num">{stats.total_reviews}</div>
          <div className="stat-label">Total Ulasan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-num">{stats.pending_claims}</div>
          <div className="stat-label">Klaim Pending</div>
        </div>
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
