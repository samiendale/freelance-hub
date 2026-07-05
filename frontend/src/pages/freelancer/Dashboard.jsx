import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, contractsRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/contracts', { params: { status: 'active' } }),
        ])
        setApplications(appRes.data)
        setContracts(contractsRes.data)
      } catch (err) {
        console.error('Dashboard fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalApps = applications.length
  const pendingApps = applications.filter((a) => a.status === 'pending').length
  const activeContracts = contracts.length
  const recentApps = applications.slice(0, 5)

  if (loading) return <div className="dashboard animate-in">Loading...</div>

  return (
    <div className="dashboard animate-in">
      <h1 className="animate-in-d1">Freelancer Dashboard</h1>

      <div className="stats-grid animate-in-d2">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{totalApps}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{pendingApps}</p>
        </div>
        <div className="stat-card">
          <h3>Active Contracts</h3>
          <p className="stat-number">{activeContracts}</p>
        </div>
      </div>

      <div className="list-card animate-in-d3">
        <h2>Recent Applications</h2>
        {recentApps.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <ul>
            {recentApps.map((app) => (
              <li key={app.id} className="list-item">
                <Link to={`/jobs/${app.job?.id}`}>{app.job?.title || 'Unknown Job'}</Link>
                <span className={`badge badge-${app.status}`}>{app.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="list-card animate-in-d4">
        <h2>Active Contracts</h2>
        {contracts.length === 0 ? (
          <p>No active contracts.</p>
        ) : (
          <ul>
            {contracts.map((c) => (
              <li key={c.id} className="list-item">
                <span>{c.job?.title || 'Contract'}</span>
                <span className="badge badge-active">Active</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/jobs" className="browse-link animate-in-d5">Browse Jobs</Link>
    </div>
  )
}
