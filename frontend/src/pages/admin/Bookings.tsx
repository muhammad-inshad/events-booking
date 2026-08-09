import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: 5 }
        });
        setBookings(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h1 className="admin-title">Bookings</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>User</th>
              <th>Dates</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.serviceId?.title || 'Unknown'}</td>
                <td>
                  {booking.userId?.name} <br/>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{booking.userId?.email}</span>
                </td>
                <td>
                  {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td>${booking.totalPrice}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No bookings found for your services.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button 
          className="admin-page-btn" 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="admin-page-info">Page {page} of {totalPages}</span>
        <button 
          className="admin-page-btn" 
          disabled={page >= totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Bookings;
