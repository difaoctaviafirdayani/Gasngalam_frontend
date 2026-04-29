import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export default function AdminUlasan() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState('semua');
  const [ulasan, setUlasan] = useState([]);

  const fetchUlasan = () => {
    api.get('/admin/reviews')
      .then(res => setUlasan(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => { fetchUlasan(); }, []);

  const hapusUlasan = async (id) => {
    if (!window.confirm('Hapus ulasan ini?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      showToast('Ulasan berhasil dihapus!');
      fetchUlasan();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus ulasan');
    }
  };

  const list = filter === 'dilaporkan' ? ulasan.filter(u => u.is_reported) : ulasan;

  return (
    <AdminLayout active="Kelola Ulasan">
      <div className="admin-page-title">Daftar Ulasan</div>
      <div className="admin-page-sub">Moderasi komentar dan rating dari wisatawan</div>

      <div className="tab-row">
        {['semua', 'dilaporkan'].map(f => (
          <button key={f} className={'tab-pill' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Nama Wisata</th>
              <th>Rating</th>
              <th>Komentar</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>Tidak ada ulasan</td></tr>
            ) : list.map((c, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div className="comment-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                      {(c.user?.name || 'A')[0].toUpperCase()}
                    </div>
                    {c.user?.name || 'Anonim'}
                  </div>
                </td>
                <td>{c.destination?.name}</td>
                <td>⭐ {c.rating}</td>
                <td style={{ maxWidth: 200, color: 'var(--text2)' }}>
                  {c.comment?.substring(0, 60)}{c.comment?.length > 60 ? '...' : ''}
                </td>
                <td>{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                  <button className="action-btn red" onClick={() => hapusUlasan(c.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
