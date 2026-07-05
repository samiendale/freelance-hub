import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BrowseJobs from './pages/BrowseJobs'
import JobDetail from './pages/JobDetail'
import EmployerDashboard from './pages/employer/Dashboard'
import EmployerPostJob from './pages/employer/PostJob'
import EmployerMyJobs from './pages/employer/MyJobs'
import EmployerJobDetail from './pages/employer/JobDetail'
import FreelancerDashboard from './pages/freelancer/Dashboard'
import FreelancerMyApplications from './pages/freelancer/MyApplications'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/ManageUsers'
import AdminJobs from './pages/admin/ManageJobs'
import AdminCategories from './pages/admin/ManageCategories'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/employer/dashboard" element={
          <ProtectedRoute roles={['employer']}><EmployerDashboard /></ProtectedRoute>
        } />
        <Route path="/employer/jobs/new" element={
          <ProtectedRoute roles={['employer']}><EmployerPostJob /></ProtectedRoute>
        } />
        <Route path="/employer/jobs" element={
          <ProtectedRoute roles={['employer']}><EmployerMyJobs /></ProtectedRoute>
        } />
        <Route path="/employer/jobs/:id" element={
          <ProtectedRoute roles={['employer']}><EmployerJobDetail /></ProtectedRoute>
        } />

        <Route path="/freelancer/dashboard" element={
          <ProtectedRoute roles={['freelancer']}><FreelancerDashboard /></ProtectedRoute>
        } />
        <Route path="/freelancer/applications" element={
          <ProtectedRoute roles={['freelancer']}><FreelancerMyApplications /></ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute roles={['admin']}><AdminJobs /></ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute roles={['admin']}><AdminCategories /></ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}
