import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-gasngalam.svg';
import heroBg from '../assets/Tugu-malang.png.png';

const destinations = [
  { name: 'Coban Rondo',         type: 'Wisata Alam',     rating: '4.8', icon: '💧', reviews: '2.1K', gradient: 'linear-gradient(160deg,#0d2b1a 0%,#1a5c35 100%)' },
  { name: 'Kampung Warna-Warni', type: 'Wisata Budaya',   rating: '4.7', icon: '🎨', reviews: '1.8K', gradient: 'linear-gradient(160deg,#1a120a 0%,#6b3a15 100%)' },
  { name: 'Jatim Park 1',        type: 'Wisata Keluarga', rating: '4.6', icon: '🎡', reviews: '1.6K', gradient: 'linear-gradient(160deg,#10102a 0%,#2d2d80 100%)' },
  { name: 'Museum Angkut',       type: 'Wisata Edukasi',  rating: '4.7', icon: '🚗', reviews: '1.4K', gradient: 'linear-gradient(160deg,#1a1010 0%,#5c1a1a 100%)' },
  { name: 'Gunung Bromo',        type: 'Wisata Alam',     rating: '4.9', icon: '🌋', reviews: '3.2K', gradient: 'linear-gradient(160deg,#1a1200 0%,#6b4a00 100%)' },
];

const whyUs = [
  { icon: '📍', title: 'Banyak Pilihan Destinasi', desc: 'Ratusan tempat menarik menanti untuk dijelajahi.' },
  { icon: '🏆', title: 'Terbaik & Terpercaya',     desc: 'Informasi akurat dan selalu diperbarui.' },
  { icon: '👍', title: 'Mudah & Praktis',          desc: 'Cari informasi wisata dengan cepat dan mudah.' },
  { icon: '❤️', title: 'Pengalaman Berkesan',      desc: 'Ciptakan kenangan terindah di Malang.' },
];

const heroFeatures = [
  { icon: '📍', title: 'Destinasi Pilihan',  desc: 'Rekomendasi tempat wisata terbaik di Malang.' },
  { icon: '🍴', title: 'Kuliner Legendaris', desc: 'Nikmati berbagai kuliner khas yang menggugah selera.' },
  { icon: '📅', title: 'Event Seru',         desc: 'Informasi event menarik yang tak boleh dilewatkan.' },
  { icon: '🗺️', title: 'Panduan Lengkap',   desc: 'Semua informasi yang kamu butuhkan untuk berwisata.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  // Warna yang benar-benar responsif terhadap dark/light mode
  const gold = '#C9A227';
  const goldLight = '#e8c052';
  const goldPale = isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.12)';

  // Background utama
  const pageBg       = isDark ? '#0a0c14' : '#f5f4ef';
  const sectionBg    = isDark ? '#0f1320' : '#ffffff';
  const sectionAlt   = isDark ? '#080b12' : '#f0ede6';
  const navBg        = isDark ? 'rgba(10,12,20,0.92)' : 'rgba(245,244,239,0.92)';

  // Teks
  const textPrimary   = isDark ? '#ffffff' : '#0f1117';
  const textSecondary = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,17,23,0.65)';
  const textMuted     = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,17,23,0.4)';

  // Card
  const cardBg     = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // Footer
  const footerBg = isDark ? '#050709' : '#0f1117';

  // Navbar border
  const navBorder = isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.25)';

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: pageBg, minHeight: '100vh', overflowX: 'hidden', color: textPrimary, transition: 'background .3s, color .3s' }}>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        padding: '0 48px', height: 68,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: navBg, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${navBorder}`,
        transition: 'background .3s',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <img
            src={logo}
            alt="GasNgalam"
            style={{
              height: 26, objectFit: 'contain',
              filter: isDark ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter .3s',
            }}
          />
          <span style={{ fontSize: 9, color: gold, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
            Kota Malang
          </span>
        </div>

        {/* Kanan: dark mode toggle + tombol */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Toggle dark mode */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              color: textPrimary, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = goldPale; }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
              e.currentTarget.style.background   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Jelajahi Sekarang */}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px', borderRadius: 99,
              background: gold, border: 'none',
              color: '#0a0c14', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = goldLight; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = gold; e.currentTarget.style.transform = ''; }}
          >
            Jelajahi Sekarang →
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center top', overflow: 'hidden',
      }}>
        {/* Overlay — di light mode lebih tipis biar foto tetap keliatan */}
        <div style={{ position: 'absolute', inset: 0, background: isDark
          ? 'linear-gradient(to right, rgba(5,7,15,0.92) 50%, rgba(5,7,15,0.4) 100%)'
          : 'linear-gradient(to right, rgba(10,12,20,0.80) 45%, rgba(10,12,20,0.25) 100%)'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: isDark
          ? 'linear-gradient(to top, rgba(5,7,15,0.8) 0%, transparent 60%)'
          : 'linear-gradient(to top, rgba(10,12,20,0.6) 0%, transparent 60%)'
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '100px 60px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, maxWidth: 1280, margin: '0 auto' }}>
          {/* Kiri — teks hero */}
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 68px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-1px', color: '#fff' }}>
              Rasakan <br />
              <span style={{ color: gold }}>Keindahan</span><br />
              Kota Malang
            </h1>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Temukan destinasi wisata terbaik, kuliner lezat, budaya unik, dan pengalaman seru di setiap sudut Kota Malang.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => navigate('/register')} style={{
                padding: '13px 28px', borderRadius: 99,
                background: gold, border: 'none',
                color: '#0a0c14', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = goldLight; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = gold; e.currentTarget.style.transform = ''; }}
              >🧭 Temukan Destinasi →</button>
            </div>
          </div>

          {/* Kanan — feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280, flexShrink: 0 }}>
            {heroFeatures.map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'rgba(10,12,20,0.72)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201,162,39,0.22)', borderRadius: 12,
                padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,22,35,0.88)'; e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,12,20,0.72)'; e.currentTarget.style.borderColor = 'rgba(201,162,39,0.22)'; }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, border: '1px solid rgba(201,162,39,0.3)' }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DESTINASI POPULER ═══ */}
      <section style={{ padding: '80px 60px', background: sectionBg, transition: 'background .3s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold, marginBottom: 10 }}>DESTINASI POPULER</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: textPrimary, letterSpacing: '-0.5px', marginBottom: 10, transition: 'color .3s' }}>
                Jelajahi Tempat Terbaik di Malang
              </h2>
              <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, maxWidth: 360, transition: 'color .3s' }}>
                Dari wisata alam, budaya, hingga spot instagramable yang siap membuat perjalananmu tak terlupakan.
              </p>
            </div>
            <button onClick={() => navigate('/login')} style={{
              padding: '10px 22px', borderRadius: 99, background: 'transparent',
              border: `1.5px solid ${isDark ? 'rgba(201,162,39,0.4)' : 'rgba(201,162,39,0.6)'}`,
              color: gold, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = goldPale; e.currentTarget.style.borderColor = gold; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = isDark ? 'rgba(201,162,39,0.4)' : 'rgba(201,162,39,0.6)'; }}
            >Lihat Semua Destinasi →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {destinations.map(({ name, type, rating, icon, reviews, gradient }) => (
              <div key={name} onClick={() => navigate('/login')} style={{
                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                background: cardBg, border: `1px solid ${cardBorder}`, transition: 'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(201,162,39,0.4)'; e.currentTarget.style.boxShadow = isDark ? '0 16px 40px rgba(0,0,0,0.4)' : '0 16px 40px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>
                  <span style={{ opacity: 0.5 }}>{icon}</span>
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,12,20,0.82)', backdropFilter: 'blur(4px)', borderRadius: 99, padding: '3px 9px', fontSize: 11, fontWeight: 700, color: '#fff', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: gold }}>★</span> {rating}
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, width: 32, height: 32, borderRadius: '50%', background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{icon}</div>
                </div>
                <div style={{ padding: '14px 14px 16px' }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 700, color: textPrimary, marginBottom: 4, transition: 'color .3s' }}>{name}</h3>
                  <p style={{ fontSize: 11.5, color: textMuted, marginBottom: 8, transition: 'color .3s' }}>{type}</p>
                  <div style={{ fontSize: 11, color: textMuted }}>
                    <span style={{ color: gold }}>★ {rating}</span>
                    <span style={{ marginLeft: 5 }}>({reviews} ulasan)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MENGAPA VISIT MALANG ═══ */}
      <section style={{ padding: '80px 60px', background: sectionAlt, transition: 'background .3s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold, marginBottom: 10 }}>MENGAPA VISIT MALANG?</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: textPrimary, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 16, transition: 'color .3s' }}>
              Pengalaman Tak<br />Terlupakan Menantimu
            </h2>
            <div style={{ width: 48, height: 3, background: gold, borderRadius: 99 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            {whyUs.map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: goldPale, border: `1px solid ${isDark ? 'rgba(201,162,39,0.25)' : 'rgba(201,162,39,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 6, transition: 'color .3s' }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: textMuted, lineHeight: 1.6, transition: 'color .3s' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: '0 60px 80px', background: sectionBg, transition: 'background .3s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', borderRadius: 20, overflow: 'hidden', backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '60px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,7,15,0.92) 0%, rgba(5,7,15,0.7) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 400 }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
              Dapatkan Info Wisata<br />Terbaru dari Malang
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
              Berlangganan newsletter kami dan dapatkan rekomendasi destinasi, promo menarik, dan event terbaru setiap minggu.
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexShrink: 0, borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(201,162,39,0.3)' }}>
            <input placeholder="Masukkan email kamu" style={{ width: 240, padding: '13px 20px', background: 'rgba(5,7,15,0.8)', border: 'none', outline: 'none', color: '#fff', fontSize: 13 }} />
            <button onClick={() => navigate('/register')} style={{ padding: '13px 24px', background: gold, border: 'none', color: '#0a0c14', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = goldLight}
              onMouseLeave={e => e.currentTarget.style.background = gold}
            >Langganan Sekarang →</button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: footerBg, borderTop: `1px solid ${isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.2)'}`, transition: 'background .3s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 60px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <img src={logo} alt="GasNgalam" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 6 }} />
              <div style={{ fontSize: 9, color: gold, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Kota Malang</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 240 }}>Platform informasi wisata resmi Kota Malang untuk membantu kamu menemukan destinasi terbaik dan pengalaman tak terlupakan.</p>
              <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
                {['IG', 'FB', 'YT', 'TK'].map(s => (
                  <div key={s} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, cursor: 'pointer', transition: 'all .2s', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = goldPale; e.currentTarget.style.color = gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                  >{s}</div>
                ))}
              </div>
            </div>

            {[
              { title: 'JELAJAHI',   links: ['Destinasi', 'Aktivitas', 'Kuliner', 'Event', 'Panduan'] },
              { title: 'INFORMASI',  links: ['Tentang Kami', 'Blog', 'FAQ', 'Kebijakan Privasi', 'Syarat & Ketentuan'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>{title}</div>
                {links.map(item => (
                  <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12, cursor: 'pointer', transition: 'color .15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                  >{item}</div>
                ))}
              </div>
            ))}

            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>KONTAK</div>
              {[
                { icon: '📍', text: 'Kota Malang, Jawa Timur, Indonesia' },
                { icon: '✉️', text: 'info@gasngalam.id' },
                { icon: '📱', text: '+62 812-3456-7890' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 Gasngalam Kota Malang. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}