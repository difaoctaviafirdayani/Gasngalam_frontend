import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { FaArrowLeft, FaFlag, FaCheck, FaCamera, FaSpinner, FaCommentAlt, FaTimes } from 'react-icons/fa';

export default function Rating() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user, comments, addComment, fetchComments, requireLogin, showToast } = useApp();
  const [d, setD]               = useState(null);
  const [star, setStar]         = useState(0);
  const [text, setText]         = useState('');
  const [photo, setPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [reported, setReported] = useState(new Set());
  const fileRef = useRef();

  useEffect(() => {
    api.get(`/destinations/${id}`)
      .then(res => setD(res.data))
      .catch(() => setD(null));
    fetchComments(id);
  }, [id]);

  if (!d) return (
    <div>
      <div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
        <FaSpinner style={{ fontSize: 32, animation: 'spin 1s linear infinite' }} />
        <p>Memuat...</p>
      </div>
    </div>
  );

  const destComments = comments[d.id] || [];

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP'); return;
    }
    if (f.size > 5 * 1024 * 1024) { showToast('Ukuran foto maksimal 5MB'); return; }
    setPhoto(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async () => {
    if (!requireLogin('Anda perlu login untuk memberikan ulasan.')) return;
    if (star === 0 || !text.trim()) {
      showToast('Pilih rating bintang dan tulis komentar terlebih dahulu');
      return;
    }
    setLoading(true);
    await addComment(d.id, { rating: star, text: text.trim(), photo });
    setStar(0); setText(''); setPhoto(null); setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
    setLoading(false);
  };

  const handleReport = async (reviewId) => {
    if (!requireLogin('Login dulu untuk melaporkan ulasan.')) return;
    if (reported.has(reviewId)) { showToast('Sudah dilaporkan sebelumnya'); return; }
    try {
      await api.post(`/reviews/${reviewId}/report`);
      setReported(prev => new Set([...prev, reviewId]));
      showToast('Ulasan berhasil dilaporkan. Admin akan meninjau.');
    } catch (err) {
      showToast(err.message || 'Gagal melaporkan ulasan');
    }
  };

  const stars = (r) => [1, 2, 3, 4, 5].map(s =>
    <span key={s} className={'star-s' + (r >= s ? '' : ' empty')}>★</span>
  );

  const distrib = [5, 4, 3, 2, 1].map(s => {
    const cnt = destComments.filter(c => c.rating === s).length;
    const pct = destComments.length > 0 ? Math.round((cnt / destComments.length) * 100) : 0;
    return { s, cnt, pct };
  });

  return (
    <div>
      <div className="content" style={{ paddingBottom: 220 }}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Kembali
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Rating dan Komentar</h2>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>{d.name}</p>

          {/* Ringkasan Rating */}
          <div className="rating-wrap">
            <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div className="rating-big-num">{d.rating || '–'}</div>
                <div className="star-display">{stars(d.rating)}</div>
                <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 3 }}>{d.review_count} ulasan</div>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                {distrib.map(({ s, pct }) => (
                  <div key={s} className="bar-row">
                    <span>★{s}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: pct + '%' }}></div></div>
                    <span style={{ width: 28, textAlign: 'right', fontSize: 11 }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daftar Komentar */}
          <div style={{ marginBottom: 22 }}>
            {destComments.length === 0 ? (
              <div className="fav-empty">
                <div className="fav-empty-icon"><FaCommentAlt style={{ fontSize: 32 }} /></div>
                <div className="fav-empty-title">Belum ada ulasan</div>
                <p style={{ fontSize: 13 }}>Jadilah yang pertama memberikan ulasan!</p>
              </div>
            ) : destComments.map((c, i) => (
              <div key={i} className="comment-item">
                <div className="comment-head">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="comment-avatar">{(c.user || 'A')[0].toUpperCase()}</div>
                    <div>
                      <span className="comment-author">{c.user}</span>
                      <span className="comment-time"> · {c.time}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="comment-rating">★ {c.rating}</div>
                    {user && (
                      <button
                        onClick={() => handleReport(c.id)}
                        disabled={reported.has(c.id) || c.is_reported}
                        style={{
                          fontSize: 11, padding: '3px 10px',
                          border: '1px solid',
                          borderRadius: 99,
                          cursor: reported.has(c.id) || c.is_reported ? 'default' : 'pointer',
                          background: 'transparent',
                          borderColor: reported.has(c.id) || c.is_reported ? 'var(--border)' : 'var(--red)',
                          color: reported.has(c.id) || c.is_reported ? 'var(--text4)' : 'var(--red)',
                          fontFamily: 'Inter, sans-serif',
                          transition: '.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {reported.has(c.id) || c.is_reported
                          ? <><FaCheck /> Dilaporkan</>
                          : <><FaFlag /> Laporkan</>
                        }
                      </button>
                    )}
                  </div>
                </div>
                <div className="comment-text">{c.text}</div>
                {c.photo_full_url && (
                  <img
                    src={c.photo_full_url}
                    alt="Foto ulasan"
                    style={{ marginTop: 10, maxWidth: 260, maxHeight: 200, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                )}
              </div>
            ))}
          </div>
      </div>

      {/* Form Ulasan — STICKY di bawah, selalu kelihatan */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        padding: '10px 16px 14px',
        pointerEvents: 'none',
      }}>
        <div className="content" style={{ margin: '0 auto', pointerEvents: 'auto', paddingTop: 0, paddingBottom: 0 }}>
          {/* Kotak form yang rapi */}
          <div style={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 14,
            padding: '14px 16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <div className="review-label" style={{ marginBottom: 10 }}>Tambahkan Ulasan</div>

            <div className="star-select" style={{ marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className={'star-pick' + (i <= star ? ' lit' : '')} onClick={() => setStar(i)}>★</button>
              ))}
              <span style={{ fontSize: 12, color: 'var(--text4)', marginLeft: 6 }}>
                {star > 0 ? star + '/5' : 'Pilih rating'}
              </span>
            </div>

            <textarea
              className="review-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tuliskan komentar Anda di sini... (minimal 5 karakter)"
              style={{ marginTop: 0, minHeight: 60, maxHeight: 110, marginBottom: 10 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              {/* Upload foto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handlePhoto} />
                {!photoPreview ? (
                  <button
                    onClick={() => fileRef.current.click()}
                    style={{
                      padding: '6px 12px', border: '1.5px dashed var(--border)', borderRadius: 8,
                      background: 'var(--bg)', cursor: 'pointer', fontSize: 12,
                      color: 'var(--text3)', fontFamily: 'Inter,sans-serif',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <FaCamera /> Lampirkan Foto <span style={{ color: 'var(--text4)' }}>(opsional)</span>
                  </button>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={photoPreview} alt="preview" style={{ height: 52, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    <button
                      onClick={removePhoto}
                      style={{
                        position: 'absolute', top: -7, right: -7,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--red)', color: '#fff', border: 'none',
                        cursor: 'pointer', fontSize: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              {/* Tombol kirim */}
              <button className="btn-primary" onClick={submit} disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </div>{/* end kotak */}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}