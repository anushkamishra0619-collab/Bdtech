import { useMemo, useState } from "react";
import {Users,Search,Eye,MessageCircle,SlidersHorizontal,Mail,GraduationCap,} from "lucide-react";

import MentorSidebar from "../Components/MentorSidebar";
import { navigateTo } from "../utils/navigation";
import "./AssignedStudents.css";

export const studentData = [
  {
    id: 1,
    name: "Gargi Yadav",
    society: "A Society",
    email: "gargi2510091@akgec.ac.in",
    status: "Active",
    phone: "+91 8737009351",
    profilePicture: "",
    college: "Ajay kumar Garg Engineering College, Ghaziabad",
    department: "Computer Science & Engineering",
    year: "2nd Year (Batch 2025-2029)",
    rollNumber: "2500270100076",
    programmingLanguages: ["JavaScript","Java", "C"],
    frameworks: ["React.js","Tailwind CSS"],
    technologies: ["Git"],
    skills: {
      frontend: ["React.js", "Tailwind CSS", "HTML5/CSS3", "Redux Toolkit"],
      other: ["Git & GitHub", "Vercel",],
    },
    github: "https://github.com/gargiyadav",
    linkedin: "https://linkedin.com/in/gargiyadav",
    portfolio: "https://gargiyadav.dev",
    projects: [
      {
        name: "Society Recruitment Portal",
        description:"Full-stack web application automating candidate applications, online quiz evaluations, and mentor review workflows with transparent scoring.",
        technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS"],
      },
    ],
    achievements: [
      "Solved 100+ algorithmic problems across LeetCode & Codeforces",
    ],
  }
];

function AssignedStudents() {
  const [students] = useState(studentData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.society.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        (student.department &&
          student.department.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const handleViewProfile = (student) => {
    navigateTo(`/mentor/students/${student.id}`);
  };

  const handleMessage = (e, student) => {
    e.stopPropagation();
    alert(`Opening conversation with ${student.name}`);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="assigned-page">
      <MentorSidebar />

      <main className="assigned-main">
        <section className="assigned-content">
          <div className="assigned-heading">
            <div>
              <h1>Assigned Students</h1>
              <p>
                Keep track of your students, monitor their progress,
                and guide them towards success.
              </p>
            </div>

            <div className="assigned-heading-icon">
              <Users size={30} />
            </div>
          </div>

          <section className="assigned-student-section">
            <div className="assigned-toolbar">
              <div className="assigned-search">
                <Search size={19} />
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="assigned-filter">
                <SlidersHorizontal size={17} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="assigned-student-grid">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <article
                    className="assigned-student-card"
                    key={student.id}
                    onClick={() => handleViewProfile(student)}
                    style={{ cursor: "pointer" }}
                  >

                    <div className="assigned-student-info">
                      <h3>{student.name}</h3>
                    </div>

                    <div className="assigned-card-actions">
                      <button
                        type="button"
                        className="assigned-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(student);
                        }}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="assigned-message-btn"
                        onClick={(e) => handleMessage(e, student)}
                        aria-label={`Message ${student.name}`}
                      >
                        <MessageCircle size={17} />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="assigned-empty-state">
                  <Users size={34} />
                  <h3>No students found</h3>
                  <p>Try adjusting your search or status filter.</p>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default AssignedStudents;
