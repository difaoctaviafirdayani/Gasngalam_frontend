import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function AdminLayout({ children, active }) {
  const navigate = useNavigate();
  const { logout } = useApp();
  const nav = [
    ['Dashboard','🏠','/admin'],
    ['Kelola Wisata','🗺️','/admin/wisata'],
    ['Kelola Pengajuan Klaim','📋','/admin/klaim'],
    ['Kelola Ulasan','💬','/admin/ulasan'],
  ];
  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Gas<span>Ngalam</span></div>
        {nav.map(([label,icon,path]) => (
          <button key={path} className={'admin-nav-item' + (active === label ? ' active' : '')} onClick={() => navigate(path)}>
            {icon} {label}
          </button>
        ))}
        <button className="admin-nav-item" style={{color:'rgba(255,180,180,.9)',marginTop:16}} onClick={() => { logout(); navigate('/'); }}>← Logout</button>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
