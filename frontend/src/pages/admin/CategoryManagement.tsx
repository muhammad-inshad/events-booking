import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/categories');
      setCategories(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
   
    try {
      if (name == "") {
     
        return toast.error('Please enter a category name'); 
      }
      await api.post('/api/categories', { name });
      setName('');
      fetchCategories();
      toast.success('Category created successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editingId) return;
    try {
      await api.put(`/api/categories/${editingId}`, { name: editName });
      setEditingId(null);
      setEditName('');
      fetchCategories();
      toast.success('Category updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
        toast.success('Category deleted successfully');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (loading && categories.length === 0) return <div style={{ padding: '40px', color: '#fff' }}>Loading categories...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h1 className="management-title">Category Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage categories for your services.</p>
      </div>

      <div className="management-card" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="New Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input"
            style={{ margin: 0, flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={18} /> Add Category
          </button>
        </form>
      </div>

      <div className="management-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>
                    {editingId === category._id ? (
                      <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="admin-input"
                          style={{ margin: 0, padding: '4px 8px' }}
                          autoFocus
                        />
                        <button type="submit" className="action-btn edit">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="action-btn delete">Cancel</button>
                      </form>
                    ) : (
                      category.name
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {editingId !== category._id && (
                      <>
                        <button 
                          onClick={() => {
                            setEditingId(category._id);
                            setEditName(category.name);
                          }} 
                          className="action-btn edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="action-btn delete">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No categories found. Add your first category above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
