import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Detail() {
  const { id }                  = useParams();
  const navigate                = useNavigate();
  const { favs, toggleFav, comments, fetchComments, requireLogin, userCoords, hitungJarak } = useApp();
  const [d, setD]               = useState(null);
  const [loading, setLoading]   = useState(true);
  const [shareToast, setShareToast] = useState(false);

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
    const shareData = {
      title: d?.name || 'GasNgalam - Wisata Malang',
      text:  `Lihat destinasi wisata ${d?.name} di GasNgalam!`,
      url:   shareUrl,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    }
  };

  if (loading) return (
    <div><Topbar />
      <div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 32 }}>⏳</div><p>Memuat...</p>
      </div>
    </div>
  );

  if (!d) return (
    <div><Topbar />
      <div className="content"><p>Destinasi tidak ditemukan.</p></div>
    </div>
  );

  const fav          = favs.has(d.id);
  const destComments = comments[d.id] || [];
  const stars        = (r) => [1, 2, 3, 4, 5].map(s =>
    <span key={s} className={'star-s' + (r >= s ? '' : ' empty')}>★</span>
  );

  const gradForColor = () => {
    if (d.gradient) return d.gradient;
    if (d.color) return `linear-gradient(135deg, ${d.color}, ${d.color}cc)`;
    return 'linear-gradient(135deg,#3498db,#2980b9)';
  };

  const jarakKm = (userCoords && d.lat && d.lng)
    ? hitungJarak(userCoords.lat, userCoords.lng, d.lat, d.lng).toFixed(1) + ' km'
    : d.distance || '-';

  const getMapsUrl = (address) => {
    if (!address || address === '-') return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const mapsUrl = getMapsUrl(d.address);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar />
      <div className="content" style={{ flex: 1 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>
        <div className="detail-hero" style={{ background: gradForColor() }}>
          <div className="detail-hero-emoji">{d.emoji || '📍'}</div>
          <div className="detail-hero-overlay"></div>
        </div>
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
              <button className="btn-action" onClick={() => {
                if (requireLogin('Anda perlu login untuk mengajukan klaim bisnis.')) navigate('/klaim/' + d.id);
              }}>📋 Ajukan Klaim Bisnis</button>

              {/* ── SHARE BUTTON ── */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <button
                  className="btn-action"
                  onClick={handleShare}
                  title="Bagikan destinasi ini"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="18" cy="5"  r="3"/>
                    <circle cx="6"  cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
                  </svg>
                  Bagikan
                </button>
                {shareToast && (
                  <div style={{
                    position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--text)', color: '#fff',
                    fontSize: 11.5, fontWeight: 500,
                    padding: '5px 12px', borderRadius: 99,
                    whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)',
                    pointerEvents: 'none',
                  }}>
                    ✓ Link disalin!
                  </div>
                )}
              </div>
            </div>
            <div className="rating-wrap">
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div className="rating-big-num">{d.rating}</div>
                  <div className="star-display">{stars(d.rating)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 3 }}>{d.review_count} ulasan</div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  {[5, 4, 3].map(s => (
                    <div key={s} className="bar-row">
                      <span>★{s}</span>
                      <div className="bar-track"><div className="bar-fill" style={{ width: (s === 5 ? 70 : s === 4 ? 20 : 10) + '%' }}></div></div>
                      <span style={{ width: 26, textAlign: 'right', fontSize: 11 }}>{s === 5 ? 70 : s === 4 ? 20 : 10}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="info-card">
              <div className="info-card-title">Info Destinasi</div>
              <div className="info-row">
                <div className="info-label">Alamat</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div className="info-val" style={{ fontSize: 12, flex: 1 }}>{d.address || '-'}</div>
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="maps-btn" title="Lihat di Google Maps">
                      📍 Maps
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}