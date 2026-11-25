

export const interviewPage = {
  title: "Interview Details",
  subtitle: "Stay informed about your interview schedule and selection journey.",
  semester: {
    label: "Current Semester",
    value: "Semester III",
    session: "Academic Session 2026–27",
  },
  semesterOptions: [
    "Semester I",
    "Semester II",
    "Semester III",
    "Semester IV",
    "Semester V",
    "Semester VI",
  ],
};

export const interviewTopbar = {
  searchPlaceholder: "Search societies, rounds, results",
  notificationLabel: "Notifications",
  notificationPath: "/student/notifications",
  profilePath: "/student/profile",
  student: {
    name: "Abhishek Kumar Singh",
    initials: "A",
    course: "B.Tech Semester III",
    session: "Academic Session 2026–27",
  },
};

/** Statuses supported by the interview module. */
export const interviewStatuses = [
  "Scheduled",
  "Completed",
  "Rescheduled",
  "Cancelled",
  "Awaiting Feedback",
];

export const feedbackPendingLabel = "Awaiting Feedback";

/** Visual tone mapping for each supported interview status. */
export const interviewStatusTones = {
  Scheduled: "scheduled",
  Completed: "completed",
  Rescheduled: "rescheduled",
  Cancelled: "cancelled",
  "Awaiting Feedback": "awaiting",
};

export const overviewCards = [
  {
    id: "total",
    label: "Total Interviews",
    value: "02",
    icon: "calendar",
    tone: "ink",
  },
  {
    id: "upcoming",
    label: "Upcoming Interviews",
    value: "01",
    icon: "clock",
    tone: "blue",
  },
  {
    id: "completed",
    label: "Completed Interviews",
    value: "01",
    icon: "check",
    tone: "green",
  },
  {
    id: "awaiting",
    label: "Awaiting Feedback",
    value: "01",
    icon: "message",
    tone: "amber",
  },
];

export const upcomingInterview = {
  id: "INT-2026-003",
  eyebrow: "UPCOMING INTERVIEW",
  title: "Technical Interview",
  society: "Technical Society",
  status: "Scheduled",
  feedbackStatus: "Awaiting Feedback",
  round: "Technical Interview",
  date: {
    month: "NOV",
    day: "28",
    weekday: "Saturday",
    year: "2026",
    iso: "2026-11-28",
  },
  time: "11:30 AM",
  duration: "20 Minutes",
  mode: "Online",
  meeting: {
    label: "Meeting Link",
    placeholder: "[Meeting link will appear here]",
    /**
     * Intentionally empty. A real URL is supplied by the recruitment desk
     * shortly before the slot; never invent one in the UI.
     */
    url: "",
    isActive: false,
  },
  availability: {
    isOpen: false,
    note: "The meeting link becomes active shortly before your slot.",
  },
  lastUpdated: "[Date, time]",
};

export const interviewer = {
  initials: "IN",
  name: "[Interviewer Name]",
  designation: "Faculty Coordinator",
  rows: [
    { id: "society", label: "Society", value: "Technical Society" },
    { id: "department", label: "Department", value: "[Department]" },
    { id: "role", label: "Interview Role", value: "Panel Lead" },
  ],
};

export const interviewSummary = {
  title: "Interview Summary",
  rows: [
    {
      id: "interview-status",
      label: "Interview Status",
      value: upcomingInterview.status,
      type: "status",
    },
    {
      id: "feedback-status",
      label: "Feedback Status",
      value: upcomingInterview.feedbackStatus,
      type: "status",
    },
    {
      id: "round",
      label: "Round",
      value: upcomingInterview.round,
      type: "text",
    },
    {
      id: "last-updated",
      label: "Last Updated",
      value: upcomingInterview.lastUpdated,
      type: "text",
    },
  ],
};

export const selectionJourney = {
  title: "Selection Journey",
  subtitle: "Stage 5 of 6 · Interview Scheduled",
  currentStage: 5,
  totalStages: 6,
  stages: [
    {
      id: "application",
      title: "Application Submitted",
      status: "Completed",
      state: "complete",
    },
    {
      id: "aptitude",
      title: "Aptitude Test",
      status: "Completed",
      state: "complete",
    },
    {
      id: "dsa",
      title: "DSA Round",
      status: "Completed",
      state: "complete",
    },
    {
      id: "domain",
      title: "Domain Examination",
      status: "Completed",
      state: "complete",
    },
    {
      id: "interview",
      title: "Interview Scheduled",
      status: "Current stage",
      state: "current",
    },
    {
      id: "selection",
      title: "Final Selection",
      status: "Upcoming",
      state: "upcoming",
    },
  ],
};

export const importantReminders = [
  {
    id: "meeting-link",
    icon: "link",
    text: "The meeting link becomes active shortly before your slot.",
  },
  {
    id: "late-joins",
    icon: "clock",
    text: "Late joins may shorten your 20-minute slot.",
  },
  {
    id: "feedback",
    icon: "message",
    text: "Feedback will appear here once the panel submits it.",
  },
];

export const interviewInstructions = [
  {
    id: "join-early",
    icon: "clock",
    text: "Join 5–10 minutes before the interview.",
  },
  {
    id: "college-id",
    icon: "contact",
    text: "Keep your college ID ready.",
  },
  {
    id: "internet",
    icon: "wifi",
    text: "Ensure stable internet connectivity.",
  },
  {
    id: "devices",
    icon: "mic",
    text: "Test your microphone and camera.",
  },
  {
    id: "projects",
    icon: "file",
    text: "Be prepared to discuss your projects.",
  },
  {
    id: "schedule",
    icon: "calendar",
    text: "Follow the interview schedule.",
  },
];

/** Feedback is shown as pending whenever the API has not supplied a value. */
export const getFeedbackLabel = (feedback) =>
  feedback && typeof feedback === "string" && feedback.trim()
    ? feedback
    : feedbackPendingLabel;

export const getStatusTone = (status) =>
  interviewStatusTones[status] ?? "awaiting";

/** Only http(s) links with a hostname can be opened as meeting URLs. */
export const isValidMeetingUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return ["http:", "https:"].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
};

/**
 * A student may join only when the panel published the link, the slot is open
 * and the interview is in a joinable state.
 */
export const isInterviewJoinable = (interview) => {
  const joinableStatuses = ["Scheduled", "Rescheduled"];
  return (
    joinableStatuses.includes(interview?.status) &&
    interview?.meeting?.isActive === true &&
    interview?.availability?.isOpen === true &&
    isValidMeetingUrl(interview?.meeting?.url)
  );
};

export default {
  interviewPage,
  interviewTopbar,
  interviewStatuses,
  feedbackPendingLabel,
  interviewStatusTones,
  overviewCards,
  upcomingInterview,
  interviewer,
  interviewSummary,
  selectionJourney,
  importantReminders,
  interviewInstructions,
  getFeedbackLabel,
  getStatusTone,
  isValidMeetingUrl,
  isInterviewJoinable,
};
