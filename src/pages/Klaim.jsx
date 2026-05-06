import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';

export default function Klaim() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { showToast, addKlaim, requireLogin } = useApp();
  const [form, setForm] = useState({ nama: '', email: '', hp: '', ket: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(f.type)) { showToast('Format file harus PDF, JPG, atau PNG'); return; }
    if (f.size > 10 * 1024 * 1024) { showToast('Ukuran file maksimal 10MB'); return; }
    setFile(f);
    showToast('File berhasil dipilih: ' + f.name);
  };

  const removeFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async () => {
    if (!requireLogin('Login dulu untuk mengajukan klaim bisnis.')) return;
    if (!form.nama || !form.email || !form.hp || !form.ket) {
      showToast('Harap lengkapi seluruh data yang wajib diisi (*)');
      return;
    }
    setLoading(true);
    const ok = await addKlaim({
      destination_id: id,
      nama: form.nama,
      email: form.email,
      hp: form.hp,
      ket: form.ket,
      file,
    });
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
      <Topbar />
      <div className="content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>

        <div className="klaim-header">
          <h2>Ajukan Klaim Bisnis</h2>
          <p>Kelola informasi destinasi wisata Anda secara resmi melalui GasNgalam</p>
          <div className="klaim-dest-badge">📍 Destinasi ID: {id}</div>
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
            <textarea
              value={form.ket}
              onChange={e => setForm({ ...form, ket: e.target.value })}
              placeholder="Jelaskan hubungan Anda dengan destinasi ini dan apa yang ingin diubah..."
            />
          </div>

          <div className="fg">
            <Lbl>Bukti Pendukung <span style={{ fontWeight: 400, color: 'var(--text4)', fontSize: 11 }}>(opsional)</span></Lbl>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />
            {!file ? (
              <div className="upload-zone" onClick={() => fileRef.current.click()} style={{ cursor: 'pointer' }}>
                <div className="upload-zone-icon">📎</div>
                <div className="upload-zone-text">
                  Klik untuk upload bukti pendukung<br />
                  <span style={{ fontSize: 11, color: '#bbb' }}>PDF, JPG, PNG — maks. 10MB</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{file.type === 'application/pdf' ? '📄' : '🖼️'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text4)' }}>{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
                <button onClick={removeFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 18, padding: 4 }}>✕</button>
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
    </div>
  );
}