import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar({ open, onClose }) {
  const { user, role, logout, notifCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path) => { navigate(path); onClose(); };

  return (
    <div style={{
      width: open ? 220 : 0, minWidth: open ? 220 : 0,
      overflow: 'hidden', background: 'var(--brand)', flexShrink: 0,
      position: 'sticky', top: 56, height: 'calc(100vh - 56px)',
      transition: 'width .26s cubic-bezier(.4,0,.2,1), min-width .26s cubic-bezier(.4,0,.2,1)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px 10px 10px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,.4)', padding: '6px 10px', marginBottom: 4 }}>
            Menu
          </div>
          {role === 'admin' ? (
            <>
              <button className={'sidebar-item' + (location.pathname === '/admin' ? ' active' : '')} onClick={() => go('/admin')} style={{ whiteSpace: 'nowrap' }}>🏠 Dashboard</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/wisata' ? ' active' : '')} onClick={() => go('/admin/wisata')} style={{ whiteSpace: 'nowrap' }}>🗺️ Kelola Wisata</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/klaim' ? ' active' : '')} onClick={() => go('/admin/klaim')} style={{ whiteSpace: 'nowrap' }}>📋 Pengajuan Klaim</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/ulasan' ? ' active' : '')} onClick={() => go('/admin/ulasan')} style={{ whiteSpace: 'nowrap' }}>💬 Kelola Ulasan</button>
            </>
          ) : user ? (
            <>
              <button className={'sidebar-item' + (location.pathname === '/' ? ' active' : '')} onClick={() => go('/')} style={{ whiteSpace: 'nowrap' }}>🏠 Beranda</button>
              <button className={'sidebar-item' + (location.pathname === '/favorites' ? ' active' : '')} onClick={() => go('/favorites')} style={{ whiteSpace: 'nowrap' }}>❤️ Destinasi Tersimpan</button>
              <button className={'sidebar-item' + (location.pathname === '/profile' ? ' active' : '')} onClick={() => go('/profile')} style={{ whiteSpace: 'nowrap' }}>👤 Profil Saya</button>
              {/* Notifikasi dengan badge */}
              <button className={'sidebar-item' + (location.pathname === '/notifications' ? ' active' : '')} onClick={() => go('/notifications')} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>🔔 Notifikasi</span>
                {notifCount > 0 && (
                  <span style={{ background: '#e74c3c', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 99, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <button className={'sidebar-item' + (location.pathname === '/' ? ' active' : '')} onClick={() => go('/')} style={{ whiteSpace: 'nowrap' }}>🏠 Dashboard</button>
          )}
        </div>
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          {user ? (
            <button className="logout-item" onClick={() => { logout(); onClose(); navigate('/'); }} style={{ whiteSpace: 'nowrap' }}>🚪 Logout</button>
          ) : (
            <button className="sidebar-item" onClick={() => go('/login')} style={{ color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }}>👤 Login</button>
          )}
        </div>
      </div>
    </div>
  );
}