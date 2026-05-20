import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';
function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + '/storage/' + url;
}

export default function AdminUlasan() {
  const { showToast }                     = useApp();
  const navigate                          = useNavigate();
  const [filter, setFilter]               = useState('semua');
  const [ulasan, setUlasan]               = useState([]);
  const [fotoPopup, setFotoPopup]         = useState(null);
  const [hapusTarget, setHapusTarget]     = useState(null);
  const [zoom, setZoom]                   = useState(1);
  const imgRef                            = useRef();

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

  useEffect(() => { fetchUlasan(); }, []);

  const doHapus = async () => {
    if (!hapusTarget) return;
    const id = hapusTarget;
    setHapusTarget(null);
    try {
      await api.delete(`/admin/reviews/${id}`);
      showToast('Ulasan berhasil dihapus!');
      fetchUlasan();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus ulasan');
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

  const list          = filter === 'dilaporkan' ? ulasan.filter(u => u.is_reported) : ulasan;
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

  return (
    <AdminLayout active="Kelola Ulasan">
      <div className="admin-page-title">Daftar Ulasan</div>
      <div className="admin-page-sub">Moderasi komentar dan rating dari wisatawan</div>

      <div style={{ display: 'flex', gap: 8, margin: '14px 0' }}>
        <button className={'tab-pill' + (filter === 'semua' ? ' active' : '')} onClick={() => setFilter('semua')}>
          Semua ({ulasan.length})
        </button>
        <button
          className={'tab-pill' + (filter === 'dilaporkan' ? ' active' : '')}
          onClick={() => setFilter('dilaporkan')}
          style={reportedCount > 0 && filter !== 'dilaporkan' ? { borderColor: 'var(--red)', color: 'var(--red)' } : {}}
        >
          ⚑ Dilaporkan
          {reportedCount > 0 && (
            <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 99, padding: '1px 7px', fontSize: 11, marginLeft: 5 }}>
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
                <td colSpan={8} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>
                  {filter === 'dilaporkan' ? 'Tidak ada ulasan yang dilaporkan.' : 'Tidak ada ulasan.'}
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

                {/* KLIK KOMENTAR → redirect ke halaman detail admin */}
                <td style={{ maxWidth: 180, fontSize: 12, color: 'var(--text2)' }}>
                  <span
                    onClick={() => navigate(`/admin/destination/${c.destination_id}`)}
                    title="Klik untuk lihat halaman detail destinasi"
                    style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                  >
                    {c.comment?.substring(0, 70)}{c.comment?.length > 70 ? '...' : ''}
                  </span>
                </td>

                {/* KLIK FOTO → popup zoom */}
                <td>
                  {c.photo_full_url ? (
                    <img
                      src={c.photo_full_url}
                      alt="foto"
                      onClick={() => { setFotoPopup(c.photo_full_url); resetZoom(); }}
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 5, border: '1px solid var(--border)', cursor: 'zoom-in' }}
                    />
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text4)' }}>–</span>
                  )}
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
                    <button className="action-btn" onClick={() => tinjauLaporan(c.id)} style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffc107' }}>
                      ✓ Tinjau
                    </button>
                  )}
                  {/* HAPUS → popup konfirmasi custom */}
                  <button className="action-btn red" onClick={() => setHapusTarget(c.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── POPUP KONFIRMASI HAPUS ── */}
      {hapusTarget && (
        <div onClick={() => setHapusTarget(null)} style={overlayStyle}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 14, padding: 28, width: '100%',
            maxWidth: 360, textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Hapus Ulasan?</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24, lineHeight: 1.6 }}>
              Ulasan ini akan dihapus permanen dan tidak bisa dikembalikan.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setHapusTarget(null)} style={{ padding: '8px 22px' }}>
                Batal
              </button>
              <button className="action-btn red" onClick={doHapus} style={{ padding: '8px 22px' }}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP FOTO ZOOM ── */}
      {fotoPopup && (
        <div onClick={closeFoto} style={overlayStyle}>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '6px 14px' }}>
              <button onClick={zoomOut} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>−</button>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: '32px', minWidth: 48, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>+</button>
              <button onClick={resetZoom} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, height: 32, padding: '0 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Reset</button>
              <button onClick={closeFoto} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✕</button>
            </div>
            <div style={{ overflow: 'auto', maxWidth: '90vw', maxHeight: '80vh', borderRadius: 10 }}>
              <img
                ref={imgRef}
                src={fotoPopup}
                alt="foto ulasan"
                style={{
                  transform: `scale(${zoom})`, transformOrigin: 'top left',
                  display: 'block', borderRadius: 10, transition: 'transform 0.2s ease',
                  maxWidth: zoom <= 1 ? '85vw' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}