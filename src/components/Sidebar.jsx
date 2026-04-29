import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar({ open, onClose }) {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();
  const go = (path) => { navigate(path); onClose(); };

  return (
    <>
      <div className={'sidebar-overlay' + (open ? ' open' : '')} onClick={onClose}></div>
      <div className={'sidebar' + (open ? ' open' : '')}>
        <div className="sidebar-head">
          <div className="sidebar-brand">Gas<span>Ngalam</span></div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>
        <div className="sidebar-body">
          {role === 'admin' ? (
            <>
              <div className="sidebar-section">Admin Panel</div>
              <button className="sidebar-item" onClick={() => go('/admin')}>🏠 Dashboard</button>
              <button className="sidebar-item" onClick={() => go('/admin/wisata')}>🗺️ Kelola Wisata</button>
              <button className="sidebar-item" onClick={() => go('/admin/klaim')}>📋 Pengajuan Klaim</button>
              <button className="sidebar-item" onClick={() => go('/admin/ulasan')}>💬 Kelola Ulasan</button>
            </>
          ) : user ? (
            <>
              <div className="sidebar-section">Menu</div>
              <button className="sidebar-item" onClick={() => go('/')}>🏠 Dashboard</button>
              <button className="sidebar-item" onClick={() => go('/favorites')}>❤️ Destinasi Tersimpan</button>
            </>
          ) : (
            <>
              <div className="sidebar-section">Menu</div>
              <button className="sidebar-item" onClick={() => go('/')}>🏠 Dashboard</button>
            </>
          )}
        </div>
        <div className="sidebar-foot">
          {user ? (
            <button className="logout-item" onClick={() => { logout(); onClose(); navigate('/'); }}>← Logout</button>
          ) : (
            <button className="sidebar-item" onClick={() => go('/login')} style={{color:'rgba(255,255,255,.8)'}}>👤 Login</button>
          )}
        </div>
      </div>
    </>
  );
}
