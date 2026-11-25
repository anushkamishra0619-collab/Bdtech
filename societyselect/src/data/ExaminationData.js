/**
 * Mock data for the Student Online Examination dashboard.
 *
 * NOTE: The assessment URL below is a MOCK used for this UI-only implementation.
 * It is not a real Unstop assessment and must be replaced with the production
 * assignment link returned by the college portal API.
 */
export const MOCK_ASSESSMENT_URL =
  "https://unstop.com/mock/assessments/probation-examination-round-1";

export const examinationSemester = {
  label: "Current Semester",
  value: "Semester III",
  term: "Aug – Dec 2026",
};

/** UI state hook for a future portal API. The mock dataset is ready instantly. */
export const examinationDataState = {
  isLoading: false,
};

/** Presentation metadata for the three examination families students see. */
export const examinationSubjectCategories = {
  dsa: { id: "dsa", label: "DSA Round", tone: "dsa" },
  domain: { id: "domain", label: "Domain Exams", tone: "domain" },
  aptitude: { id: "aptitude", label: "Aptitude Test", tone: "aptitude" },
};

/** Deadline states are supplied by the portal; no client-side countdowns. */
export const deadlineStates = {
  approaching: { label: "Approaching", tone: "urgent" },
  upcoming: { label: "Upcoming", tone: "upcoming" },
  expired: { label: "Window closed", tone: "expired" },
};

export const examinationStatistics = [
  {
    id: "assigned",
    label: "Assigned Exams",
    value: "05",
    note: "this semester",
    tone: "ink",
    icon: "clipboard",
    progress: 100,
  },
  {
    id: "pending",
    label: "Pending",
    value: "02",
    note: "closes tomorrow",
    tone: "amber",
    icon: "clock",
    progress: 40,
  },
  {
    id: "attempted",
    label: "Attempted",
    value: "03",
    note: "taken on Unstop",
    tone: "blue",
    icon: "monitor",
    progress: 60,
  },
  {
    id: "passed",
    label: "Passed",
    value: "02",
    note: "of 2 results imported",
    tone: "green",
    icon: "check",
    progress: 100,
  },
];

export const examinationLifecycle = {
  currentStageIndex: 1,
  stages: [
    {
      id: "assigned",
      title: "Assigned",
      description: "Mentor adds an exam to your portal",
      icon: "user",
    },
    {
      id: "pending",
      title: "Pending",
      description: "Waiting for your attempt",
      icon: "clock",
      currentLabel: "you are here",
    },
    {
      id: "attempted",
      title: "Attempted on Unstop",
      description: "Taken on the external platform",
      icon: "monitor",
    },
    {
      id: "result-imported",
      title: "Result Imported",
      description: "Mentor imports your result",
      icon: "file",
    },
    {
      id: "passed-failed",
      title: "Passed / Failed",
      description: "Shown against passing marks",
      icon: "trophy",
    },
  ],
};

export const examinationCategories = [
  { id: "all", label: "All Examinations", count: 5 },
  { id: "upcoming", label: "Upcoming", count: 1 },
  { id: "available", label: "Available", count: 1 },
  { id: "attempted", label: "Attempted", count: 3 },
  { id: "results", label: "Results", count: 2 },
];

export const externalAssessmentNotice =
  "This examination will be conducted on Unstop. Your examination details and results will be tracked in the college portal.";

export const featuredExamination = {
  id: "exam-001",
  name: "Probation Examination — Round 1",
  subject: "Data Structures",
  category: "dsa",
  deadlineState: "approaching",
  deadlineLabel: "Closes tomorrow · 25 Nov 2026",
  description:
    "The first probation assessment covers data structures, complexity analysis and applied problem solving. Complete it on Unstop before the deadline.",
  mentor: "Rahul Sharma",
  mentorRole: "Mentor",
  startDate: "20 Nov 2026",
  endDate: "25 Nov 2026",
  window: "20 Nov – 25 Nov 2026",
  duration: "60 Minutes",
  totalMarks: 100,
  passingMarks: 40,
  attemptStatus: "Pending",
  resultState: "pending",
  resultStatus: "Pending",
  score: null,
  percentage: null,
  submissionDate: null,
  statusLabel: "Available now",
  statusDetail: "Closes tomorrow · 25 Nov 2026",
  statusTone: "available",
  isAvailable: true,
  assessmentUrl: MOCK_ASSESSMENT_URL,
  categories: ["available"],
};

export const examinationAssignments = [
  {
    id: "exam-002",
    name: "Probation Examination — Round 2",
    subject: "Algorithms",
    category: "dsa",
    deadlineState: "upcoming",
    deadlineLabel: "Opens 1 Dec 2026",
    description:
      "The second probation assessment focuses on algorithm design, analysis and optimisation techniques.",
    mentor: "Rahul Sharma",
    mentorRole: "Mentor",
    startDate: "1 Dec 2026",
    endDate: "6 Dec 2026",
    window: "1 Dec – 6 Dec 2026",
    duration: "75 Minutes",
    totalMarks: 100,
    passingMarks: 40,
    attemptStatus: "Not started",
    resultState: "pending",
    resultStatus: "Pending",
    score: null,
    percentage: null,
    submissionDate: null,
    statusLabel: "Upcoming",
    statusDetail: "Opens 1 Dec 2026",
    statusTone: "upcoming",
    isAvailable: false,
    assessmentUrl: MOCK_ASSESSMENT_URL,
    categories: ["upcoming"],
  },
  {
    id: "exam-003",
    name: "Database Management Systems",
    subject: "Core CS",
    category: "domain",
    deadlineState: "expired",
    deadlineLabel: "Window closed 18 Nov 2026",
    description:
      "An assessment of relational modelling, SQL queries, normalization and transaction management.",
    mentor: "Priya Nair",
    mentorRole: "Mentor",
    startDate: "12 Nov 2026",
    endDate: "18 Nov 2026",
    window: "12 Nov – 18 Nov 2026",
    duration: "60 Minutes",
    totalMarks: 100,
    passingMarks: 40,
    attemptStatus: "Attempted",
    resultState: "not-imported",
    resultStatus: "Not yet imported",
    score: null,
    percentage: null,
    submissionDate: "16 Nov 2026",
    statusLabel: "Attempted on Unstop",
    statusDetail: "Submitted 16 Nov 2026",
    statusTone: "attempted",
    isAvailable: false,
    assessmentUrl: MOCK_ASSESSMENT_URL,
    categories: ["attempted"],
  },
  {
    id: "exam-004",
    name: "Aptitude & Logical Reasoning",
    subject: "Aptitude",
    category: "aptitude",
    deadlineState: "expired",
    deadlineLabel: "Window closed 15 Nov 2026",
    description:
      "An aptitude assessment covering quantitative reasoning, logical puzzles and verbal ability.",
    mentor: "Priya Nair",
    mentorRole: "Mentor",
    startDate: "10 Nov 2026",
    endDate: "15 Nov 2026",
    window: "10 Nov – 15 Nov 2026",
    duration: "45 Minutes",
    totalMarks: 50,
    passingMarks: 20,
    attemptStatus: "Attempted",
    resultState: "published",
    result: "Passed",
    resultStatus: "Passed",
    resultPublishedOn: "17 Nov 2026",
    score: 38,
    percentage: 76,
    submissionDate: "15 Nov 2026",
    statusLabel: "Passed",
    statusDetail: "Result published 17 Nov 2026",
    statusTone: "passed",
    isAvailable: false,
    assessmentUrl: MOCK_ASSESSMENT_URL,
    categories: ["attempted", "results"],
  },
  {
    id: "exam-005",
    name: "Python Programming Fundamentals",
    subject: "Programming",
    category: "domain",
    deadlineState: "expired",
    deadlineLabel: "Window closed 7 Nov 2026",
    description:
      "An assessment of Python fundamentals, data structures, functions and problem solving.",
    mentor: "Rahul Sharma",
    mentorRole: "Mentor",
    startDate: "2 Nov 2026",
    endDate: "7 Nov 2026",
    window: "2 Nov – 7 Nov 2026",
    duration: "90 Minutes",
    totalMarks: 100,
    passingMarks: 40,
    attemptStatus: "Attempted",
    resultState: "published",
    result: "Passed",
    resultStatus: "Passed",
    resultPublishedOn: "12 Nov 2026",
    score: 68,
    percentage: 68,
    submissionDate: "7 Nov 2026",
    statusLabel: "Passed",
    statusDetail: "Result published 12 Nov 2026",
    statusTone: "passed",
    isAvailable: false,
    assessmentUrl: MOCK_ASSESSMENT_URL,
    categories: ["attempted", "results"],
  },
];

export const examinationNotifications = [
  {
    id: "exam-notification-001",
    title: "Deadline tomorrow",
    description:
      "Probation Examination — Round 1 closes on 25 Nov 2026. Complete it on Unstop.",
    date: "Today",
    tone: "deadline",
    isRead: false,
  },
  {
    id: "exam-notification-002",
    title: "Pending assessment reminder",
    description: "You have not attempted Round 1 on Unstop yet.",
    date: "22 Nov 2026",
    tone: "reminder",
    isRead: false,
  },
  {
    id: "exam-notification-003",
    title: "Examination now available",
    description: "Round 1 is open. Start it on Unstop.",
    date: "20 Nov 2026",
    tone: "available",
    isRead: true,
  },
  {
    id: "exam-notification-004",
    title: "Result published",
    description: "Aptitude & Logical Reasoning — you passed.",
    date: "17 Nov 2026",
    tone: "result",
    isRead: true,
  },
  {
    id: "exam-notification-005",
    title: "New examination assigned",
    description: "Probation Examination — Round 2 by Rahul Sharma.",
    date: "18 Nov 2026",
    tone: "assignment",
    isRead: true,
  },
];

export const upcomingDeadlines = [
  {
    id: "deadline-001",
    month: "NOV",
    day: "25",
    name: "Probation Examination — Round 1",
    detail: "Closes tomorrow",
    remaining: "1 day left",
    tone: "urgent",
  },
  {
    id: "deadline-002",
    month: "DEC",
    day: "06",
    name: "Probation Examination — Round 2",
    detail: "Opens 1 Dec",
    remaining: "12 days left",
    tone: "upcoming",
  },
];

/** Shared result presentation tones. Failed is supported even though the
 *  current mock assignments contain no failed result. */
export const resultTones = {
  passed: { label: "Passed", color: "#3f8a68", soft: "#e6f3ec" },
  failed: { label: "Failed", color: "#b45a4f", soft: "#f9e9e6" },
  pending: { label: "Pending", color: "#b98a3e", soft: "#fbf2df" },
  "not-imported": {
    label: "Result Not Yet Imported",
    color: "#6d9fb1",
    soft: "#e9f2f6",
  },
};

export default {
  examinationSemester,
  examinationDataState,
  examinationSubjectCategories,
  deadlineStates,
  examinationStatistics,
  examinationLifecycle,
  examinationCategories,
  featuredExamination,
  examinationAssignments,
  examinationNotifications,
  upcomingDeadlines,
  resultTones,
  externalAssessmentNotice,
  MOCK_ASSESSMENT_URL,
};
