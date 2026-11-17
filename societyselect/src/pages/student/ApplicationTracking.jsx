import { useEffect, useState } from "react";
import { getApplications } from "../../data/applicationService";
import "../../styles/SocietyApplication.css";

const formatSubmissionDate = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleString();
};

const ApplicationTracking = () => {
  const [applications, setApplications] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      setApplications(getApplications());
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Applications could not be loaded.",
      );
    }
  }, []);

  return (
    <main className="society-listing-page society-tracking-page">
      <header className="society-navbar">
        <a
          className="society-navbar-brand"
          href="/student/dashboard"
          aria-label="SocietySelect AI home"
        >
          <span>SocietySelect</span>
          <small>AI</small>
        </a>
        <a className="society-tracking-back-link" href="/student/application">
          Society Applications
        </a>
      </header>

      <div className="society-listing-content society-tracking-content">
        <nav className="society-breadcrumbs" aria-label="Breadcrumb">
          <a href="/student/dashboard">Dashboard</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Application Tracking</span>
        </nav>

        <header className="society-tracking-heading">
          <p className="society-eyebrow">Your submissions</p>
          <h1>Application Tracking</h1>
          <p>Review the society applications saved for this browser.</p>
        </header>

        {loadError && (
          <p className="society-application-submit-error" role="alert">
            {loadError}
          </p>
        )}

        {applications === null ? (
          <p className="society-tracking-empty">
            {loadError ? "Applications could not be loaded." : "Loading applications..."}
          </p>
        ) : applications.length === 0 ? (
          <section className="society-tracking-empty">
            <h2>No submitted applications yet</h2>
            <p>Applications you submit will appear here.</p>
            <a className="society-primary-button" href="/student/application">
              Browse Societies
            </a>
          </section>
        ) : (
          <section className="society-tracking-list" aria-label="Submitted applications">
            {applications.map((application) => (
              <article
                className="society-tracking-card"
                key={application.applicationId}
              >
                <div className="society-tracking-card-heading">
                  <div>
                    <span className="society-category-label">
                      {application.status ?? "Submitted"}
                    </span>
                    <h2>{application.societyName ?? "Society name unavailable"}</h2>
                  </div>
                  <span className="society-tracking-position">
                    {application.position ?? "Position unavailable"}
                  </span>
                </div>
                <dl>
                  <div>
                    <dt>Application ID</dt>
                    <dd>{application.applicationId}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatSubmissionDate(application.submittedAt)}</dd>
                  </div>
                  <div>
                    <dt>Applicant</dt>
                    <dd>{application.student?.fullName ?? "Name unavailable"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default ApplicationTracking;
