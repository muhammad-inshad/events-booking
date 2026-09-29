import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../service/authService';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token, refreshToken } = await authService.login({ email, password });

      dispatch(setCredentials({ user, accessToken: token, refreshToken }));

      toast.success('Successfully logged in!');

      if (user.role === 'admin' || user.role === 'event_owner') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : 'An unexpected error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="input-icon" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
