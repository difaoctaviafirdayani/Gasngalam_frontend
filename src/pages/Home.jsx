import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { SkeletonCard, SkeletonList } from '../components/SkeletonCard';
import tuguImg from '../assets/Tugu-malang.png.png';

const CAT_ORDER = ['Wisata Budaya','Taman Kota','Wisata Edukasi','Kuliner Legendaris','Wisata Hiburan','Wisata Alam'];
const CAT_ICONS = { 'Semua': '🌏', 'Wisata Budaya': '🏛️', 'Taman Kota': '🌳', 'Wisata Edukasi': '📚', 'Kuliner Legendaris': '🍜', 'Wisata Hiburan': '✨', 'Wisata Alam': '🏞️' };
const getCatIcon = (c) => CAT_ICONS[c] || '📍';

// Peta semua destinasi menggunakan Leaflet
function DestinationsMap({ destinations, onSelectDest }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = (L) => {
      if (mapInstanceRef.current) return;
      // Pusat Malang
      const map = L.map(mapRef.current).setView([-7.9797, 112.6304], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      mapInstanceRef.current = map;
    };

    if (window.L) {
      initMap(window.L);
    } else {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = () => initMap(window.L);
      document.head.appendChild(s);
    }

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, []);

  // Update markers saat destinasi berubah
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    // Hapus marker lama
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    destinations.forEach(d => {
      if (!d.lat || !d.lng) return;
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 8, fillColor: '#3498db', color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.9,
      }).addTo(mapInstanceRef.current);
      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px">
          <div style="font-weight:700;font-size:13px">${d.name}</div>
          <div style="font-size:11px;color:#666;margin-top:2px">📍 ${d.location}</div>
          <div style="font-size:11px;color:#f5a623;margin-top:2px">★ ${d.rating}</div>
          <button onclick="window.__goToDestination('${d.id}')" style="margin-top:6px;background:#3498db;color:#fff;border:none;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;width:100%">Lihat Detail</button>
        </div>
      `);
      marker.on('click', () => marker.openPopup());
      markersRef.current.push(marker);
    });
  }, [destinations]);

  // Global callback untuk tombol popup
  useEffect(() => {
    window.__goToDestination = (id) => onSelectDest(id);
    return () => { delete window.__goToDestination; };
  }, [onSelectDest]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 500, borderRadius: 12, border: '1.5px solid var(--border)' }} />
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
        🗺️ {destinations.filter(d => d.lat && d.lng).length} destinasi ditampilkan di peta · Klik marker untuk detail
      </div>
    </div>
  );
}

export default function Home() {
  const [cat, setCat]                   = useState('Semua');
  const [viewMode, setViewMode]         = useState('card'); // 'card' | 'list' | 'map'
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
    api.get('/destinations', { params })
      .then(res => {
        let data = res.data;
        if (sortMode === 'popular') data = [...data].sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
        if (sortMode === 'nearest' && userCoords) {
          data = [...data].sort((a, b) => {
            const jA = (a.lat && a.lng) ? hitungJarak(userCoords.lat, userCoords.lng, a.lat, a.lng) : 99999;
            const jB = (b.lat && b.lng) ? hitungJarak(userCoords.lat, userCoords.lng, b.lat, b.lng) : 99999;
            return jA - jB;
          });
        }
        setDestinations(data);
      })
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, [cat, sortMode, userCoords]);

  useEffect(() => {
    api.get('/categories').then(res => {
      const fromApi = res.data;
      const ordered = CAT_ORDER.filter(c => fromApi.includes(c));
      const rest = fromApi.filter(c => !CAT_ORDER.includes(c));
      setCategories(['Semua', ...ordered, ...rest]);
    }).catch(() => {});
  }, []);

  const handleCatChange = (c) => { setCat(c); setSortMode('default'); };
  const handleNearest = () => {
    if (sortMode === 'nearest') { setSortMode('default'); return; }
    if (userCoords) { setSortMode('nearest'); return; }
    setGeoLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setSortMode('nearest'); setGeoLoading(false); },
      () => { alert('Izin lokasi ditolak.'); setGeoLoading(false); }
    );
  };

  const thumbEl = (d) => {
    if (d.photo_full_url) return <img src={d.photo_full_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    const bg = d.gradient || (d.color ? `linear-gradient(135deg,${d.color},${d.color}cc)` : 'linear-gradient(135deg,#3498db,#2980b9)');
    return <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{d.emoji || getCatIcon(d.category)}</div>;
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
    if (userCoords && d.lat && d.lng) return hitungJarak(userCoords.lat, userCoords.lng, d.lat, d.lng).toFixed(1) + ' km';
    return null;
  };

  const listHtml = (d) => {
    const jarak = getJarak(d);
    return (
      <div key={d.id} className="list-item" onClick={() => navigate('/destination/' + d.id)}>
        <div className="list-thumb" style={{ overflow: 'hidden', borderRadius: 'var(--r-sm)' }}>
          {d.photo_full_url
            ? <img src={d.photo_full_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
            : <div style={{ width: '100%', height: '100%', background: d.gradient || 'linear-gradient(135deg,#3498db,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, borderRadius: 'var(--r-sm)' }}>{d.emoji || getCatIcon(d.category)}</div>
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
    // Map view
    if (viewMode === 'map') {
      if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>⏳ Memuat peta...</div>;
      return <DestinationsMap destinations={destinations} onSelectDest={(id) => navigate('/destination/' + id)} />;
    }

    if (loading) {
      if (cat === 'Semua') return <div className="cards-grid">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
      return <>{Array.from({ length: 6 }).map((_, i) => <SkeletonList key={i} />)}</>;
    }
    if (destinations.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
        <p>Tidak ada destinasi pada kategori ini.</p>
      </div>
    );

    if (viewMode === 'list' || cat !== 'Semua') {
      return (
        <>
          {cat !== 'Semua' && (
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 14 }}>
              <strong style={{ color: 'var(--text)' }}>{getCatIcon(cat)} {cat}</strong>
              {' — '}
              {sortMode === 'nearest' && '📍 Terdekat · '}
              {sortMode === 'popular' && '🔥 Terpopuler · '}
              {destinations.length} destinasi
            </div>
          )}
          {destinations.map(listHtml)}
        </>
      );
    }

    // card / default Semua
    const catOrder  = CAT_ORDER.filter(c => destinations.some(d => d.category === c));
    const otherCats = [...new Set(destinations.map(d => d.category))].filter(c => !CAT_ORDER.includes(c));
    return [...catOrder, ...otherCats].map(c => {
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
  };

  const showSortBar = cat !== 'Semua';

  return (
    <div>
      {/* HERO BANNER */}
      <div style={{ display: 'flex', height: 420, overflow: 'hidden', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ flexShrink: 0, width: 380, background: '#ffffff', padding: '0 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Wisata Kota Malang · Jawa Timur</div>
          <h1 style={{ margin: 0, lineHeight: 1.05, fontWeight: 900, color: '#111', fontSize: 42, letterSpacing: '-1px' }}>
            EKSPLOR<br /><span style={{ color: '#f5a623' }}>KOTA MALANG</span>
          </h1>
          <p style={{ margin: '18px 0 0', fontSize: 14, color: '#666', lineHeight: 1.75 }}>
            Temukan Destinasi Terbaik di Kota Malang — dari taman kota yang asri hingga kampung budaya yang memukau.
          </p>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <img src={tuguImg} alt="Tugu Malang" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff 0%, transparent 12%)' }} />
          <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            📍 Tugu Malang
          </div>
        </div>
      </div>

      {/* KATEGORI */}
      <div className="cat-section" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)' }}>
        <div className="cat-inner">
          {categories.map(c => (
            <button key={c} className={'cat-btn' + (cat === c ? ' active' : '')} onClick={() => handleCatChange(c)}>
              <span>{getCatIcon(c)}</span> {c}
            </button>
          ))}
        </div>
      </div>

      {/* SORT + VIEW MODE BAR */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '8px 20px', position: 'sticky', top: 44, zIndex: 99 }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {/* Sort buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {showSortBar && (
              <>
                <button className={'sort-btn' + (sortMode === 'default' ? ' active' : '')} onClick={() => setSortMode('default')}>Semua</button>
                <button className={'sort-btn' + (sortMode === 'nearest' ? ' active' : '')} onClick={handleNearest} disabled={geoLoading}>
                  {geoLoading ? '📍...' : '📍 Terdekat'}
                </button>
              </>
            )}
            <button className={'sort-btn' + (sortMode === 'popular' ? ' active' : '')} onClick={() => setSortMode(sortMode === 'popular' ? 'default' : 'popular')}>
              🔥 Terpopuler
            </button>
          </div>

          {/* View mode toggle */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 8, padding: 3 }}>
            {[['card', '⊞'], ['list', '☰'], ['map', '🗺️']].map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={mode === 'card' ? 'Tampilan Grid' : mode === 'list' ? 'Tampilan List' : 'Tampilan Peta'}
                style={{
                  padding: '4px 10px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14,
                  background: viewMode === mode ? 'var(--white)' : 'transparent',
                  boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all .2s',
                }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="content">{renderContent()}</div>
    </div>
  );
}