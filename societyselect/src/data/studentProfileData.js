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
