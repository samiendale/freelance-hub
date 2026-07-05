import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', form);
      setForm({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  return (
    <div className="admin-page animate-in">
      <h1 className="animate-in-d1">Manage Categories</h1>

      <form className="admin-form animate-in-d2" onSubmit={handleAdd}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Slug</label>
          <input className="form-input" name="slug" value={form.slug} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>

      <div className="category-list animate-in-d3">
        {categories.map((cat) => (
          <div className="category-item" key={cat.id}>
            <div>
              <strong>{cat.name}</strong> <em>({cat.slug})</em>
              <p>{cat.description}</p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(cat.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
