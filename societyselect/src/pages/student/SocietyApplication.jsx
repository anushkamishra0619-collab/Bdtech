import { useMemo, useState } from "react";
import { societiesData } from "../../data/societiesData";
import {
  academicInformationData,
  studentData,
} from "../../data/studentProfileData";
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

const availablePositionCount = (society) =>
  (society.details?.availablePositions ?? []).reduce(
    (total, position) => total + (position.openings ?? 0),
    0,
  );

const createEmptyApplicationForm = (society) => ({
  position: society.details?.availablePositions?.[0]?.title ?? "",
  motivation: "",
  relevantSkills: "",
  githubUrl: "",
  portfolioUrl: "",
  confirmed: false,
});

const SocietyApplicationForm = ({ society, formData, onChange, onBack, onSubmit }) => {
  const positions = society.details?.availablePositions ?? [];
  const yearAndSemester = [
    academicInformationData.academicYear ?? studentData.academicYear,
    academicInformationData.currentSemester,
  ]
    .filter(Boolean)
    .join(" · ");
  const studentFields = [
    { label: "Full Name", value: studentData.name },
    { label: "Student Number", value: studentData.studentId },
    {
      label: "Branch",
      value: academicInformationData.branch ?? studentData.branch,
    },
    { label: "Year and Semester", value: yearAndSemester },
    {
      label: "Current CGPA",
      value: academicInformationData.currentCgpa
        ? `${academicInformationData.currentCgpa} / 10`
        : "",
    },
  ];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    onChange((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderStudentField = ({ label, value }) => (
    <label className="society-application-field" key={label}>
      <span>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        placeholder="Not provided in profile"
        readOnly
        aria-readonly="true"
      />
    </label>
  );

  return (
    <div className="society-listing-content society-application-content">
      <nav className="society-breadcrumbs" aria-label="Breadcrumb">
        <a href="/student/dashboard">Dashboard</a>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={onBack}>
          Society Applications
        </button>
        <span aria-hidden="true">/</span>
        <span>{society.name}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Apply</span>
      </nav>

      <header className="society-application-intro">
        <h1>
          Apply to <em>{society.name}</em>
        </h1>
        <p>
          Closing {formatDeadline(society.deadline)}
          {daysUntilDeadline(society.deadline) >= 0 &&
            ` · ${daysUntilDeadline(society.deadline)} days left`}
        </p>
      </header>

      <aside className="society-eligibility-notice society-application-eligibility">
        <p>
          <strong>Eligibility</strong>
          <span>
            — {society.details?.eligibility?.criteria ?? "Eligibility information is not provided."}
          </span>
        </p>
      </aside>

      <form className="society-application-form" onSubmit={onSubmit} noValidate>
        <h2 className="society-application-section-title">Student Details</h2>
        <p className="society-application-demo-note">
          Student details are shown from the current demonstration profile. Please verify them before submitting.
        </p>

        <div className="society-application-grid society-application-student-grid">
          {studentFields.map(renderStudentField)}

          <label className="society-application-field">
            <span>Position Applying For</span>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              disabled={positions.length === 0}
            >
              {positions.length === 0 ? (
                <option value="">No positions available</option>
              ) : (
                positions.map((position) => (
                  <option value={position.title} key={position.title}>
                    {position.title}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <div className="society-application-fields">
          <label className="society-application-field society-application-field-wide">
            <span>Why do you want to join?</span>
            <textarea
              name="motivation"
              rows="5"
              value={formData.motivation}
              onChange={handleChange}
            />
          </label>

          <label className="society-application-field society-application-field-wide">
            <span>Relevant Skills and Experience</span>
            <textarea
              name="relevantSkills"
              rows="5"
              value={formData.relevantSkills}
              onChange={handleChange}
            />
          </label>

          <div className="society-application-grid society-application-link-grid">
            <label className="society-application-field">
              <span>GitHub Profile URL</span>
              <input
                type="text"
                inputMode="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </label>
            <label className="society-application-field">
              <span>Portfolio URL <em>(Optional)</em></span>
              <input
                type="text"
                inputMode="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://"
              />
            </label>
          </div>

          <label className="society-application-confirmation">
            <input
              type="checkbox"
              name="confirmed"
              checked={formData.confirmed}
              onChange={handleChange}
            />
            <span>I confirm that the information provided is accurate.</span>
          </label>

          <div className="society-application-actions">
            <button
              className="society-secondary-button"
              type="button"
              onClick={onBack}
            >
              Back to Details
            </button>
            <button className="society-primary-button" type="submit">
              Submit Application
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SocietyDetailsView = ({ society, onBack, onApply }) => {
  const daysRemaining = daysUntilDeadline(society.deadline);
  const details = society.details ?? {};
  const positions = details.availablePositions ?? [];
  const skills = details.requiredSkills ?? [];

  return (
    <div className="society-listing-content society-details-content">
      <nav className="society-breadcrumbs" aria-label="Breadcrumb">
        <a href="/student/dashboard">Dashboard</a>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={onBack}>
          Society Applications
        </button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{society.name}</span>
      </nav>

      <button
        className="society-back-button"
        type="button"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Back to Society Applications
      </button>

      <section className="society-details-hero" aria-labelledby="society-details-title">
        <div className="society-details-heading">
          <span className={`society-category-label ${society.category.toLowerCase()}`}>
            {society.category}
          </span>
          <span className="society-card-initial" aria-hidden="true">
            {society.initials}
          </span>
        </div>
        <h1 id="society-details-title">{society.name}</h1>
        <p>{society.description}</p>
      </section>

      {details.dataStatus && (
        <aside className="society-demo-notice">
          <strong>{details.dataStatus}</strong>
          <span>
            Society details are for demonstration only; confirm official information
            with the college before applying.
          </span>
        </aside>
      )}

      <section className="society-details-panel" aria-label={`${society.name} details`}>
        <div className="society-details-facts">
          <div className="society-details-fact">
            <span className="society-field-label">Available positions</span>
            <strong>{availablePositionCount(society)} open · {positions.length} roles</strong>
          </div>
          <div className="society-details-fact">
            <span className="society-field-label">Application deadline</span>
            <strong>
              {formatDeadline(society.deadline)}
              <em>
                {daysRemaining >= 0
                  ? `${daysRemaining} days left`
                  : "Applications closed"}
              </em>
            </strong>
          </div>
          {details.eligibility && (
            <div className="society-details-fact">
              <span className="society-field-label">Eligibility</span>
              <strong className="society-eligible">
                {details.eligibility.year}
                <em>{details.eligibility.criteria}</em>
              </strong>
            </div>
          )}
          <div className="society-details-fact">
            <span className="society-field-label">Application status</span>
            <strong>{society.applicationStatus}</strong>
          </div>
        </div>

        {details.about && (
          <section className="society-details-section">
            <h2>About the society</h2>
            <p className="society-details-copy">{details.about}</p>
          </section>
        )}

        {details.objectives?.length > 0 && (
          <section className="society-details-section">
            <h2>Objectives</h2>
            <ul className="society-details-list">
              {details.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {details.domains?.length > 0 && (
          <section className="society-details-section">
            <h2>Domains</h2>
            <div className="society-details-roles">
              {details.domains.map((domain) => (
                <span key={domain}>{domain}</span>
              ))}
            </div>
          </section>
        )}

        {positions.length > 0 && (
          <section className="society-details-section">
            <h2>Available roles</h2>
            <div className="society-details-role-list">
              {positions.map((position) => (
                <article key={position.title} className="society-details-role">
                  <div>
                    <h3>{position.title}</h3>
                    {position.description && <p>{position.description}</p>}
                  </div>
                  {position.openings != null && (
                    <span>
                      {position.openings} {position.openings === 1 ? "opening" : "openings"}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="society-details-section">
            <h2>Required skills</h2>
            <div className="society-skill-tags">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {details.facultyCoordinator && (
          <section className="society-details-section">
            <h2>Faculty coordinator</h2>
            <p className="society-details-copy">
              {details.facultyCoordinator.name}
              {details.facultyCoordinator.title && ` · ${details.facultyCoordinator.title}`}
            </p>
          </section>
        )}

        {details.contactInfo && (
          <section className="society-details-section">
            <h2>Contact information</h2>
            <div className="society-details-contact">
              {details.contactInfo.email && (
                <a href={`mailto:${details.contactInfo.email}`}>
                  {details.contactInfo.email}
                </a>
              )}
              {details.contactInfo.phone && <span>{details.contactInfo.phone}</span>}
            </div>
          </section>
        )}

        {details.socialLinks?.length > 0 && (
          <section className="society-details-section">
            <h2>Social media</h2>
            <div className="society-details-roles">
              {details.socialLinks.map((link) => (
                <a
                  className="society-details-social-link"
                  href={link.url}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {details.activities?.length > 0 && (
          <section className="society-details-section">
            <h2>Activities</h2>
            <ul className="society-details-list">
              {details.activities.map((activity, index) => (
                <li key={activity.title ?? activity.name ?? index}>
                  {activity.title ?? activity.name ?? activity}
                  {activity.description && ` — ${activity.description}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {details.achievements?.length > 0 && (
          <section className="society-details-section">
            <h2>Activities and achievements</h2>
            <ul className="society-details-list">
              {details.achievements.map((achievement, index) => (
                <li key={achievement.title ?? achievement.name ?? index}>
                  {achievement.title ?? achievement.name ?? achievement}
                  {achievement.description && ` — ${achievement.description}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="society-details-actions">
          <button
            className="society-back-button society-details-back-bottom"
            type="button"
            onClick={onBack}
          >
            <span aria-hidden="true">←</span> Back to Society Applications
          </button>
          <button
            className="society-primary-button society-details-apply-button"
            type="button"
            disabled={!society.isOpen || society.applicationStatus !== "Not Applied"}
            onClick={onApply}
          >
            {society.applicationStatus !== "Not Applied"
              ? "Application Started"
              : !society.isOpen
                ? "Applications Closed"
                : <>Apply Now <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </section>
    </div>
  );
};

const SocietyApplication = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("deadline");
  const [activeView, setActiveView] = useState("listing");
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    position: "",
    motivation: "",
    relevantSkills: "",
    githubUrl: "",
    portfolioUrl: "",
    confirmed: false,
  });
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
          ...(society.details?.requiredSkills ?? []),
          ...(society.details?.availablePositions ?? []).map((position) => position.title),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((first, second) => {
        if (sortOrder === "name") return first.name.localeCompare(second.name);
        if (sortOrder === "positions") {
          return availablePositionCount(second) - availablePositionCount(first);
        }
        return first.deadline.localeCompare(second.deadline);
      });
  }, [activeFilter, searchQuery, sortOrder]);

  const closeMenu = () => setIsMenuOpen(false);
  const openSocietyDetails = (society) => {
    setSelectedSociety(society);
    setActiveView("details");
  };
  const openApplication = (society) => {
    if (!society.isOpen || society.applicationStatus !== "Not Applied") return;
    setSelectedSociety(society);
    setApplicationForm(createEmptyApplicationForm(society));
    setActiveView("application");
  };
  const handleApplicationSubmit = (event) => {
    event.preventDefault();
    setNotice(
      "Application validation and submission will be added in the next step. Your entries have not been submitted.",
    );
  };

  return (
    <main className={`society-listing-page${activeView !== "listing" ? " is-viewing-details" : ""}`}>
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

      {activeView === "application" && selectedSociety ? (
        <SocietyApplicationForm
          society={selectedSociety}
          formData={applicationForm}
          onChange={setApplicationForm}
          onBack={() => setActiveView("details")}
          onSubmit={handleApplicationSubmit}
        />
      ) : activeView === "details" && selectedSociety ? (
        <SocietyDetailsView
          society={selectedSociety}
          onBack={() => {
            setSelectedSociety(null);
            setActiveView("listing");
          }}
          onApply={() => openApplication(selectedSociety)}
        />
      ) : (
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
                      {society.initials}
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
                      {(society.details?.requiredSkills ?? []).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="society-card-facts">
                    <div>
                      <span className="society-field-label">Available positions</span>
                      <strong>
                        {availablePositionCount(society)} open · {society.details?.availablePositions?.length ?? 0} roles
                      </strong>
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
                      <strong className="society-eligible">
                        {society.details?.eligibility?.year
                          ? `✓ Eligible · ${society.details.eligibility.year} only`
                          : "Eligibility details unavailable"}
                      </strong>
                    </div>
                  </div>
                  <div className="society-card-actions">
                    <button
                      className="society-secondary-button"
                      type="button"
                      onClick={() => openSocietyDetails(society)}
                    >
                      View Details
                    </button>
                    <button
                      className={`society-primary-button${society.applicationStatus !== "Not Applied" ? " is-applied" : ""}`}
                      type="button"
                      disabled={!society.isOpen || society.applicationStatus !== "Not Applied"}
                      onClick={() => openApplication(society)}
                    >
                      {society.applicationStatus !== "Not Applied"
                        ? `${society.applicationStatus} ✓`
                        : !society.isOpen
                          ? "Applications Closed"
                          : <>Apply Now <span aria-hidden="true">→</span></>}
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
      )}

      {notice && (
        <div
          className="society-dialog-backdrop"
          role="presentation"
          onClick={() => setNotice("")}
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
              onClick={() => setNotice("")}
            >
              ×
            </button>
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
          </section>
        </div>
      )}
    </main>
  );
};

export default SocietyApplication;
