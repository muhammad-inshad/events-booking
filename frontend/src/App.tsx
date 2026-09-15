import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCurrentUser } from './store/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ServiceManagement from './pages/admin/ServiceManagement';
import Bookings from './pages/admin/Bookings';
import UserLayout from './layouts/UserLayout';
import Home from './pages/user/Home';
import ServiceDetails from './pages/user/ServiceDetails';
import MyBookings from './pages/user/MyBookings';
import EventOwnerManagement from './pages/admin/EventOwnerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user && status === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user, status]);

  if (status === 'loading') {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Auth Routes (unauthenticated users only) */}
        <Route element={<ProtectedRoute isAuthRoute={true} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Provider / Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'event_owner']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/services" element={<ServiceManagement />} />
            <Route path="/admin/bookings" element={<Bookings />} />
          </Route>
        </Route>

        {/* Super Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<EventOwnerManagement />} />
          </Route>
        </Route>

        {/* Public/User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'event_owner']} />}>
          <Route element={<UserLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
