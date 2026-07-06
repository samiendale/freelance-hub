import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = { sort };
        if (search) params.search = search;
        if (category) params.category = category;
        const { data } = await api.get('/jobs', { params });
        setJobs(data.jobs || data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, [search, category, sort]);

  return (
    <div className="browse-jobs animate-in">
      <h1 className="page-title animate-in-d1">Browse Jobs</h1>

      <div className="search-bar animate-in-d2">
          <input
            className="form-input"
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
      </div>

      <div className="filter-bar animate-in-d3">
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="budget_asc">Budget: Low to High</option>
          <option value="budget_desc">Budget: High to Low</option>
        </select>
      </div>

      <div className="jobs-grid animate-in-d4">
        {jobs.length === 0 && <p className="no-results">No jobs found.</p>}
        {jobs.map((job, i) => (
          <Link to={`/jobs/${job.id}`} className="job-card" key={job.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="job-card-top">
              <span className="job-card-category">{job.category?.name || 'General'}</span>
              {job.deadline && (
                <span className="job-card-deadline">{new Date(job.deadline).toLocaleDateString()}</span>
              )}
            </div>
            <h3 className="job-card-title">{job.title}</h3>
            <p className="job-card-employer">{job.employer?.name || 'Unknown'}</p>
            <p className="job-card-desc">
              {job.description?.length > 120
                ? job.description.slice(0, 120) + '...'
                : job.description}
            </p>
            <div className="job-card-footer">
              <span className="job-card-budget">
                ${job.budget_min?.toLocaleString()} – ${job.budget_max?.toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrowseJobs;
