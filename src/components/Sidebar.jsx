import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaHome, FaHeart, FaSignOutAlt, FaTachometerAlt, FaMap, FaClipboardList, FaComments, FaSignInAlt } from 'react-icons/fa';

export default function Sidebar({ open, overlay, onClose }) {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path) => { navigate(path); onClose(); };

  // Mode overlay (mobile/tablet): posisi fixed floating di atas konten
  // Mode push (laptop+): posisi sticky geser konten
  const overlayStyle = overlay
    ? {
        position: 'fixed',
        top: 56,
        left: 0,
        bottom: 0,
        width: 220,
        zIndex: 160,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .26s cubic-bezier(.4,0,.2,1)',
        background: 'var(--brand-dark)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        width: open ? 220 : 0,
        minWidth: open ? 220 : 0,
        overflow: 'hidden',
        background: 'var(--brand-dark)',
        flexShrink: 0,
        position: 'sticky',
        top: 56,
        height: 'calc(100vh - 56px)',
        transition: 'width .26s cubic-bezier(.4,0,.2,1), min-width .26s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      };

  return (
    <div style={overlayStyle}>
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px 10px 10px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,.4)', padding: '6px 10px', marginBottom: 4 }}>
            Menu
          </div>
          {role === 'admin' ? (
            <>
              <button className={'sidebar-item' + (location.pathname === '/admin' ? ' active' : '')} onClick={() => go('/admin')} style={{ whiteSpace: 'nowrap' }}><FaTachometerAlt /> Dashboard</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/wisata' ? ' active' : '')} onClick={() => go('/admin/wisata')} style={{ whiteSpace: 'nowrap' }}><FaMap /> Kelola Wisata</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/klaim' ? ' active' : '')} onClick={() => go('/admin/klaim')} style={{ whiteSpace: 'nowrap' }}><FaClipboardList /> Pengajuan Klaim</button>
              <button className={'sidebar-item' + (location.pathname === '/admin/ulasan' ? ' active' : '')} onClick={() => go('/admin/ulasan')} style={{ whiteSpace: 'nowrap' }}><FaComments /> Kelola Ulasan</button>
            </>
          ) : user ? (
            <>
              <button className={'sidebar-item' + (location.pathname === '/' ? ' active' : '')} onClick={() => go('/')} style={{ whiteSpace: 'nowrap' }}><FaHome /> Beranda</button>
              <button className={'sidebar-item' + (location.pathname === '/favorites' ? ' active' : '')} onClick={() => go('/favorites')} style={{ whiteSpace: 'nowrap' }}><FaHeart /> Destinasi Tersimpan</button>
            </>
          ) : (
            <button className={'sidebar-item'} onClick={() => go('/')} style={{ whiteSpace: 'nowrap' }}><FaHome /> Beranda</button>
          )}
        </div>
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          {user ? (
            <button className="logout-item" onClick={() => { logout(); onClose(); navigate('/'); }} style={{ whiteSpace: 'nowrap' }}><FaSignOutAlt /> Logout</button>
          ) : (
            <button className="sidebar-item" onClick={() => go('/login')} style={{ color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }}><FaSignInAlt /> Login</button>
          )}
        </div>
      </div>
    </div>
  );
}