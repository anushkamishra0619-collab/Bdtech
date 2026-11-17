import { useState } from "react";
import {
  githubAnalyticsStats,
  githubProfileData,
} from "../../data/GithubData";
import "../../styles/GithubAnalytics.css";

const GitHubStatIcon = ({ type }) => {
  const iconContent = {
    activity: <path d="M3 12h4l3-9 4 18 3-9h4" />,
    commits: (
      <>
        <path d="M3 12h5m8 0h5" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    repositories: <path d="M5 3h14v18H5z" />,
    pullRequests: (
      <>
        <path d="M6 5v10m12-6v10M6 15a3 3 0 1 0 3 3m6-9a3 3 0 1 0 3-3" />
      </>
    ),
    issues: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    stars: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
  }[type];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconContent}
    </svg>
  );
};

const getSparklinePoints = (values) => {
  const width = 240;
  const height = 28;
  const minimum = Math.min(...values);
  const range = Math.max(...values) - minimum || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - minimum) / range) * (height - 5) - 2;
      return `${x},${y}`;
    })
    .join(" ");
};

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

        <section className="github-statistics-grid" aria-label="GitHub statistics">
          {githubAnalyticsStats.map((stat) => {
            const sparklinePoints = getSparklinePoints(stat.sparkline);

            return (
              <article
                className={`github-stat-card github-stat-card--${stat.tone}`}
                key={stat.id}
              >
                <div className="github-stat-card-heading">
                  <h2>{stat.label}</h2>
                  <span className="github-stat-icon">
                    <GitHubStatIcon type={stat.icon} />
                  </span>
                </div>
                <p className="github-stat-value">{stat.value}</p>
                {stat.trend ? (
                  <p className="github-stat-trend">{stat.trend}</p>
                ) : (
                  <p className="github-stat-context">{stat.context}</p>
                )}
                <svg
                  className="github-stat-sparkline"
                  viewBox="0 0 240 34"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${stat.label} recent trend`}
                >
                  <defs>
                    <linearGradient id={`github-stat-fill-${stat.id}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity=".16" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    className="github-stat-sparkline-fill"
                    points={`0,34 ${sparklinePoints} 240,34`}
                    fill={`url(#github-stat-fill-${stat.id})`}
                  />
                  <polyline
                    className="github-stat-sparkline-line"
                    points={sparklinePoints}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default GitHubAnalytics;
