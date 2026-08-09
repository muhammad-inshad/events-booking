import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface ServiceFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'venue',
    location: initialData?.location || '',
    pricePerDay: initialData?.pricePerDay || 0,
    description: initialData?.description || '',
    contactDetails: initialData?.contactDetails || '',
    imageUrl: initialData?.imageUrl || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('accessToken');
      let payload: any = formData;
      const headers: any = { Authorization: `Bearer ${token}` };

      if (imageFile) {
        payload = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'imageUrl') {
            payload.append(key, (formData as any)[key]);
          }
        });
        payload.append('imageFile', imageFile);
      }

      if (initialData) {
        await axios.put(`http://localhost:5000/api/services/${initialData._id}`, payload, { headers });
      } else {
        await axios.post('http://localhost:5000/api/services', payload, { headers });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-overlay">
      <div className="admin-modal">
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Edit Service' : 'Add New Service'}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="admin-label">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }}>
              <option value="venue">Venue</option>
              <option value="caterer">Caterer</option>
              <option value="dj">DJ</option>
              <option value="photographer">Photographer</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Price Per Day ($)</label>
            <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Contact Phone Number</label>
            <input type="tel" name="contactDetails" value={formData.contactDetails} onChange={handleChange} required pattern="^\+?[0-9]{10,15}$" title="Please enter a valid phone number (10-15 digits)" className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Image File (Upload)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
            {initialData?.imageUrl && !imageFile && <div style={{marginTop: '5px', fontSize: '0.8rem'}}>Current image: <a href={initialData.imageUrl} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>View</a></div>}
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="admin-input" style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
