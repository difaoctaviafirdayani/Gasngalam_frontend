import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo-gasngalam.svg';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const { user, userDetail, theme, toggleTheme } = useApp();

  // Sidebar default: buka hanya jika layar >= 1024px (laptop ke atas)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      // Layar besar: sidebar buka otomatis; layar kecil: tutup otomatis
      if (w >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDark = theme === 'dark';
  // Di mobile/tablet sidebar jadi overlay (floating), bukan geser konten
  const sidebarAsOverlay = isMobile || window.innerWidth < 1024;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* HEADER / TOPBAR */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 56, flexShrink: 0,
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        zIndex: 200, boxShadow: 'var(--shadow-xs)',
        width: '100%', boxSizing: 'border-box',
      }}>
        <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)}>&#9776;</button>
        <a style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
          <img
            src={logo}
            alt="GasNgalam"
            style={{
              height: 26,
              width: 'auto',
              display: 'block',
              filter: isDark ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter .3s',
            }}
          />
        </a>
        <div style={{ flex: 1, position: 'relative', maxWidth: 420, margin: '0 auto' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, stroke: 'var(--text4)', fill: 'none', strokeWidth: 2, pointerEvents: 'none' }} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="searchbar"
            type="text"
            placeholder="Cari Destinasi Wisata"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate('/search?q=' + encodeURIComponent(e.target.value.trim()));
                e.target.value = '';
              }
            }}
          />
        </div>
        <div className="topbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Ganti tema">
            {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>
          {user && (
            <button
              onClick={() => navigate('/notifications')}
              title="Notifikasi"
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 6px', borderRadius: 8,
                display: 'flex', alignItems: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          )}
          {!user ? (
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          ) : (
            <div className="user-chip" onClick={() => navigate('/profile')}>
              {userDetail?.avatar_url
                ? <img src={userDetail.avatar_url} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                : <div className="user-avatar">{user[0].toUpperCase()}</div>
              }
              <span>{user}</span>
            </div>
          )}
        </div>
      </header>

      {/* BODY: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* OVERLAY gelap di belakang sidebar, muncul hanya di mobile/tablet saat sidebar buka */}
        {sidebarAsOverlay && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, top: 56,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 150,
            }}
          />
        )}

        {/* SIDEBAR */}
        <Sidebar
          open={sidebarOpen}
          overlay={sidebarAsOverlay}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}