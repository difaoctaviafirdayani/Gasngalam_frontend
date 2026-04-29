import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const CAT_ICONS = {
  "Taman Kota": "🌳",
  "Wisata Buatan": "🎡",
  "Wisata Edukasi": "📚",
  "Wisata Budaya": "🏛️",
  "Perbelanjaan": "🛒",
};

export default function Search() {
  const [params]                      = useSearchParams();
  const navigate                      = useNavigate();
  const { favs, toggleFav }           = useApp();
  const q                             = params.get('q') || '';
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    api.get('/destinations', { params: { q } })
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

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
        <div className="search-heading">Hasil Pencarian</div>
        <div className="search-sub">
          {loading ? 'Mencari...' : `Menampilkan ${results.length} hasil untuk "${q}"`}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 32 }}>⏳</div><p>Mencari destinasi...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
            <p>Destinasi wisata tidak ditemukan.<br />Coba kata kunci lain.</p>
          </div>
        ) : results.map(d => (
          <div key={d.id} className="list-item" onClick={() => navigate('/destination/' + d.id)}>
            <div className="list-thumb" style={{ background: gradForColor(d) }}>{d.emoji || '📍'}</div>
            <div className="list-info">
              <div className="list-name">{d.name}</div>
              <div className="list-loc">{d.location}</div>
              <div className="list-meta">
                <div className="list-rating">★ {d.rating} ({d.review_count})</div>
                <div className="list-cat">{CAT_ICONS[d.category] || '📍'} {d.category}</div>
              </div>
            </div>
            <div className="list-right">
              <div style={{ fontSize: 11, color: 'var(--text4)' }}>{d.distance} 🗺️</div>
              <button className="fav-list-btn" onClick={e => { e.stopPropagation(); toggleFav(d.id); }}>
                {favs.has(d.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
