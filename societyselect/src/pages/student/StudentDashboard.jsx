import { useState } from "react";
import "./StudentDashboard.css";

const dashboardData = {
  student: {
    name: "Ashutosh",
    role: "Probationer & Member",
    performance: 86,
    cohortRank: "Top 15%",
    milestone: "Full Time",
    deadline: "30th Dec",
  },
  overview: {
    applicationStatus: "In Review",
    statusDescription:
      "Your profile is under evaluation. You will be notified soon about the next steps in your journey.",
    examinationScore: 82,
    tasksCompleted: 8,
    totalTasks: 12,
    previousPerformance: 82,
    performanceChange: "+4%",
    performanceSummary: "Steady, upward momentum",
    bestQuarter: "Your best quarter yet.",
    projectCompletion: 84,
    productivityScore: "+24",
  },
  journey: [
    { number: "01", name: "Application", detail: "Successfully received", state: "complete" },
    { number: "02", name: "Online examination", detail: "82% score", state: "complete" },
    { number: "03", name: "Interview", detail: "Successfully completed", state: "complete" },
    { number: "04", name: "Probation", detail: "Building skills & impact", state: "current" },
    { number: "05", name: "Full Time", detail: "Target: 30th Dec", state: "upcoming" },
  ],
  monthlyTrend: [
    { month: "Jun", value: 64 },
    { month: "Jul", value: 69 },
    { month: "Aug", value: 74 },
    { month: "Sep", value: 79 },
    { month: "Oct", value: 83 },
    { month: "Nov", value: 86 },
  ],
  tasks: [
    {
      id: "readme",
      title: "Upload project README",
      description: "Add a detailed README file to your repository.",
      date: "16 Nov",
      priority: "High",
    },
    {
      id: "interview",
      title: "Prepare for your review",
      description: "Review your recent work and practice sharing your impact.",
      date: "20 Nov",
      priority: "Medium",
    },
    {
      id: "collaboration",
      title: "Peer collaboration review",
      description: "Share feedback on your teammates' recent contributions.",
      date: "24 Nov",
      priority: "Medium",
    },
    {
      id: "communication",
      title: "Complete communication quiz",
      description: "Test your communication and teamwork skills.",
      date: "28 Nov",
      priority: "Low",
    },
  ],
  activity: [
    { title: "Interview completed", detail: "Today, 10:30 AM" },
    { title: "Evaluation updated", detail: "Yesterday, 4:12 PM" },
    { title: "Project milestone submitted", detail: "9 Nov, 2:05 PM" },
    { title: "Peer review received", detail: "7 Nov, 11:24 AM" },
    { title: "Probation started", detail: "1 Nov, 9:00 AM" },
  ],
  skills: [
    { name: "React.js", score: 87, type: "percent" },
    { name: "JavaScript", score: 81, type: "percent" },
    { name: "Problem solving", score: 88, type: "percent" },
    { name: "Communication", score: 77, type: "percent" },
    { name: "Teamwork", score: 87, type: "percent" },
    { name: "GitHub contributions", score: 89, type: "points" },
  ],
  recommendations: [
    { taskId: "interview", text: "Practice mock interviews to feel ready for your review." },
    { taskId: "readme", text: "Add a clear README to showcase your project." },
    { taskId: "collaboration", text: "Keep building your collaboration skills through peer feedback." },
  ],
  insight: {
    heading: "Your next step towards growth",
    quote:
      "Your technical performance is improving. Focus on completing pending tasks and strengthening your project contributions.",
  },
};

const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { student, overview } = dashboardData;
  const chartPoints = dashboardData.monthlyTrend
    .map((point, index) => `${36 + index * 64},${100 - (point.value - 60) * 2.4}`)
    .join(" ");

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="student-dashboard">
      <header className="dashboard-navbar">
        <a className="navbar-brand" href="/student/dashboard" aria-label="SocietySelect AI home">
          <span className="brand-name">SocietySelect</span>
          <span className="brand-ai">AI</span>
        </a>

        <nav
          id="dashboard-navigation"
          className={`navbar-links${isMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="/student/dashboard" className="nav-link active" onClick={closeMenu}>Dashboard</a>
          <a href="/student/application-tracking" className="nav-link" onClick={closeMenu}>Applications</a>
          <a href="/student/performance" className="nav-link" onClick={closeMenu}>Performance</a>
          <a href="/student/settings" className="nav-link" onClick={closeMenu}>Settings</a>
          <a href="/student/notifications" className="nav-link" onClick={closeMenu}>Notifications</a>
        </nav>

        <div className="navbar-actions">
          <a className="navbar-notifications" href="/student/notifications" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
          </a>
          <a className="navbar-profile" href="/student/profile" aria-label={`Profile for ${student.name}`}>
            <span className="navbar-avatar" aria-hidden="true">{student.name.charAt(0)}</span>
          </a>
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

      <section className="dashboard-hero" aria-labelledby="student-hero-title">
        <p className="hero-eyebrow">Student Portal</p>
        <h1 className="hero-title" id="student-hero-title">
          Your Journey. <em>Your Skills.</em>
          <br />
          Your Opportunity.
        </h1>
        <p className="hero-description">
          Track your progress, showcase your skills and take the next step
          towards joining your dream society.
        </p>
        <div className="hero-actions">
          <a className="hero-button" href="#upcoming-tasks">Continue Your Journey</a>
          <a className="hero-button" href="/student/profile">View My Profile</a>
        </div>
      </section>

      <section className="student-profile-card" aria-label="Student profile">
        <div className="profile-identity">
          <span className="profile-avatar" aria-hidden="true">{student.name.charAt(0)}</span>
          <div>
            <h2>{student.name}</h2>
            <p>{student.role}</p>
          </div>
        </div>
        <div className="profile-performance">
          <div className="profile-score" aria-label={`Overall performance ${student.performance} percent`}>
            <span>{student.performance}</span>
          </div>
          <div className="profile-rank">
            <span className="card-label">Overall performance</span>
            <strong>{student.cohortRank} in your cohort</strong>
          </div>
        </div>
        <p className="profile-milestone">
          Next milestone: <strong>{student.milestone}</strong>
          <span>Deadline: {student.deadline}</span>
        </p>
      </section>

      <div className="dashboard-content">
        <section className="at-a-glance dashboard-section" aria-labelledby="glance-title">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">At a glance</p>
            <h2 id="glance-title">Where you stand, <em>{student.name}</em></h2>
          </div>
          <div className="glance-status">
            <div className="status-copy">
              <p className="section-eyebrow">Application status</p>
              <h3>{overview.applicationStatus}</h3>
              <p>{overview.statusDescription}</p>
            </div>
            <div className="glance-metrics">
              <article className="glance-metric">
                <p className="section-eyebrow">Examination score</p>
                <strong>{overview.examinationScore}<small>/100</small></strong>
                <span>Top 20% of candidates</span>
              </article>
              <article className="glance-metric tasks-glance">
                <p className="section-eyebrow">Tasks completed</p>
                <strong>{overview.tasksCompleted} <small>of {overview.totalTasks}</small></strong>
                <span>{overview.totalTasks - overview.tasksCompleted} remaining this month</span>
              </article>
            </div>
          </div>
          <div className="momentum">
            <div className="momentum-ring">{student.performance}<small>%</small></div>
            <div>
              <p className="section-eyebrow">Overall performance</p>
              <h3>{overview.performanceSummary}</h3>
              <p>{student.cohortRank} <span>•</span> {overview.performanceChange} <span>•</span> Previous: {overview.previousPerformance}</p>
            </div>
          </div>
        </section>

        <section className="journey-panel dashboard-section" aria-labelledby="journey-title">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">Recruitment journey</p>
            <h2 id="journey-title">Five steps to <em>belonging</em></h2>
          </div>
          <ol className="journey-steps">
            {dashboardData.journey.map((step) => (
              <li className={`journey-step ${step.state}`} key={step.number}>
                <span className="journey-number">{step.number}</span>
                <h3>{step.name}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="performance-section dashboard-section" aria-labelledby="performance-title">
          <div className="section-heading">
            <p className="section-eyebrow">Performance overview</p>
            <h2 className="visually-hidden" id="performance-title">Your performance overview</h2>
          </div>
          <div className="performance-grid">
            <div className="performance-highlight">
              <strong>{student.performance}<small>%</small></strong>
              <h3>{overview.bestQuarter}</h3>
              <p>Consistent growth across all sections this year.</p>
            </div>
            <div className="trend-chart">
              <p className="section-eyebrow">Monthly trend</p>
              <svg viewBox="0 0 420 125" role="img" aria-label="Performance rising from 64 in June to 86 in November">
                <line x1="30" y1="102" x2="398" y2="102" />
                <line x1="30" y1="62" x2="398" y2="62" />
                <line x1="30" y1="22" x2="398" y2="22" />
                <polyline points={chartPoints} />
                {dashboardData.monthlyTrend.map((point, index) => (
                  <circle
                    key={point.month}
                    cx={36 + index * 64}
                    cy={100 - (point.value - 60) * 2.4}
                    r="3.5"
                  />
                ))}
              </svg>
              <div className="chart-months">
                {dashboardData.monthlyTrend.map((point) => <span key={point.month}>{point.month}</span>)}
              </div>
            </div>
            <div className="performance-stat">
              <p className="section-eyebrow">Current score</p>
              <strong>{overview.examinationScore} / 100</strong>
            </div>
            <div className="performance-stat">
              <p className="section-eyebrow">Project completion</p>
              <strong>{overview.projectCompletion} / 100</strong>
            </div>
          </div>
        </section>

        <section className="tasks-section dashboard-section" id="upcoming-tasks" aria-labelledby="tasks-title">
          <div className="section-heading">
            <p className="section-eyebrow">Upcoming tasks</p>
            <h2 id="tasks-title">What needs your <em>attention</em></h2>
          </div>
          <ul className="task-list">
            {dashboardData.tasks.map((task) => (
              <li className="task-item" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="task-meta">
                  <time>{task.date}</time>
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="activity-section dashboard-section" aria-labelledby="activity-title">
          <div className="section-heading">
            <p className="section-eyebrow">Recent activity</p>
            <h2 id="activity-title">Lately</h2>
          </div>
          <ol className="activity-list">
            {dashboardData.activity.map((activity) => (
              <li className="activity-item" key={activity.title}>
                <span className="activity-dot" aria-hidden="true" />
                <div>
                  <h3>{activity.title}</h3>
                  <p>{activity.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="skills-section dashboard-section" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="section-eyebrow">Skills &amp; development</p>
            <h2 id="skills-title">What you bring to the society</h2>
            <p className="section-description">Excel in areas your membership profile shows and grow stronger.</p>
          </div>
          <ul className="skills-list">
            {dashboardData.skills.map((skill) => (
              <li className="skill-item" key={skill.name}>
                <span>{skill.name}</span>
                <strong>{skill.score}{skill.type === "points" ? " / 100" : "%"}</strong>
                <span className="skill-bar" aria-hidden="true">
                  <span style={{ width: `${skill.score}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="recommendations-section dashboard-section" aria-labelledby="recommendations-title">
          <div className="section-heading">
            <p className="section-eyebrow">Recommended actions</p>
            <h2 className="visually-hidden" id="recommendations-title">Recommended actions for you</h2>
          </div>
          <div className="recommendations-content">
            <ol className="recommendation-list">
              {dashboardData.recommendations.map((recommendation, index) => (
                <li key={recommendation.taskId}>
                  <span>{index + 1}</span>
                  <p>{recommendation.text}</p>
                </li>
              ))}
            </ol>
            <div className="recommendation-metrics">
              <div><strong>{overview.productivityScore}</strong><span>Productivity score</span></div>
              <div><strong>{overview.tasksCompleted}/{overview.totalTasks}</strong><span>Tasks done</span></div>
            </div>
          </div>
        </section>

        <aside className="ai-insight" aria-labelledby="insight-title">
          <p className="insight-eyebrow"><span aria-hidden="true">✦</span> AI insight</p>
          <h2 id="insight-title">{dashboardData.insight.heading}</h2>
          <blockquote>“{dashboardData.insight.quote}”</blockquote>
          <a className="insight-link" href="/student/ai-recommendations">
            View detailed insights <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>

      <footer className="dashboard-footer">
        <span>SocietySelect AI</span>
        <span aria-hidden="true">•</span>
        <span>Empowering the next generation</span>
      </footer>
    </main>
  );
};

export default StudentDashboard;
