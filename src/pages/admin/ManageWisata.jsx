import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export default function AdminWisata() {
  const { showToast } = useApp();
  const [destinations, setDestinations] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [editData, setEditData]         = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', location: '', distance: '',
    ticket_price: '', open_hours: '', description: '',
    emoji: '📍', color: '#3498db',
  });

  const fetchDestinations = () => {
    api.get('/destinations')
      .then(res => setDestinations(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchDestinations(); }, []);

  const resetForm = () => {
    setForm({ name: '', category: '', location: '', distance: '', ticket_price: '', open_hours: '', description: '', emoji: '📍', color: '#3498db' });
    setEditData(null);
    setShowForm(false);
  };

  const openEdit = (d) => {
    setEditData(d);
    setForm({
      name: d.name, category: d.category, location: d.location,
      distance: d.distance || '', ticket_price: d.ticket_price || '',
      open_hours: d.open_hours || '', description: d.description || '',
      emoji: d.emoji || '📍', color: d.color || '#3498db',
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.name || !form.category || !form.location) {
      showToast('Nama, kategori, dan lokasi wajib diisi'); return;
    }
    try {
      if (editData) {
        await api.put(`/admin/destinations/${editData.id}`, form);
        showToast('Destinasi berhasil diupdate!');
      } else {
        await api.post('/admin/destinations', { ...form, is_active: true });
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

  const set = k => e => setForm({ ...form, [k]: e.target.value });

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
              <input value={form.name} onChange={set('name')} placeholder="Nama destinasi" />
            </div>
            <div className="fg">
              <label>Kategori *</label>
              <input value={form.category} onChange={set('category')} placeholder="Wisata Alam, Taman Kota, dll" />
            </div>
          </div>
          <div className="form-row">
            <div className="fg">
              <label>Lokasi *</label>
              <input value={form.location} onChange={set('location')} placeholder="Kecamatan, Kota" />
            </div>
            <div className="fg">
              <label>Jarak</label>
              <input value={form.distance} onChange={set('distance')} placeholder="5 km" />
            </div>
          </div>
          <div className="form-row">
            <div className="fg">
              <label>Harga Tiket</label>
              <input value={form.ticket_price} onChange={set('ticket_price')} placeholder="Gratis / Rp 20.000" />
            </div>
            <div className="fg">
              <label>Jam Buka</label>
              <input value={form.open_hours} onChange={set('open_hours')} placeholder="07.00–17.00" />
            </div>
          </div>
          <div className="form-row">
            <div className="fg">
              <label>Emoji</label>
              <input value={form.emoji} onChange={set('emoji')} placeholder="🌊" style={{ width: 60 }} />
            </div>
            <div className="fg">
              <label>Warna Kartu</label>
              <input type="color" value={form.color} onChange={set('color')} style={{ width: 60, height: 36, padding: 2, border: '1px solid var(--border)', borderRadius: 6 }} />
            </div>
          </div>
          <div className="fg">
            <label>Deskripsi</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Deskripsi singkat destinasi..." rows={3} />
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
                <td><strong>{d.emoji} {d.name}</strong></td>
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
