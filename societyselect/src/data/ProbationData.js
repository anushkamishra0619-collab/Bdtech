const probationData = {
  improvementTasks: [
    { id: "improvement-01", status: "completed" },
    { id: "improvement-02", status: "completed" },
    { id: "improvement-03", status: "completed" },
    { id: "improvement-04", status: "completed" },
    { id: "improvement-05", status: "completed" },
    { id: "improvement-06", status: "completed" },
    { id: "improvement-07", status: "completed" },
    { id: "improvement-08", status: "pending" },
    { id: "improvement-09", status: "pending" },
    { id: "improvement-10", status: "pending" },
    { id: "improvement-11", status: "pending" },
    { id: "improvement-12", status: "pending" },
  ],
  probationPeriod: {
    startDate: "2026-09-01",
    currentDate: "2026-11-24",
    endDate: "2026-12-31",
  },
  reviewDetails: {
    nextReviewAt: "2026-12-05T11:00:00",
    nextReviewLabel: "5 Dec 2026, 11:00 AM",
    status: "Scheduled",
    evaluationOutcome: "Pending Evaluation",
    remarks:
      "Attendance has improved noticeably. The panel will focus on lab submissions and pending project milestones.",
  },
  mentorRemarks: {
    name: "Dr. Meera Iyer",
    designation: "Assistant Professor, Mentor",
    initials: "MI",
    feedback:
      "You have responded well to feedback this month. Your lab work is more consistent and your participation has improved.",
    recommendations:
      "Keep a weekly study schedule and share it with me. Start the project report early.",
    instructions:
      "Submit the data structures assignment by 28 Nov. Attend the Friday mentoring session each week.",
    followUpNotes: "Next one-to-one on 1 Dec. Bring your task checklist.",
  },
  notifications: [
    {
      id: "assignment-deadline",
      date: "2026-11-28",
      title: "Assignment deadline approaching",
      description: "Data structures assignment is due.",
      category: "Deadline alert",
      type: "deadline",
      isUnread: true,
    },
    {
      id: "probation-review",
      date: "2026-12-05",
      title: "Probation review scheduled",
      description: "Review meeting with the committee.",
      category: "Upcoming review date",
      type: "review",
      isUnread: true,
    },
    {
      id: "pending-tasks",
      date: "2026-11-24",
      title: "5 improvement tasks still pending",
      description: "Complete them before your review.",
      category: "Pending task reminder",
      type: "reminder",
      isUnread: false,
    },
    {
      id: "status-update",
      date: "2026-09-02",
      title: "Probation status confirmed as Active",
      description: "Confirmed by the academic committee.",
      category: "Status update",
      type: "status",
      isUnread: false,
    },
  ],
  probationHistory: [
    {
      id: "semester-3",
      semester: "Semester 3",
      duration: "60 days",
      status: "Completed",
      finalOutcome: "Cleared",
    },
    {
      id: "semester-4",
      semester: "Semester 4",
      duration: "90 days",
      status: "Completed",
      finalOutcome: "Continued",
    },
  ],
};

export default probationData;