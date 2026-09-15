import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MapPin, Tag, Phone, Info } from 'lucide-react';
import { calculateTotalPrice } from '../../utils/priceCalculator';
import toast from 'react-hot-toast';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/api/public/services/${id}`);
        const fetchedService = response.data.data;
        setService(fetchedService);
        if (fetchedService.startDate && fetchedService.endDate) {
          setStartDate(fetchedService.startDate.split('T')[0]);
          setEndDate(fetchedService.endDate.split('T')[0]);
        }
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
      toast.error('Please select both start and end dates.');
      return;
    }
    if (guests < 1) {
      toast.error('Number of persons must be at least 1.');
      return;
    }
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (eDate < sDate) {
      toast.error('End date cannot be before start date.');
      return;
    }

    setBookingLoading(true);

    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const totalPrice = calculateTotalPrice(service.pricePerDay, startDate, endDate) * guests;

      await api.post(`/api/user/bookings`, {
        serviceId: service._id,
        startDate,
        endDate,
        totalPrice,
        guests
      });

      toast.success('Successfully booked! Redirecting to My Bookings...');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading details...</div>;
  if (!service) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Service not found</div>;

  const totalPrice = (startDate && endDate && new Date(endDate) >= new Date(startDate)) 
    ? calculateTotalPrice(service.pricePerDay, startDate, endDate) * guests
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
              ${service.pricePerDay} <span style={{ fontSize: '1rem', color: 'var(--user-text-muted)', fontWeight: 'normal' }}>/ day / person</span>
            </div>

            {service.startDate && service.endDate && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--user-text-muted)', marginBottom: '8px' }}>Available Event Window</div>
                <div style={{ fontWeight: 'bold' }}>
                  {new Date(service.startDate).toLocaleDateString()} - {new Date(service.endDate).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="filter-group">
              <label className="filter-label">Check-in Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="filter-input" 
                min={service.startDate ? service.startDate.split('T')[0] : new Date().toISOString().split('T')[0]} 
                max={service.endDate ? service.endDate.split('T')[0] : undefined}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Check-out Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="filter-input" 
                min={startDate || (service.startDate ? service.startDate.split('T')[0] : new Date().toISOString().split('T')[0])} 
                max={service.endDate ? service.endDate.split('T')[0] : undefined}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Number of Persons</label>
              <input type="number" min="1" value={guests} onChange={e => setGuests(parseInt(e.target.value) || 1)} className="filter-input" />
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
