import {
  notifications,
  getNotificationCounts,
} from "../../data/NotificationData";
import "../../styles/Notification.css";

const NotificationIcon = ({ type }) => {
  const iconPaths = {
    document: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5M10 12h5M10 16h5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5V3h6v1.5M9 10l2 2 4-4M9 16h6" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.8 19h18.4z" />
        <path d="M12 9v4M12 16h.01" />
      </>
    ),
    checklist: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8l1.5 1.5L12 7M8 13l1.5 1.5L12 12M14 8h3M14 13h3M8 17h9" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M14 15c3.8-.8 6 1.2 7 5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[type] || iconPaths.document}
    </svg>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const Notifications = () => {
  const counts = getNotificationCounts();
  const summaryCards = [
    { label: "Total", value: counts.total, detail: "Notifications" },
    { label: "Unread", value: counts.unread, detail: "Need attention" },
    { label: "Tasks", value: counts.tasks, detail: "To complete" },
    { label: "Attendance", value: counts.attendance, detail: "Updates" },
  ];

  return (
    <main className="notifications-page">
      <header className="notifications-navbar">
        <a
          className="notifications-brand"
          href="/student/dashboard"
          aria-label="SocietySelect AI home"
        >
          <span>SocietySelect</span>
          <span className="notifications-brand-ai">AI</span>
        </a>

        <nav className="notifications-nav-actions" aria-label="Page actions">
          <span className="notifications-nav-label" aria-current="page">
            Notifications
          </span>
          <a
            className="notifications-user-avatar"
            href="/student/profile"
            aria-label="View Ashutosh's profile"
          >
            A
          </a>
        </nav>
      </header>

      <div className="notifications-content">
        <nav className="notifications-breadcrumb" aria-label="Breadcrumb">
          <a href="/student/dashboard">Dashboard</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Notifications</span>
        </nav>

        <section className="notifications-intro" aria-labelledby="notifications-title">
          <div>
            <p className="notifications-eyebrow">Student Updates</p>
            <h1 id="notifications-title">
              Your <em>notifications</em>
            </h1>
            <p className="notifications-description">
              Stay informed about tasks, attendance and important SocietySelect updates.
            </p>
          </div>
          <button className="notifications-mark-all" type="button">
            Mark All as Read
          </button>
        </section>

        <section className="notifications-summary" aria-label="Notification summary">
          {summaryCards.map((card) => (
            <article className="notifications-summary-card" key={card.label}>
              <div>
                <p>{card.label}</p>
                <strong>{card.value}</strong>
              </div>
              <span>{card.detail}</span>
            </article>
          ))}
        </section>

        <section className="notifications-layout" aria-label="Notifications">
          <aside className="notifications-sidebar">
            <div className="notifications-filter-heading">
              <p>Browse</p>
              <span>Categories</span>
            </div>

            <nav className="notifications-categories" aria-label="Notification categories">
              <button className="active" type="button">
                <span>All Notifications</span>
                <strong>{counts.total}</strong>
              </button>
              <button type="button">
                <span>Unread</span>
                <strong>{counts.unread}</strong>
              </button>
              <button type="button">
                <span>Tasks</span>
                <strong>{counts.tasks}</strong>
              </button>
              <button type="button">
                <span>Attendance</span>
                <strong>{counts.attendance}</strong>
              </button>
            </nav>

            <div className="notifications-status-filter">
              <p>Filter by</p>
              <button type="button" aria-pressed="false">
                <span className="filter-dot" />
                All statuses
              </button>
              <button type="button" aria-pressed="false">
                <span className="filter-dot unread" />
                Unread only
              </button>
              <button type="button" aria-pressed="false">
                <span className="filter-dot read" />
                Read only
              </button>
            </div>
          </aside>

          <div className="notifications-feed">
            <div className="notifications-toolbar">
              <label className="notifications-search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <span className="visually-hidden">Search notifications</span>
                <input type="search" placeholder="Search notifications" />
              </label>

              <label className="notifications-sort">
                <span>Sort</span>
                <select defaultValue="newest" aria-label="Sort notifications">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="unread">Unread first</option>
                </select>
              </label>
            </div>

            <div className="notifications-list">
              {notifications.slice(0, 6).map((notification) => (
                <article
                  className={`notification-card${notification.isRead ? "" : " is-unread"}`}
                  key={notification.id}
                >
                  <div className="notification-card-icon">
                    <NotificationIcon type={notification.icon} />
                  </div>

                  <div className="notification-card-body">
                    <div className="notification-card-meta">
                      <span className={`notification-category ${notification.category.toLowerCase()}`}>
                        {notification.category}
                      </span>
                      {!notification.isRead && (
                        <span className="notification-unread-label">Unread</span>
                      )}
                      <time dateTime={notification.timestamp}>
                        {formatTimestamp(notification.timestamp)}
                      </time>
                    </div>

                    <h2>{notification.title}</h2>
                    <p>{notification.description}</p>

                    {notification.metadata && (
                      <div className="notification-details">
                        {notification.metadata.priority && (
                          <span>{notification.metadata.priority} priority</span>
                        )}
                        {notification.metadata.status && (
                          <span>{notification.metadata.status}</span>
                        )}
                        {notification.metadata.sessionName && (
                          <span>{notification.metadata.sessionName}</span>
                        )}
                      </div>
                    )}

                    <button className="notification-action" type="button">
                      {notification.action.label}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M14 7l5 5-5 5" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Notifications;
