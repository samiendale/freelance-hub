import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, catRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get('/categories'),
        ]);
        const job = jobRes.data;
        setForm({
          title: job.title || '',
          description: job.description || '',
          category_id: job.category_id?.toString() || '',
          budget_min: job.budget_min?.toString() || '',
          budget_max: job.budget_max?.toString() || '',
          deadline: job.deadline || '',
        });
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/jobs/${id}`, {
        ...form,
        budget_min: parseFloat(form.budget_min),
        budget_max: parseFloat(form.budget_max),
        category_id: parseInt(form.category_id, 10),
      });
      navigate(`/employer/jobs/${id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="job-form animate-in">Loading...</div>;

  return (
    <div className="job-form animate-in">
      <h1 className="animate-in-d1">Edit Job</h1>
      <form onSubmit={handleSubmit} className="animate-in-d2">
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            className="form-select"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Budget Min</label>
          <input
            className="form-input"
            name="budget_min"
            type="number"
            min="0"
            step="0.01"
            value={form.budget_min}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Budget Max</label>
          <input
            className="form-input"
            name="budget_max"
            type="number"
            min="0"
            step="0.01"
            value={form.budget_max}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            className="form-input"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/employer/jobs/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
