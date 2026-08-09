import React from 'react';
import { useAppSelector } from '../../store/hooks';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);

  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>
      <div className="admin-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.name}</span>!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Select an option from the sidebar to manage your services and view bookings.</p>
      </div>
    </div>
  );
};

export default Dashboard;
