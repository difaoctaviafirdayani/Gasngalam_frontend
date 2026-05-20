import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export default function AdminDetailWisata() {
  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const { comments, fetchComments } = useApp();

  const [d, setD]           = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/destinations/${id}`)
      .then(res => setD(res.data))
      .catch(() => setD(null))
      .finally(() => setLoading(false));
    fetchComments(id);
  }, [id]);

  const destComments = comments[id] || [];

  const stars = (r) => [1,2,3,4,5].map(s => (
    <span key={s} style={{ color: r >= s ? '#f5a623' : '#ddd', fontSize: 18 }}>★</span>
  ));

  const mapsUrl = d?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`
    : null;

  return (
    <AdminLayout active="Kelola Ulasan">
      <button
        onClick={() => navigate('/admin/ulasan')}
        style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 16px', cursor: 'pointer',
          fontSize: 13, color: 'var(--text2)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← Kembali ke Kelola Ulasan
      </button>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          Memuat data destinasi...
        </div>
      )}

      {!loading && !d && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          Destinasi tidak ditemukan.
        </div>
      )}

      {!loading && d && (
        // grid dua kolom: kiri (konten utama) | kanan (info card)
        // persis seperti layout Detail.jsx user
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>

          {/* ── KOLOM KIRI ── */}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
              {d.name}
            </h1>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, fontSize: 13, color: 'var(--text3)', alignItems: 'center' }}>
              <span>📍 {d.location}</span>
              <span style={{ color: '#f5a623', fontWeight: 700 }}>
                ★ {d.rating}
                <span style={{ fontWeight: 400, color: 'var(--text3)' }}> ({d.review_count} ulasan)</span>
              </span>
              <span style={{ background: 'var(--bg2)', padding: '3px 12px', borderRadius: 99, fontSize: 12 }}>
                {d.category}
              </span>
            </div>

            {d.description && (
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20 }}>
                {d.description}
              </p>
            )}

            {/* Rating summary — identik dengan Detail.jsx */}
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
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: (s === 5 ? 70 : s === 4 ? 20 : 10) + '%' }}></div>
                      </div>
                      <span style={{ width: 26, textAlign: 'right', fontSize: 11 }}>
                        {s === 5 ? 70 : s === 4 ? 20 : 10}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Semua komentar — identik dengan Detail.jsx */}
            {destComments.length > 0 && (
              <div style={{ marginTop: 14 }}>
                {destComments.map((c, i) => (
                  <div key={i} className="comment-item">
                    <div className="comment-head">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="comment-avatar">{(c.user || 'A')[0]}</div>
                        <div>
                          <span className="comment-author">{c.user}</span>
                          <span className="comment-time"> · {c.time}</span>
                        </div>
                      </div>
                      <div className="comment-rating">★ {c.rating}</div>
                    </div>
                    <div className="comment-text">{c.text}</div>
                    {c.photo_full_url && (
                      <img
                        src={c.photo_full_url}
                        alt="Foto ulasan"
                        onError={e => { e.target.style.display = 'none'; }}
                        style={{
                          marginTop: 10, maxWidth: 260, maxHeight: 200,
                          borderRadius: 8, objectFit: 'cover',
                          border: '1px solid var(--border)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {destComments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text4)', fontSize: 13 }}>
                Belum ada ulasan untuk destinasi ini.
              </div>
            )}
          </div>

          {/* ── KOLOM KANAN: Info Card — identik dengan Detail.jsx ── */}
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
              ].map(item => (
                <div key={item.label} className="info-row">
                  <div className="info-label">{item.label}</div>
                  <div className={'info-val' + (item.cls ? ' ' + item.cls : '')} style={{ fontSize: 12 }}>
                    {item.val || '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
}