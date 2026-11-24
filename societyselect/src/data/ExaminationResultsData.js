/**
 * Mock data for the Student Examination Results page.
 *
 * These are SocietySelect AI recruitment/selection assessments conducted on
 * Unstop. Results only become visible after a mentor imports them into the
 * portal. Students can view results but cannot enter, edit or import marks.
 */

export const resultsSemester = {
  label: "Current Semester",
  value: "Semester III",
  session: "Academic Session 2026–27",
  student: "Abhishek Kumar Singh",
};

export const unstopAssessmentNotice =
  "Assessments are conducted on Unstop. Results appear here once your mentor imports them.";

export const pendingResultMessage =
  "Your result has not been declared yet. Please check again later.";

export const resultCategories = [
  {
    id: "all",
    label: "All Assessments",
    shortLabel: "All Results",
    description: "All recruitment assessment results",
    icon: "clipboard",
  },
  {
    id: "dsa",
    label: "DSA Round",
    shortLabel: "DSA Round",
    description: "Data Structures and Algorithms coding performance",
    icon: "file",
  },
  {
    id: "domain",
    label: "Domain Exams",
    shortLabel: "Domain Exams",
    description: "Domain-specific technical assessments",
    icon: "monitor",
  },
  {
    id: "aptitude",
    label: "Aptitude Test",
    shortLabel: "Aptitude Test",
    description: "Quantitative, logical and verbal ability",
    icon: "trophy",
  },
];

/** Visual tones shared by badges, progress bars and the details modal. */
export const resultTones = {
  passed: { label: "Passed", color: "#3f8a68", soft: "#e6f3ec", border: "#cbe5d6" },
  failed: { label: "Failed", color: "#b45a4f", soft: "#f9e9e6", border: "#efd2cd" },
  pending: { label: "Pending", color: "#b98a3e", soft: "#fbf2df", border: "#ecd9ae" },
};

/**
 * Assessment records.
 *
 * `resultImported: false` means the mentor has not imported the result yet.
 * Pending records deliberately keep `obtainedMarks` and `declaredOn` as null so
 * the UI never displays placeholder or invented marks.
 */
export const assessmentRecords = [
  {
    id: "RA-DSA-001",
    name: "DSA Round — Arrays & Linked Lists",
    category: "dsa",
    focus: "Data Structures and Algorithms coding performance",
    mentor: "Dr. Neha Sharma",
    assessmentDate: "12 Nov 2026",
    obtainedMarks: 78,
    totalMarks: 100,
    passingMarks: 40,
    resultImported: true,
    declaredOn: "16 Nov 2026",
    unstopReference: "UNSTOP-DSA-2026-0142",
  },
  {
    id: "RA-DSA-002",
    name: "DSA Round — Trees & Graphs",
    category: "dsa",
    focus: "Data Structures and Algorithms coding performance",
    mentor: "Dr. Neha Sharma",
    assessmentDate: "26 Nov 2026",
    obtainedMarks: 36,
    totalMarks: 100,
    passingMarks: 40,
    resultImported: true,
    declaredOn: "30 Nov 2026",
    unstopReference: "UNSTOP-DSA-2026-0158",
  },
  {
    id: "RA-DOM-001",
    name: "Web Development Domain Exam",
    category: "domain",
    focus: "Front-end fundamentals, APIs and applied web development",
    mentor: "Prof. Rahul Verma",
    assessmentDate: "14 Nov 2026",
    obtainedMarks: 84,
    totalMarks: 100,
    passingMarks: 40,
    resultImported: true,
    declaredOn: "18 Nov 2026",
    unstopReference: "UNSTOP-DOM-2026-0211",
  },
  {
    id: "RA-DOM-002",
    name: "AI/ML Domain Exam",
    category: "domain",
    focus: "Machine learning foundations and practical model evaluation",
    mentor: "Dr. Anita Gupta",
    assessmentDate: "28 Nov 2026",
    obtainedMarks: null,
    totalMarks: 100,
    passingMarks: 40,
    resultImported: false,
    declaredOn: null,
    unstopReference: "UNSTOP-DOM-2026-0226",
  },
  {
    id: "RA-DOM-003",
    name: "UI/UX Domain Exam",
    category: "domain",
    focus: "Design thinking, wireframing and usability evaluation",
    mentor: "Prof. Sandeep Rao",
    assessmentDate: "16 Dec 2026",
    obtainedMarks: null,
    totalMarks: 100,
    passingMarks: 40,
    resultImported: false,
    declaredOn: null,
    unstopReference: "UNSTOP-DOM-2026-0240",
  },
  {
    id: "RA-APT-001",
    name: "Quantitative Aptitude",
    category: "aptitude",
    focus: "Numbers, arithmetic, percentages and data interpretation",
    mentor: "Dr. Pooja Mishra",
    assessmentDate: "08 Nov 2026",
    obtainedMarks: 41,
    totalMarks: 50,
    passingMarks: 20,
    resultImported: true,
    declaredOn: "11 Nov 2026",
    unstopReference: "UNSTOP-APT-2026-0088",
  },
  {
    id: "RA-APT-002",
    name: "Logical Reasoning",
    category: "aptitude",
    focus: "Deductions, puzzles, sequences and analytical reasoning",
    mentor: "Dr. Pooja Mishra",
    assessmentDate: "10 Nov 2026",
    obtainedMarks: null,
    totalMarks: 50,
    passingMarks: 20,
    resultImported: false,
    declaredOn: null,
    unstopReference: "UNSTOP-APT-2026-0094",
  },
  {
    id: "RA-APT-003",
    name: "Verbal Ability Test",
    category: "aptitude",
    focus: "Comprehension, grammar and verbal reasoning",
    mentor: "Dr. Pooja Mishra",
    assessmentDate: "30 Nov 2026",
    obtainedMarks: 17,
    totalMarks: 50,
    passingMarks: 20,
    resultImported: true,
    declaredOn: "03 Dec 2026",
    unstopReference: "UNSTOP-APT-2026-0107",
  },
];

/** A result is only real once the mentor has imported it. */
export const isResultDeclared = (record) =>
  record?.resultImported === true && Number.isFinite(record.obtainedMarks);

/** Passed when obtained marks meet or exceed the passing marks. */
export const getAssessmentStatus = (record) => {
  if (!isResultDeclared(record)) return "Pending";
  return record.obtainedMarks >= record.passingMarks ? "Passed" : "Failed";
};

/** Percentage is derived only for declared results; pending stays null. */
export const getAssessmentPercentage = (record) => {
  if (!isResultDeclared(record) || !record.totalMarks) return null;
  return Math.round((record.obtainedMarks / record.totalMarks) * 1000) / 10;
};

export default {
  resultsSemester,
  unstopAssessmentNotice,
  pendingResultMessage,
  resultCategories,
  resultTones,
  assessmentRecords,
  isResultDeclared,
  getAssessmentStatus,
  getAssessmentPercentage,
};
