import { Routes, Route, Navigate } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Routes>
      {/* Auth Routes (unauthenticated users only) */}
      <Route element={<ProtectedRoute isAuthRoute={true} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/services" element={<ServiceManagement />} />
          <Route path="/admin/bookings" element={<Bookings />} />
        </Route>
      </Route>

      {/* Public/User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
