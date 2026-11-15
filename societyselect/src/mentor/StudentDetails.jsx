import { useEffect, useState } from "react";
import {ArrowLeft,Mail,Phone,GraduationCap,Code2,Globe,Award,FolderKanban,UserRound,ExternalLink,Sparkles,} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import MentorSidebar from "../Components/MentorSidebar";
import { studentData } from "./AssignedStudents";
import { navigateTo } from "../utils/navigation";
import "./StudentDetails.css";

function StudentDetails() {
  const getStudentIdFromUrl = () => {
    const hash = window.location.hash || "";
    const hashMatch = hash.match(/students\/(\d+)/i);
    if (hashMatch) return Number(hashMatch[1]);

    const path = window.location.pathname || "";
    const pathMatch = path.match(/students\/(\d+)/i);
    if (pathMatch) return Number(pathMatch[1]);

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("id")) return Number(searchParams.get("id"));
    if (searchParams.get("studentId")) return Number(searchParams.get("studentId"));

    const segments = path.split("/").filter(Boolean);
    const last = Number(segments[segments.length - 1]);
    if (!isNaN(last) && last > 0) return last;

    return 1;
  };

  const [studentId, setStudentId] = useState(getStudentIdFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      setStudentId(getStudentIdFromUrl());
    };
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, []);

  const student = studentData.find((item) => item.id === studentId) || studentData[0];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const showValue = (value) => {
    return value && String(value).trim()
      ? value
      : "Not added yet";
  };

  const renderTags = (items) => {
    return items && items.length > 0 ? (
      <div className="student-tags">
        {items.map((item, index) => (
          <span className="student-tag" key={index}>
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="student-empty-text">Not added yet</p>
    );
  };

  if (!student) {
    return (
      <div className="student-details-layout">
        <MentorSidebar />

        <main className="student-details-page">
          <button
            type="button"
            className="student-back-btn"
            onClick={() => navigateTo("/mentor/students")}
          >
            <ArrowLeft size={17} />
            Back to Students
          </button>

          <div className="student-not-found">
            <UserRound size={40} />
            <h2>Student not found</h2>
            <p>The requested student profile does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const skillCategories = Object.entries(student.skills || {});

  return (
    <div className="student-details-layout">
      <MentorSidebar />
      <main className="student-details-page">
        <div className="student-details-topbar">
          <button
            type="button"
            className="student-back-btn"
            onClick={() => navigateTo("/mentor/students")}
          >
            <ArrowLeft size={17} />
            Back to Students
          </button>

          <span className="student-profile-label">
            STUDENT PROFILE
          </span>
        </div>

        <div className="student-resume">

          <aside className="student-resume-sidebar">
            <div className="student-profile-image">
              {student.profilePicture ? (
                <img
                  src={student.profilePicture}
                  alt={student.name}
                />
              ) : (
                <span>{getInitials(student.name)}</span>
              )}
            </div>

            <div className="student-profile-name">
              <span className="student-small-label">
                STUDENT PROFILE
              </span>

              <h1>{student.name}</h1>

              <span
                className={`student-status ${student.status.toLowerCase()}`}
              >
                {student.status}
              </span>
            </div>
            <section className="student-side-section">
              <h3>PERSONAL INFORMATION</h3>

              <div className="student-contact-item">
                <Mail size={16} />
                <span>{student.email}</span>
              </div>

              <div className="student-contact-item">
                <Phone size={16} />
                <span>{showValue(student.phone)}</span>
              </div>

              <div className="student-contact-item">
                <GraduationCap size={16} />
                <span>{student.society}</span>
              </div>
            </section>

            {/* Technical Skills */}
            <section className="student-side-section">
              <h3>TECHNICAL SKILLS</h3>

              <div className="student-skill-category">
                <span>Programming Languages</span>
                {renderTags(student.programmingLanguages)}
              </div>

              <div className="student-skill-category">
                <span>Frameworks</span>
                {renderTags(student.frameworks)}
              </div>

              <div className="student-skill-category">
                <span>Technologies</span>
                {renderTags(student.technologies)}
              </div>
            </section>

            {/* Social Links */}
            <section className="student-side-section">
              <h3>SOCIAL LINKS</h3>

              <div className="student-social-item">
                <FaGithub size={16} />
                {student.github ? (
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ExternalLink size={12} />
                  </a>
                ) : (
                  <span>GitHub: Not added</span>
                )}
              </div>

              <div className="student-social-item">
                <FaLinkedin size={16} />
                {student.linkedin ? (
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn <ExternalLink size={12} />
                  </a>
                ) : (
                  <span>LinkedIn: Not added</span>
                )}
              </div>

              <div className="student-social-item">
                <Globe size={16} />
                {student.portfolio ? (
                  <a
                    href={student.portfolio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Portfolio <ExternalLink size={12} />
                  </a>
                ) : (
                  <span>Portfolio: Not added</span>
                )}
              </div>
            </section>
          </aside>

          {/* RIGHT PROFILE COLUMN */}
          <div className="student-resume-content">

            {/* About */}
            <section className="student-content-section student-about-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <Sparkles size={17} />
                </span>
                <h2>ABOUT STUDENT</h2>
              </div>

              <p>
                This is the student profile of {student.name}.
                Explore their academic background, technical
                knowledge, skills, projects, and achievements.
              </p>
            </section>

            <section className="student-content-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <GraduationCap size={17} />
                </span>
                <h2>ACADEMIC INFORMATION</h2>
              </div>

              <div className="student-timeline-item">
                <div className="student-timeline-date">
                  COLLEGE
                </div>

                <div className="student-timeline-description">
                  <h3>{showValue(student.college)}</h3>
                  <p>{showValue(student.department)}</p>
                  <span>Year: {showValue(student.year)}</span>
                  <span>
                    Roll Number: {showValue(student.rollNumber)}
                  </span>
                </div>
              </div>
            </section>

            {/* Technical Expertise */}
            <section className="student-content-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <Code2 size={17} />
                </span>
                <h2>TECHNICAL EXPERTISE</h2>
              </div>

              <div className="student-detail-block">
                <h3>Programming Languages</h3>
                {renderTags(student.programmingLanguages)}
              </div>

              <div className="student-detail-block">
                <h3>Frameworks</h3>
                {renderTags(student.frameworks)}
              </div>

              <div className="student-detail-block">
                <h3>Technologies</h3>
                {renderTags(student.technologies)}
              </div>
            </section>

            {/* Skills */}
            <section className="student-content-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <Sparkles size={17} />
                </span>
                <h2>SKILLS</h2>
              </div>

              {skillCategories.map(([category, items]) => (
                <div className="student-detail-block" key={category}>
                  <h3>{category.toUpperCase()}</h3>
                  {renderTags(items)}
                </div>
              ))}
            </section>

            {/* Projects */}
            <section className="student-content-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <FolderKanban size={17} />
                </span>
                <h2>PROJECTS</h2>
              </div>

              {student.projects.length > 0 ? (
                student.projects.map((project, index) => (
                  <div className="student-project-item" key={index}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    {renderTags(project.technologies || [])}
                  </div>
                ))
              ) : (
                <p className="student-empty-text">
                  No projects added yet.
                </p>
              )}
            </section>

            {/* Achievements */}
            <section className="student-content-section">
              <div className="student-section-heading">
                <span className="student-section-icon">
                  <Award size={17} />
                </span>
                <h2>ACHIEVEMENTS</h2>
              </div>

              {student.achievements.length > 0 ? (
                <div className="student-achievement-list">
                  {student.achievements.map((achievement, index) => (
                    <div
                      className="student-achievement-item"
                      key={index}
                    >
                      <Award size={17} />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="student-empty-text">
                  No achievements added yet.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDetails;
