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

      <div className="jobs-list animate-in-d4">
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} className="job-card" key={job.id}>
            <div className="job-card-title">{job.title}</div>
            <div className="job-card-meta">
              <span>{job.employer?.name || 'Unknown'}</span>
              <span>{job.category?.name || 'General'}</span>
              <span>${job.budget_min} - ${job.budget_max}</span>
              {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrowseJobs;
