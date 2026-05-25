import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

import { FiX, FiExternalLink, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AdminKlaim() {
  const { showToast } = useApp();
  const [filter, setFilter]         = useState('semua');
  const [klaim, setKlaim]           = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [konfirmasi, setKonfirmasi] = useState(null);

  const fetchKlaim = () => {
    api.get('/admin/claims')
      .then(res => setKlaim(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => { fetchKlaim(); }, []);

  const doUpdate = async () => {
    if (!konfirmasi) return;
    const { id, status } = konfirmasi;
    setKonfirmasi(null);
    try {
      await api.patch(`/admin/claims/${id}`, { status });
      showToast('Klaim berhasil ' + (status === 'approved' ? 'disetujui' : 'ditolak') + '!');
      fetchKlaim();
      setDetailItem(null);
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

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: 20,
  };

  const cardStyle = {
    background: '#fff', borderRadius: 14, padding: 28,
    width: '100%', maxWidth: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
    maxHeight: '90vh', overflowY: 'auto',
  };

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
                  <button
                    className="action-btn"
                    onClick={() => setDetailItem(k)}
                    style={{ background: '#e8f4fd', color: '#1a6fa8', borderColor: '#a8d4f0' }}
                  >
                    Detail
                  </button>
                  {k.status === 'pending' && (
                    <>
                      <button className="action-btn green" onClick={() => setKonfirmasi({ id: k.id, status: 'approved' })}>Setujui</button>
                      <button className="action-btn red"   onClick={() => setKonfirmasi({ id: k.id, status: 'rejected' })}>Tolak</button>
                    </>
                  )}
                  {k.status !== 'pending' && !detailItem && (
                    <span style={{ fontSize: 12, color: 'var(--text4)' }}>Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Detail Klaim */}
      {detailItem && (
        <div onClick={() => setDetailItem(null)} style={overlayStyle}>
          <div onClick={e => e.stopPropagation()} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Detail Pengajuan Klaim</div>
              <button onClick={() => setDetailItem(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }}>
                <FiX size={20} />
              </button>
            </div>

            {[
              { label: 'Destinasi',      val: detailItem.destination?.name },
              { label: 'Nama Lengkap',   val: detailItem.full_name },
              { label: 'Email',          val: detailItem.email },
              { label: 'No. Telepon',    val: detailItem.phone },
              { label: 'Tanggal Kirim',  val: new Date(detailItem.created_at).toLocaleDateString('id-ID') },
              { label: 'Status',         val: <span className={'badge ' + badgeClass(detailItem.status)}>{badgeLabel(detailItem.status)}</span> },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 13 }}>
                <div style={{ width: 120, flexShrink: 0, color: 'var(--text3)', fontWeight: 600 }}>{label}</div>
                <div style={{ color: 'var(--text)' }}>{val || '-'}</div>
              </div>
            ))}

            <div style={{ marginBottom: 12, fontSize: 13 }}>
              <div style={{ color: 'var(--text3)', fontWeight: 600, marginBottom: 4 }}>Keterangan</div>
              <div style={{ color: 'var(--text)', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', lineHeight: 1.6 }}>
                {detailItem.description || '-'}
              </div>
            </div>

            {/* File dokumen */}
            {detailItem.document_url && (
              <div style={{ marginBottom: 16, fontSize: 13 }}>
                <div style={{ color: 'var(--text3)', fontWeight: 600, marginBottom: 6 }}>Dokumen Bukti</div>
                {detailItem.document_url.match(/\.(jpg|jpeg|png)$/i) ? (
                  <div>
                    <img
                      src={detailItem.document_url}
                      alt="dokumen"
                      style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }}
                    />
                    <a href={detailItem.document_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, color: '#1a4fa8' }}>
                      <FiExternalLink size={12} /> Buka di tab baru
                    </a>
                  </div>
                ) : (
                  <div>
                    <iframe
                      src={detailItem.document_url}
                      style={{ width: '100%', height: 380, border: '1px solid var(--border)', borderRadius: 8 }}
                      title="preview-pdf"
                    />
                    <a href={detailItem.document_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, color: '#1a4fa8' }}>
                      <FiExternalLink size={12} /> Buka PDF di tab baru
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tombol aksi di dalam detail */}
            {detailItem.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="action-btn green" style={{ padding: '8px 18px' }} onClick={() => setKonfirmasi({ id: detailItem.id, status: 'approved' })}>Setujui</button>
                <button className="action-btn red"   style={{ padding: '8px 18px' }} onClick={() => setKonfirmasi({ id: detailItem.id, status: 'rejected' })}>Tolak</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Konfirmasi */}
      {konfirmasi && (
        <div onClick={() => setKonfirmasi(null)} style={overlayStyle}>
          <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, maxWidth: 380, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              {konfirmasi.status === 'approved'
                ? <FiCheckCircle size={40} color="#22c55e" />
                : <FiXCircle size={40} color="#ef4444" />
              }
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
              {konfirmasi.status === 'approved' ? 'Setujui Klaim?' : 'Tolak Klaim?'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 22 }}>
              {konfirmasi.status === 'approved'
                ? 'Klaim ini akan disetujui dan pengelola akan mendapat akses.'
                : 'Klaim ini akan ditolak dan tidak bisa dikembalikan ke pending.'}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setKonfirmasi(null)}
                style={{ padding: '8px 20px' }}
              >
                Batal
              </button>
              <button
                className={konfirmasi.status === 'approved' ? 'action-btn green' : 'action-btn red'}
                style={{ padding: '8px 20px' }}
                onClick={doUpdate}
              >
                Ya, {konfirmasi.status === 'approved' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}