import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const CAT_ICONS = {
  "Semua": "🌏",
  "Taman Kota": "🌳",
  "Wisata Buatan": "🎡",
  "Wisata Edukasi": "📚",
  "Wisata Budaya": "🏛️",
  "Perbelanjaan": "🛒",
};

export default function Home() {
  const [cat, setCat]                   = useState('Semua');
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories]     = useState(['Semua']);
  const [loading, setLoading]           = useState(true);
  const [sortBy, setSortBy]             = useState('semua');
  const { favs, toggleFav }             = useApp();
  const navigate                        = useNavigate();

  useEffect(() => {
    setLoading(true);
    setSortBy('semua');
    const params = cat !== 'Semua' ? { category: cat } : {};
    api.get('/destinations', { params })
      .then(res => setDestinations(res.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, [cat]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(['Semua', ...res.data]))
      .catch(() => {});
  }, []);

  const gradForColor = (d) => {
    if (d.gradient) return d.gradient;
    if (d.color) return `linear-gradient(135deg, ${d.color}, ${d.color}cc)`;
    return 'linear-gradient(135deg,#3498db,#2980b9)';
  };

  const parseDistance = (str) => {
    if (!str) return Infinity;
    const num = parseFloat(str.replace(',', '.'));
    if (str.includes('km')) return num * 1000;
    return num;
  };

  const getSorted = (list) => {
    if (sortBy === 'terdekat')
      return [...list].sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    if (sortBy === 'terpopuler')
      return [...list].sort((a, b) =>
        b.rating - a.rating || b.review_count - a.review_count);
    return list;
  };

  const cardHtml = (d) => (
    <div key={d.id} className="dest-card" onClick={() => navigate('/destination/' + d.id)}>
      <div className="card-img" style={{ background: gradForColor(d) }}>
        <div className="card-img-emoji">{d.emoji || '📍'}</div>
        <span className="card-cat-badge">{d.category}</span>
        <button className="card-fav" onClick={e => { e.stopPropagation(); toggleFav(d.id); }}>
          {favs.has(d.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-body">
        <div className="card-name">{d.name}</div>
        <div className="card-loc">📍 {d.location}</div>
        <div className="card-footer">
          <div className="card-rating">★ {d.rating} <span style={{ fontWeight: 400, color: 'var(--text4)' }}>({d.review_count})</span></div>
          <div className="card-dist">{d.distance}</div>
        </div>
      </div>
    </div>
  );

  const listHtml = (d) => (
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
  );

  const renderContent = () => {
    if (loading) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
        <p>Memuat destinasi...</p>
      </div>
    );

    if (destinations.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
        <p>Tidak ada destinasi pada kategori ini.</p>
      </div>
    );

    if (cat === 'Semua') {
      const cats = [...new Set(destinations.map(d => d.category))];
      return cats.map(c => {
        const dests = destinations.filter(d => d.category === c);
        return (
          <div key={c}>
            <div className="sec-head">
              <div>
                <div className="sec-title">{CAT_ICONS[c] || '📍'} {c}</div>
                <div className="sec-sub">{dests.length} destinasi tersedia</div>
              </div>
            </div>
            <div className="cards-grid">{dests.map(cardHtml)}</div>
          </div>
        );
      });
    }

    return (
      <>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 14 }}>
          <strong style={{ color: 'var(--text)' }}>{CAT_ICONS[cat] || '📍'} {cat}</strong> — Menampilkan semua destinasi {cat.toLowerCase()}
        </div>
        <div className="sort-tabs">
          {['semua', 'terdekat', 'terpopuler'].map(s => (
            <button
              key={s}
              className={'sort-btn' + (sortBy === s ? ' active' : '')}
              onClick={() => setSortBy(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {getSorted(destinations).map(listHtml)}
      </>
    );
  };

  return (
    <div>
      <Topbar />
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">🗺️ Wisata Kota Malang · Jawa Timur</div>
          <h1 className="hero-title">EKSPLOR MALANG</h1>
          <p className="hero-sub">Temukan Destinasi Terbaik di Kota Malang — dari taman kota yang asri hingga kampung budaya yang memukau.</p>
        </div>
      </div>
      <div className="cat-section">
        <div className="cat-inner">
          {categories.map(c => (
            <button key={c} className={'cat-btn' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>
              <span>{CAT_ICONS[c] || '📍'}</span> {c}
            </button>
          ))}
        </div>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}