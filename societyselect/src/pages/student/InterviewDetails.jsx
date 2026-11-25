import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  ContactRound,
  FileText,
  Info,
  Link2,
  MessageSquare,
  Mic,
  Monitor,
  Search,
  UserRound,
  Video,
  Wifi,
  X,
} from "lucide-react";
import {
  getFeedbackLabel,
  getStatusTone,
  importantReminders,
  interviewInstructions,
  interviewPage,
  interviewSummary,
  interviewTopbar,
  interviewer,
  isInterviewJoinable,
  overviewCards,
  selectionJourney,
  upcomingInterview,
} from "../../data/InterviewDetailsData";
import "../../styles/InterviewDetails.css";

const overviewIcons = {
  calendar: CalendarCheck,
  clock: Clock3,
  check: CircleCheck,
  message: MessageSquare,
};

const statusIcons = {
  Scheduled: CalendarCheck,
  Completed: CircleCheck,
  Rescheduled: Clock3,
  Cancelled: X,
  "Awaiting Feedback": MessageSquare,
};

const instructionIcons = {
  clock: Clock3,
  contact: ContactRound,
  wifi: Wifi,
  mic: Mic,
  file: FileText,
  calendar: CalendarCheck,
};

const reminderIcons = {
  link: Link2,
  clock: Clock3,
  message: MessageSquare,
};

const StatusBadge = ({ status }) => {
  const Icon = statusIcons[status] ?? Info;
  return (
    <span className={`iv-badge iv-badge--${getStatusTone(status)}`}>
      <Icon size={11} strokeWidth={2} aria-hidden="true" />
      {status}
    </span>
  );
};

const Topbar = ({ data }) => {
  const [query, setQuery] = useState("");
  const { student } = data;

  return (
    <header className="iv-navbar">
      <label className="iv-search">
        <Search size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder={data.searchPlaceholder}
          aria-label={data.searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="iv-navbar-actions">
        <a
          className="iv-notification-button"
          href={data.notificationPath}
          aria-label={data.notificationLabel}
        >
          <Bell size={18} strokeWidth={1.7} aria-hidden="true" />
          <span className="iv-notification-dot" aria-hidden="true" />
        </a>

        <span className="iv-navbar-divider" aria-hidden="true" />

        <a
          className="iv-profile"
          href={data.profilePath}
          aria-label={`Profile for ${student.name}`}
        >
          <span className="iv-profile-avatar" aria-hidden="true">
            {student.initials}
          </span>
          <span className="iv-profile-copy">
            <strong>{student.name}</strong>
            <span>{student.course}</span>
            <span>{student.session}</span>
          </span>
          <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
};

const OverviewCard = ({ card }) => {
  const Icon = overviewIcons[card.icon] ?? CalendarCheck;
  return (
    <article className={`iv-metric iv-metric--${card.tone}`}>
      <span className="iv-metric-icon">
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="iv-metric-label">{card.label}</span>
      <strong className="iv-metric-value">{card.value}</strong>
    </article>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="iv-detail-item">
    <dt>
      <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
      {label}
    </dt>
    <dd>{value}</dd>
  </div>
);

const UpcomingInterviewCard = ({ interview, canJoin, onJoin }) => {
  const { date, meeting } = interview;
  const meetingText = canJoin ? meeting.url : meeting.placeholder;

  return (
    <section className="iv-card iv-upcoming-card" aria-labelledby="iv-upcoming-title">
      <header className="iv-upcoming-top">
        <p className="iv-card-eyebrow">{interview.eyebrow}</p>
        <StatusBadge status={interview.status} />
      </header>

      <div className="iv-upcoming-identity">
        <div
          className="iv-date-block"
          aria-label={`${date.weekday}, ${date.month} ${date.day}, ${date.year}`}
        >
          <span className="iv-date-month">{date.month}</span>
          <strong className="iv-date-day">{date.day}</strong>
          <span className="iv-date-context">
            {date.weekday}
            <br />
            {date.year}
          </span>
        </div>
        <div className="iv-upcoming-copy">
          <h2 id="iv-upcoming-title">{interview.title}</h2>
          <p>{interview.society}</p>
        </div>
      </div>

      <dl className="iv-detail-grid">
        <DetailItem icon={Clock3} label="Time" value={interview.time} />
        <DetailItem icon={Clock3} label="Duration" value={interview.duration} />
        <DetailItem icon={Monitor} label="Mode" value={interview.mode} />
      </dl>

      <div className="iv-meeting">
        <span className="iv-meeting-icon">
          <Link2 size={17} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="iv-meeting-copy">
          <span>{meeting.label}</span>
          <strong className={canJoin ? "" : "is-placeholder"}>{meetingText}</strong>
        </div>
        <button
          className="iv-join-button"
          type="button"
          disabled={!canJoin}
          aria-disabled={!canJoin}
          title={canJoin ? "Join interview" : meeting.placeholder}
          onClick={onJoin}
        >
          <Video size={14} strokeWidth={2} aria-hidden="true" />
          Join Interview
        </button>
      </div>
    </section>
  );
};

const SelectionTimeline = ({ journey }) => (
  <section className="iv-card iv-timeline-card" aria-labelledby="iv-journey-title">
    <div className="iv-panel-head">
      <div>
        <h2 id="iv-journey-title">{journey.title}</h2>
        <p>{journey.subtitle}</p>
      </div>
      <span className="iv-stage-count">
        {journey.currentStage} / {journey.totalStages}
      </span>
    </div>

    <ol className="iv-timeline">
      {journey.stages.map((stage) => (
        <li className={`iv-stage is-${stage.state}`} key={stage.id}>
          <span className="iv-stage-marker">
            {stage.state === "complete" ? (
              <Check size={13} strokeWidth={2.4} aria-hidden="true" />
            ) : stage.state === "current" ? (
              <span className="iv-stage-core" aria-hidden="true" />
            ) : null}
          </span>
          <span className="iv-stage-title">{stage.title}</span>
          <span className="iv-stage-status">{stage.status}</span>
        </li>
      ))}
    </ol>
  </section>
);

const InterviewerCard = ({ data }) => (
  <section className="iv-card iv-panel" aria-labelledby="iv-interviewer-title">
    <div className="iv-panel-head">
      <h2 id="iv-interviewer-title">Interviewer</h2>
      <span className="iv-panel-icon">
        <UserRound size={15} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>

    <div className="iv-interviewer-profile">
      <span className="iv-interviewer-avatar" aria-hidden="true">
        {data.initials}
      </span>
      <div>
        <strong>{data.name}</strong>
        <span>{data.designation}</span>
      </div>
    </div>

    <dl className="iv-info-rows">
      {data.rows.map((row) => (
        <div className="iv-info-row" key={row.id}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const InterviewSummaryCard = ({ summary }) => (
  <section className="iv-card iv-panel" aria-labelledby="iv-summary-title">
    <div className="iv-panel-head">
      <h2 id="iv-summary-title">{summary.title}</h2>
      <span className="iv-panel-icon">
        <Info size={15} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>

    <dl className="iv-info-rows">
      {summary.rows.map((row) => (
        <div className="iv-info-row" key={row.id}>
          <dt>{row.label}</dt>
          <dd>
            {row.type === "status" ? (
              <StatusBadge status={getFeedbackLabel(row.value)} />
            ) : (
              <span className="iv-info-value">{row.value}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

const RemindersCard = ({ reminders }) => (
  <section className="iv-card iv-panel" aria-labelledby="iv-reminders-title">
    <div className="iv-panel-head">
      <h2 id="iv-reminders-title">Important Reminders</h2>
      <span className="iv-panel-icon">
        <Bell size={15} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>

    <ul className="iv-reminder-list">
      {reminders.map((reminder) => {
        const Icon = reminderIcons[reminder.icon] ?? Info;
        return (
          <li className="iv-reminder" key={reminder.id}>
            <span className="iv-reminder-icon">
              <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <p>{reminder.text}</p>
          </li>
        );
      })}
    </ul>
  </section>
);

const InstructionsCard = ({ instructions }) => (
  <section className="iv-card iv-panel iv-instructions" aria-labelledby="iv-instructions-title">
    <div className="iv-panel-head">
      <h2 id="iv-instructions-title">Interview Instructions</h2>
      <span className="iv-panel-icon">
        <FileText size={15} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>

    <ul className="iv-instruction-grid">
      {instructions.map((instruction) => {
        const Icon = instructionIcons[instruction.icon] ?? Info;
        return (
          <li className="iv-instruction" key={instruction.id}>
            <span className="iv-instruction-icon">
              <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <p>{instruction.text}</p>
          </li>
        );
      })}
    </ul>
  </section>
);

const InterviewDetails = () => {
  const [semester, setSemester] = useState(interviewPage.semester.value);
  const canJoin = isInterviewJoinable(upcomingInterview);

  const handleJoin = () => {
    if (!canJoin) return;
    window.open(upcomingInterview.meeting.url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="interview-details-page">
      <Topbar data={interviewTopbar} />

      <div className="iv-shell">
        <header className="iv-page-header">
          <div className="iv-heading-copy">
            <h1>{interviewPage.title}</h1>
            <p>{interviewPage.subtitle}</p>
          </div>

          <div className="iv-header-badges">
            <label className="iv-semester-select">
              <span className="iv-visually-hidden">Select semester</span>
              <select
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
              >
                {interviewPage.semesterOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
            </label>

            <span className="iv-session-badge">
              <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
              {interviewPage.semester.session}
            </span>
          </div>
        </header>

        <section className="iv-overview" aria-label="Interview overview">
          {overviewCards.map((card) => (
            <OverviewCard card={card} key={card.id} />
          ))}
        </section>

        <div className="iv-content-grid">
          <div className="iv-main-column">
            <UpcomingInterviewCard
              interview={upcomingInterview}
              canJoin={canJoin}
              onJoin={handleJoin}
            />
            <SelectionTimeline journey={selectionJourney} />
            <InstructionsCard instructions={interviewInstructions} />
          </div>

          <aside className="iv-side-column" aria-label="Interview information">
            <InterviewerCard data={interviewer} />
            <InterviewSummaryCard summary={interviewSummary} />
            <RemindersCard reminders={importantReminders} />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default InterviewDetails;
