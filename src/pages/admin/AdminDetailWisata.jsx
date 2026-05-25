import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

import { FiArrowLeft, FiMapPin, FiPhone, FiClock, FiTag, FiInstagram, FiImage } from 'react-icons/fi';
import { FaMapMarkedAlt, FaStar, FaRegStar } from 'react-icons/fa';

export default function AdminDetailWisata() {
  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const { comments, fetchComments } = useApp();

  const [d, setD]             = useState(null);
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

  const stars = (r) =>
    [1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: r >= s ? '#f5a623' : '#ddd', fontSize: 18, display: 'inline-flex' }}>
        {r >= s ? <FaStar /> : <FaRegStar />}
      </span>
    ));

  const mapsUrl = d?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`
    : null;

  return (
    <AdminLayout active="Kelola Ulasan">

      {/* ── TOPBAR BACK BUTTON ── */}
      <button
        onClick={() => navigate('/admin/ulasan')}
        style={{
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '6px 16px',
          cursor: 'pointer',
          fontSize: 13,
          color: 'var(--text2)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <FiArrowLeft size={14} /> Kembali ke Kelola Ulasan
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
        <div>

          {/* ── HERO BANNER ── */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 280,
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 24,
            background: d.photo_url
              ? 'transparent'
              : 'linear-gradient(135deg, #3b1fa8 0%, #6b35d9 50%, #9b59d9 100%)',
          }}>
            {d.photo_url ? (
              <img
                src={d.photo_url}
                alt={d.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10, color: 'rgba(255,255,255,0.4)',
              }}>
                <FiImage size={52} />
                <span style={{ fontSize: 13 }}>Belum ada foto utama</span>
              </div>
            )}

            {/* Overlay gradient bawah supaya badge terbaca */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />

            {/* Badge kategori */}
            {d.category && (
              <span style={{
                position: 'absolute', top: 16, left: 16,
                background: '#e8a020', color: '#fff',
                fontSize: 12, padding: '4px 14px',
                borderRadius: 999, fontWeight: 500,
              }}>
                {d.category}
              </span>
            )}
          </div>

          {/* ── GRID DUA KOLOM ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 28,
            alignItems: 'start',
          }}>

            {/* ── KOLOM KIRI ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Judul & meta */}
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '20px 24px',
              }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                  {d.name}
                </h1>
                <div style={{
                  display: 'flex', gap: 16, flexWrap: 'wrap',
                  marginBottom: 14, fontSize: 13,
                  color: 'var(--text3)', alignItems: 'center',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <FiMapPin size={13} /> {d.location}
                  </span>
                  <span style={{ color: '#f5a623', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <FaStar size={13} /> {d.rating}
                    <span style={{ fontWeight: 400, color: 'var(--text3)' }}>
                      {' '}({d.review_count} ulasan)
                    </span>
                  </span>
                  <span style={{
                    background: 'var(--bg2)', padding: '3px 12px',
                    borderRadius: 99, fontSize: 12,
                  }}>
                    {d.category}
                  </span>
                </div>
                {d.description && (
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>
                    {d.description}
                  </p>
                )}
              </div>

              {/* Rating summary */}
              <div className="rating-wrap">
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div className="rating-big-num">{d.rating}</div>
                    <div className="star-display">{stars(d.rating)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 3 }}>
                      {d.review_count} ulasan
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    {[5, 4, 3].map(s => (
                      <div key={s} className="bar-row">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          <FaStar size={11} color="#f5a623" />{s}
                        </span>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: (s === 5 ? 70 : s === 4 ? 20 : 10) + '%' }}
                          />
                        </div>
                        <span style={{ width: 26, textAlign: 'right', fontSize: 11 }}>
                          {s === 5 ? 70 : s === 4 ? 20 : 10}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daftar komentar */}
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '20px 24px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                  Ulasan Pengguna
                </div>

                {destComments.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '30px 0',
                    color: 'var(--text4)', fontSize: 13,
                  }}>
                    Belum ada ulasan untuk destinasi ini.
                  </div>
                )}

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
                      <div className="comment-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FaStar size={12} color="#f5a623" /> {c.rating}
                      </div>
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
            </div>

            {/* ── KOLOM KANAN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>

              {/* Info Card */}
              <div className="info-card">
                <div className="info-card-title">Info Destinasi</div>

                {/* Alamat + mini map */}
                <div className="info-row">
                  <div className="info-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <FiMapPin size={13} /> Alamat
                  </div>
                  <div className="info-val" style={{ fontSize: 12 }}>{d.address || '-'}</div>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        marginTop: 10,
                        height: 120,
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: 'var(--bg2)',
                        color: 'var(--text3)',
                        fontSize: 12,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
                    >
                      <FaMapMarkedAlt size={28} />
                      <span>Klik untuk lihat di Google Maps</span>
                    </a>
                  )}
                </div>

                {/* Baris info lainnya */}
                {[
                  { label: 'Contact Person',  val: d.contact,       icon: <FiPhone size={13} /> },
                  { label: 'Jam Operasional', val: d.open_hours,    icon: <FiClock size={13} /> },
                  { label: 'HTM',             val: d.ticket_price,  icon: <FiTag size={13} />,  cls: 'price' },
                  { label: 'Sosial Media',    val: d.social_media,  icon: <FiInstagram size={13} /> },
                ].map(item => (
                  <div key={item.label} className="info-row">
                    <div className="info-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      {item.icon} {item.label}
                    </div>
                    <div className={`info-val${item.cls ? ' ' + item.cls : ''}`} style={{ fontSize: 12 }}>
                      {item.val || '-'}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}