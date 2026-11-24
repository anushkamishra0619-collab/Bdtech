import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import probationData from "../../data/ProbationData";
import "../../styles/ProbationDashboard.css";

const probationDetails = [
  { label: "Start date", value: "1 Sep 2026" },
  { label: "Current semester", value: "Semester 5" },
  { label: "Duration", value: "105 days" },
];

const getDateTimestamp = (date) => Date.parse(`${date}T00:00:00Z`);

const formatTimelineDate = (date, includeYear = false) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(new Date(getDateTimestamp(date)));

const notificationIconByType = {
  deadline: CalendarDays,
  review: CalendarDays,
  reminder: ClipboardList,
  status: ShieldCheck,
};

const ProbationDashboard = () => {
  const improvementTasks = probationData.improvementTasks;
  const totalAssigned = improvementTasks.length;
  const completedTasks = improvementTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const pendingTasks = totalAssigned - completedTasks;
  const remainingTasks = pendingTasks;
  const progressPercentage =
    totalAssigned === 0
      ? 0
      : Math.round((completedTasks / totalAssigned) * 100);

  const progressMetrics = [
    { value: totalAssigned, label: "Total assigned" },
    { value: completedTasks, label: "Completed" },
    { value: pendingTasks, label: "Pending" },
    { value: remainingTasks, label: "Remaining to complete" },
  ];

  const { startDate, currentDate, endDate } = probationData.probationPeriod;
  const nextReviewDate = probationData.reviewDetails.nextReviewAt.split("T")[0];
  const startTimestamp = getDateTimestamp(startDate);
  const currentTimestamp = getDateTimestamp(currentDate);
  const endTimestamp = getDateTimestamp(endDate);
  const periodDuration = endTimestamp - startTimestamp;
  const currentDay =
    periodDuration > 0 && Number.isFinite(currentTimestamp)
      ? Math.floor((currentTimestamp - startTimestamp) / 86400000) + 1
      : 0;
  const getTimelinePosition = (date) => {
    const timestamp = getDateTimestamp(date);
    if (periodDuration <= 0 || !Number.isFinite(timestamp)) return 0;
    return Math.max(
      0,
      Math.min(100, ((timestamp - startTimestamp) / periodDuration) * 100),
    );
  };
  const timelineMilestones = [
    {
      id: "start",
      date: startDate,
      label: "Probation starts",
      alignment: "start",
      includeYear: true,
    },
    {
      id: "current",
      date: currentDate,
      label: `Today, day ${currentDay}`,
      alignment: "current",
      includeYear: false,
    },
    {
      id: "review",
      date: nextReviewDate,
      label: "Next review",
      alignment: "review",
      includeYear: false,
    },
    {
      id: "end",
      date: endDate,
      label: "Probation ends",
      alignment: "end",
      includeYear: true,
    },
  ].map((milestone) => ({
    ...milestone,
    position: getTimelinePosition(milestone.date),
  }));
  const currentTimelinePosition =
    timelineMilestones.find((milestone) => milestone.id === "current")
      ?.position ?? 0;
  const mentorRemarks = probationData.mentorRemarks;
  const notifications = probationData.notifications;
  const probationHistory = probationData.probationHistory ?? [];
  const unreadNotificationCount = notifications.filter(
    (notification) => notification.isUnread,
  ).length;
  const mentorNotes = [
    {
      label: "Recommendations",
      content: mentorRemarks.recommendations,
      Icon: Lightbulb,
    },
    {
      label: "Instructions",
      content: mentorRemarks.instructions,
      Icon: ClipboardList,
    },
    {
      label: "Follow-up notes",
      content: mentorRemarks.followUpNotes,
      Icon: FileText,
    },
  ];

  return (
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

        <div className="probation-progress-panel">
          <div className="probation-progress-label">
            <ChartNoAxesCombined size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>Progress Tracker</span>
          </div>

          <div className="probation-progress-value">
            <span>{progressPercentage}</span>
            <span className="probation-progress-percent">%</span>
          </div>
          <p className="probation-progress-description">
            {completedTasks} of {totalAssigned} improvement tasks completed
          </p>

          <div
            className="probation-progress-segments"
            role="progressbar"
            aria-label="Improvement task progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
            aria-valuetext={`${completedTasks} of ${totalAssigned} improvement tasks completed`}
          >
            {improvementTasks.map((task) => (
              <span
                className={`probation-progress-segment${
                  task.status === "completed" ? " is-completed" : ""
                }`}
                key={task.id}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="probation-progress-legend" aria-hidden="true">
            <span>Completed</span>
            <span>Pending</span>
          </div>

          <dl className="probation-progress-metrics">
            {progressMetrics.map(({ value, label }) => (
              <div className="probation-progress-metric" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="probation-review-section"
        aria-labelledby="probation-review-title"
      >
        <div className="probation-review-timeline">
          <div className="probation-review-section-heading">
            <CalendarDays size={17} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <h2 id="probation-review-title">Review timeline</h2>
              <p>Your probation period and upcoming review.</p>
            </div>
          </div>

          <div
            className="probation-timeline"
            aria-label="Probation timeline"
          >
            <div className="probation-timeline-track" aria-hidden="true">
              <span
                className="probation-timeline-progress"
                style={{ width: `${currentTimelinePosition}%` }}
              />
            </div>
            <ol className="probation-timeline-milestones">
              {timelineMilestones.map((milestone) => (
                <li
                  className={`probation-timeline-milestone is-${milestone.alignment}`}
                  key={milestone.id}
                  style={{ left: `${milestone.position}%` }}
                >
                  <span className="probation-timeline-marker" aria-hidden="true" />
                  <div className="probation-timeline-copy">
                    <time
                      dateTime={milestone.date}
                      aria-current={milestone.id === "current" ? "date" : undefined}
                    >
                      {formatTimelineDate(milestone.date, milestone.includeYear)}
                    </time>
                    <span>{milestone.label}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <dl className="probation-review-details">
          <div className="probation-review-date-group">
            <div>
              <dt>Next review</dt>
              <dd>
                <time dateTime={probationData.reviewDetails.nextReviewAt}>
                  {probationData.reviewDetails.nextReviewLabel}
                </time>
              </dd>
            </div>
            <div>
              <dt>Review status</dt>
              <dd>
                <span className="probation-review-status">
                  {probationData.reviewDetails.status}
                </span>
              </dd>
            </div>
          </div>
          <div className="probation-review-outcome">
            <dt>Evaluation outcome</dt>
            <dd>
              <span className="probation-review-outcome-badge">
                {probationData.reviewDetails.evaluationOutcome}
              </span>
            </dd>
          </div>
          <div className="probation-review-remarks">
            <dt>Review remarks</dt>
            <dd>{probationData.reviewDetails.remarks}</dd>
          </div>
        </dl>
      </section>

      <section
        className="probation-feedback-section"
        aria-label="Mentor remarks and notifications"
      >
        <article
          className="probation-mentor-remarks"
          aria-labelledby="probation-mentor-title"
        >
          <div className="probation-feedback-heading">
            <MessageSquare size={17} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <h2 id="probation-mentor-title">Mentor remarks</h2>
              <p>Shared by your mentor. View only.</p>
            </div>
          </div>

          <div className="probation-mentor-identity">
            <span className="probation-mentor-avatar" aria-hidden="true">
              {mentorRemarks.initials}
            </span>
            <div>
              <h3>{mentorRemarks.name}</h3>
              <p>{mentorRemarks.designation}</p>
            </div>
          </div>

          <blockquote className="probation-mentor-feedback">
            {mentorRemarks.feedback}
          </blockquote>

          <dl className="probation-mentor-notes">
            {mentorNotes.map(({ label, content, Icon }) => (
              <div className="probation-mentor-note" key={label}>
                <dt>
                  <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </dt>
                <dd>{content}</dd>
              </div>
            ))}
          </dl>
        </article>

        <section
          className="probation-notifications"
          aria-labelledby="probation-notifications-title"
        >
          <div className="probation-feedback-heading probation-notifications-heading">
            <Bell size={17} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <h2 id="probation-notifications-title">
                Notifications and deadlines
              </h2>
              <p>{unreadNotificationCount} unread</p>
            </div>
          </div>

          <ul className="probation-notification-list">
            {notifications.map((notification) => {
              const NotificationIcon =
                notificationIconByType[notification.type];
              const [day, month] = formatTimelineDate(notification.date).split(
                " ",
              );

              return (
                <li
                  className={`probation-notification${
                    notification.isUnread ? " is-unread" : ""
                  }`}
                  key={notification.id}
                >
                  <time
                    className="probation-notification-date"
                    dateTime={notification.date}
                  >
                    <span>{day}</span>
                    <span>{month}</span>
                  </time>
                  <div className="probation-notification-copy">
                    <h3>
                      <span className="probation-notification-dot" aria-hidden="true" />
                      {notification.title}
                      {notification.isUnread && (
                        <span className="probation-visually-hidden">, unread</span>
                      )}
                    </h3>
                    <p>{notification.description}</p>
                    <span className="probation-notification-category">
                      <NotificationIcon
                        size={12}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      {notification.category}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </section>

      <section
        className="probation-history-section"
        aria-labelledby="probation-history-title"
      >
        <div className="probation-history-heading">
          <div>
            <h2 id="probation-history-title">Probation history</h2>
            <p>Previous probation periods and their final outcomes.</p>
          </div>
        </div>

        <table className="probation-history-table">
          <caption className="probation-visually-hidden">
            Previous probation records by semester
          </caption>
          <thead>
            <tr>
              <th scope="col">Semester</th>
              <th scope="col">Duration</th>
              <th scope="col">Status</th>
              <th scope="col">Final Outcome</th>
            </tr>
          </thead>
          <tbody>
            {probationHistory.length > 0 ? (
              probationHistory.map((record) => (
                <tr key={record.id}>
                  <td data-label="Semester">{record.semester}</td>
                  <td data-label="Duration">{record.duration}</td>
                  <td data-label="Status">
                    <span className="probation-history-status">
                      {record.status}
                    </span>
                  </td>
                  <td data-label="Final Outcome">
                    <span className="probation-history-outcome">
                      {record.finalOutcome}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="probation-history-empty-row">
                <td colSpan={4}>
                  No previous probation records are available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default ProbationDashboard;
