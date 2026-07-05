import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  )
}
