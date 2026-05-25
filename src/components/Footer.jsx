import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-gasngalam.svg';
import {
  FaInstagram, FaFacebookF, FaYoutube, FaTiktok,
  FaMapMarkerAlt, FaEnvelope, FaPhoneAlt,
  FaHome, FaHeart, FaSearch,
  FaLandmark, FaTree, FaBuilding, FaGraduationCap, FaShoppingBag,
} from 'react-icons/fa';

const socialIcons = [
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaFacebookF, label: 'Facebook' },
  { Icon: FaYoutube,   label: 'YouTube'  },
  { Icon: FaTiktok,    label: 'TikTok'   },
];

const contactInfo = [
  { Icon: FaMapMarkerAlt, text: 'Kota Malang, Jawa Timur' },
  { Icon: FaEnvelope,     text: 'info@gasngalam.id'       },
  { Icon: FaPhoneAlt,     text: '(0341) 123-4567'         },
];

const gold     = '#C9A227';
const goldPale = 'rgba(201,162,39,0.15)';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0f1117',
      borderTop: '1px solid rgba(201,162,39,0.2)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 60px 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: 48,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Brand */}
          <div>
            <img src={logo} alt="GasNgalam" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 6 }} />
            <div style={{ fontSize: 9, color: gold, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
              Kota Malang
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 240 }}>
              Temukan destinasi wisata terbaik di Kota Malang.<br />
              Dari budaya, kuliner, hingga hiburan — semua ada di sini.
            </p>
            <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
              {socialIcons.map(({ Icon, label }) => (
                <a href="#" key={label} title={label} aria-label={label} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .2s',
                  color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = goldPale; e.currentTarget.style.color = gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>JELAJAHI</div>
            {[
              { Icon: FaHome,    label: 'Beranda',       path: '/'          },
              { Icon: FaHeart,   label: 'Favorit Saya',  path: '/favorites' },
              { Icon: FaSearch,  label: 'Cari Destinasi', path: '/search'   },
            ].map(({ Icon, label, path }) => (
              <div key={label} onClick={() => navigate(path)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, color: 'rgba(255,255,255,0.45)',
                marginBottom: 12, cursor: 'pointer', transition: 'color .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
              >
                <Icon size={12} style={{ color: gold, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>

          {/* Kategori */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>KATEGORI</div>
            {[
              { Icon: FaLandmark,    label: 'Wisata Budaya'  },
              { Icon: FaTree,        label: 'Taman Kota'     },
              { Icon: FaBuilding,    label: 'Wisata Buatan'  },
              { Icon: FaGraduationCap, label: 'Wisata Edukasi' },
              { Icon: FaShoppingBag, label: 'Perbelanjaan'   },
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12,
              }}>
                <Icon size={12} style={{ color: gold, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>

          {/* Kontak */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>INFORMASI</div>
            {contactInfo.map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <Icon size={13} style={{ color: gold, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom */}
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
            © {year} <strong style={{ color: 'rgba(255,255,255,0.5)' }}>GasNgalam</strong>. Dibuat dengan
            <FaHeart size={10} style={{ color: gold }} /> untuk Kota Malang.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Tentang Kami'].map(item => (
              <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}