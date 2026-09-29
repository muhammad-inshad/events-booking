import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authService } from '../service/authService';
import './Auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEventOwner, setIsEventOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
        role: isEventOwner ? 'event_owner' : 'user'
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      toast.error(message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us to start booking events</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User className="input-icon" />
            </div>
          </div>

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
          
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              id="eventOwner" 
              checked={isEventOwner} 
              onChange={(e) => setIsEventOwner(e.target.checked)} 
              style={{ width: 'auto' }}
            />
            <label htmlFor="eventOwner" style={{ marginBottom: 0 }}>Register as an Event Provider</label>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
