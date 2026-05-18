import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo gasngalam.svg';

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false); // default tertutup

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Topbar */}
      <header className="flex items-center gap-3.5 px-5 h-14 bg-white border-b border-[var(--border)] fixed top-0 left-0 right-0 z-[200] shadow-[var(--shadow-xs)]">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="w-9 h-9 rounded-[var(--r-sm)] border border-[var(--border)] bg-transparent cursor-pointer flex items-center justify-center text-[var(--text2)] text-base flex-shrink-0 transition-colors hover:bg-[var(--bg)] hover:border-[var(--brand-gold)] hover:text-[var(--brand)]"
        >
          &#9776;
        </button>

        {/* Logo */}
        <a className="cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <img src={logo} alt="GasNgalam" className="h-7 w-auto block" />
        </a>

        {/* Search */}
        <div className="flex-1 max-w-[440px] relative mx-auto">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 stroke-[var(--text4)] fill-none stroke-2 pointer-events-none"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="w-full h-9 bg-[var(--bg)] border-[1.5px] border-[var(--border)] rounded-[var(--r-sm)] pl-8 pr-3 text-[13px] text-[var(--text)] transition-all focus:outline-none focus:border-[var(--brand-gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,166,35,.12)] placeholder:text-[var(--text4)]"
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

        {/* Right: login / user chip */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-[var(--r-sm)] border-[1.5px] border-[var(--brand)] bg-transparent text-[var(--brand)] text-[13px] font-semibold cursor-pointer transition-colors hover:bg-[var(--brand)] hover:text-white"
            >
              Login
            </button>
          ) : (
            <div
              onClick={() => setSidebarOpen(o => !o)}
              className="flex items-center gap-2 bg-[var(--brand-gold-pale)] border-[1.5px] border-[#f5d79e] rounded-full py-[5px] pl-[5px] pr-3 cursor-pointer transition-colors hover:border-[var(--brand-gold)]"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-[11px] font-bold text-white">
                {user[0].toUpperCase()}
              </div>
              <span className="text-[12px] text-[var(--brand)] font-semibold">{user}</span>
            </div>
          )}
        </div>
      </header>

      {/* Layout body */}
      <div className="flex pt-14 min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 overflow-y-auto bg-[var(--bg)] min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}