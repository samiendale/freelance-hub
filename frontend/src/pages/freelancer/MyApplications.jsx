import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  const tabs = ['All', 'Pending', 'Accepted', 'Rejected']

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications/my')
        setApplications(res.data)
      } catch (err) {
        console.error('MyApplications fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  const filtered =
    activeTab === 'All'
      ? applications
      : applications.filter((a) => a.status === activeTab.toLowerCase())

  if (loading) return <div className="my-bids animate-in">Loading...</div>

  return (
    <div className="my-bids animate-in">
      <h1 className="animate-in-d1">My Applications</h1>

      <div className="filter-tabs animate-in-d2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="animate-in-d3">No applications found.</p>
      ) : (
        filtered.map((app, i) => (
          <div key={app.id} className={`bid-card animate-in-d${Math.min(i + 3, 5)}`}>
            <div className="bid-card-header">
              <Link to={`/jobs/${app.job?.id}`}>
                {app.job?.title || 'Unknown Job'}
              </Link>
              <span className={`badge badge-${app.status}`}>{app.status}</span>
            </div>
            <p>{app.cover_letter}</p>
            <p className="app-meta">Submitted: {new Date(app.created_at).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  )
}
