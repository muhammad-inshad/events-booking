import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';

const Home: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/public/services', {
        params: { ...filters, page, limit: 12 }
      });
      setServices(response.data.data);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (page !== 1) {
      setPage(1);
    } else {
      fetchServices();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Find the Perfect Vibe for Your Event</h1>
        <p className="hero-subtitle">Discover top-rated venues, premium caterers, and talented professionals.</p>
      </section>

      {/* Filter Bar */}
      <form className="filter-bar" onSubmit={handleSearch}>
        <div className="filter-group">
          <label className="filter-label"><Search size={14} /> Keyword</label>
          <input type="text" name="keyword" value={filters.keyword} onChange={handleChange} placeholder="e.g. Wedding" className="filter-input" />
        </div>
        <div className="filter-group">
          <label className="filter-label"><Tag size={14} /> Category</label>
          <select name="category" value={filters.category} onChange={handleChange} className="filter-input">
            <option value="">All Categories</option>
            <option value="venue">Venue</option>
            <option value="caterer">Caterer</option>
            <option value="dj">DJ</option>
            <option value="photographer">Photographer</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label"><MapPin size={14} /> Location</label>
          <input type="text" name="location" value={filters.location} onChange={handleChange} placeholder="City or region" className="filter-input" />
        </div>
        <div className="filter-group">
          <label className="filter-label"><Calendar size={14} /> Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="filter-input" />
        </div>
        <div className="filter-group">
          <label className="filter-label"><Calendar size={14} /> End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="filter-input" />
        </div>
        <div className="filter-group filter-action">
          <button type="submit" className="user-btn">Search</button>
        </div>
      </form>

      {/* Service Grid */}
      <section className="service-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--user-text-muted)' }}>Loading services...</div>
        ) : (
          <div className="service-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <div className="service-card-img">
                  <span className="service-card-category">{service.category}</span>
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '3rem', textTransform: 'capitalize' }}>
                      {service.category}
                    </span>
                  )}
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{service.title}</h3>
                  <div className="service-card-info">
                    <MapPin size={14} /> {service.location}
                  </div>
                  <div className="service-card-info" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {service.description}
                  </div>
                  <div className="service-card-price">
                    ${service.pricePerDay} <span style={{ fontSize: '0.8rem', color: 'var(--user-text-muted)', fontWeight: 'normal' }}>/ day</span>
                  </div>
                  <Link to={`/service/${service._id}`} className="user-btn" style={{ marginTop: '16px', textDecoration: 'none' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--user-text-muted)' }}>
                No services found matching your criteria. Try adjusting your filters.
              </div>
            )}
            {services.length > 0 && totalPages > 1 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                <button 
                  className="user-btn" 
                  disabled={page <= 1} 
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  Previous
                </button>
                <span style={{ color: 'var(--user-text-muted)', fontSize: '0.95rem' }}>Page {page} of {totalPages}</span>
                <button 
                  className="user-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
