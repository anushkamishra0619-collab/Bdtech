export const githubProfileData = {
  demoMode: true,
  profile: {
    name: "Ashutosh Sharma",
    username: "@ashutosh-sharma",
    profileUrl: "https://github.com/",
    affiliation: "Student developer",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    college: "SocietySelect Institute",
    bio: "Building thoughtful software, exploring full-stack development, and learning through open-source collaboration.",
    highlights: ["India", "Joined September 2023"],
  },
  metrics: [
    { label: "Followers", value: "248" },
    { label: "Following", value: "132" },
    { label: "Repos", value: "36" },
    { label: "Commits", value: "1,284" },
  ],
};

export const githubAnalyticsStats = [
  {
    id: "contributions",
    label: "Total contributions",
    value: "1,813",
    trend: "▲ 18.4% vs last term",
    icon: "activity",
    tone: "blue",
    sparkline: [9, 10, 12, 14, 18, 19, 17, 18, 20, 21, 22, 23, 27, 28, 30, 32],
  },
  {
    id: "commits",
    label: "Total commits",
    value: "1,396",
    context: "Across 28 active branches",
    icon: "commits",
    tone: "blue",
    sparkline: [23, 22, 21, 20, 19, 19, 23, 24, 24, 26, 29, 31, 28, 26, 24, 22, 21, 20],
  },
  {
    id: "repositories",
    label: "Public repos",
    value: "34",
    context: "12 academic capstones",
    icon: "repositories",
    tone: "muted",
    sparkline: [10, 12, 14, 12, 11, 12, 15, 14, 15, 16, 18, 22, 21, 24, 23, 24, 25],
  },
  {
    id: "pull-requests",
    label: "Pull requests",
    value: "86",
    trend: "94% merge rate",
    icon: "pullRequests",
    tone: "blue",
    sparkline: [12, 10, 8, 11, 13, 14, 15, 15, 17, 20, 19, 16, 20, 23],
  },
  {
    id: "issues-resolved",
    label: "Issues resolved",
    value: "64",
    context: "2.4d avg turnaround",
    icon: "issues",
    tone: "navy",
    sparkline: [10, 14, 17, 20, 18, 17, 18, 17, 18, 17, 15, 17, 17, 17, 16, 13],
  },
  {
    id: "stars-earned",
    label: "Stars earned",
    value: "428",
    context: "Top repo: 184 stars",
    icon: "stars",
    tone: "blue",
    sparkline: [18, 15, 13, 16, 18, 22, 19, 16, 18, 17, 14, 11, 8, 14, 17],
  },
];

const millisecondsPerDay = 24 * 60 * 60 * 1000;

const buildContributionYear = (year, targetTotal, peakCount) => {
  const firstDay = Date.UTC(year, 0, 1);
  const dayCount = (Date.UTC(year + 1, 0, 1) - firstDay) / millisecondsPerDay;
  const peakIndex = (Date.UTC(year, 5, 25) - firstDay) / millisecondsPerDay;
  const rawCounts = [];
  let activeRun = 0;

  for (let index = 0; index < dayCount; index += 1) {
    const date = new Date(firstDay + index * millisecondsPerDay);
    const weekday = date.getUTCDay();
    const seed = Math.sin((index + 1) * 127.1 + year * 311.7) * 43758.5453;
    const random = seed - Math.floor(seed);
    const weekendThreshold = weekday === 0 || weekday === 6 ? 0.46 : 0.24;
    const isActive = random > weekendThreshold && activeRun < 10;

    rawCounts.push(isActive ? 1 + Math.floor(random * 5) : 0);
    activeRun = isActive ? activeRun + 1 : 0;
  }

  rawCounts[peakIndex] = 0;

  const longestRunStart = Math.floor(
    (Date.UTC(year, 3, 10) - firstDay) / millisecondsPerDay,
  );
  rawCounts[longestRunStart - 1] = 0;
  for (let index = longestRunStart; index < longestRunStart + 11; index += 1) {
    rawCounts[index] = Math.max(1, rawCounts[index]);
  }
  rawCounts[longestRunStart + 11] = 0;

  rawCounts[dayCount - 4] = 0;
  for (let index = dayCount - 3; index < dayCount; index += 1) {
    rawCounts[index] = Math.max(1, rawCounts[index]);
  }

  const availableForOtherDays = targetTotal - peakCount;
  const rawTotal = rawCounts.reduce((sum, count) => sum + count, 0);
  const scaledCounts = rawCounts.map((count) =>
    count === 0 ? 0 : Math.floor((count * availableForOtherDays) / rawTotal),
  );
  let remainder = availableForOtherDays - scaledCounts.reduce((sum, count) => sum + count, 0);
  const activeDays = rawCounts
    .map((count, index) => ({ count, index }))
    .filter(({ count }) => count > 0)
    .sort((left, right) => right.count - left.count);

  for (let index = 0; index < remainder; index += 1) {
    scaledCounts[activeDays[index].index] += 1;
  }
  scaledCounts[peakIndex] = peakCount;

  const days = scaledCounts.map((count, index) => ({
    date: new Date(firstDay + index * millisecondsPerDay).toISOString().slice(0, 10),
    count,
    commits: Math.ceil(count * 0.75),
    pullRequestReviews: count - Math.ceil(count * 0.75),
  }));
  let currentStreak = 0;
  let longestStreak = 0;
  let activeStreak = 0;
  let busiestDay = days[0];

  for (const day of days) {
    activeStreak = day.count > 0 ? activeStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, activeStreak);
    if (day.count > busiestDay.count) busiestDay = day;
  }
  for (let index = days.length - 1; index >= 0 && days[index].count > 0; index -= 1) {
    currentStreak += 1;
  }

  const busiestDate = new Date(`${busiestDay.date}T00:00:00Z`);
  const busiestDateLabel = `${busiestDate.getUTCDate()} ${busiestDate.toLocaleDateString(
    "en-US",
    { month: "short", timeZone: "UTC" },
  )}`;

  return {
    totalContributions: days.reduce((sum, day) => sum + day.count, 0),
    currentStreak,
    longestStreak,
    busiestDay: {
      count: busiestDay.count,
      date: busiestDateLabel,
    },
    days,
  };
};

const contributionYears = {
  2026: buildContributionYear(2026, 1813, 39),
  2025: buildContributionYear(2025, 1624, 31),
  2024: buildContributionYear(2024, 1438, 28),
};

export const githubContributionData = {
  ...contributionYears,
  "All Time": {
    totalContributions: Object.values(contributionYears).reduce(
      (sum, year) => sum + year.totalContributions,
      0,
    ),
    currentStreak: contributionYears[2026].currentStreak,
    longestStreak: Math.max(
      ...Object.values(contributionYears).map((year) => year.longestStreak),
    ),
    busiestDay: contributionYears[2026].busiestDay,
    days: Object.values(contributionYears)
      .flatMap((year) => year.days)
      .sort((left, right) => left.date.localeCompare(right.date)),
  },
};

export const githubLanguageDistribution = {
  totalLinesOfCode: 148000,
  languageCount: 8,
  repositoryCount: 34,
  subtitle: "Cumulative byte-weight across 34 public repositories.",
  languages: [
    { name: "TypeScript", percentage: 38.5, repositoryCount: 16, color: "#4d7c96" },
    { name: "Python", percentage: 26.2, repositoryCount: 10, color: "#7aaf8a" },
    { name: "Rust", percentage: 14.8, repositoryCount: 4, color: "#bd8751" },
    { name: "Go", percentage: 12, repositoryCount: 3, color: "#6d9fb1" },
    { name: "C++", percentage: 8.5, repositoryCount: 1, color: "#9eacb4" },
  ],
};

export const githubCommitVelocity = {
  Weekly: {
    title: "Weekly commit velocity",
    subtitle: "Semester pacing · avg 34 commits / week",
    axisMax: 80,
    ticks: [0, 20, 40, 60, 80],
    highlightIndices: [7, 11],
    points: [
      { label: "Week 1 (Sep)", axisLabel: "Week 1 (Sep)", value: 22 },
      { label: "Week 2", axisLabel: "", value: 18 },
      { label: "Week 3", axisLabel: "", value: 26 },
      { label: "Week 4 (Oct midterms)", axisLabel: "Week 4 (Oct midterms)", value: 30 },
      { label: "Week 5", axisLabel: "", value: 24 },
      { label: "Week 6", axisLabel: "", value: 34 },
      { label: "Week 7", axisLabel: "", value: 40 },
      { label: "Week 8 (Hackathon peak)", axisLabel: "Week 8 (Hackathon peak)", value: 62 },
      { label: "Week 9", axisLabel: "", value: 28 },
      { label: "Week 10", axisLabel: "", value: 36 },
      { label: "Week 11", axisLabel: "", value: 31 },
      { label: "Week 12 (Current)", axisLabel: "Week 12 (Current)", value: 58 },
    ],
  },
  Monthly: {
    title: "Monthly commit velocity",
    subtitle: "Yearly pacing · avg 136 commits / month",
    axisMax: 180,
    ticks: [0, 45, 90, 135, 180],
    highlightIndices: [7, 11],
    points: [
      { label: "January", axisLabel: "Jan", value: 108 },
      { label: "February", axisLabel: "Feb", value: 96 },
      { label: "March", axisLabel: "Mar", value: 124 },
      { label: "April", axisLabel: "Apr", value: 138 },
      { label: "May", axisLabel: "May", value: 121 },
      { label: "June", axisLabel: "Jun", value: 147 },
      { label: "July", axisLabel: "Jul", value: 156 },
      { label: "August", axisLabel: "Aug", value: 171 },
      { label: "September", axisLabel: "Sep", value: 132 },
      { label: "October", axisLabel: "Oct", value: 165 },
      { label: "November", axisLabel: "Nov", value: 143 },
      { label: "December", axisLabel: "Dec", value: 131 },
    ],
  },
  Quarterly: {
    title: "Quarterly commit velocity",
    subtitle: "Yearly pacing · avg 381 commits / quarter",
    axisMax: 500,
    ticks: [0, 125, 250, 375, 500],
    highlightIndices: [2, 3],
    points: [
      { label: "Quarter 1", axisLabel: "Q1", value: 310 },
      { label: "Quarter 2", axisLabel: "Q2", value: 382 },
      { label: "Quarter 3", axisLabel: "Q3", value: 428 },
      { label: "Quarter 4 (Current)", axisLabel: "Q4 (Current)", value: 405 },
    ],
  },
};

export const githubRecentActivities = [
  {
    id: "activity-001",
    type: "Commit",
    status: "Committed",
    title: "Pushed 3 commits to main",
    description: "Refined dashboard metrics and improved responsive chart behavior.",
    repository: "societyselect-web",
    timestamp: "2026-11-17T13:24:00Z",
  },
  {
    id: "activity-002",
    type: "Pull Request",
    status: "In review",
    title: "Opened a pull request",
    description: "Added accessible labels and keyboard support to analytics charts.",
    repository: "societyselect-web",
    timestamp: "2026-11-17T10:42:00Z",
  },
  {
    id: "activity-003",
    type: "Issue",
    status: "Resolved",
    title: "Closed an issue",
    description: "Resolved a mobile layout overflow in the activity dashboard.",
    repository: "campus-connect",
    timestamp: "2026-11-16T16:18:00Z",
  },
  {
    id: "activity-004",
    type: "Merge",
    status: "Merged",
    title: "Merged a pull request",
    description: "Merged the student profile improvements into the development branch.",
    repository: "societyselect-web",
    timestamp: "2026-11-16T12:06:00Z",
  },
  {
    id: "activity-005",
    type: "Commit",
    status: "Committed",
    title: "Committed 5 changes",
    description: "Updated application form validation and its inline feedback states.",
    repository: "society-apply",
    timestamp: "2026-11-15T18:35:00Z",
  },
];

export const githubTopRepositories = [
  {
    id: "societyselect-portal",
    name: "societyselect-portal",
    description:
      "Campus matching platform for student technical societies and hackathon teams. Implements deterministic matching and peer evaluation workflows.",
    language: "TypeScript",
    languageColor: "#4d7c96",
    stars: 184,
    forks: 42,
    updatedAt: "2026-11-18T10:00:00Z",
    topics: ["react", "academic", "ai-matching"],
    featured: true,
  },
  {
    id: "neuro-canvas-ai",
    name: "neuro-canvas-ai",
    description:
      "WebGPU-accelerated neural network visualizer for learning coursework. Renders layer-by-layer activations in the browser.",
    language: "Python",
    languageColor: "#7aaf8a",
    stars: 126,
    forks: 28,
    updatedAt: "2026-11-17T10:00:00Z",
    topics: ["webgpu", "deep-learning", "shader"],
  },
  {
    id: "campus-event-bot",
    name: "campus-event-bot",
    description:
      "Discord and Slack bot that syncs seminar calendars, RSVP webhooks and automated reminders for student events.",
    language: "Go",
    languageColor: "#6d9fb1",
    stars: 68,
    forks: 14,
    updatedAt: "2026-11-15T10:00:00Z",
    topics: ["golang", "discord-api", "automation"],
  },
  {
    id: "dsa-in-rust",
    name: "dsa-in-rust",
    description:
      "Algorithms and persistent data structures implemented idiomatically in Rust with benchmarks.",
    language: "Rust",
    languageColor: "#bd8751",
    stars: 50,
    forks: 19,
    updatedAt: "2026-11-11T10:00:00Z",
    topics: ["rust", "algorithms", "benchmarks"],
  },
  {
    id: "peer-tutoring-app",
    name: "peer-tutoring-app",
    description:
      "A campus peer-learning portal with subject discovery, tutor profiles, and session scheduling.",
    language: "TypeScript",
    languageColor: "#4d7c96",
    stars: 46,
    forks: 11,
    updatedAt: "2026-11-09T10:00:00Z",
    topics: ["education", "react", "scheduling"],
  },
  {
    id: "open-source-orientation",
    name: "open-source-orientation",
    description:
      "Interactive onboarding guides that help new contributors find beginner-friendly project issues.",
    language: "JavaScript",
    languageColor: "#b2a25f",
    stars: 38,
    forks: 9,
    updatedAt: "2026-11-07T10:00:00Z",
    topics: ["open-source", "onboarding", "community"],
  },
  {
    id: "lab-book",
    name: "lab-book",
    description:
      "A lightweight experiment notebook for organizing class lab observations and reproducible results.",
    language: "Python",
    languageColor: "#7aaf8a",
    stars: 31,
    forks: 7,
    updatedAt: "2026-11-05T10:00:00Z",
    topics: ["notebooks", "science", "education"],
  },
  {
    id: "campus-map",
    name: "campus-map",
    description:
      "Accessible campus navigation with searchable buildings, routes, and student-friendly location details.",
    language: "TypeScript",
    languageColor: "#4d7c96",
    stars: 27,
    forks: 6,
    updatedAt: "2026-11-02T10:00:00Z",
    topics: ["maps", "accessibility", "campus"],
  },
  {
    id: "study-room-booking",
    name: "study-room-booking",
    description:
      "Room availability and booking prototype designed for collaborative campus study spaces.",
    language: "Java",
    languageColor: "#9f716c",
    stars: 22,
    forks: 5,
    updatedAt: "2026-10-29T10:00:00Z",
    topics: ["booking", "campus", "prototype"],
  },
  {
    id: "matrix-heatmaps",
    name: "matrix-heatmaps",
    description:
      "Small visualization toolkit for exploring matrix data with configurable color scales and labels.",
    language: "JavaScript",
    languageColor: "#b2a25f",
    stars: 18,
    forks: 4,
    updatedAt: "2026-10-24T10:00:00Z",
    topics: ["visualization", "matrices", "canvas"],
  },
  {
    id: "api-test-fixtures",
    name: "api-test-fixtures",
    description:
      "Reusable test fixtures and examples for validating student project REST APIs.",
    language: "Python",
    languageColor: "#7aaf8a",
    stars: 14,
    forks: 3,
    updatedAt: "2026-10-19T10:00:00Z",
    topics: ["testing", "api", "fixtures"],
  },
  {
    id: "rust-cli-notes",
    name: "rust-cli-notes",
    description:
      "A command-line study notes prototype focused on fast search and portable plain-text storage.",
    language: "Rust",
    languageColor: "#bd8751",
    stars: 11,
    forks: 2,
    updatedAt: "2026-10-12T10:00:00Z",
    topics: ["cli", "notes", "rust"],
  },
];