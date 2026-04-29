import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Detail() {
  const { id }                  = useParams();
  const navigate                = useNavigate();
  const { favs, toggleFav, comments, fetchComments, requireLogin } = useApp();
  const [d, setD]               = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/destinations/${id}`)
      .then(res => setD(res.data))
      .catch(() => setD(null))
      .finally(() => setLoading(false));
    fetchComments(id);
  }, [id]);

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

  return (
    <div>
      <Topbar />
      <div className="content">
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
              <div className="detail-meta-item">🗺️ {d.distance} dari lokasimu</div>
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
              {[
                ['Alamat',         d.address],
                ['Contact Person', d.contact],
                ['Jam Operasional', d.open_hours],
                ['HTM',            d.ticket_price, 'price'],
                ['Sosial Media',   d.social_media],
              ].map(([label, val, cls]) => (
                <div key={label} className="info-row">
                  <div className="info-label">{label}</div>
                  <div className={'info-val' + (cls ? ' ' + cls : '')} style={{ fontSize: 12 }}>{val || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
