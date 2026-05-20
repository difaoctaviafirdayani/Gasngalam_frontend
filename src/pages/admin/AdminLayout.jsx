import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import logo from "../../assets/logo-gasngalam.svg";

export default function AdminLayout({ children, active }) {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true); // default muncul

  const nav = [
    ['Dashboard',              '🏠', '/admin'],
    ['Kelola Wisata',          '🗺️', '/admin/wisata'],
    ['Kelola Pengajuan Klaim', '📋', '/admin/klaim'],
    ['Kelola Ulasan',          '💬', '/admin/ulasan'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* TOPBAR */}
      <div className="topbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
        >
          &#9776;
        </button>
        <a className="logo-wrap" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="GasNgalam" style={{ height: 28, width: 'auto' }} />
        </a>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', fontWeight: 500 }}>
          Admin Panel
        </div>
      </div>

      {/* LAYOUT BODY */}
      <div style={{ display: 'flex', paddingTop: 56, minHeight: '100vh' }}>

        {/* PERSISTENT SIDEBAR */}
        <div style={{
          width: sidebarOpen ? 220 : 0,
          minWidth: sidebarOpen ? 220 : 0,
          overflow: 'hidden',
          background: 'var(--brand)',
          flexShrink: 0,
          position: 'sticky',
          top: 56,
          height: 'calc(100vh - 56px)',
          transition: 'width .26s cubic-bezier(.4,0,.2,1), min-width .26s cubic-bezier(.4,0,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
        }}>
          <div style={{ width: 220, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '16px 10px 10px', flex: 1 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '1.2px', color: 'rgba(255,255,255,.4)',
                padding: '6px 10px', marginBottom: 4,
              }}>Menu</div>
              {nav.map(([label, icon, path]) => (
                <button
                  key={path}
                  className={'sidebar-item' + (active === label ? ' active' : '')}
                  onClick={() => navigate(path)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
              <button
                className="logout-item"
                onClick={() => { logout(); navigate('/'); }}
                style={{ whiteSpace: 'nowrap' }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* KONTEN */}
        <div style={{ flex: 1, padding: '24px 22px', overflowY: 'auto', background: 'var(--bg)', minWidth: 0 }}>
          {children}
        </div>

      </div>
    </div>
  );
}