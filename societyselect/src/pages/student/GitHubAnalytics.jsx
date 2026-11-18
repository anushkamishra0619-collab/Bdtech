import { useState } from "react";
import {
  githubContributionData,
  githubAnalyticsStats,
  githubCommitVelocity,
  githubLanguageDistribution,
  githubProfileData,
  githubRecentActivities,
  githubTopRepositories,
} from "../../data/GithubData";
import "../../styles/GithubAnalytics.css";

const contributionYears = ["2026", "2025", "2024", "All Time"];
const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

const GitHubActivityIcon = ({ type }) => {
  const iconContent = {
    Commit: (
      <>
        <path d="M3 12h5m8 0h5" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    "Pull Request": (
      <>
        <path d="M7 5v14m10-14v10" />
        <circle cx="7" cy="5" r="2" />
        <circle cx="17" cy="19" r="2" />
        <circle cx="17" cy="9" r="2" />
      </>
    ),
    Issue: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v5m0 3h.01" />
      </>
    ),
    Merge: (
      <>
        <path d="M7 5v14m10-14v4c0 3-2 5-5 5h-1" />
        <circle cx="7" cy="5" r="2" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="5" r="2" />
      </>
    ),
  }[type];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconContent}
    </svg>
  );
};

const formatActivityTimestamp = (timestamp) =>
  new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

const formatRepositoryUpdatedAt = (timestamp) => {
  const updatedDate = new Date(timestamp);
  const now = new Date();
  const updatedDay = Date.UTC(
    updatedDate.getUTCFullYear(),
    updatedDate.getUTCMonth(),
    updatedDate.getUTCDate(),
  );
  const currentDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysAgo = Math.max(0, Math.floor((currentDay - updatedDay) / 86400000));
  if (daysAgo === 0) return "Updated today";
  if (daysAgo === 1) return "Updated yesterday";
  return `Updated ${daysAgo}d ago`;
};

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

const getSmoothLinePath = (points) => {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)];
    const controlOneX = current.x + (next.x - previous.x) / 6;
    const controlOneY = current.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (following.x - current.x) / 6;
    const controlTwoY = next.y - (following.y - current.y) / 6;
    path += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${next.x} ${next.y}`;
  }
  return path;
};

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
  const [selectedVelocityRange, setSelectedVelocityRange] = useState("Weekly");
  const [hoveredVelocityPoint, setHoveredVelocityPoint] = useState(null);
  const [repositorySearch, setRepositorySearch] = useState("");
  const [repositoryLanguage, setRepositoryLanguage] = useState("All languages");
  const [repositorySort, setRepositorySort] = useState("stars");
  const [visibleRepositoryCount, setVisibleRepositoryCount] = useState(4);
  const { profile, metrics, demoMode } = githubProfileData;
  const selectedContributionData = githubContributionData[selectedContributionYear];
  const languageSegments = getDonutSegments(githubLanguageDistribution.languages);
  const velocitySeries = githubCommitVelocity[selectedVelocityRange];
  const velocityPlot = {
    width: 880,
    left: 52,
    right: 12,
    top: 24,
    bottom: 270,
  };
  const velocityPlotWidth = velocityPlot.width - velocityPlot.left - velocityPlot.right;
  const velocityStep = velocityPlotWidth / velocitySeries.points.length;
  const velocityPoints = velocitySeries.points.map((point, index) => {
    const x = velocityPlot.left + velocityStep * (index + 0.5);
    const y =
      velocityPlot.bottom -
      (point.value / velocitySeries.axisMax) * (velocityPlot.bottom - velocityPlot.top);
    return {
      ...point,
      index,
      x,
      y,
      barX: x - Math.min(40, velocityStep * 0.6) / 2,
      barWidth: Math.min(40, velocityStep * 0.6),
      barY: y,
      barHeight: velocityPlot.bottom - y,
      isHighlighted: velocitySeries.highlightIndices.includes(index),
    };
  });
  const velocityLinePath = getSmoothLinePath(velocityPoints);
  const repositoryLanguages = [
    "All languages",
    ...new Set(githubTopRepositories.map((repository) => repository.language)),
  ];
  const filteredRepositories = githubTopRepositories
    .filter((repository) => {
      const searchTerm = repositorySearch.trim().toLowerCase();
      const matchesSearch =
        !searchTerm ||
        [
          repository.name,
          repository.description,
          repository.language,
          ...repository.topics,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      const matchesLanguage =
        repositoryLanguage === "All languages" ||
        repository.language === repositoryLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((left, right) => {
      if (repositorySort === "updated") {
        return new Date(right.updatedAt) - new Date(left.updatedAt);
      }
      if (repositorySort === "name") {
        return left.name.localeCompare(right.name);
      }
      return right.stars - left.stars;
    });
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

  const showVelocityTooltip = (event, point) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || bounds.left + bounds.width / 2;
    const y = event.clientY || bounds.top;
    setHoveredVelocityPoint({
      text: `${point.label}: ${point.value} commits`,
      left: Math.max(8, Math.min(x + 12, window.innerWidth - 220)),
      top: Math.max(8, y - 38),
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

        <section
          className="github-velocity-card"
          aria-labelledby="github-velocity-title"
        >
          <div className="github-velocity-header">
            <div>
              <h2 id="github-velocity-title">{velocitySeries.title}</h2>
              <p>{velocitySeries.subtitle}</p>
            </div>
            <div className="github-velocity-range-selector" role="group" aria-label="Commit time range">
              {Object.keys(githubCommitVelocity).map((range) => (
                <button
                  type="button"
                  className={range === selectedVelocityRange ? "is-selected" : undefined}
                  aria-pressed={range === selectedVelocityRange}
                  key={range}
                  onClick={() => {
                    setSelectedVelocityRange(range);
                    setHoveredVelocityPoint(null);
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="github-velocity-chart-scroll">
            <svg
              className="github-velocity-chart"
              viewBox="0 0 880 350"
              role="img"
              aria-label={`${velocitySeries.title} bar chart with trend line`}
            >
              {velocitySeries.ticks.map((tick) => {
                const y =
                  velocityPlot.bottom -
                  (tick / velocitySeries.axisMax) *
                    (velocityPlot.bottom - velocityPlot.top);
                return (
                  <g className="github-velocity-axis-tick" key={tick}>
                    <line
                      x1={velocityPlot.left}
                      x2={velocityPlot.width - velocityPlot.right}
                      y1={y}
                      y2={y}
                    />
                    <text x={velocityPlot.left - 10} y={y + 4} textAnchor="end">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {velocityPoints.map((point) => (
                <g
                  className="github-velocity-data-point"
                  key={point.label}
                  tabIndex={0}
                  aria-label={`${point.label}: ${point.value} commits`}
                  onMouseEnter={(event) => showVelocityTooltip(event, point)}
                  onMouseLeave={() => setHoveredVelocityPoint(null)}
                  onFocus={(event) => showVelocityTooltip(event, point)}
                  onBlur={() => setHoveredVelocityPoint(null)}
                >
                  <title>{`${point.label}: ${point.value} commits`}</title>
                  <rect
                    x={point.barX}
                    y={point.barY}
                    width={point.barWidth}
                    height={point.barHeight}
                    rx="5"
                    className={
                      point.isHighlighted
                        ? "github-velocity-bar is-highlighted"
                        : "github-velocity-bar"
                    }
                  />
                </g>
              ))}

              <path
                className="github-velocity-trend-line"
                d={velocityLinePath}
                aria-hidden="true"
              />

              {velocityPoints.map((point) =>
                point.isHighlighted ? (
                  <g className="github-velocity-highlight" key={`highlight-${point.label}`}>
                    <text x={point.x} y={point.y - 14} textAnchor="middle">
                      {point.value}
                    </text>
                    <circle cx={point.x} cy={point.y} r="6" />
                  </g>
                ) : null,
              )}

              {velocityPoints.map((point) =>
                point.axisLabel ? (
                  <text
                    className={
                      point.isHighlighted
                        ? "github-velocity-axis-label is-highlighted"
                        : "github-velocity-axis-label"
                    }
                    key={`axis-${point.label}`}
                    x={point.x}
                    y="301"
                    textAnchor="middle"
                  >
                    {point.axisLabel}
                  </text>
                ) : null,
              )}
            </svg>
          </div>

          <div className="github-velocity-legend" aria-label="Chart legend">
            <span>
              <i className="github-velocity-legend-bar" aria-hidden="true" />
              Commits
            </span>
            <span>
              <i className="github-velocity-legend-bar is-highlighted" aria-hidden="true" />
              Peak / current
            </span>
            <span>
              <i className="github-velocity-legend-line" aria-hidden="true" />
              Trend
            </span>
          </div>
        </section>
        <section
          className="github-telemetry-card"
          aria-labelledby="github-telemetry-title"
        >
          <div className="github-telemetry-header">
            <div>
              <h2 id="github-telemetry-title">Recent telemetry feed</h2>
              <p>Recent activity across your GitHub repositories.</p>
            </div>
            <span className="github-telemetry-demo-badge">DEMO DATA</span>
          </div>

          <ol className="github-telemetry-list">
            {githubRecentActivities.map((activity) => (
              <li
                className={`github-telemetry-item github-telemetry-item-${activity.type
                  .toLowerCase()
                  .replace(" ", "-")}`}
                key={activity.id}
              >
                <span className="github-telemetry-icon">
                  <GitHubActivityIcon type={activity.type} />
                </span>
                <div className="github-telemetry-main">
                  <div className="github-telemetry-title-row">
                    <h3>{activity.title}</h3>
                    <time
                      className="github-telemetry-time"
                      dateTime={activity.timestamp}
                    >
                      {formatActivityTimestamp(activity.timestamp)}
                    </time>
                  </div>
                  <p>{activity.description}</p>
                  <div className="github-telemetry-meta">
                    <span className="github-telemetry-repository">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 2.5h10v11H3zM6 2.5v11" />
                      </svg>
                      {activity.repository}
                    </span>
                    <span className="github-telemetry-type">{activity.type}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="github-repositories-section"
          aria-labelledby="github-repositories-heading"
        >
          <div className="github-repositories-heading">
            <h2 id="github-repositories-heading">
              Top repositories <span>&amp; open-source projects</span>
            </h2>
            <p>
              {githubTopRepositories.length} public repositories (demonstration list).
            </p>
          </div>

          <div className="github-repository-controls">
            <label className="github-repository-search">
              <span className="github-visually-hidden">Search repositories</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="m13 13 4 4" />
              </svg>
              <input
                type="search"
                placeholder="Search repositories..."
                value={repositorySearch}
                onChange={(event) => {
                  setRepositorySearch(event.target.value);
                  setVisibleRepositoryCount(4);
                }}
              />
            </label>

            <label className="github-repository-select">
              <span className="github-visually-hidden">Filter by language</span>
              <select
                value={repositoryLanguage}
                onChange={(event) => {
                  setRepositoryLanguage(event.target.value);
                  setVisibleRepositoryCount(4);
                }}
              >
                {repositoryLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label className="github-repository-select github-repository-sort">
              <span className="github-visually-hidden">Sort repositories</span>
              <select
                value={repositorySort}
                onChange={(event) => {
                  setRepositorySort(event.target.value);
                  setVisibleRepositoryCount(4);
                }}
              >
                <option value="stars">Sort by: Most stars</option>
                <option value="updated">Sort by: Recently updated</option>
                <option value="name">Sort by: Name</option>
              </select>
            </label>
          </div>

          {filteredRepositories.length > 0 ? (
            <>
              <div className="github-repository-grid">
                {filteredRepositories
                  .slice(0, visibleRepositoryCount)
                  .map((repository) => (
                    <article
                      className="github-repository-card"
                      key={repository.id}
                    >
                      <div className="github-repository-card-heading">
                        <div className="github-repository-name-wrap">
                          <svg
                            className="github-repository-icon"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M3 2.5h14v15H3zM6.5 2.5v15" />
                          </svg>
                          <h3>{repository.name}</h3>
                        </div>
                        <div className="github-repository-badges">
                          <span className="github-repository-public">Public</span>
                          {repository.featured && (
                            <span className="github-repository-featured">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="github-repository-description">
                        {repository.description}
                      </p>

                      <ul className="github-repository-topics" aria-label="Topics">
                        {repository.topics.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>

                      <div className="github-repository-metrics">
                        <span className="github-repository-language">
                          <i
                            style={{ backgroundColor: repository.languageColor }}
                            aria-hidden="true"
                          />
                          {repository.language}
                        </span>
                        <span className="github-repository-count">
                          <span aria-hidden="true">☆</span> {repository.stars}
                          <span className="github-visually-hidden"> stars</span>
                        </span>
                        <span className="github-repository-count">
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M4 3v10m8-10v4c0 3-2 5-5 5H6" />
                            <circle cx="4" cy="3" r="1.5" />
                            <circle cx="4" cy="13" r="1.5" />
                            <circle cx="12" cy="3" r="1.5" />
                          </svg>
                          {repository.forks}
                          <span className="github-visually-hidden"> forks</span>
                        </span>
                      </div>

                      <time
                        className="github-repository-updated"
                        dateTime={repository.updatedAt}
                      >
                        {formatRepositoryUpdatedAt(repository.updatedAt)}
                      </time>
                    </article>
                  ))}
              </div>
              <div className="github-repository-footer">
                <span>
                  Showing {Math.min(visibleRepositoryCount, filteredRepositories.length)} of{" "}
                  {filteredRepositories.length} repositories
                </span>
                {visibleRepositoryCount < filteredRepositories.length && (
                  <button
                    className="github-repository-load-more"
                    type="button"
                    onClick={() =>
                      setVisibleRepositoryCount((count) => count + 4)
                    }
                  >
                    Load More Repositories
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 3v10m-4-4 4 4 4-4" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="github-repository-empty" role="status">
              No repositories match your search and language filter.
            </div>
          )}
        </section>
        {hoveredVelocityPoint && (
          <div
            className="github-velocity-tooltip"
            role="tooltip"
            style={{
              left: `${hoveredVelocityPoint.left}px`,
              top: `${hoveredVelocityPoint.top}px`,
            }}
          >
            {hoveredVelocityPoint.text}
          </div>
        )}
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
