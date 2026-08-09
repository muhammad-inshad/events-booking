import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MapPin, Tag, Phone, Info } from 'lucide-react';
import { calculateTotalPrice } from '../../utils/priceCalculator';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/services/${id}`);
        setService(response.data.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBook = async () => {
    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates.');
      return;
    }
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (eDate < sDate) {
      setBookingError('End date cannot be before start date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const totalPrice = calculateTotalPrice(service.pricePerDay, startDate, endDate);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/bookings`, {
        serviceId: service._id,
        startDate,
        endDate,
        totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookingSuccess(true);
      // Reset dates
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      setBookingError(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading details...</div>;
  if (!service) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Service not found</div>;

  const totalPrice = (startDate && endDate && new Date(endDate) >= new Date(startDate)) 
    ? calculateTotalPrice(service.pricePerDay, startDate, endDate) 
    : 0;

  return (
    <div className="details-container">
      <div className="details-header">
        <h1 className="details-title">{service.title}</h1>
        <div className="details-meta">
          <div className="details-meta-item"><Tag size={16} /> <span style={{ textTransform: 'capitalize' }}>{service.category}</span></div>
          <div className="details-meta-item"><MapPin size={16} /> {service.location}</div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-main">
          <div className="service-card-img" style={{ height: '400px', borderRadius: '16px', marginBottom: '40px', overflow: 'hidden' }}>
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '5rem', textTransform: 'capitalize' }}>
                {service.category}
              </span>
            )}
          </div>
          
          <div className="details-description">
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={20} /> About this Service</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{service.description}</p>
            
            <h3 style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={20} /> Contact Information</h3>
            <p>{service.contactDetails}</p>
          </div>
        </div>

        <div className="details-sidebar">
          <div className="booking-widget">
            <div className="booking-price">
              ${service.pricePerDay} <span style={{ fontSize: '1rem', color: 'var(--user-text-muted)', fontWeight: 'normal' }}>/ day</span>
            </div>

            {bookingSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                Successfully booked! Check 'My Bookings' for details.
              </div>
            )}
            
            {bookingError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '16px', borderRadius: '8px', border: '1px solid #ef4444' }}>
                {bookingError}
              </div>
            )}

            <div className="filter-group">
              <label className="filter-label">Check-in Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="filter-input" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="filter-group">
              <label className="filter-label">Check-out Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="filter-input" min={startDate || new Date().toISOString().split('T')[0]} />
            </div>

            {totalPrice > 0 && (
              <div className="booking-total">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            )}

            <button 
              className="user-btn" 
              onClick={handleBook}
              disabled={bookingLoading}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {bookingLoading ? 'Processing...' : 'Reserve Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
