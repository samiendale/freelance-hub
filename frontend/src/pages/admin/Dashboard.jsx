import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="admin-dashboard animate-in">Loading...</div>;

  return (
    <div className="admin-dashboard animate-in">
      <h1 className="animate-in-d1">Admin Dashboard</h1>
      <div className="stats-grid animate-in-d2">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalJobs}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalContracts}</div>
          <div className="stat-label">Total Contracts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.totalRevenue || 0}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="admin-links animate-in-d3">
        <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
        <Link to="/admin/jobs" className="btn btn-primary">Manage Jobs</Link>
        <Link to="/admin/categories" className="btn btn-primary">Manage Categories</Link>
      </div>
    </div>
  );
};

export default Dashboard;
