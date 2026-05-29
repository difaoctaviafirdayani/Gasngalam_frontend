import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext(null);
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

function resolvePhotoUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + (url.startsWith('/') ? '' : '/') + url;
}

export function AppProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [userId, setUserId]         = useState(null);
  const [userDetail, setUserDetail] = useState(null); // {id, name, email, avatar_url, role}
  const [role, setRole]             = useState(null);
  const [favs, setFavs]             = useState(new Set());
  const [comments, setComments]     = useState({});
  const [toast, setToast]           = useState({ msg: '', show: false });
  const [loginModal, setLoginModal] = useState({ open: false, msg: '' });
  const [userCoords, setUserCoords] = useState(null);
  const [theme, setTheme]           = useState(() => localStorage.getItem('theme') || 'light');
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const fetchNotifCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setNotifCount(res.data.count || 0);
    } catch {}
  }, []);

 const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/me');
      setUserDetail(res.data);
      setUserId(res.data.id);
      setUser(res.data.name);
      localStorage.setItem('user', res.data.name);
    } catch {}
  }, []);

  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedRole  = localStorage.getItem('role');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(savedUser);
      setRole(savedRole);
      api.get('/favorites/ids').then(res => setFavs(new Set(res.data))).catch(() => {});
      fetchMe();
      fetchNotifCount();
    }
  }, []);

  // Poll notif count setiap 30 detik kalau user login
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchNotifCount, 30000);
    return () => clearInterval(interval);
  }, [user, fetchNotifCount]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const hitungJarak = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const requireLogin = (msg) => {
    if (!user) { setLoginModal({ open: true, msg: msg || 'Silakan login terlebih dahulu.' }); return false; }
    return true;
  };
  const closeLoginModal = () => setLoginModal({ open: false, msg: '' });

  const login = async (email, password) => {
    if (!email || !password) { showToast('Email dan password harus diisi'); return null; }
    try {
      const res  = await api.post('/login', { email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  data.user.name);
      localStorage.setItem('role',  data.user.role);
      setUser(data.user.name);
      setRole(data.user.role);
      setUserId(data.user.id);
      setUserDetail(data.user);
      showToast(data.user.role === 'admin'
        ? 'Login sebagai Admin berhasil!'
        : `Selamat datang, ${data.user.name}!`
      );
      api.get('/favorites/ids').then(r => setFavs(new Set(r.data))).catch(() => {});
      fetchNotifCount();
      return data.user.role;
    } catch (err) {
      showToast(err.message || 'Email atau password salah');
      return null;
    }
  };

  const register = async (name, email, phone, password, passwordConfirmation) => {
    try {
      const res  = await api.post('/register', { name, email, phone, password, password_confirmation: passwordConfirmation });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  data.user.name);
      localStorage.setItem('role',  data.user.role);
      setUser(data.user.name);
      setRole(data.user.role);
      setUserId(data.user.id);
      setUserDetail(data.user);
      showToast('Akun berhasil dibuat! Selamat datang, ' + data.user.name + '!');
      return true;
    } catch (err) {
      showToast(err.message || 'Gagal mendaftar');
      return false;
    }
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null); setRole(null); setUserId(null); setUserDetail(null);
    setFavs(new Set()); setComments({}); setNotifCount(0);
    showToast('Sampai jumpa!');
  };

  const toggleFav = async (id) => {
    if (!requireLogin('Login dulu untuk menyimpan destinasi favorit.')) return;
    const isFav = favs.has(id);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        setFavs(prev => { const n = new Set(prev); n.delete(id); return n; });
        showToast('Dihapus dari favorit');
      } else {
        await api.post(`/favorites/${id}`);
        setFavs(prev => new Set([...prev, id]));
        showToast('Berhasil ditambahkan ke favorit!');
      }
    } catch (err) { showToast(err.message || 'Gagal update favorit'); }
  };

  const fetchComments = async (destId) => {
    try {
      const res = await api.get(`/destinations/${destId}/reviews`);
      const formatted = res.data.map(r => ({
        id:             r.id,
        user:           r.user?.name || 'Anonim',
        time:           new Date(r.created_at).toLocaleDateString('id-ID'),
        text:           r.comment,
        rating:         r.rating,
        is_reported:    r.is_reported || false,
        photo_full_url: resolvePhotoUrl(r.photo_full_url || r.photo_url || r.photo || null),
      }));
      setComments(prev => ({ ...prev, [destId]: formatted }));
    } catch {}
  };

  const addComment = async (destId, { rating, text, photo }) => {
    if (!requireLogin('Login dulu untuk memberikan ulasan.')) return;
    try {
      const formData = new FormData();
      formData.append('rating',  rating);
      formData.append('comment', text);
      if (photo) formData.append('photo', photo);
      await api.post(`/destinations/${destId}/reviews`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Ulasan berhasil ditambahkan!');
      await fetchComments(destId);
    } catch (err) { showToast(err.message || 'Gagal mengirim ulasan'); }
  };

  const reportComment = async (reviewId) => {
    if (!requireLogin('Login dulu untuk melaporkan ulasan.')) return false;
    try {
      await api.post(`/reviews/${reviewId}/report`);
      showToast('Ulasan berhasil dilaporkan. Admin akan meninjau.');
      return true;
    } catch (err) { showToast(err.message || 'Gagal melaporkan ulasan'); return false; }
  };

  const addKlaim = async ({ destination_id, nama, email, hp, ket, file }) => {
    if (!requireLogin('Login dulu untuk mengajukan klaim bisnis.')) return false;
    try {
      const formData = new FormData();
      formData.append('destination_id', destination_id);
      formData.append('full_name',      nama);
      formData.append('email',          email);
      formData.append('phone',          hp);
      formData.append('description',    ket);
      if (file) formData.append('document', file);
      await api.post('/claims', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Klaim berhasil dikirim! Menunggu verifikasi admin.');
      fetchNotifCount();
      return true;
    } catch (err) { showToast(err.message || 'Gagal mengirim klaim'); return false; }
  };

  return (
    <AppContext.Provider value={{
      user, userId, userDetail, role,
      favs, comments, toast, loginModal,
      userCoords, hitungJarak,
      login, register, logout, toggleFav,
      addComment, fetchComments, addKlaim, reportComment,
      requireLogin, closeLoginModal, showToast,
      theme, toggleTheme,
      notifCount, setNotifCount, fetchNotifCount, fetchMe,
      resolvePhotoUrl,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);