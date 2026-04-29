import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Favorites() {
  const { favs, toggleFav }           = useApp();
  const navigate                      = useNavigate();
  const [favDests, setFavDests]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (favs.size === 0) { setFavDests([]); setLoading(false); return; }
    // Ambil semua destinasi lalu filter berdasarkan favs
    api.get('/destinations')
      .then(res => {
        const all = res.data;
        setFavDests(all.filter(d => favs.has(d.id)));
      })
      .catch(() => setFavDests([]))
      .finally(() => setLoading(false));
  }, [favs]);

  const gradForColor = (d) => {
    if (d.gradient) return d.gradient;
    if (d.color) return `linear-gradient(135deg, ${d.color}, ${d.color}cc)`;
    return 'linear-gradient(135deg,#3498db,#2980b9)';
  };

  return (
    <div>
      <Topbar />
      <div className="content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Destinasi Tersimpan</h2>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>Koleksi wisata favorit Anda</p>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 32 }}>⏳</div><p>Memuat...</p>
          </div>
        ) : favDests.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-empty-icon">🤍</div>
            <div className="fav-empty-title">Belum ada destinasi tersimpan</div>
            <p style={{ fontSize: 13 }}>Mulai eksplor dan simpan wisata favoritmu!</p>
          </div>
        ) : favDests.map(d => (
          <div key={d.id} className="list-item" onClick={() => navigate('/destination/' + d.id)}>
            <div className="list-thumb" style={{ background: gradForColor(d) }}>{d.emoji || '📍'}</div>
            <div className="list-info">
              <div className="list-name">{d.name}</div>
              <div className="list-loc">{d.location}</div>
            </div>
            <div className="list-right">
              <button className="fav-list-btn" onClick={e => { e.stopPropagation(); toggleFav(d.id); }}>❤️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
