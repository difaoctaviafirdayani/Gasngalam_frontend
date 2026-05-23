import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import api from '../services/api';

// Lazy-load Leaflet hanya jika dibutuhkan
function LeafletMap({ lat, lng, name }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng || !mapRef.current) return;
    // Inject Leaflet CSS jika belum ada
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id   = 'leaflet-css';
      link.rel  = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeaflet = async () => {
      if (mapInstanceRef.current) return; // sudah diinit
      // Dynamically import Leaflet
      const L = (await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js')).default || window.L;

      // Fallback: load via script tag
      if (!L) {
        await new Promise(resolve => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          s.onload = resolve;
          document.head.appendChild(s);
        });
        initMap(window.L);
      } else {
        initMap(L);
      }
    };

    const initMap = (L) => {
      if (mapInstanceRef.current) return;
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${name}</b>`)
        .openPopup();
      mapInstanceRef.current = map;
    };

    loadLeaflet().catch(() => {
      // Fallback: load script tag
      if (!window.L) {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = () => {
          if (!mapInstanceRef.current && mapRef.current) {
            const L = window.L;
            const map = L.map(mapRef.current).setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap',
            }).addTo(map);
            L.marker([lat, lng]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
            mapInstanceRef.current = map;
          }
        };
        document.head.appendChild(s);
      } else if (!mapInstanceRef.current && mapRef.current) {
        const L = window.L;
        const map = L.map(mapRef.current).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
        mapInstanceRef.current = map;
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: 280, borderRadius: 10, border: '1.5px solid var(--border)', zIndex: 1 }} />
  );
}

// Komponen Carousel Galeri
function PhotoCarousel({ photos, mainPhoto, name }) {
  const allPhotos = [
    ...(mainPhoto ? [{ url: mainPhoto, caption: name }] : []),
    ...(photos || []),
  ];

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (allPhotos.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + allPhotos.length) % allPhotos.length);
  const next = () => setCurrent(i => (i + 1) % allPhotos.length);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 20, background: '#000' }}>
      {/* Main Image */}
      <div style={{ position: 'relative', height: 280 }}>
        <img
          src={allPhotos[current].url}
          alt={allPhotos[current].caption || name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
          onClick={() => setLightbox(true)}
        />
        {allPhotos.length > 1 && (
          <>
            <button onClick={prev} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <button onClick={next} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
              {allPhotos.map((_, i) => (
                <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 99, background: i === current ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all .2s' }} />
              ))}
            </div>
          </>
        )}
        {allPhotos[current].caption && allPhotos[current].caption !== name && (
          <div style={{ position: 'absolute', bottom: 28, left: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11.5, padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
            {allPhotos[current].caption}
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, padding: '2px 7px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
          {current + 1} / {allPhotos.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {allPhotos.length > 1 && (
        <div style={{ display: 'flex', gap: 4, padding: '6px 8px', background: '#111', overflowX: 'auto' }}>
          {allPhotos.map((p, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{
              width: 52, height: 40, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
              border: i === current ? '2px solid var(--brand)' : '2px solid transparent', transition: 'border .2s',
            }}>
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={allPhotos[current].url} alt="" style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox(false); }} style={{ position: 'fixed', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}
    </div>
  );
}

export default function Detail() {
  const { id }                  = useParams();
  const navigate                = useNavigate();
  const { favs, toggleFav, comments, fetchComments, requireLogin, userCoords, hitungJarak } = useApp();
  const [d, setD]               = useState(null);
  const [loading, setLoading]   = useState(true);
  const [shareToast, setShareToast] = useState(false);
  const [infoTab, setInfoTab]   = useState('info'); // 'info' | 'map'
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/destinations/${id}`)
      .then(res => setD(res.data))
      .catch(() => setD(null))
      .finally(() => setLoading(false));
    fetchComments(id);
  }, [id]);

  const handleShare = async () => {
    const shareUrl  = window.location.href;
    const shareData = { title: d?.name || 'GasNgalam', text: `Lihat destinasi wisata ${d?.name} di GasNgalam!`, url: shareUrl };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareUrl); } catch {
        const ta = document.createElement('textarea');
        ta.value = shareUrl; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      setShareToast(true); setTimeout(() => setShareToast(false), 2200);
    }
  };

  const handleExportPdf = async () => {
    if (!d) return;
    setExportingPdf(true);
    // Buat window baru dengan konten yang bersih untuk print
    const printContent = `
<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>${d.name} - GasNgalam</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 32px; color: #222; }
  h1 { font-size: 26px; margin-bottom: 4px; }
  .badge { display: inline-block; background: #f0f0f0; border-radius: 99px; padding: 2px 10px; font-size: 12px; margin-bottom: 16px; }
  .rating { font-size: 20px; color: #f5a623; font-weight: 700; }
  .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  .info-table td { padding: 9px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
  .info-table td:first-child { font-weight: 700; color: #555; width: 160px; }
  .desc { font-size: 14px; line-height: 1.7; margin: 16px 0; color: #444; }
  .footer { margin-top: 32px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
  img.hero { width: 100%; max-height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 18px; }
  @media print { button { display: none !important; } }
</style>
</head><body>
${d.photo_full_url ? `<img class="hero" src="${d.photo_full_url}" alt="${d.name}" />` : ''}
<h1>${d.name}</h1>
<span class="badge">${d.category}</span>
<div class="rating">★ ${d.rating} <span style="font-size:14px;color:#666;font-weight:400">(${d.review_count} ulasan)</span></div>
<p class="desc">${d.description || ''}</p>
<table class="info-table">
  <tr><td>📍 Lokasi</td><td>${d.location || '-'}</td></tr>
  <tr><td>🏠 Alamat</td><td>${d.address || '-'}</td></tr>
  <tr><td>🎫 Harga Tiket</td><td>${d.ticket_price || '-'}</td></tr>
  <tr><td>🕐 Jam Operasional</td><td>${d.open_hours || '-'}</td></tr>
  <tr><td>📞 Contact</td><td>${d.contact || '-'}</td></tr>
  <tr><td>📱 Sosial Media</td><td>${d.social_media || '-'}</td></tr>
  ${d.lat && d.lng ? `<tr><td>🗺️ Koordinat</td><td>${d.lat}, ${d.lng}</td></tr>` : ''}
</table>
<div class="footer">
  Diunduh dari GasNgalam — Wisata Kota Malang · ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
</div>
<script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }</script>
</body></html>`;
    const win = window.open('', '_blank');
    win.document.write(printContent);
    win.document.close();
    setExportingPdf(false);
  };

  if (loading) return (
    <div><div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div style={{ fontSize: 32 }}>⏳</div><p>Memuat...</p>
    </div></div>
  );

  if (!d) return (
    <div><div className="content"><p>Destinasi tidak ditemukan.</p></div></div>
  );

  const fav          = favs.has(d.id);
  const destComments = comments[d.id] || [];
  const stars        = (r) => [1,2,3,4,5].map(s => <span key={s} className={'star-s' + (r >= s ? '' : ' empty')}>★</span>);
  const jarakKm      = (userCoords && d.lat && d.lng)
    ? hitungJarak(userCoords.lat, userCoords.lng, d.lat, d.lng).toFixed(1) + ' km'
    : d.distance || '-';
  const gradForColor = () => d.gradient || (d.color ? `linear-gradient(135deg,${d.color},${d.color}cc)` : 'linear-gradient(135deg,#3498db,#2980b9)');
  const mapsUrl = d.address && d.address !== '-' ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}` : null;

  // Gabungkan foto utama + galeri
  const gallery = d.gallery || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="content" style={{ flex: 1 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>

        {/* Galeri Carousel (jika ada foto) atau Hero lama */}
        {(d.photo_full_url || gallery.length > 0) ? (
          <PhotoCarousel photos={gallery} mainPhoto={d.photo_full_url} name={d.name} />
        ) : (
          <div className="detail-hero" style={{ background: gradForColor() }}>
            <div className="detail-hero-emoji">{d.emoji || '📍'}</div>
            <div className="detail-hero-overlay"></div>
          </div>
        )}

        <div className="detail-grid">
          <div>
            <h1 className="detail-title">{d.name}</h1>
            <div className="detail-meta-row">
              <div className="detail-meta-item" style={{ color: 'var(--red)' }}>📍 {d.location}</div>
              <div className="detail-meta-item" style={{ color: 'var(--gold)', fontWeight: 700 }}>
                ★ {d.rating} <span style={{ fontWeight: 400, color: 'var(--text3)' }}>({d.review_count} ulasan)</span>
              </div>
              <div className="detail-meta-item">🗺️ {jarakKm} dari lokasimu</div>
              <div style={{ background: 'var(--bg)', padding: '3px 10px', borderRadius: 99, fontSize: 11.5, color: 'var(--text2)', fontWeight: 500, border: '1px solid var(--border)' }}>
                {d.category}
              </div>
            </div>
            <p className="detail-desc">{d.description}</p>

            <div className="detail-actions">
              <button className={'btn-fav' + (fav ? ' active' : '')} onClick={() => toggleFav(d.id)}>
                {fav ? '❤️ Tersimpan' : '🤍 Simpan'}
              </button>
              <button className="btn-action" onClick={() => navigate('/destination/' + d.id + '/rating')}>💬 Rating dan Komentar</button>
              <button className="btn-action" onClick={() => { if (requireLogin('Anda perlu login untuk mengajukan klaim bisnis.')) navigate('/klaim/' + d.id); }}>📋 Ajukan Klaim Bisnis</button>

        

              {/* Share */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <button className="btn-action" onClick={handleShare} title="Bagikan destinasi ini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Bagikan
                </button>
                {shareToast && (
                  <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: '#fff', fontSize: 11.5, fontWeight: 500, padding: '5px 12px', borderRadius: 99, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)', pointerEvents: 'none' }}>
                    ✓ Link disalin!
                  </div>
                )}
              </div>
            </div>

            {/* Rating Summary */}
            <div className="rating-wrap">
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div className="rating-big-num">{d.rating}</div>
                  <div className="star-display">{stars(d.rating)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 3 }}>{d.review_count} ulasan</div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  {[5,4,3].map(s => (
                    <div key={s} className="bar-row">
                      <span>★{s}</span>
                      <div className="bar-track"><div className="bar-fill" style={{ width: (s===5?70:s===4?20:10)+'%' }}></div></div>
                      <span style={{ width: 26, textAlign: 'right', fontSize: 11 }}>{s===5?70:s===4?20:10}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Komentar */}
            {destComments.length > 0 && (
              <div style={{ marginTop: 14 }}>
                {destComments.slice(0, 3).map((c, i) => (
                  <div key={i} className="comment-item">
                    <div className="comment-head">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="comment-avatar">{c.user[0]}</div>
                        <div><span className="comment-author">{c.user}</span> <span className="comment-time">· {c.time}</span></div>
                      </div>
                      <div className="comment-rating">★ {c.rating}</div>
                    </div>
                    <div className="comment-text">{c.text}</div>
                    {c.photo_full_url && (
                      <img src={c.photo_full_url} alt="Foto ulasan" style={{ marginTop: 10, maxWidth: 260, maxHeight: 200, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Info + Peta */}
          <div>
            {/* Tab Info / Peta */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              {[['info', '📋 Info'], ['map', '🗺️ Peta']].map(([key, label]) => (
                <button key={key} onClick={() => setInfoTab(key)} style={{
                  flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: infoTab === key ? '2px solid var(--brand)' : '2px solid transparent',
                  color: infoTab === key ? 'var(--brand)' : 'var(--text3)',
                }}>{label}</button>
              ))}
            </div>

            {/* Tab: Info Destinasi */}
            {infoTab === 'info' && (
              <div className="info-card" style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <div className="info-card-title">Info Destinasi</div>
                <div className="info-row">
                  <div className="info-label">Alamat</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <div className="info-val" style={{ fontSize: 12 }}>{d.address || '-'}</div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border)', background: '#e8f0fe', height: 80, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#4285F4' }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(66,133,244,0.25)'}
                          onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          Buka di Google Maps
                        </div>
                      </a>
                    )}
                  </div>
                </div>
                {[
                  { label: 'Contact Person',  val: d.contact },
                  { label: 'Jam Operasional', val: d.open_hours },
                  { label: 'HTM',             val: d.ticket_price, cls: 'price' },
                  { label: 'Sosial Media',    val: d.social_media },
                ].map((item) => (
                  <div key={item.label} className="info-row">
                    <div className="info-label">{item.label}</div>
                    <div className={'info-val' + (item.cls ? ' ' + item.cls : '')} style={{ fontSize: 12 }}>{item.val || '-'}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Peta Interaktif Leaflet */}
            {infoTab === 'map' && (
              <div style={{ padding: '14px 0' }}>
                {d.lat && d.lng ? (
                  <>
                    <LeafletMap lat={d.lat} lng={d.lng} name={d.name} />
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
                      📌 {d.name} · {d.lat.toFixed(5)}, {d.lng.toFixed(5)}
                    </div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8, textAlign: 'center', color: 'var(--brand)', fontSize: 12, fontWeight: 600 }}>
                        Buka di Google Maps ↗
                      </a>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
                    <p style={{ fontSize: 13 }}>Koordinat destinasi ini belum tersedia.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}