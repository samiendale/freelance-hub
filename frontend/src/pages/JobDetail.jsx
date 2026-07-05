import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', cover_letter: '' })
  const [resume, setResume] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`)
        setJob(data)
        if (user) setForm(f => ({ ...f, name: user.name }))
      } catch (err) {
        setError('Failed to load job.')
      }
    }
    fetchJob()
  }, [id, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('cover_letter', form.cover_letter)
      if (resume) fd.append('resume', resume)

      await api.post(`/applications/jobs/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess('Application submitted successfully!')
      setForm({ name: user?.name || '', cover_letter: '' })
      setResume(null)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!job) return <div className="job-detail animate-in"><p>Loading...</p></div>

  return (
    <div className="job-detail animate-in">
      <div className="job-header animate-in-d1">
        <h1>{job.title}</h1>
        <p className="job-meta-line">
          <span>Posted by <strong>{job.employer?.name || 'Unknown'}</strong></span>
          <span>{job.category?.name || 'General'}</span>
          <span>Budget: ${job.budget_min} – ${job.budget_max}</span>
          {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
          <span className={`badge badge-${job.status}`}>{job.status}</span>
        </p>
      </div>

      <div className="job-body animate-in-d2">
        <p>{job.description}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!user && (
        <div className="apply-prompt animate-in-d3">
          <p><Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> as a freelancer to apply for this job.</p>
        </div>
      )}

      {user && user.role === 'freelancer' && job.status === 'open' && (
        <form className="bid-form animate-in-d3" onSubmit={handleSubmit}>
          <h3>Apply for this Job</h3>
          <div className="form-group">
            <label>Your name</label>
            <input name="name" className="form-input" value={form.name} onChange={handleChange} required placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Resume / CV (optional)</label>
            <input type="file" className="form-input" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>Why are you a good fit?</label>
            <textarea name="cover_letter" className="form-textarea" value={form.cover_letter} onChange={handleChange} required placeholder="Tell the employer why you're the right person for this job..." rows={5} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}

      {user && user.role === 'employer' && (
        <div className="apply-prompt animate-in-d3">
          <p>You are viewing this as an employer. <Link to={`/employer/jobs/${id}`}>Manage this job listing</Link></p>
        </div>
      )}
    </div>
  )
}
