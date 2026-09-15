import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { Shield, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const EventOwnerManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      toast.success('Role updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleBlockToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const isBlocked = !currentStatus;
      await api.put(`/api/admin/users/${userId}/block`, { isBlocked });
      fetchUsers();
      toast.success(isBlocked ? 'User blocked successfully' : 'User unblocked successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update block status');
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Loading users...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h1 className="management-title">User & Role Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage Event Owners and user permissions.</p>
      </div>

      {error && <div style={{ color: '#ff4d4f', marginBottom: '20px' }}>{error}</div>}

      <div className="management-card">
        <div className="table-responsive">
          <table className="management-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Current Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {user.role === 'admin' ? <Shield size={16} color="#8b5cf6" /> : <UserIcon size={16} />}
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: user.isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: user.isBlocked ? '#b91c1c' : '#047857',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: user.role === 'admin' ? 'rgba(139, 92, 246, 0.15)' : user.role === 'event_owner' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100,116,139,0.15)',
                      color: user.role === 'admin' ? '#5b21b6' : user.role === 'event_owner' ? '#047857' : '#334155',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {user.role !== 'admin' && (
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', cursor: 'pointer' }}
                        >
                          <option value="user">User</option>
                          <option value="event_owner">Event Owner</option>
                        </select>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor: user.isBlocked ? '#10b981' : '#ef4444',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventOwnerManagement;
