import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Rating() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user, comments, addComment, fetchComments, requireLogin, showToast } = useApp();
  const [d, setD]  = useState(null);
  const [star, setStar]     = useState(0);
  const [text, setText]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/destinations/${id}`)
      .then(res => setD(res.data))
      .catch(() => setD(null));
    fetchComments(id);
  }, [id]);

  if (!d) return (
    <div><Topbar />
      <div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 32 }}>⏳</div><p>Memuat...</p>
      </div>
    </div>
  );

  const destComments = comments[d.id] || [];

  const submit = async () => {
    if (!requireLogin('Anda perlu login untuk memberikan ulasan.')) return;
    if (!text.trim() || star === 0) {
      showToast('Isi komentar dan pilih rating terlebih dahulu');
      return;
    }
    setLoading(true);
    await addComment(d.id, { rating: star, text: text.trim() });
    setStar(0);
    setText('');
    setLoading(false);
  };

  const stars = (r) => [1, 2, 3, 4, 5].map(s =>
    <span key={s} className={'star-s' + (r >= s ? '' : ' empty')}>★</span>
  );

  return (
    <div>
      <Topbar />
      <div className="content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Kembali</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Rating dan Komentar</h2>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>{d.name}</p>

        <div className="rating-wrap">
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
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

        <div style={{ marginBottom: 18 }}>
          {destComments.length === 0 ? (
            <div className="fav-empty">
              <div className="fav-empty-icon">💬</div>
              <div className="fav-empty-title">Belum ada ulasan</div>
              <p style={{ fontSize: 13 }}>Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : destComments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-head">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="comment-avatar">{c.user[0]}</div>
                  <div>
                    <span className="comment-author">{c.user}</span>
                    <span className="comment-time"> · {c.time}</span>
                  </div>
                </div>
                <div className="comment-rating">★ {c.rating}</div>
              </div>
              <div className="comment-text">{c.text}</div>
            </div>
          ))}
        </div>

        <div className="add-review-box">
          <div className="review-label">Tambahkan Ulasan</div>
          <div className="star-select">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} className={'star-pick' + (i <= star ? ' lit' : '')} onClick={() => setStar(i)}>★</button>
            ))}
          </div>
          <textarea
            className="review-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Tuliskan komentar Anda di sini..."
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text4)' }}>☆ {star}/5</span>
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
