import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const CAT_ICONS = {
  'Wisata Budaya': '🏛️', 'Taman Kota': '🌳', 'Wisata Edukasi': '📚',
  'Kuliner Legendaris': '🍜', 'Wisata Hiburan': '✨', 'Wisata Alam': '🏞️',
  'Kuliner & Belanja': '🛒',
};

export default function Search() {
  const [params]                      = useSearchParams();
  const navigate                      = useNavigate();
  const { favs, toggleFav }           = useApp();
  const q                             = params.get('q') || '';
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [categories, setCategories]   = useState([]);

  // Filter state
  const [filterCat,     setFilterCat]     = useState('');
  const [filterFree,    setFilterFree]    = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [sortBy,        setSortBy]        = useState('rating');

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!q.trim() && !filterCat && !filterFree && !filterOpenNow) { setResults([]); return; }
    setLoading(true);
    const p = { sort: sortBy, dir: 'desc' };
    if (q.trim())     p.q        = q;
    if (filterCat)    p.category = filterCat;
    if (filterFree)   p.free     = '1';
    if (filterOpenNow) p.open_now = '1';
    api.get('/destinations', { params: p })
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q, filterCat, filterFree, filterOpenNow, sortBy]);

  const resetFilters = () => {
    setFilterCat(''); setFilterFree(false); setFilterOpenNow(false); setSortBy('rating');
  };
  const hasFilter = filterCat || filterFree || filterOpenNow;

  const thumbEl = (d) => {
    if (d.photo_full_url) return <img src={d.photo_full_url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />;
    const bg = d.gradient || (d.color ? `linear-gradient(135deg,${d.color},${d.color}cc)` : 'linear-gradient(135deg,#3498db,#2980b9)');
    return <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, borderRadius: 'var(--r-sm)' }}>{d.emoji || CAT_ICONS[d.category] || '📍'}</div>;
  };

  return (
    <div>
      <div className="content" style={{ paddingTop: 16 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>
        <div className="search-heading">Hasil Pencarian</div>
        <div className="search-sub">
          {loading ? 'Mencari...' : q
            ? `Menampilkan ${results.length} hasil untuk "${q}"`
            : `${results.length} destinasi ditemukan`
          }
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* ── Sidebar Filter ── */}
          <div style={{
            width: 200, flexShrink: 0,
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 12px',
            position: 'sticky', top: 70,
          }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>🎛️ Filter</div>

            {/* Sort */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Urutkan</div>
              {[['rating', '⭐ Rating Tertinggi'], ['review_count', '🔥 Terpopuler'], ['name', '🔤 A-Z']].map(([val, label]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer', marginBottom: 4 }}>
                  <input type="radio" name="sort" value={val} checked={sortBy === val} onChange={() => setSortBy(val)} />
                  {label}
                </label>
              ))}
            </div>

            {/* Kategori */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Kategori</div>
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text)', background: 'var(--white)' }}
              >
                <option value="">Semua Kategori</option>
                {categories.map(c => <option key={c} value={c}>{CAT_ICONS[c] || '📍'} {c}</option>)}
              </select>
            </div>

            {/* Harga */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Harga Tiket</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={filterFree} onChange={e => setFilterFree(e.target.checked)} />
                🎫 Gratis / Bebas
              </label>
            </div>

            {/* Jam Buka */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Jam Operasional</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={filterOpenNow} onChange={e => setFilterOpenNow(e.target.checked)} />
                🕐 Memiliki Info Jam
              </label>
            </div>

            {hasFilter && (
              <button onClick={resetFilters} style={{ width: '100%', padding: '6px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                ✕ Reset Filter
              </button>
            )}
          </div>

          {/* ── Hasil ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: 32 }}>⏳</div><p>Mencari destinasi...</p>
              </div>
            ) : (!q.trim() && !filterCat && !filterFree && !filterOpenNow) ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                <p>Ketik kata kunci di search bar atau gunakan filter untuk mencari destinasi.</p>
              </div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                <p>Destinasi wisata tidak ditemukan.<br />Coba kata kunci atau filter lain.</p>
              </div>
            ) : results.map(d => (
              <div key={d.id} className="list-item" onClick={() => navigate('/destination/' + d.id)}>
                <div className="list-thumb" style={{ overflow: 'hidden', borderRadius: 'var(--r-sm)' }}>
                  {thumbEl(d)}
                </div>
                <div className="list-info">
                  <div className="list-name">{d.name}</div>
                  <div className="list-loc">📍 {d.location}</div>
                  <div className="list-meta">
                    <div className="list-rating">★ {d.rating} ({d.review_count})</div>
                    <div className="list-cat">{CAT_ICONS[d.category] || '📍'} {d.category}</div>
                  </div>
                  {d.ticket_price && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>🎫 {d.ticket_price}</div>
                  )}
                  {d.open_hours && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>🕐 {d.open_hours}</div>
                  )}
                </div>
                <div className="list-right">
                  {d.distance && <div style={{ fontSize: 11, color: 'var(--text4)' }}>{d.distance} 🗺️</div>}
                  <button className="fav-list-btn" onClick={e => { e.stopPropagation(); toggleFav(d.id); }}>
                    {favs.has(d.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}