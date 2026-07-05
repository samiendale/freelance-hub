import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('freelancer')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await api.post('/auth/register', { name, email, password, role })
      const user = await login(email, password)
      if (user.role === 'employer') navigate('/employer/dashboard')
      else if (user.role === 'freelancer') navigate('/freelancer/dashboard')
      else if (user.role === 'admin') navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed')
    }
  }

  return (
    <div className="register-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Join FreelanceHub</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Name</label>
          <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input className="form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <div className="form-group">
          <label>I want to...</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="freelancer">Find Work (Freelancer)</option>
            <option value="employer">Hire Talent (Employer)</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Create Account</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
