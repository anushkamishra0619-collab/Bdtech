import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  FileCheck,
  FileText,
  Hourglass,
  Info,
  LockKeyhole,
  Monitor,
  SlidersHorizontal,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import {
  assessmentRecords,
  getAssessmentPercentage,
  getAssessmentStatus,
  isResultDeclared,
  pendingResultMessage,
  resultCategories,
  resultTones,
  resultsSemester,
  unstopAssessmentNotice,
} from "../../data/ExaminationResultsData";
import "../../styles/ExaminationResults.css";

const categoryIcons = {
  clipboard: FileCheck,
  file: FileText,
  monitor: Monitor,
  trophy: Trophy,
};

const statusIcons = {
  Passed: CircleCheck,
  Failed: X,
  Pending: Hourglass,
};

const StatusBadge = ({ status }) => {
  const Icon = statusIcons[status] ?? Hourglass;
  return (
    <span className={`res-badge res-badge--${status.toLowerCase()}`}>
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {status}
    </span>
  );
};

const CategoryBadge = ({ categoryId }) => {
  const category = resultCategories.find((item) => item.id === categoryId);
  const Icon = categoryIcons[category?.icon] ?? FileCheck;
  return (
    <span className={`res-category-badge res-category-badge--${categoryId}`}>
      <Icon size={12} strokeWidth={1.9} aria-hidden="true" />
      {category?.shortLabel ?? categoryId}
    </span>
  );
};

const MetaField = ({ label, value, icon: Icon }) => (
  <div className="res-field">
    <dt className="res-field-label">
      <Icon size={12} strokeWidth={1.9} aria-hidden="true" />
      {label}
    </dt>
    <dd className="res-field-value">{value}</dd>
  </div>
);

const OverviewCard = ({ label, value, note, tone, icon: Icon }) => (
  <article className={`res-metric res-metric--${tone}`}>
    <div className="res-metric-top">
      <span className="res-mini-label">{label}</span>
      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
    </div>
    <strong className="res-metric-value">{value}</strong>
    <span className="res-metric-note">{note}</span>
  </article>
);

const Modal = ({ eyebrow, title, subtitle, onClose, children }) => {
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  return (
    <div
      className="res-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="res-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="res-modal-title"
      >
        <header className="res-modal-header">
          <div className="res-modal-heading">
            <p className="res-eyebrow">{eyebrow}</p>
            <h2 id="res-modal-title">{title}</h2>
            {subtitle ? <p className="res-modal-subtitle">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="res-icon-button"
            onClick={onClose}
            autoFocus
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
};

const ScoreVisual = ({ percentage, obtained, total, toneKey }) => {
  const circumference = 2 * Math.PI * 52;
  const tone = resultTones[toneKey] ?? resultTones.pending;
  const value = percentage ?? 0;

  return (
    <div className={`res-score-visual res-score-visual--${toneKey}`}>
      <svg viewBox="0 0 130 130" aria-hidden="true">
        <circle className="res-score-track" cx="65" cy="65" r="52" />
        <circle
          className="res-score-progress"
          cx="65"
          cy="65"
          r="52"
          stroke={tone.color}
          strokeDasharray={circumference}
          strokeDashoffset={
            percentage === null ? circumference : circumference * (1 - value / 100)
          }
        />
      </svg>
      <div className="res-score-center">
        {percentage === null ? (
          <LockKeyhole size={27} strokeWidth={1.6} aria-hidden="true" />
        ) : (
          <>
            <strong>{obtained}</strong>
            <span>/ {total}</span>
          </>
        )}
      </div>
    </div>
  );
};

const DetailsModal = ({ record, onClose }) => {
  const status = getAssessmentStatus(record);
  const toneKey = status.toLowerCase();
  const tone = resultTones[toneKey];
  const declared = isResultDeclared(record);
  const percentage = getAssessmentPercentage(record);
  const category = resultCategories.find((item) => item.id === record.category);

  return (
    <Modal
      eyebrow="Assessment result"
      title={record.name}
      subtitle={`${category?.label ?? record.category} · ${record.focus}`}
      onClose={onClose}
    >
      <div className="res-modal-body">
        <ScoreVisual
          percentage={percentage}
          obtained={record.obtainedMarks}
          total={record.totalMarks}
          toneKey={toneKey}
        />

        <div className="res-result-status">
          <StatusBadge status={status} />
          {declared ? (
            <strong className="res-result-percentage">{percentage}%</strong>
          ) : null}
        </div>

        <p className="res-result-message">
          {declared
            ? status === "Passed"
              ? `You cleared this assessment. Your mentor imported the result on ${record.declaredOn}.`
              : `You did not clear this assessment. Your mentor imported the result on ${record.declaredOn}.`
            : pendingResultMessage}
        </p>

        <dl className="res-modal-grid">
          <MetaField label="Assessment category" value={category?.label ?? record.category} icon={FileCheck} />
          <MetaField label="Assigned mentor" value={record.mentor} icon={UserRound} />
          <MetaField label="Assessment date" value={record.assessmentDate} icon={CalendarDays} />
          <MetaField label="Total marks" value={record.totalMarks} icon={FileText} />
          <MetaField label="Passing marks" value={record.passingMarks} icon={Check} />
          <MetaField
            label="Obtained marks"
            value={declared ? record.obtainedMarks : "Not available"}
            icon={declared ? CircleCheck : LockKeyhole}
          />
          <MetaField
            label="Percentage"
            value={declared ? `${percentage}%` : "Not available"}
            icon={CircleCheck}
          />
          <MetaField
            label="Result declaration date"
            value={declared ? record.declaredOn : "Not declared"}
            icon={Clock3}
          />
          <MetaField label="Result status" value={tone.label} icon={Trophy} />
          <MetaField
            label="Unstop reference"
            value={record.unstopReference}
            icon={ExternalLink}
          />
        </dl>

        <div className={`res-info-panel${declared ? "" : " res-info-panel--locked"}`}>
          {declared ? (
            <Info size={17} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <LockKeyhole size={17} strokeWidth={1.8} aria-hidden="true" />
          )}
          <div>
            <h3>{declared ? "View-only result" : "Marks are protected"}</h3>
            <p>{unstopAssessmentNotice}</p>
          </div>
        </div>
      </div>

      <footer className="res-modal-footer">
        <button type="button" className="res-btn res-btn--secondary" onClick={onClose}>
          Close
        </button>
      </footer>
    </Modal>
  );
};

const ExaminationResults = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const summary = useMemo(() => {
    const declaredRecords = assessmentRecords.filter(isResultDeclared);
    const passed = declaredRecords.filter(
      (record) => getAssessmentStatus(record) === "Passed",
    ).length;
    const failed = declaredRecords.length - passed;
    const total = assessmentRecords.length;
    const average = declaredRecords.length
      ? Math.round(
          (declaredRecords.reduce(
            (sum, record) => sum + getAssessmentPercentage(record),
            0,
          ) /
            declaredRecords.length) *
            10,
        ) / 10
      : 0;

    return {
      total,
      declared: declaredRecords.length,
      passed,
      failed,
      pending: total - declaredRecords.length,
      average,
    };
  }, []);

  const categorySummaries = useMemo(
    () =>
      resultCategories
        .filter((category) => category.id !== "all")
        .map((category) => {
          const records = assessmentRecords.filter(
            (record) => record.category === category.id,
          );
          const declared = records.filter(isResultDeclared);
          const passed = declared.filter(
            (record) => getAssessmentStatus(record) === "Passed",
          ).length;
          const average = declared.length
            ? Math.round(
                (declared.reduce(
                  (sum, record) => sum + getAssessmentPercentage(record),
                  0,
                ) /
                  declared.length) *
                  10,
              ) / 10
            : 0;

          return {
            ...category,
            total: records.length,
            declared: declared.length,
            passed,
            average,
          };
        }),
    [],
  );

  const visibleRecords = useMemo(
    () =>
      activeCategory === "all"
        ? assessmentRecords
        : assessmentRecords.filter((record) => record.category === activeCategory),
    [activeCategory],
  );

  const overviewCards = [
    {
      id: "total",
      label: "Total Assessments",
      value: String(summary.total).padStart(2, "0"),
      note: "DSA · Domain · Aptitude",
      tone: "ink",
      icon: FileCheck,
    },
    {
      id: "declared",
      label: "Results Declared",
      value: String(summary.declared).padStart(2, "0"),
      note: `${summary.failed} did not clear`,
      tone: "blue",
      icon: FileText,
    },
    {
      id: "passed",
      label: "Passed",
      value: String(summary.passed).padStart(2, "0"),
      note: `${summary.declared ? Math.round((summary.passed / summary.declared) * 100) : 0}% of declared`,
      tone: "green",
      icon: CircleCheck,
    },
    {
      id: "pending",
      label: "Pending",
      value: String(summary.pending).padStart(2, "0"),
      note: "awaiting mentor import",
      tone: "amber",
      icon: Hourglass,
    },
  ];

  const activeCategoryLabel =
    resultCategories.find((category) => category.id === activeCategory)?.label ??
    "All Assessments";

  return (
    <main className="results-page">
      <div className="results-shell">
        <header className="res-page-header">
          <nav className="res-breadcrumb" aria-label="Breadcrumb">
            <span>Student Portal</span>
            <span aria-hidden="true">/</span>
            <span>Examination</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Results</span>
          </nav>

          <div className="res-page-heading">
            <div className="res-heading-copy">
              <h1>Examination Results</h1>
              <p>View your Unstop assessment performance and selection round results.</p>
            </div>
            <div className="res-header-badges">
              <div className="res-semester-badge">
                <span>{resultsSemester.label}</span>
                <strong>{resultsSemester.value}</strong>
              </div>
              <div className="res-session-badge">
                <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
                <div>
                  <strong>{resultsSemester.session}</strong>
                  <span>{resultsSemester.student}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="res-metrics" aria-label="Result overview">
          {overviewCards.map((card) => (
            <OverviewCard key={card.id} {...card} />
          ))}
        </section>

        <section className="res-summary" aria-labelledby="res-summary-title">
          <div className="res-summary-head">
            <div>
              <p className="res-eyebrow">Performance summary</p>
              <h2 id="res-summary-title">Overall assessment performance</h2>
            </div>
            <p>
              The average score is calculated from declared results only. Pending results
              are excluded.
            </p>
          </div>

          <div className="res-summary-grid">
            <article className="res-average-card">
              <svg viewBox="0 0 110 110" aria-hidden="true">
                <circle className="res-average-track" cx="55" cy="55" r="44" />
                <circle
                  className="res-average-fill"
                  cx="55"
                  cy="55"
                  r="44"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={
                    2 * Math.PI * 44 * (1 - summary.average / 100)
                  }
                />
              </svg>
              <div className="res-average-copy">
                <strong>{summary.average}%</strong>
                <span>Average score</span>
                <p>
                  from {summary.declared} declared results · pending not counted
                </p>
              </div>
            </article>

            <article className="res-summary-card">
              <h3>Category-wise performance</h3>
              <div className="res-performance-list">
                {categorySummaries.map((category) => (
                  <div className="res-performance-row" key={category.id}>
                    <div className="res-performance-label">
                      <span>{category.shortLabel}</span>
                      <span>{category.declared} declared</span>
                    </div>
                    <div className="res-progress-track">
                      <div
                        className={`res-progress-fill res-progress-fill--${category.id}`}
                        style={{ width: `${category.average}%` }}
                      />
                    </div>
                    <strong>{category.average}%</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="res-summary-card">
              <h3>Passed vs Pending</h3>
              <div className="res-distribution-bar" aria-hidden="true">
                <span
                  className="res-distribution-segment res-distribution-segment--passed"
                  style={{ width: `${(summary.passed / summary.total) * 100}%` }}
                />
                <span
                  className="res-distribution-segment res-distribution-segment--failed"
                  style={{ width: `${(summary.failed / summary.total) * 100}%` }}
                />
                <span
                  className="res-distribution-segment res-distribution-segment--pending"
                  style={{ width: `${(summary.pending / summary.total) * 100}%` }}
                />
              </div>
              <ul className="res-distribution-legend">
                <li>
                  <span className="res-legend-dot res-legend-dot--passed" />
                  Passed <strong>{summary.passed}</strong>
                </li>
                <li>
                  <span className="res-legend-dot res-legend-dot--failed" />
                  Failed <strong>{summary.failed}</strong>
                </li>
                <li>
                  <span className="res-legend-dot res-legend-dot--pending" />
                  Pending <strong>{summary.pending}</strong>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="res-results-section" aria-labelledby="res-results-title">
          <div className="res-section-head">
            <div>
              <p className="res-eyebrow">Assessment results</p>
              <h2 id="res-results-title">Your selection round results</h2>
            </div>
            <div className="res-toolbar-note">
              <SlidersHorizontal size={13} strokeWidth={1.8} aria-hidden="true" />
              Showing {visibleRecords.length} of {summary.total}
              <span aria-hidden="true">·</span>
              Sorted by assessment date
            </div>
          </div>

          <div className="res-tabs" role="tablist" aria-label="Result categories">
            {resultCategories.map((category) => {
              const Icon = categoryIcons[category.icon] ?? FileCheck;
              const count =
                category.id === "all"
                  ? assessmentRecords.length
                  : assessmentRecords.filter((record) => record.category === category.id)
                      .length;
              return (
                <button
                  className={`res-tab${activeCategory === category.id ? " is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon size={14} strokeWidth={1.9} aria-hidden="true" />
                  {category.shortLabel}
                  <span className="res-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" aria-label={`${activeCategoryLabel} results`}>
            <div className="res-table-card">
              <table className="res-table">
                <thead>
                  <tr>
                    <th scope="col">Assessment</th>
                    <th scope="col">Category</th>
                    <th scope="col">Assigned Mentor</th>
                    <th scope="col">Assessment Date</th>
                    <th scope="col">Obtained / Total</th>
                    <th scope="col">Percentage</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="res-visually-hidden">Action</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => {
                    const status = getAssessmentStatus(record);
                    const declared = isResultDeclared(record);
                    const percentage = getAssessmentPercentage(record);

                    return (
                      <tr key={record.id}>
                        <td data-label="Assessment">
                          <div className="res-assessment-cell">
                            <strong>{record.name}</strong>
                            <span>{record.focus}</span>
                          </div>
                        </td>
                        <td data-label="Category">
                          <CategoryBadge categoryId={record.category} />
                        </td>
                        <td data-label="Assigned Mentor">{record.mentor}</td>
                        <td data-label="Assessment Date">{record.assessmentDate}</td>
                        <td data-label="Obtained / Total">
                          {declared ? (
                            <span className="res-score-cell">
                              <strong>{record.obtainedMarks}</strong>
                              <span> / {record.totalMarks}</span>
                            </span>
                          ) : (
                            <span className="res-dash">—</span>
                          )}
                        </td>
                        <td data-label="Percentage">
                          {declared ? (
                            <strong className="res-percentage-cell">{percentage}%</strong>
                          ) : (
                            <span className="res-dash">—</span>
                          )}
                        </td>
                        <td data-label="Status">
                          <StatusBadge status={status} />
                          <span className="res-status-note">
                            {declared
                              ? `Declared ${record.declaredOn}`
                              : pendingResultMessage}
                          </span>
                        </td>
                        <td data-label="Action">
                          <button
                            type="button"
                            className="res-details-button"
                            onClick={() => setSelectedRecord(record)}
                          >
                            View Details
                            <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="res-footnote">
            <Info size={15} strokeWidth={1.8} aria-hidden="true" />
            <p>{unstopAssessmentNotice}</p>
            <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </section>
      </div>

      {selectedRecord ? (
        <DetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      ) : null}
    </main>
  );
};

export default ExaminationResults;
