import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Klaim() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { showToast, addKlaim, requireLogin } = useApp();

  const [form, setForm]               = useState({ nama: '', email: '', hp: '', ket: '' });
  const [file, setFile]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [destName, setDestName]       = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    api.get(`/destinations/${id}`)
      .then(res => setDestName(res.data.name || ''))
      .catch(() => setDestName(''));
  }, [id]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(f.type)) { showToast('Format file harus PDF, JPG, atau PNG'); return; }
    if (f.size > 10 * 1024 * 1024) { showToast('Ukuran file maksimal 10MB'); return; }
    setFile(f);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeFile = () => setFile(null);

  const openPreview = () => {
    if (!file) return;
    setPreviewItem({ url: URL.createObjectURL(file), type: file.type, name: file.name });
  };

  const closePreview = () => {
    if (previewItem?.url) URL.revokeObjectURL(previewItem.url);
    setPreviewItem(null);
  };

  const submit = async () => {
    if (!requireLogin('Login dulu untuk mengajukan klaim bisnis.')) return;
    if (!form.nama || !form.email || !form.hp || !form.ket) {
      showToast('Harap lengkapi seluruh data yang wajib diisi (*)'); return;
    }
    setLoading(true);
    const ok = await addKlaim({ destination_id: id, nama: form.nama, email: form.email, hp: form.hp, ket: form.ket, file: file || null });
    setLoading(false);
    if (ok) setTimeout(() => navigate(-1), 1500);
  };

  const Lbl = ({ children, required }) => (
    <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 5, display: 'block', color: 'var(--text2)' }}>
      {children} {required && <span style={{ color: 'var(--red)', fontWeight: 700 }}>*</span>}
    </label>
  );

  return (
    <div>
      <div className="content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>

        <div className="klaim-header">
          <h2>Ajukan Klaim Bisnis</h2>
          <p>Kelola informasi destinasi wisata Anda secara resmi melalui GasNgalam</p>
          <div className="klaim-dest-badge">📍 {destName || `Memuat...`}</div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
          <span style={{ color: 'var(--red)', fontWeight: 700 }}>*</span> Wajib diisi
        </p>

        <div className="form-card">
          <div className="form-row">
            <div className="fg">
              <Lbl required>Nama Lengkap</Lbl>
              <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Masukkan nama lengkap" />
            </div>
            <div className="fg">
              <Lbl required>Email</Lbl>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="nama@gmail.com" />
            </div>
          </div>

          <div className="fg">
            <Lbl required>Nomor Telepon</Lbl>
            <input value={form.hp} onChange={e => setForm({ ...form, hp: e.target.value })} placeholder="08XXXXXXXXXX" />
          </div>

          <div className="fg">
            <Lbl required>Keterangan</Lbl>
            <textarea value={form.ket} onChange={e => setForm({ ...form, ket: e.target.value })} placeholder="Jelaskan hubungan Anda dengan destinasi ini dan apa yang ingin diubah..." />
          </div>

          <div className="fg">
            <Lbl>Bukti Pendukung <span style={{ fontWeight: 400, color: 'var(--text4)', fontSize: 11 }}>(opsional)</span></Lbl>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />

            {!file && (
              <div className="upload-zone" onClick={() => fileRef.current.click()} style={{ cursor: 'pointer' }}>
                <div className="upload-zone-icon">📎</div>
                <div className="upload-zone-text">
                  Klik untuk upload bukti pendukung<br />
                  <span style={{ fontSize: 11, color: '#bbb' }}>PDF, JPG, PNG — maks. 10MB</span>
                </div>
              </div>
            )}

            {file && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{file.type === 'application/pdf' ? '📄' : '🖼️'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text4)' }}>{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={openPreview} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', padding: '4px 10px', fontSize: 12, color: 'var(--text2)', fontFamily: 'Inter, sans-serif' }}>
                    👁 Lihat
                  </button>
                  <button
                    onClick={() => fileRef.current.click()}
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', padding: '4px 10px', fontSize: 12, color: 'var(--text2)', fontFamily: 'Inter, sans-serif' }}
                  >
                    🔄 Ganti
                  </button>
                  <button onClick={removeFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 18, padding: 4 }}>✕</button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => navigate(-1)}>Batal</button>
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </div>
      </div>

      {previewItem && (
        <div onClick={closePreview} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                {previewItem.type === 'application/pdf' ? '📄' : '🖼️'} {previewItem.name}
              </div>
              <button onClick={closePreview} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {previewItem.type === 'application/pdf'
              ? <iframe src={previewItem.url} style={{ width: '70vw', height: '75vh', border: 'none', borderRadius: 8 }} title="preview-pdf" />
              : <img src={previewItem.url} alt="preview" style={{ maxWidth: '80vw', maxHeight: '75vh', borderRadius: 8, objectFit: 'contain' }} />
            }
          </div>
        </div>
      )}
    </div>
  );
}