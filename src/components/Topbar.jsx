import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import logo from '../assets/logo gasngalam.svg';
import api from '../services/api';

function NotifDropdown({ onClose }) {
  const { setNotifCount } = useApp();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setNotifCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setNotifCount(0);
  };

  const typeIcon = (type) => {
    if (type === 'claim_status') return '📋';
    return '🔔';
  };

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      width: 320, maxHeight: 420, overflowY: 'auto', zIndex: 999,
    }}>
      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>🔔 Notifikasi</span>
        <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Tandai semua dibaca
        </button>
      </div>
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Memuat...</div>
      ) : notifs.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔕</div>
          Belum ada notifikasi
        </div>
      ) : notifs.map(n => (
        <div
          key={n.id}
          onClick={() => markRead(n.id)}
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            background: n.is_read ? 'transparent' : 'var(--brand)11',
            transition: 'background .2s',
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{typeIcon(n.type)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 13, color: 'var(--text)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
              <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 4 }}>
                {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {!n.is_read && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Topbar() {
  const { user, theme, toggleTheme, notifCount } = useApp();
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const notifRef = useRef(null);

  const doSearch = () => {
    if (search.trim()) { navigate('/search?q=' + encodeURIComponent(search.trim())); setSearch(''); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <nav className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>&#9776;</button>
        <a className="logo-wrap" onClick={() => navigate('/')}>
          <img src={logo} alt="GasNgalam" style={{ height: 28, objectFit: 'contain' }} />
        </a>
        <div className="search-wrap">
          <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
            <svg className="search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="searchbar"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari Destinasi Wisata"
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
          </div>
        </div>
        <div className="topbar-right">
          {/* ===== NOTIF BELL — di kiri dark mode ===== */}
          {user && (
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                title="Notifikasi"
                style={{
                  background: notifOpen ? 'var(--bg)' : 'none',
                  border: 'none', cursor: 'pointer',
                  padding: '4px 6px', borderRadius: 8, position: 'relative',
                  display: 'flex', alignItems: 'center',
                  transition: 'background .2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {notifCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 0, right: 0,
                    background: '#e74c3c', color: '#fff',
                    fontSize: 9, fontWeight: 800,
                    borderRadius: '50%', width: 16, height: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}>
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} />}
            </div>
          )}

          {/* ===== DARK MODE TOGGLE ===== */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Ganti tema">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {!user ? (
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          ) : (
            <div className="user-chip" onClick={() => setSidebarOpen(true)}>
              <div className="user-avatar">{user[0].toUpperCase()}</div>
              <span>{user}</span>
            </div>
          )}
        </div>
      </nav>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}