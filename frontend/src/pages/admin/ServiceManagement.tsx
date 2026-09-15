import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ServiceForm from '../../components/admin/ServiceForm';

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async () => {
    try {
      const response = await api.get(`/api/services`, {
        params: { keyword, category, page, limit: 5 }
      });
      setServices(response.data.data);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [keyword, category, page]);

  useEffect(() => {
    setPage(1);
  }, [keyword, category]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/services/${id}`);
        fetchServices();
        toast.success('Service deleted successfully');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <ServiceForm 
        initialData={editingService} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => {
          setIsFormOpen(false);
          fetchServices();
        }} 
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="admin-title" style={{ marginBottom: 0 }}>Service Management</h1>
        <button 
          onClick={handleAddNew}
          className="btn-primary"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="admin-input-group">
        <input 
          type="text" 
          placeholder="Search by keyword..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="admin-input"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="admin-input"
          style={{ flex: 'none', width: '200px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price / Day</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{service.title}</td>
                <td style={{ textTransform: 'capitalize' }}>{service.category}</td>
                <td>${service.pricePerDay}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleEdit(service)} className="action-btn edit"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(service._id)} className="action-btn delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No services found.</td>
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

export default ServiceManagement;
