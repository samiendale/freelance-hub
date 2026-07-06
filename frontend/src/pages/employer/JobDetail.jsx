import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/applications/jobs/${id}`),
      ])
      setJob(jobRes.data)
      setApplications(appRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleAccept = async (appId) => {
    try {
      await api.patch(`/applications/${appId}/accept`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/jobs/${job.id}`)
      navigate('/employer/jobs')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="job-detail animate-in">Loading...</div>
  if (!job) return <div className="job-detail animate-in">Job not found.</div>

  return (
    <div className="job-detail animate-in">
      <button className="btn btn-sm animate-in-d1" onClick={() => navigate('/employer/jobs')}>
        &larr; Back to My Jobs
      </button>

      <div className="job-info animate-in-d2">
        <h1>{job.title}</h1>
        <span className={`badge badge-${job.status}`}>
          {statusLabels[job.status] || job.status}
        </span>
        <p>{job.description}</p>
        <div className="job-meta">
          <span>Budget: ${job.budget_min} – ${job.budget_max}</span>
          <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          <span>Category: {job.category?.name || 'N/A'}</span>
        </div>
        {job.status === 'open' && user?.id === job.employer_id && (
          <div className="job-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Link to={`/employer/jobs/${job.id}/edit`} className="btn btn-primary btn-sm">Edit Job</Link>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Job</button>
          </div>
        )}
      </div>

      {job.contract && (
        <div className="contract-info animate-in-d3">
          <h2>Contract</h2>
          <p>Status: <span className={`badge badge-${job.contract.status}`}>{job.contract.status}</span></p>
        </div>
      )}

      <div className="bids-section animate-in-d4">
        <h2>Applications ({applications.length})</h2>
        {applications.length === 0 && <p>No applications yet.</p>}
        {applications.map((app) => (
          <div key={app.id} className="bid-card">
            <div className="bid-card-header">
              <strong>{app.name || app.freelancer?.name || 'Unknown'}</strong>
              <span className={`badge badge-${app.status}`}>{app.status}</span>
            </div>
            {app.freelancer?.skills && (
              <div className="skills-list" style={{ marginBottom: '0.75rem' }}>
                {app.freelancer.skills.map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            )}
            <p style={{ marginBottom: '0.75rem' }}>{app.cover_letter}</p>
            {app.resume_url && (
              <p><a href={`${app.resume_url}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">View Resume</a></p>
            )}
            {app.status === 'pending' && (
              <button className="btn btn-success btn-sm" onClick={() => handleAccept(app.id)}>
                Accept Application
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
