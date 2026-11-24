import { CalendarDays, ShieldCheck } from "lucide-react";
import "../../styles/ProbationDashboard.css";

const probationDetails = [
  { label: "Start date", value: "1 Sep 2026" },
  { label: "Current semester", value: "Semester 5" },
  { label: "Duration", value: "105 days" },
];

const ProbationDashboard = () => (
  <main className="probation-dashboard">
    <header className="probation-page-header">
      <nav className="probation-breadcrumb" aria-label="Breadcrumb">
        <span>Student Portal</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Probation Dashboard</span>
      </nav>

      <div className="probation-page-heading">
        <div className="probation-heading-copy">
          <h1>Probation Dashboard</h1>
          <p>
            Monitor your probation journey, track improvement tasks and stay
            informed about upcoming reviews.
          </p>
        </div>
        <div className="probation-header-badges">
          <span className="probation-semester-badge">
            Semester 5 <span aria-hidden="true">·</span> Aug – Dec 2026
          </span>
          <span className="probation-active-badge">
            <span className="probation-badge-dot" aria-hidden="true" />
            Active
          </span>
        </div>
      </div>
    </header>

    <section
      className="probation-status-hero"
      aria-labelledby="probation-status-title"
    >
      <div className="probation-status-panel">
        <div className="probation-status-label">
          <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>Probation status</span>
        </div>

        <div className="probation-status-value">
          <span className="probation-status-dot" aria-hidden="true" />
          <h2 id="probation-status-title">Active</h2>
        </div>

        <p className="probation-status-description">
          Under probation since 1 Sep 2026
        </p>

        <div className="probation-status-divider" aria-hidden="true" />

        <dl className="probation-status-details">
          {probationDetails.map(({ label, value }) => (
            <div className="probation-status-detail" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  </main>
);

export default ProbationDashboard;
