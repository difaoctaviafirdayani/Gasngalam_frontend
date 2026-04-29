import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export default function AdminKlaim() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState('semua');
  const [klaim, setKlaim]   = useState([]);

  const fetchKlaim = () => {
    api.get('/admin/claims')
      .then(res => setKlaim(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => { fetchKlaim(); }, []);

  const updateKlaim = async (id, status) => {
    try {
      await api.patch(`/admin/claims/${id}`, { status });
      showToast('Klaim berhasil ' + (status === 'approved' ? 'disetujui' : 'ditolak') + '!');
      fetchKlaim();
    } catch (err) {
      showToast(err.message || 'Gagal update klaim');
    }
  };

  const list = filter === 'semua'
    ? klaim
    : klaim.filter(k => {
        if (filter === 'pending')   return k.status === 'pending';
        if (filter === 'disetujui') return k.status === 'approved';
        if (filter === 'ditolak')   return k.status === 'rejected';
        return true;
      });

  const badgeClass = s => s === 'approved' ? 'badge-green' : s === 'rejected' ? 'badge-red' : 'badge-amber';
  const badgeLabel = s => s === 'approved' ? 'Disetujui' : s === 'rejected' ? 'Ditolak' : 'Pending';

  return (
    <AdminLayout active="Kelola Pengajuan Klaim">
      <div className="admin-page-title">Daftar Pengajuan Klaim</div>
      <div className="admin-page-sub">Tinjau dan verifikasi klaim dari pengelola wisata</div>

      <div className="tab-row">
        {['semua', 'pending', 'disetujui', 'ditolak'].map(f => (
          <button key={f} className={'tab-pill' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Nama Wisata</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Tanggal Kirim</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>Tidak ada data</td></tr>
            ) : list.map((k, i) => (
              <tr key={i}>
                <td><strong>{k.destination?.name}</strong></td>
                <td>{k.full_name}</td>
                <td>{k.email}</td>
                <td>{new Date(k.created_at).toLocaleDateString('id-ID')}</td>
                <td><span className={'badge ' + badgeClass(k.status)}>{badgeLabel(k.status)}</span></td>
                <td>
                  {k.status === 'pending' ? (
                    <>
                      <button className="action-btn green" onClick={() => updateKlaim(k.id, 'approved')}>Setujui</button>
                      <button className="action-btn red" onClick={() => updateKlaim(k.id, 'rejected')}>Tolak</button>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text4)' }}>Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
