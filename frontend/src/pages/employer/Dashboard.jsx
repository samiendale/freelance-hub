import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, contractsRes] = await Promise.all([
          api.get('/jobs/my'),
          api.get('/contracts', { params: { status: 'active' } }),
        ]);
        setJobs(jobsRes.data);
        setContracts(contractsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="dashboard animate-in">Loading...</div>;

  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const activeContracts = contracts.length;

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-header animate-in-d1">
        <h1>Employer Dashboard</h1>
        <Link to="/employer/jobs/new" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      <div className="stats-grid animate-in-d2">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Open Jobs</h3>
          <p>{openJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Active Contracts</h3>
          <p>{activeContracts}</p>
        </div>
      </div>

      <div className="list-card animate-in-d3">
        <h2>Recent Jobs</h2>
        {jobs.slice(0, 5).map((job) => (
          <div key={job.id} className="list-item">
            <Link to={`/employer/jobs/${job.id}`}>{job.title}</Link>
            <span className={`badge badge-${job.status}`}>
              {statusLabels[job.status] || job.status}
            </span>
          </div>
        ))}
        {jobs.length === 0 && <p>No jobs posted yet.</p>}
      </div>

      <div className="list-card animate-in-d4">
        <h2>Active Contracts</h2>
        {contracts.length === 0 && <p>No active contracts.</p>}
        {contracts.map((contract) => (
          <div key={contract.id} className="list-item">
            <Link to={`/employer/jobs/${contract.job_id}`}>
              {contract.job?.title || `Contract #${contract.id}`}
            </Link>
            <span className="badge badge-in_progress">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}
