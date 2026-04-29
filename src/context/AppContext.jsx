import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [role, setRole]             = useState(null);
  const [favs, setFavs]             = useState(new Set());
  const [comments, setComments]     = useState({});
  const [toast, setToast]           = useState({ msg: '', show: false });
  const [loginModal, setLoginModal] = useState({ open: false, msg: '' });

  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedRole  = localStorage.getItem('role');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(savedUser);
      setRole(savedRole);
      api.get('/favorites/ids')
        .then(res => setFavs(new Set(res.data)))
        .catch(() => {});
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const requireLogin = (msg) => {
    if (!user) {
      setLoginModal({ open: true, msg: msg || 'Silakan login terlebih dahulu.' });
      return false;
    }
    return true;
  };

  const closeLoginModal = () => setLoginModal({ open: false, msg: '' });

  const login = async (email, password) => {
    if (!email || !password) { showToast('Email dan password harus diisi'); return null; }
    try {
      const res = await api.post('/login', { email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  data.user.name);
      localStorage.setItem('role',  data.user.role);
      setUser(data.user.name);
      setRole(data.user.role);
      showToast(data.user.role === 'admin' ? 'Login sebagai Admin berhasil!' : `Selamat datang, ${data.user.name}!`);
      api.get('/favorites/ids').then(r => setFavs(new Set(r.data))).catch(() => {});
      return data.user.role;
    } catch (err) {
      showToast(err.message || 'Email atau password salah');
      return null;
    }
  };

  const register = async (name, email, phone, password, passwordConfirmation) => {
    try {
      const res = await api.post('/register', { name, email, phone, password, password_confirmation: passwordConfirmation });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  data.user.name);
      localStorage.setItem('role',  data.user.role);
      setUser(data.user.name);
      setRole(data.user.role);
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
    setUser(null); setRole(null); setFavs(new Set());
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
    } catch (err) {
      showToast(err.message || 'Gagal update favorit');
    }
  };

  const fetchComments = async (destId) => {
    try {
      const res = await api.get(`/destinations/${destId}/reviews`);
      const formatted = res.data.map(r => ({
        user:     r.user?.name || 'Anonim',
        time:     new Date(r.created_at).toLocaleDateString('id-ID'),
        text:     r.comment,
        rating:   r.rating,
        reported: r.is_reported || false,
      }));
      setComments(prev => ({ ...prev, [destId]: formatted }));
    } catch {}
  };

  const addComment = async (destId, { rating, text }) => {
    if (!requireLogin('Login dulu untuk memberikan ulasan.')) return;
    try {
      await api.post(`/destinations/${destId}/reviews`, { rating, comment: text });
      showToast('Ulasan berhasil ditambahkan!');
      await fetchComments(destId);
    } catch (err) {
      showToast(err.message || 'Gagal mengirim ulasan');
    }
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
      return true;
    } catch (err) {
      showToast(err.message || 'Gagal mengirim klaim');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user, role, favs, comments, toast, loginModal,
      login, register, logout, toggleFav,
      addComment, fetchComments, addKlaim,
      requireLogin, closeLoginModal, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
