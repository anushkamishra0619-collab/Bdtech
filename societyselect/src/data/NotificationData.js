export const notifications = [
  {
    id: "notification-task-001",
    title: "Project README submission due",
    description: "Upload the Campus Connect README and implementation notes for mentor review.",
    category: "Task",
    timestamp: "2026-11-24T09:30:00+05:30",
    isRead: false,
    icon: "document",
    action: {
      label: "Open project submission",
      type: "route",
      route: "/student/project-submission",
    },
    metadata: {
      taskId: "readme",
      dueDate: "2026-11-24",
      priority: "High",
      status: "Pending",
    },
  },
  {
    id: "notification-attendance-001",
    title: "Attendance updated",
    description: "Your attendance for the 24 November React development session has been recorded.",
    category: "Attendance",
    timestamp: "2026-11-24T09:05:00+05:30",
    isRead: false,
    icon: "calendar",
    action: {
      label: "View attendance",
      type: "route",
      route: "/student/my-attendance",
    },
    metadata: {
      sessionDate: "2026-11-24",
      sessionName: "React Development Lab",
      status: "Present",
      attendancePercentage: 89,
    },
  },
  {
    id: "notification-task-002",
    title: "Mock interview preparation reminder",
    description: "Complete the assigned interview preparation checklist before tomorrow's review.",
    category: "Task",
    timestamp: "2026-11-23T18:40:00+05:30",
    isRead: false,
    icon: "clipboard",
    action: {
      label: "View interview details",
      type: "route",
      route: "/student/interview",
    },
    metadata: {
      taskId: "interview",
      dueDate: "2026-11-25",
      priority: "Medium",
      status: "In Progress",
    },
  },
  {
    id: "notification-attendance-002",
    title: "Peer collaboration session missed",
    description: "The Peer Collaboration Review session on 23 November is marked absent.",
    category: "Attendance",
    timestamp: "2026-11-23T17:20:00+05:30",
    isRead: true,
    icon: "alert",
    action: {
      label: "Review attendance",
      type: "route",
      route: "/student/my-attendance",
    },
    metadata: {
      sessionDate: "2026-11-23",
      sessionName: "Peer Collaboration Review",
      status: "Absent",
      attendancePercentage: 88,
    },
  },
  {
    id: "notification-task-003",
    title: "Communication quiz is live",
    description: "Submit the communication and teamwork quiz by 28 November 2026.",
    category: "Task",
    timestamp: "2026-11-23T14:10:00+05:30",
    isRead: true,
    icon: "checklist",
    action: {
      label: "Start communication quiz",
      type: "route",
      route: "/student/online-examination",
    },
    metadata: {
      taskId: "communication",
      dueDate: "2026-11-28",
      priority: "Low",
      status: "Pending",
    },
  },
  {
    id: "notification-attendance-003",
    title: "Probation meeting marked present",
    description: "Your attendance for the probation progress meeting has been confirmed.",
    category: "Attendance",
    timestamp: "2026-11-22T16:35:00+05:30",
    isRead: true,
    icon: "calendar",
    action: {
      label: "Open attendance calendar",
      type: "route",
      route: "/student/attendance-calendar",
    },
    metadata: {
      sessionDate: "2026-11-22",
      sessionName: "Probation Progress Meeting",
      status: "Present",
      attendancePercentage: 89,
    },
  },
  {
    id: "notification-task-004",
    title: "Peer feedback response requested",
    description: "Share feedback on your teammates' recent project contributions.",
    category: "Task",
    timestamp: "2026-11-22T11:15:00+05:30",
    isRead: false,
    icon: "users",
    action: {
      label: "Open peer review",
      type: "route",
      route: "/student/tasks",
    },
    metadata: {
      taskId: "collaboration",
      dueDate: "2026-11-24",
      priority: "Medium",
      status: "Pending",
    },
  },
  {
    id: "notification-attendance-004",
    title: "GitHub mentoring session attended",
    description: "Attendance was recorded for the GitHub contribution and code review workshop.",
    category: "Attendance",
    timestamp: "2026-11-21T15:45:00+05:30",
    isRead: true,
    icon: "calendar",
    action: {
      label: "View my attendance",
      type: "route",
      route: "/student/my-attendance",
    },
    metadata: {
      sessionDate: "2026-11-21",
      sessionName: "GitHub Code Review Workshop",
      status: "Present",
      attendancePercentage: 90,
    },
  },
  {
    id: "notification-task-005",
    title: "README submission approved",
    description: "Your Campus Connect README has been approved with positive mentor feedback.",
    category: "Task",
    timestamp: "2026-11-20T13:25:00+05:30",
    isRead: true,
    icon: "award",
    action: {
      label: "View task feedback",
      type: "route",
      route: "/student/tasks",
    },
    metadata: {
      taskId: "readme",
      dueDate: "2026-11-16",
      priority: "High",
      status: "Approved",
    },
  },
  {
    id: "notification-attendance-005",
    title: "Technical interview attended",
    description: "Your technical interview slot attendance has been verified by the mentor panel.",
    category: "Attendance",
    timestamp: "2026-11-20T10:50:00+05:30",
    isRead: true,
    icon: "clock",
    action: {
      label: "Open interview details",
      type: "route",
      route: "/student/interview",
    },
    metadata: {
      sessionDate: "2026-11-20",
      sessionName: "Technical Interview Round",
      status: "Present",
      attendancePercentage: 91,
    },
  },
  {
    id: "notification-attendance-006",
    title: "Design critique session recorded",
    description: "Attendance for the UI and experience design critique has been added to your record.",
    category: "Attendance",
    timestamp: "2026-11-19T16:05:00+05:30",
    isRead: true,
    icon: "calendar",
    action: {
      label: "View attendance history",
      type: "route",
      route: "/student/attendance-calendar",
    },
    metadata: {
      sessionDate: "2026-11-19",
      sessionName: "UI/UX Design Critique",
      status: "Present",
      attendancePercentage: 92,
    },
  },
  {
    id: "notification-attendance-007",
    title: "Monthly attendance summary ready",
    description: "Your November attendance summary is available with 7 sessions recorded this month.",
    category: "Attendance",
    timestamp: "2026-11-18T12:00:00+05:30",
    isRead: true,
    icon: "chart",
    action: {
      label: "View monthly summary",
      type: "route",
      route: "/student/my-attendance",
    },
    metadata: {
      sessionDate: "2026-11-18",
      sessionName: "November Attendance Summary",
      status: "Summary",
      attendancePercentage: 92,
    },
  },
];

export const countTotalNotifications = () =>
  notifications.length;

export const countUnreadNotifications = () =>
  notifications.filter((notification) => !notification.isRead).length;

export const countTaskNotifications = () =>
  notifications.filter((notification) => notification.category === "Task").length;

export const countAttendanceNotifications = () =>
  notifications.filter((notification) => notification.category === "Attendance").length;

export const getNotificationCounts = () => ({
  total: countTotalNotifications(),
  unread: countUnreadNotifications(),
  tasks: countTaskNotifications(),
  attendance: countAttendanceNotifications(),
});

export default notifications;