import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

function NotificationBell() {
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    api.get('/notifications').then(res => setNotifications(res.data)).catch(() => {})
  }, [open])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count')
        setCount(data.count)
      } catch {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/all/read')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setCount(0)
    } catch {}
  }

  const unread = notifications.filter(n => !n.read)

  return (
    <div className="notif-bell" ref={ref}>
      <button className="notif-bell-btn" onClick={() => setOpen(!open)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && <span className="notif-badge">{count > 99 ? '99+' : count}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {unread.length > 0 && (
              <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
            {notifications.map(n => (
              <div key={n.id} className={`notif-item ${n.read ? '' : 'notif-unread'}`} onClick={() => markRead(n.id)}>
                <NavLink to={n.link || '#'} className="notif-link" onClick={() => setOpen(false)}>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{new Date(n.created_at).toLocaleDateString()}</div>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" end>FreelanceHub</NavLink>
        <div className="nav-links">
          <NavLink to="/jobs" className={navClass}>Browse Jobs</NavLink>
          {!user ? (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link btn btn-primary btn-sm active' : 'nav-link btn btn-primary btn-sm'}>Sign Up</NavLink>
            </>
          ) : (
            <>
              {user.role === 'employer' && (
                <NavLink to="/employer/dashboard" className={navClass}>Dashboard</NavLink>
              )}
              {user.role === 'freelancer' && (
                <>
                  <NavLink to="/freelancer/dashboard" className={navClass}>Dashboard</NavLink>
                  <NavLink to="/freelancer/applications" className={navClass}>My Applications</NavLink>
                </>
              )}
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navClass}>Admin</NavLink>
              )}
              <NotificationBell />
              <button onClick={handleLogout} className="nav-link btn btn-ghost">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
