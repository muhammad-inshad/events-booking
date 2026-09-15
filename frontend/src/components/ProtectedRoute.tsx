import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
  isAuthRoute?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectPath = '/login',
  isAuthRoute = false
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const hasToken = !!Cookies.get('accessToken');
  const isAuth = isAuthenticated || hasToken;

  if (isAuthRoute && isAuth) {
    if (user?.role === 'admin' || user?.role === 'event_owner') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  if (!isAuthRoute && !isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAuthRoute && allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
