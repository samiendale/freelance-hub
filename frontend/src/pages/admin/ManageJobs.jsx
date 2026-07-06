import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/admin/jobs', { params: { search } });
      setJobs(data.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/jobs/${id}/status`, { status });
      fetchJobs();
    } catch (err) {
      console.error('Failed to update job status', err);
    }
  };

  return (
    <div className="admin-page animate-in">
      <h1 className="animate-in-d1">Manage Jobs</h1>
      <div className="admin-search animate-in-d2">
        <input
          className="form-input"
          type="text"
          placeholder="Search by title or employer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="admin-table animate-in-d2">
        <thead>
          <tr className="admin-table-header">
            <th>ID</th>
            <th>Title</th>
            <th>Employer</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr className="admin-table-row" key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.employer?.name || 'N/A'}</td>
              <td>
                <select
                  className="status-select"
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{new Date(job.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageJobs;
