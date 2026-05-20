import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import LoginModal from './components/LoginModal';

import UserLayout from './pages/UserLayout';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Rating from './pages/Rating';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Klaim from './pages/Klaim';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

import AdminDashboard from './pages/admin/Dashboard';
import AdminWisata from './pages/admin/ManageWisata';
import AdminKlaim from './pages/admin/ManageKlaim';
import AdminUlasan from './pages/admin/ManageUlasan';
import AdminDetailWisata from './pages/admin/AdminDetailWisata';

function AdminRoute({ children }) {
  const { user, role } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/" />;
  return children;
}

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function HomeOrLanding() {
  const { user } = useApp();
  return user ? <UserLayout><Home /></UserLayout> : <LandingPage />;
}

function AppInner() {
  const { toast, loginModal, closeLoginModal } = useApp();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeOrLanding />} />
        <Route path="/search" element={<UserLayout><Search /></UserLayout>} />
        <Route path="/destination/:id" element={<UserLayout><Detail /></UserLayout>} />
        <Route path="/destination/:id/rating" element={<UserLayout><Rating /></UserLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<UserLayout><Favorites /></UserLayout>} />
        <Route path="/klaim/:id" element={<UserLayout><Klaim /></UserLayout>} />
        <Route path="/profile" element={<ProtectedRoute><UserLayout><Profile /></UserLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><UserLayout><Notifications /></UserLayout></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/wisata" element={<AdminRoute><AdminWisata /></AdminRoute>} />
        <Route path="/admin/klaim" element={<AdminRoute><AdminKlaim /></AdminRoute>} />
        <Route path="/admin/ulasan" element={<AdminRoute><AdminUlasan /></AdminRoute>} />
        <Route path="/admin/destination/:id" element={<AdminRoute><AdminDetailWisata /></AdminRoute>} />
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