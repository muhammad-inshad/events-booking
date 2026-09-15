import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import api from '../../utils/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/services/dashboard-stats');
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="admin-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.name}</span>!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Select an option from the sidebar to manage your services and view bookings.</p>
      </div>

      <div className="admin-card" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Booking Trends (Last 6 Months)</h2>
        <div style={{ height: '300px', width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>Loading graph...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
