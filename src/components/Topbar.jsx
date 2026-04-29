import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import logo from '../assets/logo gasngalam.svg';

export default function Topbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const doSearch = () => {
    if (search.trim()) { navigate('/search?q=' + encodeURIComponent(search.trim())); setSearch(''); }
  };

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
