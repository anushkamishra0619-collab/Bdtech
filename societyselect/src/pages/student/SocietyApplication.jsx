import { useMemo, useState } from "react";
import { societiesData } from "../../data/societiesData";
import { studentData } from "../../data/studentProfileData";
import "../../styles/SocietyApplication.css";

const formatDeadline = (deadline) =>
  new Date(`${deadline}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const daysUntilDeadline = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const closingDate = new Date(`${deadline}T00:00:00`);
  return Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));
};

const SocietyApplication = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("deadline");
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [notice, setNotice] = useState("");

  const openSocieties = societiesData.filter((society) => society.isOpen);
  const myApplications = societiesData.filter(
    (society) => society.applicationStatus !== "Not Applied",
  );
  const inReview = societiesData.filter(
    (society) => society.applicationStatus === "In Review",
  );
  const closingThisWeek = openSocieties.filter((society) => {
    const daysRemaining = daysUntilDeadline(society.deadline);
    return daysRemaining >= 0 && daysRemaining <= 7;
  });

  const visibleSocieties = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return societiesData
      .filter(
        (society) =>
          activeFilter === "All" || society.category === activeFilter,
      )
      .filter((society) => {
        if (!normalizedQuery) return true;
        return [
          society.name,
          society.description,
          society.category,
          ...society.skills,
          ...society.positions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((first, second) => {
        if (sortOrder === "name") return first.name.localeCompare(second.name);
        if (sortOrder === "positions") {
          return second.positions.length - first.positions.length;
        }
        return first.deadline.localeCompare(second.deadline);
      });
  }, [activeFilter, searchQuery, sortOrder]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="society-listing-page">
      <header className="society-navbar">
        <a
          className="society-navbar-brand"
          href="/student/dashboard"
          aria-label="SocietySelect AI home"
        >
          <span>SocietySelect</span>
          <small>AI</small>
        </a>
        <nav
          id="society-navigation"
          className={`society-navbar-links${isMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="/student/dashboard" onClick={closeMenu}>Dashboard</a>
          <a href="/student/profile" onClick={closeMenu}>Profile</a>
          <a
            href="/student/application"
            className="active"
            aria-current="page"
            onClick={closeMenu}
          >
            Society Applications
          </a>
          <a href="/student/application-tracking" onClick={closeMenu}>
            Application Tracking
          </a>
        </nav>
        <label className="society-preview-control">
          <span>Preview as</span>
          <select aria-label="Preview as">
            <option>2nd Year</option>
          </select>
        </label>
        <a
          className="society-navbar-profile"
          href="/student/profile"
          aria-label={`Profile for ${studentData.name}`}
        >
          {studentData.avatarInitial}
        </a>
        <button
          className={`society-navbar-toggle${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="society-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="society-listing-content">
        <nav className="society-breadcrumbs" aria-label="Breadcrumb">
          <a href="/student/dashboard">Dashboard</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Society Applications</span>
        </nav>

        <section className="society-listing-intro">
          <div>
            <p className="society-eyebrow">Find your community</p>
            <h1>Society <em>Applications</em></h1>
            <p className="society-listing-subtitle">
              Discover and apply to college societies.
            </p>
          </div>
        </section>

        <section className="society-stat-grid" aria-label="Application statistics">
          <article className="society-stat-card">
            <span>Open Societies</span><strong>{openSocieties.length}</strong>
          </article>
          <article className="society-stat-card">
            <span>My Applications</span><strong>{myApplications.length}</strong>
          </article>
          <article className="society-stat-card">
            <span>In Review</span><strong>{inReview.length}</strong>
          </article>
          <article className="society-stat-card">
            <span>Closing This Week</span><strong>{closingThisWeek.length}</strong>
          </article>
        </section>

        <aside className="society-eligibility-notice">
          <p>
            <strong>✓ Eligible</strong>
            <span>— you are a 2nd-year student, so you can apply to any open society.</span>
          </p>
        </aside>

        <section className="society-directory" aria-labelledby="society-directory-title">
          <div className="society-directory-controls">
            <label className="society-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                type="search"
                placeholder="Search societies, skills or roles"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search societies"
              />
            </label>
            <div className="society-filter-tabs" role="group" aria-label="Filter by category">
              {["All", "Technical", "Cultural"].map((filter) => (
                <button
                  className={activeFilter === filter ? "active" : ""}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="society-sort-control">
              <span>Sort by</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                aria-label="Sort societies"
              >
                <option value="deadline">Deadline</option>
                <option value="name">Name A–Z</option>
                <option value="positions">Most positions</option>
              </select>
            </label>
          </div>
          <p className="society-result-count">
            {visibleSocieties.length} societies found
          </p>

          <div className="society-card-grid">
            {visibleSocieties.map((society) => (
              <article className="society-card" key={society.id}>
                <div className="society-card-content">
                  <div className="society-card-heading">
                    <span className="society-card-initial" aria-hidden="true">
                      {society.name.charAt(0)}
                    </span>
                    <span className={`society-category-label ${society.category.toLowerCase()}`}>
                      {society.category}
                    </span>
                  </div>
                  <h3>{society.name}</h3>
                  <p className="society-card-description">{society.description}</p>
                  <div className="society-card-skills">
                    <span className="society-field-label">Skills</span>
                    <div className="society-skill-tags">
                      {society.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="society-card-facts">
                    <div>
                      <span className="society-field-label">Available positions</span>
                      <strong>{society.positionsAvailable} open · {society.positions.length} roles</strong>
                    </div>
                    <div>
                      <span className="society-field-label">Application deadline</span>
                      <strong>
                        {formatDeadline(society.deadline)}
                        <em>{daysUntilDeadline(society.deadline)} days left</em>
                      </strong>
                    </div>
                    <div>
                      <span className="society-field-label">Eligibility</span>
                      <strong className="society-eligible">✓ Eligible · {society.eligibility} only</strong>
                    </div>
                  </div>
                  <div className="society-card-actions">
                    <button
                      className="society-secondary-button"
                      type="button"
                      onClick={() => setSelectedSociety(society)}
                    >
                      View Details
                    </button>
                    <button
                      className={`society-primary-button${society.applicationStatus !== "Not Applied" ? " is-applied" : ""}`}
                      type="button"
                      disabled={society.applicationStatus !== "Not Applied"}
                      onClick={() =>
                        setNotice("The application form will be available in the next step.")
                      }
                    >
                      {society.applicationStatus !== "Not Applied" ? "Applied ✓" : <>Apply Now <span aria-hidden="true">→</span></>}
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visibleSocieties.length === 0 && (
              <div className="society-empty-state">
                <span aria-hidden="true">⌕</span>
                <h3>No matching societies</h3>
                <p>Try a different search or category filter.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {(selectedSociety || notice) && (
        <div
          className="society-dialog-backdrop"
          role="presentation"
          onClick={() => {
            setSelectedSociety(null);
            setNotice("");
          }}
        >
          <section
            className="society-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="society-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="society-dialog-close"
              type="button"
              aria-label="Close dialog"
              onClick={() => {
                setSelectedSociety(null);
                setNotice("");
              }}
            >
              ×
            </button>
            {selectedSociety ? (
              <>
                <span className="society-category-label">{selectedSociety.category}</span>
                <h2 id="society-dialog-title">{selectedSociety.name}</h2>
                <p>{selectedSociety.description}</p>
                <h3>Available roles</h3>
                <ul>
                  {selectedSociety.positions.map((position) => (
                    <li key={position}>{position}</li>
                  ))}
                </ul>
                <p><strong>Deadline:</strong> {formatDeadline(selectedSociety.deadline)}</p>
                <p><strong>Eligibility:</strong> {selectedSociety.eligibility}</p>
                <button
                  className="society-primary-button"
                  type="button"
                  onClick={() => {
                    setSelectedSociety(null);
                    setNotice("The application form will be available in the next step.");
                  }}
                >
                  Apply Now
                </button>
              </>
            ) : (
              <>
                <span className="society-eyebrow">Applications</span>
                <h2 id="society-dialog-title">Coming soon</h2>
                <p>{notice}</p>
                <button
                  className="society-primary-button"
                  type="button"
                  onClick={() => setNotice("")}
                >
                  Understood
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default SocietyApplication;
