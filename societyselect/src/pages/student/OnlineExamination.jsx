import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarClock,
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
  examinationAssignments,
  examinationCategories,
  examinationLifecycle,
  examinationNotifications,
  examinationSemester,
  examinationStatistics,
  externalAssessmentNotice,
  featuredExamination,
  resultTones,
  upcomingDeadlines,
} from "../../data/ExaminationData";
import "../../styles/OnlineExamination.css";

const overviewIcons = {
  clipboard: FileCheck,
  clock: Clock3,
  monitor: Monitor,
  check: CircleCheck,
};

const lifecycleIcons = {
  user: UserRound,
  clock: Hourglass,
  monitor: Monitor,
  file: FileCheck,
  trophy: Trophy,
};

const StatusBadge = ({ tone = "neutral", children, icon: Icon, dot = true }) => (
  <span className={`ex-badge ex-badge--${tone}`}>
    {Icon ? (
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
    ) : dot ? (
      <span className="ex-badge-dot" aria-hidden="true" />
    ) : null}
    {children}
  </span>
);

const MetaField = ({ label, value, icon: Icon }) => (
  <div className="ex-field">
    <dt className="ex-field-label">
      {Icon ? <Icon size={12} strokeWidth={1.9} aria-hidden="true" /> : null}
      {label}
    </dt>
    <dd className="ex-field-value">{value}</dd>
  </div>
);

const Modal = ({ eyebrow, title, subtitle, onClose, variant, children }) => {
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
      className="ex-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`ex-modal ex-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ex-modal-title"
      >
        <header className="ex-modal-header">
          <div className="ex-modal-heading">
            <p className="ex-eyebrow">{eyebrow}</p>
            <h2 id="ex-modal-title">{title}</h2>
            {subtitle ? <p className="ex-modal-subtitle">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="ex-icon-button"
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

const DetailsModal = ({ exam, onClose }) => (
  <Modal
    eyebrow="Examination details"
    title={exam.name}
    subtitle={`${exam.subject} · Assigned by ${exam.mentor} (${exam.mentorRole})`}
    onClose={onClose}
    variant="details"
  >
    <div className="ex-modal-body">
      <div className="ex-modal-badges">
        <StatusBadge tone={exam.statusTone}>{exam.statusLabel}</StatusBadge>
        <StatusBadge tone="neutral" icon={Monitor}>
          Hosted on Unstop
        </StatusBadge>
      </div>

      <p className="ex-modal-description">{exam.description}</p>

      <dl className="ex-modal-grid">
        <MetaField label="Subject" value={exam.subject} icon={BookOpen} />
        <MetaField label="Assigned mentor" value={`${exam.mentor} (${exam.mentorRole})`} icon={UserRound} />
        <MetaField label="Start date" value={exam.startDate} icon={CalendarDays} />
        <MetaField label="End date" value={exam.endDate} icon={CalendarClock} />
        <MetaField label="Duration" value={exam.duration} icon={Clock3} />
        <MetaField label="Total marks" value={exam.totalMarks} icon={FileText} />
        <MetaField label="Passing marks" value={exam.passingMarks} icon={Check} />
        <MetaField
          label="Current status"
          value={exam.attemptStatus}
          icon={Info}
        />
      </dl>

      <div className="ex-modal-link-row">
        <span className="ex-field-label">Assessment link</span>
        <a
          className="ex-text-link"
          href={exam.assessmentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Unstop assessment (mock link)
          <ExternalLink size={12} strokeWidth={1.9} aria-hidden="true" />
        </a>
      </div>

      <div className="ex-info-panel">
        <Info size={18} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <h3>External Assessment</h3>
          <p>{externalAssessmentNotice}</p>
        </div>
      </div>
    </div>

    <footer className="ex-modal-footer">
      <button type="button" className="ex-btn ex-btn--secondary" onClick={onClose}>
        Close
      </button>
      {exam.isAvailable ? (
        <a
          className="ex-btn ex-btn--primary"
          href={exam.assessmentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start Exam on Unstop
          <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          className="ex-btn ex-btn--primary"
          disabled
          title="This examination is not available yet"
        >
          Start Exam on Unstop
          <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </footer>
  </Modal>
);

const ResultModal = ({ exam, onClose }) => {
  const toneKey =
    exam.resultState === "published"
      ? (exam.result || "passed").toLowerCase()
      : exam.resultState;
  const tone = resultTones[toneKey] ?? resultTones.pending;
  const hasScore =
    exam.resultState === "published" && Number.isFinite(exam.score);
  const percentage = hasScore
    ? Math.max(
        0,
        Math.min(
          100,
          exam.percentage ?? Math.round((exam.score / exam.totalMarks) * 100),
        ),
      )
    : 0;
  const circumference = 2 * Math.PI * 52;

  const message = hasScore
    ? toneKey === "passed"
      ? `You passed this assessment. Your mentor imported the result on ${exam.resultPublishedOn}.`
      : `You did not clear this assessment. Your mentor imported the result on ${exam.resultPublishedOn}.`
    : exam.resultState === "not-imported"
      ? "Your attempt is recorded on Unstop. Marks are hidden until your mentor imports the result."
      : "Your examination result is pending. Marks will appear here once your mentor imports the result.";

  return (
    <Modal
      eyebrow="Examination result"
      title="Result details"
      subtitle={exam.name}
      onClose={onClose}
      variant="result"
    >
      <div className="ex-modal-body">
        <div className={`ex-score-visual ex-score-visual--${toneKey}`}>
          <svg viewBox="0 0 130 130" aria-hidden="true">
            <circle className="ex-score-track" cx="65" cy="65" r="52" />
            <circle
              className="ex-score-progress"
              cx="65"
              cy="65"
              r="52"
              stroke={tone.color}
              strokeDasharray={circumference}
              strokeDashoffset={hasScore ? circumference * (1 - percentage / 100) : circumference}
            />
          </svg>
          <div className="ex-score-center">
            {hasScore ? (
              <>
                <strong>{exam.score}</strong>
                <span>/ {exam.totalMarks}</span>
              </>
            ) : (
              <LockKeyhole size={28} strokeWidth={1.6} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="ex-result-status">
          <StatusBadge tone={toneKey} icon={hasScore ? CircleCheck : Hourglass}>
            {tone.label}
          </StatusBadge>
          {hasScore ? <strong className="ex-result-percent">{percentage}%</strong> : null}
        </div>

        <p className="ex-result-message">{message}</p>

        <dl className="ex-modal-grid">
          <MetaField
            label="Score obtained"
            value={hasScore ? `${exam.score} / ${exam.totalMarks}` : "Not available"}
            icon={FileText}
          />
          <MetaField label="Total marks" value={exam.totalMarks} icon={FileText} />
          <MetaField
            label="Percentage"
            value={hasScore ? `${percentage}%` : "Not available"}
            icon={CircleCheck}
          />
          <MetaField label="Passing marks" value={exam.passingMarks} icon={Check} />
          <MetaField label="Result status" value={tone.label} icon={Trophy} />
          <MetaField
            label="Submission status"
            value={
              exam.submissionDate
                ? `Submitted on Unstop · ${exam.submissionDate}`
                : "Not submitted"
            }
            icon={Monitor}
          />
        </dl>

        {!hasScore ? (
          <div className="ex-info-panel ex-info-panel--compact">
            <LockKeyhole size={16} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <h3>Marks are protected</h3>
              <p>No score is displayed until the mentor imports the result into the portal.</p>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="ex-modal-footer">
        <button type="button" className="ex-btn ex-btn--secondary" onClick={onClose}>
          Close
        </button>
      </footer>
    </Modal>
  );
};

const FeaturedExamination = ({ exam, onViewDetails }) => (
  <article className="ex-featured" aria-labelledby="ex-featured-title">
    <div className="ex-featured-ribbon" aria-hidden="true" />
    <div className="ex-featured-top">
      <div className="ex-featured-badges">
        <StatusBadge tone={exam.statusTone}>{exam.statusLabel}</StatusBadge>
        <StatusBadge tone="neutral" icon={Monitor} dot={false}>
          Hosted on Unstop
        </StatusBadge>
        <StatusBadge tone="danger" icon={Clock3} dot={false}>
          {exam.statusDetail}
        </StatusBadge>
      </div>
      <span className="ex-featured-index">Featured examination</span>
    </div>

    <div className="ex-featured-body">
      <div className="ex-featured-heading">
        <div className="ex-featured-title-group">
          <p className="ex-eyebrow">Main assigned examination</p>
          <h2 id="ex-featured-title">{exam.name}</h2>
          <p className="ex-featured-subline">
            <BookOpen size={14} strokeWidth={1.8} aria-hidden="true" />
            {exam.subject}
            <span className="ex-dot-separator" aria-hidden="true">·</span>
            <UserRound size={14} strokeWidth={1.8} aria-hidden="true" />
            {exam.mentor} ({exam.mentorRole})
          </p>
        </div>
        <span className="ex-unstop-chip">
          <Monitor size={14} strokeWidth={1.8} aria-hidden="true" />
          Unstop assessment
        </span>
      </div>

      <dl className="ex-field-grid">
        <MetaField label="Start date" value={exam.startDate} icon={CalendarDays} />
        <MetaField label="Deadline" value={exam.endDate} icon={CalendarClock} />
        <MetaField label="Duration" value={exam.duration} icon={Clock3} />
        <MetaField label="Total marks" value={exam.totalMarks} icon={FileText} />
        <MetaField label="Passing marks" value={exam.passingMarks} icon={Check} />
      </dl>

      <div className="ex-featured-status-row">
        <div className="ex-status-cell">
          <span className="ex-mini-label">Attempt status</span>
          <StatusBadge tone="amber">{exam.attemptStatus}</StatusBadge>
        </div>
        <div className="ex-status-cell">
          <span className="ex-mini-label">Result status</span>
          <StatusBadge tone="amber">{exam.resultStatus}</StatusBadge>
        </div>
      </div>

      <div className="ex-featured-footer">
        <div className="ex-footer-copy">
          <Info size={15} strokeWidth={1.8} aria-hidden="true" />
          <p>
            <strong>Opens on Unstop in a new tab.</strong> Your attempt and result
            are tracked here.
          </p>
        </div>
        <div className="ex-actions">
          <button
            type="button"
            className="ex-btn ex-btn--secondary"
            onClick={() => onViewDetails(exam)}
          >
            View Details
          </button>
          <a
            className="ex-btn ex-btn--primary"
            href={exam.assessmentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start Examination
            <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </article>
);

const AssignmentCard = ({ exam, onViewDetails, onViewResult }) => {
  const hasScore =
    exam.resultState === "published" && Number.isFinite(exam.score);

  return (
    <article className={`ex-assignment ex-assignment--${exam.statusTone}`}>
      <div className="ex-assignment-head">
        <StatusBadge tone={exam.statusTone}>{exam.statusLabel}</StatusBadge>
        <span className="ex-assignment-detail">{exam.statusDetail}</span>
      </div>

      <h3 className="ex-assignment-title">{exam.name}</h3>
      <p className="ex-assignment-subline">
        <span>{exam.subject}</span>
        <span className="ex-dot-separator" aria-hidden="true">·</span>
        <span>
          {exam.mentor} ({exam.mentorRole})
        </span>
      </p>

      <div className="ex-assignment-meta">
        <span>
          <CalendarDays size={13} strokeWidth={1.8} aria-hidden="true" />
          {exam.window}
        </span>
        <span>
          <Clock3 size={13} strokeWidth={1.8} aria-hidden="true" />
          {exam.duration}
        </span>
        <span>
          <FileText size={13} strokeWidth={1.8} aria-hidden="true" />
          {exam.totalMarks} marks
        </span>
        <span>
          <Check size={13} strokeWidth={1.8} aria-hidden="true" />
          Pass: {exam.passingMarks}
        </span>
      </div>

      <div className="ex-assignment-state">
        {hasScore ? (
          <>
            <div className="ex-state-cell">
              <span className="ex-mini-label">Score</span>
              <strong className="ex-score-value">
                {exam.score} <small>/ {exam.totalMarks}</small>
              </strong>
            </div>
            <div className="ex-state-cell">
              <span className="ex-mini-label">Percentage</span>
              <strong className="ex-score-value">{exam.percentage}%</strong>
            </div>
            <StatusBadge tone={(exam.result || "passed").toLowerCase()}>
              {exam.resultStatus}
            </StatusBadge>
          </>
        ) : (
          <>
            <div className="ex-state-cell">
              <span className="ex-mini-label">Attempt</span>
              <strong>{exam.attemptStatus}</strong>
            </div>
            <div className="ex-state-cell">
              <span className="ex-mini-label">Result</span>
              <strong className={exam.resultState === "not-imported" ? "ex-muted-value" : ""}>
                {exam.resultStatus}
              </strong>
            </div>
            {exam.resultState === "not-imported" ? (
              <p className="ex-assignment-note">
                Marks appear after your mentor imports the result.
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="ex-assignment-actions">
        <button
          type="button"
          className="ex-btn ex-btn--secondary"
          onClick={() => onViewDetails(exam)}
        >
          View Details
        </button>
        {exam.resultState !== "pending" ? (
          <button
            type="button"
            className="ex-btn ex-btn--link"
            onClick={() => onViewResult(exam)}
          >
            View Result
            <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </article>
  );
};

const OnlineExamination = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [detailsExam, setDetailsExam] = useState(null);
  const [resultExam, setResultExam] = useState(null);
  const [readNotifications, setReadNotifications] = useState(() =>
    examinationNotifications
      .filter((notification) => notification.isRead)
      .map((notification) => notification.id),
  );

  const visibleExams = useMemo(() => {
    const allExams = [featuredExamination, ...examinationAssignments];
    if (activeCategory === "all") return allExams;
    return allExams.filter((exam) => exam.categories.includes(activeCategory));
  }, [activeCategory]);

  const featuredVisible = visibleExams.some(
    (exam) => exam.id === featuredExamination.id,
  );
  const otherAssignments = visibleExams.filter(
    (exam) => exam.id !== featuredExamination.id,
  );
  const unreadCount = examinationNotifications.filter(
    (notification) => !readNotifications.includes(notification.id),
  ).length;

  return (
    <main className="examination-page">
      <div className="ex-shell">
        <header className="ex-page-header">
          <nav className="ex-breadcrumb" aria-label="Breadcrumb">
            <span>Student Portal</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Online Examination</span>
          </nav>

          <div className="ex-page-heading">
            <div className="ex-heading-copy">
              <h1>My Examinations</h1>
              <p>
                Track your assigned assessments, deadlines and examination results.
              </p>
            </div>
            <div className="ex-semester-badge">
              <span className="ex-semester-label">{examinationSemester.label}</span>
              <span className="ex-semester-value">
                {examinationSemester.value}
                <span aria-hidden="true">·</span>
                {examinationSemester.term}
              </span>
            </div>
          </div>
        </header>

        <section className="ex-metrics" aria-label="Examination overview">
          {examinationStatistics.map((metric) => {
            const Icon = overviewIcons[metric.icon];
            return (
              <article className={`ex-metric ex-metric--${metric.tone}`} key={metric.id}>
                <div className="ex-metric-top">
                  <span className="ex-mini-label">{metric.label}</span>
                  <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <strong className="ex-metric-value">{metric.value}</strong>
                <span className="ex-metric-note">{metric.note}</span>
              </article>
            );
          })}
        </section>

        <section className="ex-timeline" aria-labelledby="ex-timeline-title">
          <div className="ex-timeline-head">
            <div>
              <p className="ex-eyebrow">Examination lifecycle</p>
              <h2 id="ex-timeline-title">How an examination progresses</h2>
            </div>
            <p className="ex-timeline-copy">
              Exams are taken on Unstop. This portal tracks your progress and shows
              results once your mentor imports them.
            </p>
          </div>

          <ol className="ex-steps">
            {examinationLifecycle.stages.map((stage, index) => {
              const Icon = lifecycleIcons[stage.icon];
              const isComplete = index < examinationLifecycle.currentStageIndex;
              const isCurrent = index === examinationLifecycle.currentStageIndex;
              return (
                <li
                  className={`ex-step${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
                  key={stage.id}
                >
                  <span className="ex-step-marker">
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3>
                    {stage.title}
                    {stage.currentLabel ? (
                      <span className="ex-current-chip">{stage.currentLabel}</span>
                    ) : null}
                  </h3>
                  <p>{stage.description}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="ex-content-grid">
          <div className="ex-main-column">
            <div className="ex-list-toolbar">
              <div className="ex-tabs" role="tablist" aria-label="Examination categories">
                {examinationCategories.map((category) => (
                  <button
                    className={`ex-tab${activeCategory === category.id ? " is-active" : ""}`}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category.id}
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                    <span className="ex-tab-count">{category.count}</span>
                  </button>
                ))}
              </div>
              <div className="ex-sort-note">
                <SlidersHorizontal size={13} strokeWidth={1.8} aria-hidden="true" />
                Total <strong>{examinationCategories[0].count}</strong>
                <span aria-hidden="true">·</span>
                Sorted by deadline
              </div>
            </div>

            <div role="tabpanel" aria-label={`${activeCategory} examinations`}>
              {featuredVisible ? (
                <FeaturedExamination
                  exam={featuredExamination}
                  onViewDetails={setDetailsExam}
                />
              ) : null}

              {otherAssignments.length > 0 ? (
                <section className="ex-other-section" aria-labelledby="ex-other-title">
                  <div className="ex-section-head">
                    <div>
                      <p className="ex-eyebrow">Other assignments</p>
                      <h2 id="ex-other-title">
                        {activeCategory === "all"
                          ? "Other examinations"
                          : `${examinationCategories.find((category) => category.id === activeCategory)?.label}`}
                      </h2>
                    </div>
                    <span className="ex-section-count">
                      {otherAssignments.length} examination
                      {otherAssignments.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="ex-assignment-list">
                    {otherAssignments.map((exam) => (
                      <AssignmentCard
                        key={exam.id}
                        exam={exam}
                        onViewDetails={setDetailsExam}
                        onViewResult={setResultExam}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {visibleExams.length === 0 ? (
                <div className="ex-empty">
                  <Bell size={22} strokeWidth={1.6} aria-hidden="true" />
                  <p>No examinations in this category yet.</p>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="ex-side-column" aria-label="Examination updates">
            <section className="ex-panel" aria-labelledby="ex-notifications-title">
              <div className="ex-panel-head">
                <div>
                  <h2 id="ex-notifications-title">Notifications</h2>
                  <span className="ex-panel-subtitle">
                    Today{unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="ex-mark-read"
                  onClick={() =>
                    setReadNotifications(
                      examinationNotifications.map((notification) => notification.id),
                    )
                  }
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
              </div>

              <ul className="ex-notification-list">
                {examinationNotifications.map((notification) => {
                  const isRead = readNotifications.includes(notification.id);
                  return (
                    <li
                      className={`ex-notification${isRead ? " is-read" : ""}`}
                      key={notification.id}
                    >
                      <span
                        className={`ex-notification-dot ex-notification-dot--${notification.tone}`}
                        aria-hidden="true"
                      />
                      <div className="ex-notification-body">
                        <h3>{notification.title}</h3>
                        <p>{notification.description}</p>
                        <span className="ex-notification-date">{notification.date}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="ex-panel" aria-labelledby="ex-deadlines-title">
              <div className="ex-panel-head">
                <div>
                  <h2 id="ex-deadlines-title">Upcoming deadlines</h2>
                  <span className="ex-panel-subtitle">Keep track of what is next</span>
                </div>
                <CalendarClock size={17} strokeWidth={1.7} aria-hidden="true" />
              </div>

              <ul className="ex-deadline-list">
                {upcomingDeadlines.map((deadline) => (
                  <li className="ex-deadline" key={deadline.id}>
                    <div className={`ex-date-tile ex-date-tile--${deadline.tone}`}>
                      <span>{deadline.month}</span>
                      <strong>{deadline.day}</strong>
                    </div>
                    <div className="ex-deadline-body">
                      <h3>{deadline.name}</h3>
                      <p>{deadline.detail}</p>
                      <span className={`ex-remaining ex-remaining--${deadline.tone}`}>
                        {deadline.remaining}
                        <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {detailsExam ? (
        <DetailsModal exam={detailsExam} onClose={() => setDetailsExam(null)} />
      ) : null}
      {resultExam ? (
        <ResultModal exam={resultExam} onClose={() => setResultExam(null)} />
      ) : null}
    </main>
  );
};

export default OnlineExamination;
