import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo gasngalam.svg';

export default function AdminLayout({ children, active }) {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    ['Dashboard', '🏠', '/admin'],
    ['Kelola Wisata', '🗺️', '/admin/wisata'],
    ['Kelola Pengajuan Klaim', '📋', '/admin/klaim'],
    ['Kelola Ulasan', '💬', '/admin/ulasan'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

  {/* TOPBAR ADMIN */}
  <div className="topbar">
    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>&#9776;</button>
    {/* Logo SVG */}
    <a className="logo-wrap" onClick={() => navigate('/admin')}>
      <img src={logo} alt="GasNgalam" style={{ height: 28, width: 'auto' }} />
    </a>
    <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', fontWeight: 500 }}>
      Admin Panel
    </div>
  </div>

      {/* OVERLAY */}
      <div
        className={'sidebar-overlay' + (sidebarOpen ? ' open' : '')}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR DRAWER */}
      <div className={'sidebar' + (sidebarOpen ? ' open' : '')}>
        <div className="sidebar-head">
          <div className="sidebar-brand">Gas<span>Ngalam</span></div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-section">Menu</div>
          {nav.map(([label, icon, path]) => (
            <button
              key={path}
              className={'sidebar-item' + (active === label ? ' active' : '')}
              onClick={() => { navigate(path); setSidebarOpen(false); }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="sidebar-foot">
          <button
            className="logout-item"
            onClick={() => { logout(); navigate('/'); }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* KONTEN */}
      <div className="admin-content" style={{ maxWidth: 1020, margin: '0 auto', padding: '24px 18px' }}>
        {children}
      </div>

    </div>
  );
}