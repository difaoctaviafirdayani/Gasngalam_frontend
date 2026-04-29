import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Rating from './pages/Rating';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Klaim from './pages/Klaim';
import AdminDashboard from './pages/admin/Dashboard';
import AdminWisata from './pages/admin/ManageWisata';
import AdminKlaim from './pages/admin/ManageKlaim';
import AdminUlasan from './pages/admin/ManageUlasan';

function AdminRoute({ children }) {
  const { user, role } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/" />;
  return children;
}

function AppInner() {
  const { toast, loginModal, closeLoginModal } = useApp();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/destination/:id" element={<Detail />} />
        <Route path="/destination/:id/rating" element={<Rating />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/klaim/:id" element={<Klaim />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/wisata" element={<AdminRoute><AdminWisata /></AdminRoute>} />
        <Route path="/admin/klaim" element={<AdminRoute><AdminKlaim /></AdminRoute>} />
        <Route path="/admin/ulasan" element={<AdminRoute><AdminUlasan /></AdminRoute>} />
      </Routes>
      <div className={'toast-bar' + (toast.show ? ' show' : '')}>{toast.msg}</div>
      {loginModal.open && <LoginModal msg={loginModal.msg} onClose={closeLoginModal} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
