import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const CAT_ORDER = [
  'Wisata Budaya',
  'Taman Kota',
  'Wisata Edukasi',
  'Kuliner Legendaris',
  'Wisata Hiburan',
  'Wisata Alam',
];

const CAT_ICONS = {
  'Semua':             '🌏',
  'Wisata Budaya':     '🏛️',
  'Taman Kota':        '🌳',
  'Wisata Edukasi':    '📚',
  'Kuliner Legendaris':'🍜',
  'Wisata Hiburan':    '✨',
  'Wisata Alam':       '🏞️',
};
const getCatIcon = (c) => CAT_ICONS[c] || '📍';

export default function Home() {
  const [cat, setCat]                   = useState('Semua');
  const [sortMode, setSortMode]         = useState('default');
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories]     = useState(['Semua']);
  const [loading, setLoading]           = useState(true);
  const [userCoords, setUserCoords]     = useState(null);
  const [geoLoading, setGeoLoading]     = useState(false);
  const { favs, toggleFav, hitungJarak } = useApp();
  const navigate                        = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (cat !== 'Semua') params.category = cat;

    if (cat !== 'Semua') {
      if (sortMode === 'popular') {
        params.sort = 'review_count';
        params.dir  = 'desc';
      }
      if (sortMode === 'nearest' && userCoords) {
        params.sort = 'nearest';
        params.lat  = userCoords.lat;
        params.lng  = userCoords.lng;
      }
    }

    api.get('/destinations', { params })
      .then(res => {
        let data = res.data;
        // Frontend sort sebagai fallback supaya hasilnya pasti terurut
        if (sortMode === 'popular') {
          data = [...data].sort((a, b) => b.review_count - a.review_count);
        }
        setDestinations(data);
      })
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, [cat, sortMode, userCoords]);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        const fromApi = res.data;
        const ordered = CAT_ORDER.filter(c => fromApi.includes(c));
        const rest    = fromApi.filter(c => !CAT_ORDER.includes(c));
        setCategories(['Semua', ...ordered, ...rest]);
      })
      .catch(() => {});
  }, []);

  const handleCatChange = (c) => {
    setCat(c);
    setSortMode('default');
  };

  const handleNearest = () => {
    if (sortMode === 'nearest') { setSortMode('default'); return; }
    if (userCoords) { setSortMode('nearest'); return; }
    setGeoLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortMode('nearest');
        setGeoLoading(false);
      },
      () => {
        alert('Izin lokasi ditolak. Aktifkan lokasi di browser untuk fitur ini.');
        setGeoLoading(false);
      }
    );
  };

  const thumbEl = (d) => {
    if (d.photo_full_url) {
      return (
        <img
          src={d.photo_full_url}
          alt={d.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    const bg = d.gradient || (d.color ? `linear-gradient(135deg,${d.color},${d.color}cc)` : 'linear-gradient(135deg,#3498db,#2980b9)');
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
        {d.emoji || getCatIcon(d.category)}
      </div>
    );
  };

  const cardHtml = (d) => (
    <div key={d.id} className="dest-card" onClick={() => navigate('/destination/' + d.id)}>
      <div className="card-img" style={{ overflow: 'hidden' }}>
        {thumbEl(d)}
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
          {d.distance && <div className="card-dist">{d.distance}</div>}
        </div>
      </div>
    </div>
  );

  const getJarak = (d) => {
    if (d.distance_km) return d.distance_km + ' km';
    if (userCoords && d.lat && d.lng)
      return hitungJarak(userCoords.lat, userCoords.lng, d.lat, d.lng).toFixed(1) + ' km';
    return null;
  };

  const listHtml = (d) => {
    const jarak = getJarak(d);
    return (
      <div key={d.id} className="list-item" onClick={() => navigate('/destination/' + d.id)}>
        <div className="list-thumb" style={{ overflow: 'hidden', borderRadius: 'var(--r-sm)' }}>
          {d.photo_full_url
            ? <img src={d.photo_full_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
            : <div style={{ width: '100%', height: '100%', background: d.gradient || (d.color ? `linear-gradient(135deg,${d.color},${d.color}cc)` : 'linear-gradient(135deg,#3498db,#2980b9)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, borderRadius: 'var(--r-sm)' }}>{d.emoji || getCatIcon(d.category)}</div>
          }
        </div>
        <div className="list-info">
          <div className="list-name">{d.name}</div>
          <div className="list-loc">{d.location}</div>
          <div className="list-meta">
            <div className="list-rating">★ {d.rating} ({d.review_count})</div>
            <div className="list-cat">{getCatIcon(d.category)} {d.category}</div>
          </div>
        </div>
        <div className="list-right">
          {jarak && <div style={{ fontSize: 11, color: 'var(--text4)' }}>{jarak} 🗺️</div>}
          <button className="fav-list-btn" onClick={e => { e.stopPropagation(); toggleFav(d.id); }}>
            {favs.has(d.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    );
  };

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
      const catOrder  = CAT_ORDER.filter(c => destinations.some(d => d.category === c));
      const otherCats = [...new Set(destinations.map(d => d.category))].filter(c => !CAT_ORDER.includes(c));
      const allCats   = [...catOrder, ...otherCats];

      return allCats.map(c => {
        const dests = destinations.filter(d => d.category === c);
        if (dests.length === 0) return null;
        return (
          <div key={c}>
            <div className="sec-head">
              <div>
                <div className="sec-title">{getCatIcon(c)} {c}</div>
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
          <strong style={{ color: 'var(--text)' }}>{getCatIcon(cat)} {cat}</strong>
          {' — '}
          {sortMode === 'nearest'  && '📍 Terdekat · '}
          {sortMode === 'popular'  && '🔥 Terpopuler · '}
          {destinations.length} destinasi
        </div>
        {destinations.map(listHtml)}
      </>
    );
  };

  const showSortBar = cat !== 'Semua';

  return (
    <div>
      <Topbar />
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">🗺️ Wisata Kota Malang · Jawa Timur</div>
          <h1 className="hero-title">EKSPLOR KOTA MALANG</h1>
          <p className="hero-sub">Temukan Destinasi Terbaik di Kota Malang — dari taman kota yang asri hingga kampung budaya yang memukau.</p>
        </div>
      </div>

      <div className="cat-section">
        <div className="cat-inner">
          {categories.map(c => (
            <button
              key={c}
              className={'cat-btn' + (cat === c ? ' active' : '')}
              onClick={() => handleCatChange(c)}
            >
              <span>{getCatIcon(c)}</span> {c}
            </button>
          ))}
        </div>
      </div>

      {showSortBar && (
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '8px 20px' }}>
          <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', gap: 8 }}>
            <button className={'sort-btn' + (sortMode === 'default' ? ' active' : '')} onClick={() => setSortMode('default')}>Semua</button>
            <button className={'sort-btn' + (sortMode === 'nearest' ? ' active' : '')} onClick={handleNearest} disabled={geoLoading}>
              {geoLoading ? '📍...' : '📍 Terdekat'}
            </button>
            <button className={'sort-btn' + (sortMode === 'popular' ? ' active' : '')} onClick={() => setSortMode(sortMode === 'popular' ? 'default' : 'popular')}>
              🔥 Terpopuler
            </button>
          </div>
        </div>
      )}

      <div className="content">{renderContent()}</div>
    </div>
  );
}