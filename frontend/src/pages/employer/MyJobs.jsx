import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusFilters = ['All', 'open', 'in_progress', 'completed', 'cancelled'];

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/my');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="my-jobs animate-in">Loading...</div>;

  const filteredJobs =
    activeFilter === 'All'
      ? jobs
      : jobs.filter((j) => j.status === activeFilter);

  return (
    <div className="my-jobs animate-in">
      <div className="my-jobs-header animate-in-d1">
        <h1>My Jobs</h1>
        <Link to="/employer/jobs/new" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      <div className="filter-tabs animate-in-d2">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab${activeFilter === filter ? ' active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'All' ? 'All' : statusLabels[filter] || filter}
          </button>
        ))}
      </div>

      <div className="jobs-list animate-in-d3">
        {filteredJobs.length === 0 && <p>No jobs found.</p>}
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card" style={{ cursor: 'default' }}>
            <Link to={`/employer/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className={`badge badge-${job.status}`}>
                  {statusLabels[job.status] || job.status}
                </span>
              </div>
              <div className="job-card-body">
                <span>Budget: ${job.budget_min} - ${job.budget_max}</span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                <span>Bids: {job.bidCount || 0}</span>
              </div>
            </Link>
            {job.status === 'open' && (
              <div className="job-card-actions" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                <Link to={`/employer/jobs/${job.id}/edit`} className="btn btn-sm btn-primary">Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={async (e) => { e.preventDefault(); if (confirm('Delete this job?')) { await api.delete(`/jobs/${job.id}`); setJobs(prev => prev.filter(j => j.id !== job.id)); } }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
