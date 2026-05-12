import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '🗺️', title: 'Eksplorasi Wisata',   desc: 'Temukan ratusan destinasi wisata terbaik di Kota Malang — dari taman kota, budaya, kuliner legendaris, hingga wisata alam yang memukau.' },
  { icon: '⭐', title: 'Ulasan & Rating',       desc: 'Baca ulasan jujur dari wisatawan lain, lengkap dengan foto dan rating bintang untuk membantu Anda memilih destinasi terbaik.' },
  { icon: '❤️', title: 'Simpan Favorit',        desc: 'Tandai dan simpan destinasi impian Anda. Buat daftar wisata pribadi yang bisa diakses kapan saja dan di mana saja.' },
  { icon: '📍', title: 'Temukan Terdekat',      desc: 'Cari destinasi wisata berdasarkan lokasi Anda saat ini. Fitur GPS kami membantu menemukan tempat wisata terdekat dengan mudah.' },
  { icon: '🏆', title: 'Klaim Bisnis',          desc: 'Pemilik destinasi wisata? Klaim bisnis Anda di GasNgalam untuk mengelola informasi dan menjangkau lebih banyak pengunjung.' },
  { icon: '🔍', title: 'Pencarian Cerdas',      desc: 'Cari destinasi berdasarkan nama, kategori, atau lokasi. Filter terpopuler, terdekat, atau tertinggi ratingnya dengan mudah.' },
];

const stats = [
  { num: '100+', label: 'Destinasi Wisata' },
  { num: '10K+', label: 'Ulasan Pengguna' },
  { num: '50K+', label: 'Pengunjung Aktif' },
  { num: '4.8★', label: 'Rating Aplikasi' },
];

const categories = [
  { icon: '🏛️', name: 'Wisata Budaya' },
  { icon: '🌳', name: 'Taman Kota' },
  { icon: '📚', name: 'Wisata Edukasi' },
  { icon: '🍜', name: 'Kuliner Legendaris' },
  { icon: '✨', name: 'Wisata Hiburan' },
  { icon: '🏞️', name: 'Wisata Alam' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#0A0B14', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: 'rgba(10,11,20,.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '0 24px', display: 'flex', alignItems: 'center', height: 60,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>
          Gas<span style={{ color: '#F59E0B' }}>Ngalam</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px', borderRadius: 99, background: 'transparent',
              border: '1px solid rgba(255,255,255,.25)', color: 'rgba(255,255,255,.85)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,.7)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.25)'}
          >Login</button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '8px 20px', borderRadius: 99,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              border: 'none', color: '#0A0B14',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              boxShadow: '0 4px 14px rgba(245,158,11,.35)', transition: 'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >Daftar Gratis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 80px', textAlign: 'center', position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,.12) 0%, transparent 70%)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)',
          borderRadius: 99, padding: '5px 14px', marginBottom: 28,
          fontSize: 12, fontWeight: 600, color: '#F59E0B', letterSpacing: '.5px',
        }}>
          🗺️ Panduan Wisata Kota Malang · Jawa Timur
        </div>

        <h1 style={{
          fontSize: 'clamp(38px, 7vw, 72px)', fontWeight: 900, color: '#fff',
          lineHeight: 1.1, marginBottom: 22, letterSpacing: '-2px', maxWidth: 800,
        }}>
          Eksplor Keindahan<br />
          <span style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Kota Malang
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(255,255,255,.55)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 44,
        }}>
          Platform terpercaya untuk menemukan, menyimpan, dan merencanakan wisata terbaik di Kota Malang. Lebih dari 100 destinasi menanti Anda.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 36px', borderRadius: 99,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              border: 'none', color: '#0A0B14', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              boxShadow: '0 8px 32px rgba(245,158,11,.4)', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(245,158,11,.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,.4)'; }}
          >Mulai Eksplorasi →</button>

          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 36px', borderRadius: 99,
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)',
              color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              backdropFilter: 'blur(8px)', transition: 'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
          >Sudah punya akun? Login</button>
        </div>

        <div style={{ position: 'absolute', top: 80, left: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 60, right: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </section>

      {/* STATS */}
      <section style={{
        padding: '60px 24px',
        background: 'rgba(255,255,255,.02)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {stats.map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#F59E0B', letterSpacing: '-1px' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORI */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>Kategori Wisata</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
              Semua Ada di GasNgalam
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {categories.map(({ icon, name }) => (
              <div
                key={name}
                onClick={() => navigate('/login')}
                style={{
                  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 16, padding: '22px 20px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,.08)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.transform = ''; }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>Fitur Unggulan</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>Dirancang untuk Wisatawan</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
              Fitur lengkap yang memudahkan perjalanan wisata Anda di Kota Malang
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: '28px 24px', transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-.3px' }}>{title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245,158,11,.1) 0%, transparent 70%)',
        borderTop: '1px solid rgba(255,255,255,.05)',
      }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', marginBottom: 16 }}>
          Siap Eksplorasi Malang?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
          Daftar gratis sekarang dan mulai temukan destinasi wisata terbaik Kota Malang.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '16px 48px', borderRadius: 99,
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            border: 'none', color: '#0A0B14', fontSize: 16, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'Inter,sans-serif',
            boxShadow: '0 10px 40px rgba(245,158,11,.45)', transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(245,158,11,.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 40px rgba(245,158,11,.45)'; }}
        >Daftar Sekarang — Gratis!</button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060710', borderTop: '1px solid rgba(255,255,255,.06)', padding: '60px 24px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>

            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-.5px' }}>
                Gas<span style={{ color: '#F59E0B' }}>Ngalam</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.8, maxWidth: 240 }}>
                Platform panduan wisata Kota Malang. Temukan destinasi terbaik, baca ulasan, dan rencanakan perjalanan Anda.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                {['📘', '📸', '🐦'].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>{icon}</div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>Wisata</div>
              {['Wisata Budaya', 'Taman Kota', 'Kuliner', 'Wisata Alam', 'Hiburan'].map(item => (
                <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 10, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.8)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}
                >{item}</div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
              {['Beranda', 'Cari Destinasi', 'Favorit Saya', 'Klaim Bisnis', 'Daftar Akun'].map(item => (
                <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 10, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.8)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}
                >{item}</div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>Kontak</div>
              {[
                { icon: '📍', text: 'Kota Malang, Jawa Timur' },
                { icon: '✉️', text: 'halo@gasngalam.id' },
                { icon: '📱', text: '+62 812-XXXX-XXXX' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
              © 2025 GasNgalam. Dibuat dengan ❤️ untuk wisatawan Malang.
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(item => (
                <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.3)'}
                >{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}