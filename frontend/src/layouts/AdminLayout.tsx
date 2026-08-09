import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, Package, Calendar, LogOut } from 'lucide-react';
import '../admin.css';

const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Service Management', path: '/admin/services', icon: <Package size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="admin-theme">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          Admin Portal
        </div>
        
        <nav className="admin-nav">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div>
          <button 
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
