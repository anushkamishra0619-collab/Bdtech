import { useState } from "react";
import {
  githubContributionData,
  githubAnalyticsStats,
  githubLanguageDistribution,
  githubProfileData,
} from "../../data/GithubData";
import "../../styles/GithubAnalytics.css";

const contributionYears = ["2026", "2025", "2024", "All Time"];
const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

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

const getContributionWeeks = (days) => {
  const countsByDate = new Map(days.map((day) => [day.date, day.count]));
  const firstDate = new Date(`${days[0].date}T00:00:00Z`);
  const lastDate = new Date(`${days[days.length - 1].date}T00:00:00Z`);
  const gridStart = new Date(firstDate);
  const gridEnd = new Date(lastDate);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));

  const weeks = [];
  for (
    let weekStart = new Date(gridStart);
    weekStart <= gridEnd;
    weekStart.setUTCDate(weekStart.getUTCDate() + 7)
  ) {
    const week = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const date = new Date(weekStart);
      date.setUTCDate(date.getUTCDate() + weekday);
      const dateKey = date.toISOString().slice(0, 10);
      const count = countsByDate.get(dateKey);
      week.push({
        date: dateKey,
        count: count || 0,
        outsideRange: count === undefined,
      });
    }
    weeks.push(week);
  }
  return weeks;
};

const getContributionLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const formatContributionDate = (date) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const getDonutSegments = (languages) => {
  const circumference = 2 * Math.PI * 62;
  let offset = 0;

  return languages.map((language) => {
    const segmentLength = (circumference * language.percentage) / 100;
    const segment = {
      ...language,
      circumference,
      segmentLength,
      offset,
    };
    offset += segmentLength;
    return segment;
  });
};

const GitHubAnalytics = () => {
  const [syncMessage, setSyncMessage] = useState("");
  const [selectedContributionYear, setSelectedContributionYear] = useState("2026");
  const [hoveredContribution, setHoveredContribution] = useState(null);
  const { profile, metrics, demoMode } = githubProfileData;
  const selectedContributionData = githubContributionData[selectedContributionYear];
  const languageSegments = getDonutSegments(githubLanguageDistribution.languages);
  const contributionWeeks = getContributionWeeks(selectedContributionData.days);
  const monthMarkers = contributionWeeks.reduce((markers, week, weekIndex) => {
    const firstOfMonth = week.find(
      (day) => !day.outsideRange && day.date.slice(-2) === "01",
    );
    if (!firstOfMonth) return markers;

    const date = new Date(`${firstOfMonth.date}T00:00:00Z`);
    const month = date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    markers.push({
      weekIndex,
      label:
        selectedContributionYear === "All Time"
          ? `${month} '${firstOfMonth.date.slice(2, 4)}`
          : month,
    });
    return markers;
  }, []);

  const showContributionTooltip = (event, day) => {
    setHoveredContribution({
      text: `${day.count} ${
        day.count === 1 ? "contribution" : "contributions"
      } on ${formatContributionDate(day.date)}`,
      left: Math.max(8, Math.min(event.clientX + 12, window.innerWidth - 220)),
      top: Math.max(8, event.clientY - 38),
    });
  };

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

        <section
          className="github-contribution-card"
          aria-label="GitHub contribution heatmap"
        >
          <div className="github-contribution-header">
            <div className="github-contribution-title">
              <h2>
                {selectedContributionData.totalContributions.toLocaleString()} contributions in{" "}
                {selectedContributionYear}
              </h2>
              <p>Daily snapshot of pull requests, commits, issues and peer reviews.</p>
            </div>
            <div className="github-contribution-year-selector" aria-label="Contribution year">
              {contributionYears.map((year) => (
                <button
                  type="button"
                  className={
                    year === selectedContributionYear ? "is-selected" : undefined
                  }
                  aria-pressed={year === selectedContributionYear}
                  key={year}
                  onClick={() => setSelectedContributionYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div
            className="github-heatmap-scroll"
            tabIndex={0}
            aria-label="Scrollable daily contribution calendar"
          >
            <div className="github-heatmap-scroll-content">
              <div
                className="github-heatmap-months"
                style={{ width: `${contributionWeeks.length * 17 - 3}px` }}
                aria-hidden="true"
              >
                {monthMarkers.map((month) => (
                  <span
                    key={`${month.weekIndex}-${month.label}`}
                    style={{ left: `${month.weekIndex * 17}px` }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>

              <div className="github-heatmap-chart">
                <div className="github-heatmap-weekday-labels" aria-hidden="true">
                  {weekdayLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
                <div className="github-heatmap-weeks">
                  {contributionWeeks.map((week) => (
                    <div className="github-heatmap-week" key={week[0].date}>
                      {week.map((day, weekdayIndex) => {
                        if (day.outsideRange) {
                          return (
                            <span
                              className="github-contribution-cell is-outside-range"
                              key={`${day.date}-${weekdayIndex}`}
                              aria-hidden="true"
                            />
                          );
                        }

                        const dayLabel = formatContributionDate(day.date);
                        return (
                          <button
                            type="button"
                            className={`github-contribution-cell github-contribution-cell--level-${getContributionLevel(
                              day.count,
                            )}`}
                            key={day.date}
                            aria-label={`${day.count} ${
                              day.count === 1 ? "contribution" : "contributions"
                            } on ${dayLabel}`}
                            title={`${day.count} ${
                              day.count === 1 ? "contribution" : "contributions"
                            } on ${dayLabel}`}
                            onMouseEnter={(event) =>
                              showContributionTooltip(event, day)
                            }
                            onMouseLeave={() => setHoveredContribution(null)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="github-contribution-summary">
            <div className="github-contribution-highlights">
              <div>
                <strong>{selectedContributionData.currentStreak} days</strong>
                <span>Current streak</span>
              </div>
              <div>
                <strong>{selectedContributionData.longestStreak} days</strong>
                <span>Longest streak</span>
              </div>
              <div>
                <strong>
                  {selectedContributionData.busiestDay.count} contributions (
                  {selectedContributionData.busiestDay.date})
                </strong>
                <span>Busiest day</span>
              </div>
            </div>
            <div className="github-contribution-legend" aria-label="Contribution intensity">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  className={`github-contribution-cell github-contribution-cell--level-${level}`}
                  key={level}
                  aria-hidden="true"
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </section>

        <section
          className="github-language-card"
          aria-labelledby="github-language-title"
        >
          <div className="github-language-header">
            <div>
              <h2 id="github-language-title">Language distribution</h2>
              <p>{githubLanguageDistribution.subtitle}</p>
            </div>
            <span className="github-language-count">
              {githubLanguageDistribution.languageCount} languages
            </span>
          </div>

          <div className="github-language-content">
            <div className="github-language-donut-wrap">
              <svg
                className="github-language-donut"
                viewBox="0 0 160 160"
                role="img"
                aria-label={`Language usage across ${githubLanguageDistribution.totalLinesOfCode.toLocaleString()} lines of code`}
              >
                <circle
                  className="github-language-donut-track"
                  cx="80"
                  cy="80"
                  r="62"
                />
                {languageSegments.map((segment) => (
                  <circle
                    className="github-language-donut-segment"
                    cx="80"
                    cy="80"
                    r="62"
                    key={segment.name}
                    stroke={segment.color}
                    strokeDasharray={`${segment.segmentLength} ${
                      segment.circumference - segment.segmentLength
                    }`}
                    strokeDashoffset={-segment.offset}
                    transform="rotate(-90 80 80)"
                  />
                ))}
              </svg>
              <div className="github-language-donut-center" aria-hidden="true">
                <strong>
                  {Math.round(githubLanguageDistribution.totalLinesOfCode / 1000)}k
                </strong>
                <span>Lines of code</span>
              </div>
            </div>

            <ul className="github-language-list" aria-label="Language breakdown">
              {githubLanguageDistribution.languages.map((language) => (
                <li className="github-language-item" key={language.name}>
                  <div className="github-language-item-heading">
                    <span className="github-language-name">
                      <span
                        className="github-language-color"
                        style={{ backgroundColor: language.color }}
                        aria-hidden="true"
                      />
                      {language.name}
                    </span>
                    <span className="github-language-repositories">
                      {language.percentage}% · {language.repositoryCount} repos
                    </span>
                  </div>
                  <div
                    className="github-language-progress"
                    role="meter"
                    aria-label={`${language.name} share`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={language.percentage}
                  >
                    <span
                      style={{
                        width: `${language.percentage}%`,
                        backgroundColor: language.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {hoveredContribution && (
          <div
            className="github-contribution-tooltip"
            role="tooltip"
            style={{
              left: `${hoveredContribution.left}px`,
              top: `${hoveredContribution.top}px`,
            }}
          >
            {hoveredContribution.text}
          </div>
        )}
      </main>
    </div>
  );
};

export default GitHubAnalytics;
