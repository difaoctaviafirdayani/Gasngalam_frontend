<div className="topbar-right">
  {/* ===== NOTIF BELL — sebelah kiri dark mode ===== */}
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