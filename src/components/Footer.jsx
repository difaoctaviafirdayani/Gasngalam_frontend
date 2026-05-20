import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-gasngalam.svg';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand + Deskripsi */}
        <div className="footer-brand-col">
          <img src={logo} alt="GasNgalam" style={{ height: 28, objectFit: 'contain',  }} />
          <p className="footer-tagline">
            Temukan destinasi wisata terbaik di Kota Malang.<br />
            Dari budaya, kuliner, hingga hiburan — semua ada di sini.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn" title="Instagram" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" title="Facebook" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" title="Twitter / X" aria-label="Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="footer-social-btn" title="TikTok" aria-label="TikTok">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1-.12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigasi */}
        <div className="footer-nav-col">
          <div className="footer-nav-title">Jelajahi</div>
          <ul className="footer-nav-list">
            <li><button onClick={() => navigate('/')} className="footer-nav-link">🏠 Beranda</button></li>
            <li><button onClick={() => navigate('/favorites')} className="footer-nav-link">❤️ Favorit Saya</button></li>
            <li><button onClick={() => navigate('/search')} className="footer-nav-link">🔍 Cari Destinasi</button></li>
          </ul>
        </div>

        {/* Kategori */}
        <div className="footer-nav-col">
          <div className="footer-nav-title">Kategori</div>
          <ul className="footer-nav-list">
            <li><span className="footer-nav-plain">🏛️ Wisata Budaya</span></li>
            <li><span className="footer-nav-plain">🌳 Taman Kota</span></li>
            <li><span className="footer-nav-plain">🎡 Wisata Buatan</span></li>
            <li><span className="footer-nav-plain">📚 Wisata Edukasi</span></li>
            <li><span className="footer-nav-plain">🛒 Perbelanjaan</span></li>
          </ul>
        </div>

        {/* Kontak */}
        <div className="footer-nav-col">
          <div className="footer-nav-title">Informasi</div>
          <ul className="footer-nav-list">
            <li>
              <span className="footer-contact-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Kota Malang, Jawa Timur
              </span>
            </li>
            <li>
              <span className="footer-contact-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                info@gasngalam.id
              </span>
            </li>
            <li>
              <span className="footer-contact-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 5.9 5.9l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
                </svg>
                (0341) 123-4567
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">
            © {year} <strong>GasNgalam</strong>. Dibuat dengan ❤️ untuk Kota Malang.
          </span>
          <div className="footer-bottom-links">
            <span className="footer-bottom-link">Kebijakan Privasi</span>
            <span className="footer-bottom-sep">·</span>
            <span className="footer-bottom-link">Syarat &amp; Ketentuan</span>
            <span className="footer-bottom-sep">·</span>
            <span className="footer-bottom-link">Tentang Kami</span>
          </div>
        </div>
      </div>
    </footer>
  );
}