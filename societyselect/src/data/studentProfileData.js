export const studentData = {
  avatarInitial: "A",
  name: "Ashutosh",
  studentId: "SS2026-001",
  universityRollNumber: "2301640100001",
  branch: "Computer Science and Engineering",
  academicYear: "2nd Year",
  college: "Ajay Kumar Garg Engineering College",
  societyRole: "Probationer & Member",
  applicationStatus: "In Review",
};

export const personalInformationData = {
  fullName: "Ashutosh",
  personalEmail: "ashutosh.dev@example.com",
  collegeEmail: "ashutosh@demo-college.edu",
  phoneNumber: "+91 98765 43210",
  dateOfBirth: "2004-08-19",
  gender: "Male",
  address: "A-204, Green Park Apartments",
  city: "Ghaziabad",
  state: "Uttar Pradesh",
};

export const academicInformationData = {
  universityName: "Dr. A.P.J. Abdul Kalam Technical University",
  universityRollNumber: "2301640100001",
  studentId: "SS2026-001",
  course: "B.Tech",
  branch: "Computer Science and Engineering",
  academicYear: "2nd Year",
  currentSemester: "3rd Semester",
  admissionYear: "2023",
  currentCgpa: "8.4",
  academicPerformance: "86% overall evaluation — Good standing",
};

export const technicalSkillsData = [
  {
    id: "programming-languages",
    category: "Programming Languages",
    skills: [
      { name: "C", proficiency: 68 },
      { name: "C++", proficiency: 72 },
      { name: "Java", proficiency: 70 },
      { name: "JavaScript", proficiency: 84 },
      { name: "Python", proficiency: 76 },
    ],
  },
  {
    id: "frontend-development",
    category: "Frontend Development",
    skills: [
      { name: "HTML", proficiency: 90 },
      { name: "CSS", proficiency: 86 },
      { name: "React", proficiency: 82 },
    ],
  },
  {
    id: "backend-development",
    category: "Backend Development",
    skills: [
      { name: "Node.js", proficiency: 72 },
      { name: "Express", proficiency: 68 },
      { name: "MongoDB", proficiency: 64 },
    ],
  },
  {
    id: "developer-tools",
    category: "Developer Tools",
    skills: [
      { name: "Git", proficiency: 80 },
      { name: "GitHub", proficiency: 84 },
      { name: "VS Code", proficiency: 90 },
    ],
  },
  {
    id: "technical-domains",
    category: "Technical Domains",
    skills: [
      { name: "Web Development", proficiency: 82 },
      { name: "AI/ML", proficiency: 58 },
      { name: "App Development", proficiency: 54 },
    ],
  },
];

export const studentProjectsData = [
  {
    id: "project-campus-connect",
    name: "Campus Connect",
    description:
      "A student community platform for discovering campus events, sharing updates, and connecting with peers.",
    technologyStack: ["React", "Node.js", "Express", "MongoDB"],
    role: "Full Stack",
    githubUrl: "https://github.com/example/campus-connect",
    liveDemoUrl: "https://campus-connect.example.com",
    status: "Completed",
  },
  {
    id: "project-study-planner",
    name: "Study Planner",
    description:
      "A focused study planner that helps students organize coursework and keep track of weekly goals.",
    technologyStack: ["JavaScript", "HTML", "CSS"],
    role: "Frontend",
    githubUrl: "https://github.com/example/study-planner",
    liveDemoUrl: "",
    status: "In Progress",
  },
];

export const achievementsData = [
  {
    id: "achievement-hackathon",
    title: "Campus Innovation Hackathon",
    organization: "AKGEC Innovation Cell",
    type: "Competition",
    date: "2025-02-14",
    description:
      "Recognized for a student-focused campus collaboration platform.",
    verificationStatus: "Verified",
    verificationUrl: "https://example.com/verify/campus-hackathon",
  },
  {
    id: "achievement-web-certificate",
    title: "Full Stack Web Development",
    organization: "Open Learning Institute",
    type: "Certificate",
    date: "2024-12-10",
    description:
      "Completed a project-based course covering modern web development.",
    verificationStatus: "Verified",
    verificationUrl: "https://example.com/verify/web-development",
  },
  {
    id: "achievement-academic",
    title: "Academic Excellence Award",
    organization: "Ajay Kumar Garg Engineering College",
    type: "Award",
    date: "2024-06-01",
    description: "Recognized for strong academic performance during the year.",
    verificationStatus: "Pending",
    verificationUrl: "",
  },
];

export const collegeSocietyData = {
  appliedSocieties: [
    {
      id: "society-tech",
      name: "Technical Society",
      role: "Probationer",
      applicationStatus: "In Review",
      recruitmentProgress: "Application reviewed",
      examStatus: "Passed",
      interviewStatus: "Scheduled",
      probationStatus: "In Progress",
    },
    {
      id: "society-innovation",
      name: "Innovation & Entrepreneurship Cell",
      role: "Applicant",
      applicationStatus: "Shortlisted",
      recruitmentProgress: "Interview stage",
      examStatus: "Passed",
      interviewStatus: "Pending",
      probationStatus: "Not Started",
    },
  ],
};

export const performanceData = {
  overallScore: 86,
  technicalSkillsScore: 88,
  communicationScore: 82,
  teamworkScore: 90,
  mentorFeedback:
    "Ashutosh demonstrates consistent initiative, collaborates well with peers, and applies feedback thoughtfully.",
  evaluationHistory: [
    { period: "Spring 2025", score: 86, evaluator: "R. Sharma, Mentor" },
    { period: "Fall 2024", score: 82, evaluator: "A. Mehta, Mentor" },
    { period: "Spring 2024", score: 79, evaluator: "P. Verma, Mentor" },
  ],
};

export const githubActivityData = {
  username: "ashutosh-dev",
  profileUrl: "https://github.com/ashutosh-dev",
  repositoryCount: 18,
  contributionsThisYear: 246,
  commitsThisMonth: 38,
  recentProjects: [
    { name: "Campus Connect", updated: "Updated 2 days ago", language: "JavaScript" },
    { name: "Study Planner", updated: "Updated 1 week ago", language: "React" },
    { name: "DSA Practice", updated: "Updated 2 weeks ago", language: "C++" },
  ],
  recentActivity: [
    { title: "Added event discovery filters", date: "2 days ago", kind: "Commit" },
    { title: "Refined responsive profile layout", date: "5 days ago", kind: "Pull request" },
    { title: "Published study planner UI", date: "1 week ago", kind: "Repository" },
  ],
  contributionActivity: [
    1, 0, 2, 1, 3, 0, 1, 2, 4, 1, 0, 3, 2, 1, 4, 2, 0, 1, 3, 2, 4, 1, 2, 0,
    3, 1, 4, 2, 1, 3, 0, 2, 4, 1, 2, 3, 1, 0, 2, 4, 3, 1, 2, 0, 1, 3, 4, 2,
    1, 0, 3, 2, 4, 1, 3, 2, 0, 1, 4, 3, 2, 1, 0, 2, 3, 4, 1, 2, 3, 0, 1, 4,
  ],
};

export const extracurricularActivitiesData = [
  {
    id: "activity-coding-club",
    title: "Campus Coding Club",
    role: "Active Member",
    category: "Club",
    period: "2024 – Present",
    description: "Participates in peer learning sessions and coding meetups.",
  },
  {
    id: "activity-community",
    title: "Digital Literacy Drive",
    role: "Volunteer",
    category: "Volunteering",
    period: "2024",
    description: "Helped organize introductory computer workshops for students.",
  },
  {
    id: "activity-event",
    title: "TechFest 2025",
    role: "Event Coordinator",
    category: "Event",
    period: "February 2025",
    description: "Coordinated registration and attendee support for the event.",
  },
];

export const profileDocumentsData = [
  {
    id: "document-resume",
    name: "Resume",
    fileName: "Ashutosh_Resume.pdf",
    verificationStatus: "Verified",
    updated: "Updated 12 Feb 2025",
  },
  {
    id: "document-college-id",
    name: "College ID",
    fileName: "College_ID_Card.pdf",
    verificationStatus: "Verified",
    updated: "Updated 08 Jan 2025",
  },
  {
    id: "document-certificates",
    name: "Certificates",
    fileName: "Certificates_Collection.pdf",
    verificationStatus: "Pending",
    updated: "Updated 18 Feb 2025",
  },
];

export const additionalProfileData = {
  interests: ["Web development", "Artificial intelligence", "Open source"],
  careerGoals:
    "Build accessible software products and grow into a full-stack engineering role.",
  languages: ["English", "Hindi"],
  portfolioUrl: "https://ashutosh.example.com",
  linkedInUrl: "https://www.linkedin.com/in/ashutosh-dev",
  visibility: "Public",
};

export const profileSummaryData = {
  lastUpdated: "17 February 2025",
  profileOwner: "Ashutosh",
  headline: "Computer Science student · Aspiring Full Stack Developer",
};

export const profileCompletionData = {
  percentage: 85,
  completedSections: [
    "Personal information",
    "Academic details",
    "Skills & domains",
    "Projects & contributions",
  ],
  missingInformation: [
    "Add a profile photograph",
    "Add a LinkedIn link",
  ],
};
