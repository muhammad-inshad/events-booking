import React, { useEffect, useState } from 'react';
import { bookingService } from '../../service/bookingService';
import { Link } from 'react-router-dom';
import type { Booking, BookingServiceRef } from '../../types/models';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await bookingService.getMyBookings();
        setBookings(result);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--user-text)' }}>Loading your bookings...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '32px', fontWeight: '800', color: 'var(--user-text)' }}>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div style={{ background: 'var(--user-card-bg)', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--user-border)' }}>
          <p style={{ color: 'var(--user-text-muted)', fontSize: '1.1rem', marginBottom: '24px' }}>You haven't booked any services yet.</p>
          <Link to="/home" className="user-btn" style={{ textDecoration: 'none' }}>Explore Services</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="user-bookings-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Location</th>
                <th>Dates</th>
                <th>Persons</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => {
                const isPast = new Date(booking.endDate) < new Date();
                const service: BookingServiceRef | null =
                  typeof booking.serviceId === 'string' ? null : booking.serviceId;
                return (
                  <tr key={booking._id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/service/${service?._id}`} style={{ color: 'var(--user-text)', textDecoration: 'none' }}>
                        {service?.title || 'Unknown Service'}
                      </Link>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{service?.category}</td>
                    <td>{service?.location}</td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--user-text-muted)' }}>to {new Date(booking.endDate).toLocaleDateString()}</div>
                    </td>
                    <td>{booking.guests || 1}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--user-primary)' }}>${booking.totalPrice}</td>
                    <td>
                      <span className={`status-badge ${isPast ? 'status-past' : 'status-upcoming'}`}>
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
