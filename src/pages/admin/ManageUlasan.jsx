import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';
function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + '/storage/' + url;
}

export default function AdminUlasan() {
  const { showToast }       = useApp();
  const [filter, setFilter] = useState('semua');
  const [ulasan, setUlasan] = useState([]);

  const fetchUlasan = () => {
    api.get('/admin/reviews')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setUlasan(data.map(u => ({
          ...u,
          photo_full_url: resolvePhoto(u.photo_full_url || u.photo_url || u.photo || null),
        })));
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUlasan();
  }, []);

  const hapusUlasan = async (id) => {
    if (!window.confirm('Hapus ulasan ini?')) return;
    try {
      await api.delete(`/admin/reviews/${confirmHapus}`);
      showToast('Ulasan berhasil dihapus!');
      fetchUlasan();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus ulasan');
    } finally {
      setConfirmHapus(null);
    }
  };

  const tinjauLaporan = async (id) => {
    try {
      await api.patch(`/admin/reviews/${id}/report`);
      showToast('Laporan sudah ditinjau.');
      fetchUlasan();
    } catch (err) {
      showToast(err.message || 'Gagal update laporan');
    }
  };

  const list = filter === 'dilaporkan'
    ? ulasan.filter(u => u.is_reported)
    : ulasan;

  const reportedCount = ulasan.filter(u => u.is_reported).length;

  const zoomIn    = () => setZoom(p => Math.min(p + 0.25, 4));
  const zoomOut   = () => setZoom(p => Math.max(p - 0.25, 0.5));
  const resetZoom = () => setZoom(1);
  const closeFoto = () => { setFotoPopup(null); resetZoom(); };

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: 20,
  };

  const stars = (r) => [1,2,3,4,5].map(s => (
    <span key={s} className={'star-s' + (r >= s ? '' : ' empty')}>★</span>
  ));


  return (
    <AdminLayout active="Kelola Ulasan">
      <div className="admin-page-title">Daftar Ulasan</div>
      <div className="admin-page-sub">
        Moderasi komentar dan rating dari wisatawan
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '14px 0' }}>
        <button
          className={'tab-pill' + (filter === 'semua' ? ' active' : '')}
          onClick={() => setFilter('semua')}
        >
          Semua ({ulasan.length})
        </button>

        <button
          className={
            'tab-pill' + (filter === 'dilaporkan' ? ' active' : '')
          }
          onClick={() => setFilter('dilaporkan')}
          style={
            reportedCount > 0 && filter !== 'dilaporkan'
              ? {
                  borderColor: 'var(--red)',
                  color: 'var(--red)'
                }
              : {}
          }
        >
          ⚑ Dilaporkan

          {reportedCount > 0 && (
            <span
              style={{
                background: 'var(--red)',
                color: '#fff',
                borderRadius: 99,
                padding: '1px 7px',
                fontSize: 11,
                marginLeft: 5
              }}
            >
              {reportedCount}
            </span>
          )}
        </button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Pengguna</th><th>Wisata</th><th>Rating</th><th>Komentar</th>
              <th>Foto</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: 'center',
                    padding: 22,
                    color: 'var(--text4)'
                  }}
                >
                  {filter === 'dilaporkan'
                    ? 'Tidak ada ulasan yang dilaporkan.'
                    : 'Tidak ada ulasan.'}
                </td>
              </tr>
            ) : list.map((c) => (
              <tr key={c.id} style={c.is_reported ? { background: '#fff8f8' } : {}}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div className="comment-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                      {(c.user?.name || 'A')[0].toUpperCase()}
                    </div>
                    {c.user?.name || 'Anonim'}
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>{c.destination?.name}</td>
                <td>⭐ {c.rating}</td>
                <td style={{ maxWidth: 180, fontSize: 12, color: 'var(--text2)' }}>
                  {c.comment?.substring(0, 70)}{c.comment?.length > 70 ? '...' : ''}
                </td>
                <td>
                  {c.photo_full_url
                    ? <img src={c.photo_full_url} alt="foto" style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 5, border: '1px solid var(--border)' }} />
                    : <span style={{ fontSize: 11, color: 'var(--text4)' }}>–</span>
                  }
                </td>
                <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                  {new Date(c.created_at).toLocaleDateString('id-ID')}
                </td>
                <td>
                  {c.is_reported
                    ? <span className="badge badge-red" style={{ fontSize: 11 }}>⚑ Dilaporkan</span>
                    : <span className="badge badge-green" style={{ fontSize: 11 }}>OK</span>
                  }
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {c.is_reported && (
                    <button
                      className="action-btn"
                      onClick={() => tinjauLaporan(c.id)}
                      style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffc107' }}
                    >
                      ✓ Tinjau
                    </button>
                  )}
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