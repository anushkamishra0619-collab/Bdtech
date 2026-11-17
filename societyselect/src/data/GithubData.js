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
    { label: "Public repositories", value: "36" },
    { label: "Commits YTD", value: "1,284" },
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