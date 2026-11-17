import { useState } from "react";
import { githubProfileData } from "../../data/GithubData";
import "../../styles/GithubAnalytics.css";

const GitHubAnalytics = () => {
  const [syncMessage, setSyncMessage] = useState("");
  const { profile, metrics, demoMode } = githubProfileData;

  return (
    <div className="github-analytics-page">
      <header className="github-analytics-navbar">
        <div className="github-analytics-navbar-inner">
          <a
            className="github-analytics-brand"
            href="/student/dashboard"
            aria-label="SocietySelect AI home"
          >
            <span>SocietySelect</span>
            <span className="github-analytics-brand-ai">AI</span>
          </a>

          <div className="github-analytics-nav-actions">
            <span className="github-analytics-nav-label" aria-current="page">
              GitHub Analytics
            </span>
            <a
              className="github-analytics-notifications"
              href="/student/notifications"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
            </a>
            <a
              className="github-analytics-user-avatar"
              href="/student/profile"
              aria-label={`View ${profile.name}'s profile`}
            >
              {profile.name.charAt(0)}
            </a>
          </div>
        </div>
      </header>

      <main className="github-analytics-content">
        <nav className="github-analytics-breadcrumb" aria-label="Breadcrumb">
          <a href="/student/dashboard">Dashboard</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">GitHub Analytics</span>
        </nav>

        <section className="github-analytics-intro" aria-labelledby="github-analytics-title">
          <div className="github-analytics-title-row">
            <h1 id="github-analytics-title">
              GitHub <em>Analytics</em>
            </h1>
            <span className="github-analytics-demo-badge">
              <span className="github-analytics-demo-dot" aria-hidden="true" />
              Demo mode · not connected · {profile.username}
            </span>
          </div>
          <p className="github-analytics-description">
            Track your coding journey, contributions and velocity. Sample telemetry shown to campus
            engineering societies and mentor panels. Not live GitHub data.
          </p>
          <div className="github-analytics-actions">
            <button
              className="github-analytics-sync-button"
              type="button"
              onClick={() => setSyncMessage("Sample profile data is up to date.")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 7v5h-5M4.7 9A7.5 7.5 0 0 1 18 6l2 2M4 17v-5h5m10.3 3A7.5 7.5 0 0 1 6 18l-2-2" />
              </svg>
              <span>Sync GitHub Activity</span>
              {demoMode && <span className="github-analytics-sync-demo">demo</span>}
            </button>
            <a
              className="github-analytics-profile-button"
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Profile <span aria-hidden="true">↗</span>
            </a>
            <span className="github-analytics-sync-message" aria-live="polite">
              {syncMessage}
            </span>
          </div>
        </section>

        <section className="github-profile-overview" aria-label="GitHub profile overview">
          <div className="github-profile-identity">
            <div className="github-profile-avatar-wrap">
              <div className="github-profile-avatar" aria-hidden="true">
                {profile.name.charAt(0)}
              </div>
              <span className="github-profile-online-indicator" aria-label="Active" />
            </div>
            <div className="github-profile-details">
              <div className="github-profile-name-row">
                <h2>{profile.name}</h2>
                <a
                  className="github-profile-username"
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.username}
                </a>
                <span className="github-profile-affiliation">{profile.affiliation}</span>
              </div>
              <p className="github-profile-academics">
                {profile.department} · {profile.year} · {profile.college}
              </p>
              <p className="github-profile-bio">{profile.bio}</p>
              <ul className="github-profile-meta" aria-label="Profile details">
                {profile.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>

          <dl className="github-profile-metrics">
            {metrics.map((metric) => (
              <div className="github-profile-metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
};

export default GitHubAnalytics;
