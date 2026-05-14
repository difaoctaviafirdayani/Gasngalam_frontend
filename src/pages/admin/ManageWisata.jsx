import { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const CATEGORIES = [
  'Wisata Budaya',
  'Taman Kota',
  'Wisata Edukasi',
  'Kuliner & Belanja',
  'Wisata Hiburan',
  'Wisata Alam',
];

const EMPTY_FORM = {
  name: '', category: '', location: '',
  ticket_price: '', open_hours: '',
  contact: '', social_media: '', address: '',
  description: '',
  lat: '', lng: '',
  is_active: true,
};

export default function AdminWisata() {
  const { showToast }                   = useApp();
  const [destinations, setDestinations] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [editData, setEditData]         = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [photo, setPhoto]               = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const fileRef                         = useRef();

  const fetchDestinations = () => {
    api.get('/destinations')
      .then(res => setDestinations(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchDestinations(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
    setEditData(null);
    setShowForm(false);
  };

  const openEdit = (d) => {
    setEditData(d);
    setForm({
      name:         d.name         || '',
      category:     d.category     || '',
      location:     d.location     || '',
      ticket_price: d.ticket_price || '',
      open_hours:   d.open_hours   || '',
      contact:      d.contact      || '',
      social_media: d.social_media || '',
      address:      d.address      || '',
      description:  d.description  || '',
      lat:          d.lat          || '',
      lng:          d.lng          || '',
      is_active:    d.is_active    ?? true,
    });
    setPhoto(null);
    setPhotoPreview(d.photo_full_url || null);
    setShowForm(true);
  };

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP'); return;
    }
    if (f.size > 5 * 1024 * 1024) { showToast('Ukuran foto maksimal 5MB'); return; }
    setPhoto(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const set  = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const setCheck = k => e => setForm(prev => ({ ...prev, [k]: e.target.checked }));

  const submitForm = async () => {
    if (!form.name || !form.category || !form.location) {
      showToast('Nama, kategori, dan lokasi wajib diisi'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
  if (k === 'is_active') {
    fd.append(k, v ? '1' : '0');
  } else if (v !== '' && v !== null && v !== undefined) {
    fd.append(k, v);
  }
});
      if (photo) fd.append('photo', photo);

      if (editData) {
        await api.post(`/admin/destinations/${editData.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Destinasi berhasil diupdate!');
      } else {
        await api.post('/admin/destinations', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Destinasi berhasil ditambahkan!');
      }
      resetForm();
      fetchDestinations();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan destinasi');
    } finally {
      setSubmitting(false);
    }
  };

  const hapus = async (id, name) => {
    if (!window.confirm(`Hapus destinasi "${name}"?`)) return;
    try {
      await api.delete(`/admin/destinations/${id}`);
      showToast('Destinasi berhasil dihapus!');
      fetchDestinations();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus destinasi');
    }
  };

  const inp = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 7,
    padding: '9px 11px', fontSize: 13, fontFamily: 'Inter,sans-serif',
    background: 'var(--bg2)', color: 'var(--text)',
  };
  const sel = { ...inp, appearance: 'auto' };

  const Lbl = ({ children, required }) => (
    <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 5, display: 'block', color: 'var(--text2)' }}>
      {children} {required && <span style={{ color: 'var(--red)' }}>*</span>}
    </label>
  );

  return (
    <AdminLayout active="Kelola Wisata">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div className="admin-page-title">Daftar Wisata</div>
          <div className="admin-page-sub">Manajemen data destinasi wisata</div>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Tambah Destinasi
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 22, marginBottom: 22 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            {editData ? '✏️ Edit Destinasi' : '➕ Tambah Destinasi Baru'}
          </div>

          {/* Nama & Kategori */}
          <div className="form-row">
            <div className="fg">
              <Lbl required>Nama Wisata</Lbl>
              <input style={inp} value={form.name} onChange={set('name')} placeholder="Nama destinasi" />
            </div>
            <div className="fg">
              <Lbl required>Kategori</Lbl>
              <select style={sel} value={form.category} onChange={set('category')}>
                <option value="">-- Pilih Kategori --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Lokasi & Status */}
          <div className="form-row">
            <div className="fg">
              <Lbl required>Lokasi</Lbl>
              <input style={inp} value={form.location} onChange={set('location')} placeholder="Kecamatan, Kota Malang" />
            </div>
            <div className="fg" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={form.is_active} onChange={setCheck('is_active')} style={{ width: 16, height: 16 }} />
                Aktif / Tampil ke pengguna
              </label>
            </div>
          </div>

          {/* Harga & Jam */}
          <div className="form-row">
            <div className="fg">
              <Lbl>Harga Tiket</Lbl>
              <input style={inp} value={form.ticket_price} onChange={set('ticket_price')} placeholder="Gratis / Rp 20.000" />
            </div>
            <div className="fg">
              <Lbl>Jam Operasional</Lbl>
              <input style={inp} value={form.open_hours} onChange={set('open_hours')} placeholder="07.00–17.00 WIB" />
            </div>
          </div>

          {/* Contact & Sosmed */}
          <div className="form-row">
            <div className="fg">
              <Lbl>Contact Person</Lbl>
              <input style={inp} value={form.contact} onChange={set('contact')} placeholder="08XXXXXXXXXX / 0341-XXXXXX" />
            </div>
            <div className="fg">
              <Lbl>Sosial Media</Lbl>
              <input style={inp} value={form.social_media} onChange={set('social_media')} placeholder="@namaakun" />
            </div>
          </div>

          {/* Alamat */}
          <div className="fg" style={{ marginBottom: 12 }}>
            <Lbl>Alamat Lengkap</Lbl>
            <input style={inp} value={form.address} onChange={set('address')} placeholder="Jl. Nama Jalan No. X, Kelurahan, Kecamatan, Kota Malang" />
          </div>

          {/* Koordinat GPS */}
          <div className="form-row">
            <div className="fg">
              <Lbl>Latitude <span style={{ fontWeight: 400, color: 'var(--text4)', fontSize: 11 }}>(untuk fitur Terdekat)</span></Lbl>
              <input style={inp} value={form.lat} onChange={set('lat')} placeholder="-7.9666" type="number" step="any" />
            </div>
            <div className="fg">
              <Lbl>Longitude</Lbl>
              <input style={inp} value={form.lng} onChange={set('lng')} placeholder="112.6326" type="number" step="any" />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="fg" style={{ marginBottom: 12 }}>
            <Lbl>Deskripsi</Lbl>
            <textarea
              style={{ ...inp, resize: 'vertical', minHeight: 80 }}
              value={form.description}
              onChange={set('description')}
              placeholder="Deskripsi singkat destinasi ini..."
              rows={3}
            />
          </div>

          {/* Upload Foto */}
          <div className="fg" style={{ marginBottom: 14 }}>
            <Lbl>Foto Utama <span style={{ fontWeight: 400, color: 'var(--text4)', fontSize: 11 }}>(JPG/PNG/WebP, maks. 5MB)</span></Lbl>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handlePhoto} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {photoPreview && (
                <img src={photoPreview} alt="preview" style={{ height: 72, width: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              )}
              <button
                onClick={() => fileRef.current.click()}
                style={{ padding: '8px 18px', border: '1.5px dashed var(--border)', borderRadius: 8, background: 'var(--bg)', cursor: 'pointer', fontSize: 12, color: 'var(--text2)', fontFamily: 'Inter,sans-serif' }}
              >
                {photoPreview ? '🔄 Ganti Foto' : '📷 Upload Foto'}
              </button>
              {photoPreview && (
                <button
                  onClick={() => { setPhoto(null); setPhotoPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✕ Hapus
                </button>
              )}
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: 6 }}>
            <button className="btn-secondary" onClick={resetForm} disabled={submitting}>Batal</button>
            <button className="btn-primary" onClick={submitForm} disabled={submitting}>
              {submitting ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah Destinasi')}
            </button>
          </div>
        </div>
      )}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Wisata</th>
              <th>Kategori</th>
              <th>Lokasi</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Kelola</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>Memuat data...</td></tr>
            ) : destinations.map(d => (
              <tr key={d.id}>
                <td>
                  {d.photo_full_url
                    ? <img src={d.photo_full_url} alt={d.name} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                    : <div style={{ width: 52, height: 40, background: d.gradient || d.color || '#e0e0e0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{d.emoji || '📍'}</div>
                  }
                </td>
                <td><strong>{d.name}</strong></td>
                <td>{d.category}</td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{d.location}</td>
                <td>⭐ {d.rating} ({d.review_count})</td>
                <td>
                  <span className={`badge ${d.is_active ? 'badge-green' : 'badge-red'}`}>
                    {d.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => openEdit(d)}>Edit</button>
                  <button className="action-btn red" onClick={() => hapus(d.id, d.name)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}