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
  
  // Also check cookie just in case state was lost but cookie is still there
  const hasToken = !!Cookies.get('accessToken');
  const isAuth = isAuthenticated || hasToken;

  // If this route is /login or /register, and user is ALREADY logged in
  if (isAuthRoute && isAuth) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // For protected routes, if NOT logged in
  if (!isAuthRoute && !isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check roles if specified
  if (!isAuthRoute && allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
