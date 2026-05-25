import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-gasngalam.svg';
import {
  FaInstagram, FaFacebookF, FaYoutube, FaTiktok,
  FaMapMarkerAlt, FaEnvelope, FaPhoneAlt,
} from 'react-icons/fa';

const socialIcons = [
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaFacebookF, label: 'Facebook'  },
  { Icon: FaYoutube,   label: 'YouTube'   },
  { Icon: FaTiktok,    label: 'TikTok'    },
];

const contactInfo = [
  { Icon: FaMapMarkerAlt, text: 'Kota Malang, Jawa Timur, Indonesia' },
  { Icon: FaEnvelope,     text: 'info@gasngalam.id'                  },
  { Icon: FaPhoneAlt,     text: '+62 812-3456-7890'                  },
];

export default function Footer() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const year = new Date().getFullYear();

  const gold     = '#C9A227';
  const goldPale = isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.12)';
  const footerBg = isDark ? '#050709' : '#0f1117';

  return (
    <footer style={{
      background: footerBg,
      borderTop: `1px solid ${isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.2)'}`,
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 60px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48,
          paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Brand */}
          <div>
            <img src={logo} alt="GasNgalam" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 6 }} />
            <div style={{ fontSize: 9, color: gold, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
              Kota Malang
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 240 }}>
              Platform informasi wisata resmi Kota Malang untuk membantu kamu menemukan destinasi terbaik dan pengalaman tak terlupakan.
            </p>
            <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
              {socialIcons.map(({ Icon, label }) => (
                <div key={label} title={label} aria-label={label} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .2s', color: 'rgba(255,255,255,0.45)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = goldPale; e.currentTarget.style.color = gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* JELAJAHI & INFORMASI — persis sama dengan LandingPage */}
          {[
            { title: 'JELAJAHI',  links: ['Destinasi', 'Aktivitas', 'Kuliner', 'Event', 'Panduan'] },
            { title: 'INFORMASI', links: ['Tentang Kami', 'Blog', 'FAQ', 'Kebijakan Privasi', 'Syarat & Ketentuan'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
                {title}
              </div>
              {links.map(item => (
                <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}

          {/* Kontak */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
              KONTAK
            </div>
            {contactInfo.map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <Icon size={14} style={{ color: gold, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar — persis sama dengan LandingPage */}
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © {year} Gasngalam Kota Malang. Made with Love, Kelompok 3 T2E.
          </span>
        </div>
      </div>
    </footer>
  );
}