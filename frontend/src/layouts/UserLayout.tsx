import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Compass, CalendarDays, LogOut } from 'lucide-react';
import '../user.css';

const UserLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="user-layout">
      {/* Navbar */}
      <nav className="user-navbar">
        <div className="user-nav-container">
          <Link to="/home" className="user-logo">
            <Compass className="user-logo-icon" size={28} />
            <span className="user-logo-text">VibeBook</span>
          </Link>
          
          <div className="user-nav-links">
            <Link 
              to="/home" 
              className={`user-nav-link ${location.pathname === '/home' ? 'active' : ''}`}
            >
              Explore
            </Link>
            <Link 
              to="/my-bookings" 
              className={`user-nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
            >
              <CalendarDays size={18} />
              My Bookings
            </Link>
          </div>
          
          <div className="user-nav-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="user-logout-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="user-main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="user-footer">
        <p>&copy; {new Date().getFullYear()} VibeBook Events. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserLayout;
