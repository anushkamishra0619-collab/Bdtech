
import { useState } from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="student-dashboard">
      <header className="dashboard-navbar">
        <a className="navbar-brand" href="#" aria-label="SocietySelect AI home">
          <span className="brand-name">SocietySelect</span>
          <span className="brand-ai">AI</span>
        </a>

        <nav
          id="dashboard-navigation"
          className={`navbar-links${isMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#" className="nav-link active" onClick={closeMenu}>Dashboard</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Applications</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Performance</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Settings</a>
          <a href="#" className="nav-link" onClick={closeMenu}>Notifications</a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-notifications" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
          </button>
          <button className="navbar-profile" type="button" aria-label="Profile for Ashutosh">
            <span className="navbar-avatar" aria-hidden="true">A</span>
          </button>
        </div>

        <button
          className="navbar-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="dashboard-container">
        <h1>Student Dashboard</h1>
      </div>

    </main>
  );
};

export default StudentDashboard;
