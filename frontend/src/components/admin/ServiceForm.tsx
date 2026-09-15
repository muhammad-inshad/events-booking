import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import MapLocationPicker from '../MapLocationPicker';

interface ServiceFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    pricePerDay: initialData?.pricePerDay || 0,
    description: initialData?.description || '',
    contactDetails: initialData?.contactDetails || '',
    imageUrl: initialData?.imageUrl || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data.data);
        if (!initialData?.category && res.data.data.length > 0) {
          setFormData(prev => ({ ...prev, category: res.data.data[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload: any = formData;

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
        await api.put(`/api/services/${initialData._id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post(`/api/services`, payload);
        toast.success('Service created successfully');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="admin-label">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }}>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
              {categories.length === 0 && <option value="">Please add a category first</option>}
            </select>
          </div>
          <div>
            <label className="admin-label">Location</label>
            <MapLocationPicker 
              locationData={{ address: formData.location, lat: formData.lat, lng: formData.lng }}
              onChange={({ address, lat, lng }) => setFormData({ ...formData, location: address, lat, lng })}
            />
          </div>
          <div>
            <label className="admin-label">Price Per Day ($)</label>
            <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="admin-label">Contact Phone Number</label>
            <input type="tel" name="contactDetails" value={formData.contactDetails} onChange={handleChange} required pattern="^\+?[0-9]{10,15}$" title="Please enter a valid phone number (10-15 digits)" className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="admin-label">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label className="admin-label">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label className="admin-label">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label className="admin-label">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="admin-input" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
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
