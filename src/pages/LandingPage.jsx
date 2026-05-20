import { useNavigate } from 'react-router-dom';

import heroBg from '../assets/Tugu-malang.png.png';
import ctaBg from '../assets/Tugu-malang.png.png';
import logo from '../assets/logo-gasngalam.svg';

const HERO_BG = heroBg;
const CTA_BG = ctaBg;
// Ganti path ini sesuai lokasi gambar di project kamu
// Taruh gambar di src/assets/ lalu import di sini
// import heroBg from '../assets/tugu-malang.jpg';
// import ctaBg from '../assets/malang-city.jpg';

const categories = [
  { icon: '🏞️', name: 'Wisata Alam',    color: '#e8f5ee', text: '#1a6b3a' },
  { icon: '🏛️', name: 'Wisata Budaya',  color: '#fef3e2', text: '#b8860b' },
  { icon: '🍜', name: 'Kuliner Legendaris', color: '#fde8e8', text: '#c0392b' },
  { icon: '📚', name: 'Wisata Edukasi', color: '#e8eef9', text: '#2c5aa0' },
  { icon: '🎡', name: 'Wisata Hiburan', color: '#f3e8fd', text: '#7b2d8b' },
  { icon: '⭐', name: 'Taman Kota', color: '#fff3e0', text: '#e65100' },
];

const destinations = [
  { name: 'Alun-Alun Tugu Malang', type: 'Taman Kota',      rating: '4.8', reviews: '2.1K', bg: 'linear-gradient(135deg,#1a3a2a,#2d6b45)', icon: '🏛️' },
  { name: 'Jatim Park 1',          type: 'Wisata Hiburan',   rating: '4.7', reviews: '1.8K', bg: 'linear-gradient(135deg,#1a1a3a,#3a2d6b)', icon: '🎡' },
  { name: 'Museum Angkut',         type: 'Wisata Edukasi',   rating: '4.6', reviews: '1.6K', bg: 'linear-gradient(135deg,#3a1a1a,#6b2d2d)', icon: '🚗' },
  { name: 'Coban Rondo',           type: 'Wisata Alam',      rating: '4.7', reviews: '1.4K', bg: 'linear-gradient(135deg,#1a3a3a,#2d6b6b)', icon: '💧' },
  { name: 'Kampung Warna-Warni',   type: 'Wisata Budaya',    rating: '4.5', reviews: '1.2K', bg: 'linear-gradient(135deg,#3a2a1a,#6b4f2d)', icon: '🎨' },
];

const whyUs = [
  { icon: '🗺️', title: 'Informasi Lengkap',    desc: 'Semua informasi wisata tersedia dalam satu platform yang mudah diakses kapan saja.' },
  { icon: '🔄', title: 'Update Terbaru',        desc: 'Informasi selalu diperbarui agar kamu tidak ketinggalan destinasi dan event terbaru.' },
  { icon: '❤️', title: 'Simpan Favorit',        desc: 'Simpan destinasi favoritmu dengan mudah untuk merencanakan perjalanan impian.' },
  { icon: '🔍', title: 'Mudah Dicari',          desc: 'Cari destinasi dengan cepat dan mudah sesuai kebutuhan dan selera kamu.' },
  { icon: '📅', title: 'Info Event',            desc: 'Temukan berbagai event menarik yang ada di Kota Malang sepanjang tahun.' },
  { icon: '🎧', title: 'Dukungan Wisatawan',   desc: 'Kami siap membantu perjalananmu di Malang dengan panduan dan informasi terbaik.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#faf8f3', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={logo} alt="GasNgalam" style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>
            Kota Malang
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '9px 22px', borderRadius: 99,
              background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter,sans-serif', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >Masuk</button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '9px 22px', borderRadius: 99,
              background: '#eb8e25', border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter,sans-serif', transition: 'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ca6f08'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff9900'}
          >Daftar Gratis</button>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
      }}>
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '60px 60px 80px', maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 99, padding: '5px 14px',
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
            letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20,
          }}>📍 Jawa Timur, Indonesia</div>

          <h1 style={{
            fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.1, marginBottom: 18,
            letterSpacing: '-1.5px',
          }}>
            Informasi Destinasi<br />Wisata Kota Malang
          </h1>

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7, marginBottom: 36, maxWidth: 480,
          }}>
            Temukan berbagai destinasi wisata menarik, kuliner lezat, event seru, dan informasi penting seputar Kota Malang.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '14px 30px', borderRadius: 99,
                background: '#1a6b3a', border: 'none',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2d8a50'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; e.currentTarget.style.transform = ''; }}
            >🧭 Mulai Jelajahi</button>

            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '13px 28px', borderRadius: 99,
                background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)',
                color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
            >Sudah punya akun?</button>
          </div>
        </div>

        {/* Stats — dipindah ke luar hero sebagai bar bawah */}
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        background: '#1a1a1a', padding: '0',
      }}>
        {[
          { num: '200+', label: 'Destinasi' },
          { num: '4.8★', label: 'Rating' },
          { num: '50K+', label: 'Pengunjung' },
        ].map(({ num, label }, i) => (
          <div key={label} style={{
            flex: 1, maxWidth: 200,
            padding: '28px 24px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════ KATEGORI DESTINASI ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#faf8f3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-block',
              background: '#e8f5ee', color: '#1a6b3a',
              fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 99, marginBottom: 12,
            }}>Kategori</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-1px', marginBottom: 10 }}>
              Kategori Destinasi
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)', maxWidth: 440, margin: '0 auto' }}>
              Jelajahi berbagai jenis destinasi wisata di Kota Malang
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
            {categories.map(({ icon, name, color, text }) => (
              <div
                key={name}
                onClick={() => navigate('/login')}
                style={{
                  background: '#fff', borderRadius: 16, padding: '22px 12px 18px',
                  textAlign: 'center', cursor: 'pointer',
                  border: '1.5px solid transparent',
                  transition: 'all .2s',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#1a6b3a';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,107,58,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 12px', fontSize: 22,
                }}>{icon}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DESTINASI POPULER ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#e8f5ee', color: '#1a6b3a',
                fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                padding: '5px 14px', borderRadius: 99, marginBottom: 10,
              }}>Terpopuler</div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-1px' }}>
                Destinasi Populer
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', marginTop: 6 }}>
                Tempat wisata favorit yang wajib kamu kunjungi
              </p>
            </div>
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#ff7b00', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >Lihat Semua →</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            {destinations.map(({ name, type, rating, reviews, bg, icon }) => (
              <div
                key={name}
                onClick={() => navigate('/login')}
                style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
              >
                {/* Gambar placeholder — ganti dengan <img> jika ada gambar nyata */}
                <div style={{
                  width: '100%', aspectRatio: '3/2',
                  background: bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 36, position: 'relative',
                  transition: 'transform .4s', overflow: 'hidden',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  <span style={{ opacity: 0.4 }}>{icon}</span>
                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
                    borderRadius: 99, padding: '3px 10px',
                    fontSize: 10, fontWeight: 600, color: '#1a1a1a',
                  }}>{type}</div>
                </div>
                <div style={{ padding: '12px 2px 4px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, color: '#1a1a1a' }}>{name}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>{type}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span style={{ fontWeight: 700 }}>{rating}</span>
                    <span style={{ color: 'rgba(0,0,0,0.4)' }}>({reviews} ulasan)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MENGAPA GASNGALAM ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#faf8f3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-block',
              background: '#e8f5ee', color: '#1a6b3a',
              fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 99, marginBottom: 12,
            }}>Keunggulan</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-1px', marginBottom: 10 }}>
              Mengapa GasNgalam?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)', maxWidth: 460, margin: '0 auto' }}>
              Platform terpercaya untuk merencanakan perjalananmu di Kota Malang
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {whyUs.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: '#fff', borderRadius: 20, padding: '28px 24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: '#e8f5ee', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22, marginBottom: 16,
                }}>{icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <div style={{ padding: '0 60px 80px' }}>
        <div style={{
          position: 'relative', borderRadius: 24, overflow: 'hidden',
          backgroundImage: `url(${CTA_BG})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          padding: '80px 60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,40,20,0.88) 0%, rgba(10,40,20,0.6) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 480 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.2, letterSpacing: '-1px' }}>
              Siap Jelajahi Kota Malang?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              Mulai rencanakan perjalananmu dan temukan pengalaman tak terlupakan di Kota Malang yang indah.
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#c9973a', color: '#fff',
                border: 'none', padding: '16px 36px', borderRadius: 99,
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b8882d'; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c9973a'; e.currentTarget.style.transform = ''; }}
            >Mulai Jelajahi →</button>
          </div>
        </div>
      </div>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ background: '#0f2417', padding: '60px 60px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 48 }}>

            {/* Brand */}
            <div>
              <img src={logo} alt="GasNgalam" style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 14 }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 240 }}>
                Platform informasi wisata resmi Kota Malang untuk membantu kamu menemukan destinasi terbaik.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                {['📘', '📸', '▶️', '🎵'].map((icon, i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, cursor: 'pointer', transition: 'border-color .2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#c9973a'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                  >{icon}</div>
                ))}
              </div>
            </div>

            {/* Destinasi */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#c9973a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Destinasi</div>
              {['Wisata Alam', 'Wisata Budaya', 'Wisata Kuliner', 'Wisata Edukasi', 'Tempat Populer'].map(item => (
                <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9973a'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >{item}</div>
              ))}
            </div>

            {/* Informasi */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#c9973a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Informasi</div>
              {['Event', 'Berita', 'Panduan Wisata', 'Transportasi', 'Peta Wisata'].map(item => (
                <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9973a'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >{item}</div>
              ))}
            </div>

            {/* Kontak */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#c9973a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Kontak</div>
              {[
                { icon: '📍', text: 'Kota Malang, Jawa Timur' },
                { icon: '✉️', text: 'halo@gasngalam.id' },
                { icon: '📱', text: '+62 812-3456-7890' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '20px 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              © 2026 GasNgalam Semua hak cipta dilindungi.
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(item => (
                <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}