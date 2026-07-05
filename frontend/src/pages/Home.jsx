import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero-title animate-in">
          Find your <span>match.</span>
          <br />Ship your work.
        </h1>
        <p className="hero-subtitle animate-in animate-in-d1">
          Where ambitious freelancers meet meaningful projects.
          No noise, no bidding wars — just quality connections.
        </p>
        <div className="cta-buttons animate-in animate-in-d2">
          <Link to="/register" className="btn btn-primary">Find Work</Link>
          <Link to="/register?role=employer" className="btn btn-secondary">Hire Talent</Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="animate-in">How it works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>For Freelancers</h3>
            <p>Create your profile, showcase your craft, and browse projects that actually match your skills. No spam, just signal.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>For Employers</h3>
            <p>Post your project, get proposals from vetted talent, and hire with confidence. Transparent budgets, clear timelines.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
