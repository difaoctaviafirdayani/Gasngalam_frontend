import { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const KATEGORI_OPTIONS = [
  'Wisata Budaya', 'Taman Kota', 'Wisata Edukasi', 'Kuliner & Belanja', 'Wisata Hiburan',
];

export default function AdminWisata() {
  const { showToast } = useApp();
  const [destinations, setDestinations] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [editData, setEditData]         = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', location: '',
    latitude: '', longitude: '',
    ticket_price: '', open_hours: '', description: '',
    address: '', contact: '', social_media: '',
    image: null, imagePreview: null,
  });
  const fileRef = useRef();

  const fetchDestinations = () => {
    api.get('/destinations')
      .then(res => setDestinations(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchDestinations(); }, []);

  const resetForm = () => {
    setForm({
      name: '', category: '', location: '',
      latitude: '', longitude: '',
      ticket_price: '', open_hours: '', description: '',
      address: '', contact: '', social_media: '',
      image: null, imagePreview: null,
    });
    setEditData(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const openEdit = (d) => {
    setEditData(d);
    setForm({
      name:         d.name         || '',
      category:     d.category     || '',
      location:     d.location     || '',
      latitude:     d.latitude     || '',
      longitude:    d.longitude    || '',
      ticket_price: d.ticket_price || '',
      open_hours:   d.open_hours   || '',
      description:  d.description  || '',
      address:      d.address      || '',
      contact:      d.contact      || '',
      social_media: d.social_media || '',
      image:        null,
      imagePreview: null,
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.name || !form.category || !form.location || !form.latitude || !form.longitude) {
      showToast('Nama, kategori, lokasi, latitude, dan longitude wajib diisi'); return;
    }
    try {
      const payload = {
        name:         form.name,
        category:     form.category,
        location:     form.location,
        latitude:     form.latitude,
        longitude:    form.longitude,
        ticket_price: form.ticket_price,
        open_hours:   form.open_hours,
        description:  form.description,
        address:      form.address,
        contact:      form.contact,
        social_media: form.social_media,
        is_active:    true,
      };
      if (editData) {
        await api.put(`/admin/destinations/${editData.id}`, payload);
        showToast('Destinasi berhasil diupdate!');
      } else {
        await api.post('/admin/destinations', payload);
        showToast('Destinasi berhasil ditambahkan!');
      }
      resetForm();
      fetchDestinations();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan destinasi');
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

  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }));

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
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>
            {editData ? '✏️ Edit Destinasi' : '➕ Tambah Destinasi Baru'}
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Nama Wisata *</label>
              <input value={form.name} onChange={set('name')} placeholder="Nama Destinasi" />
            </div>
            <div className="fg">
              <label>Kategori *</label>
              <select value={form.category} onChange={set('category')}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }}>
                <option value="">-Pilih Kategori-</option>
                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Lokasi *</label>
              <input value={form.location} onChange={set('location')} placeholder="Kecamatan" />
            </div>
            <div className="fg">
              <label>Alamat</label>
              <input value={form.address} onChange={set('address')} placeholder="Alamat Lengkap" />
            </div>
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Latitude *</label>
              <input value={form.latitude} onChange={set('latitude')} placeholder="Contoh: -7.983908" />
            </div>
            <div className="fg">
              <label>Longitude *</label>
              <input value={form.longitude} onChange={set('longitude')} placeholder="Contoh: 112.621391" />
            </div>
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Harga Tiket</label>
              <input value={form.ticket_price} onChange={set('ticket_price')} placeholder="Rp 000,00" />
            </div>
            <div className="fg">
              <label>Jam Buka</label>
              <input value={form.open_hours} onChange={set('open_hours')} placeholder="00.00-23.59" />
            </div>
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Contact Person</label>
              <input value={form.contact} onChange={set('contact')} placeholder="Nomor Handphone" />
            </div>
            <div className="fg">
              <label>Sosial Media</label>
              <input value={form.social_media} onChange={set('social_media')} placeholder="Sosial Media Destinasi" />
            </div>
          </div>

          <div className="fg">
            <label>Deskripsi</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Deskripsi Singkat Destinasi" rows={3} />
          </div>

          <div className="fg">
            <label>Foto Destinasi</label>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files[0];
                if (!f) return;
                setForm(prev => ({ ...prev, image: f, imagePreview: URL.createObjectURL(f) }));
              }}
            />
            {!form.imagePreview ? (
              <div
                onClick={() => fileRef.current.click()}
                style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '24px 0', textAlign: 'center', cursor: 'pointer', color: 'var(--text4)', background: 'var(--bg2)' }}
              >
                <div style={{ fontSize: 26 }}>🖼️</div>
                <div style={{ fontSize: 13 }}>Klik untuk upload foto</div>
                <div style={{ fontSize: 11, color: '#bbb' }}>JPG, PNG, WEBP — maks. 5MB</div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <img
                  src={form.imagePreview}
                  alt="preview"
                  style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
                />
                <button
                  onClick={() => { setForm(prev => ({ ...prev, image: null, imagePreview: null })); fileRef.current.value = ''; }}
                  style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700 }}
                >
                  x
                </button>
              </div>
            )}
          </div>

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button className="btn-secondary" onClick={resetForm}>Batal</button>
            <button className="btn-primary" onClick={submitForm}>
              {editData ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </div>
      )}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
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
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 22, color: 'var(--text4)' }}>Memuat data...</td></tr>
            ) : destinations.map(d => (
              <tr key={d.id}>
                <td><strong>{d.name}</strong></td>
                <td>{d.category}</td>
                <td>{d.location}</td>
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