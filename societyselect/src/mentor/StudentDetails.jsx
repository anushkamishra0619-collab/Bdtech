import { useEffect, useState } from "react";
import {ArrowLeft,Mail,Phone,GraduationCap,Code2,Globe,Award,FolderKanban,} from "lucide-react";
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

    if (searchParams.get("id")) {
      return Number(searchParams.get("id"));
    }

    if (searchParams.get("studentId")) {
      return Number(searchParams.get("studentId"));
    }

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

  const student =
    studentData.find((item) => item.id === studentId) || studentData[0];

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
            <h2>Student not found</h2>
            <p>The requested student profile does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const allSkills = [
    ...(student.programmingLanguages || []),
    ...(student.frameworks || []),
    ...(student.technologies || []),
    ...Object.values(student.skills || {}).flat(),
  ];

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

        <div className="student-social-profile-card">
          <div className="student-social-card-header">
            <div className="student-social-avatar">
              {student.profilePicture ? (
                <img
                  src={student.profilePicture}
                  alt={student.name}
                />
              ) : (
                <span>{getInitials(student.name)}</span>
              )}
            </div>

            <div className="student-social-user-info">
              <h3>{student.name}</h3>
              <p>
                {showValue(student.domain || student.society || student.department)}
              </p>
            </div>
          </div>
          <div className="student-social-description">

            <div className="social-description-heading">
              <h3>About Student</h3>
            </div>
            <div className="social-detail-item">
              <Mail size={16} />
              <span>{showValue(student.email)}</span>
            </div>

            <div className="social-detail-item">
              <Phone size={16} />
              <span>{showValue(student.phone)}</span>
            </div>
            <div className="social-detail-item">
              <Code2 size={16} />
              <span>
                Department: {showValue(student.department)}
              </span>
            </div>

            <div className="social-detail-item">
              <GraduationCap size={16} />
              <span>
                Year: {showValue(student.year)} | Roll Number: {showValue(student.rollNumber)}
              </span>
            </div>

            <div className="social-description-divider"></div>
            <div className="social-extra-details">
              <h4>
                <Code2 size={16} />
                Technical Skills
              </h4>

              <div className="social-detail-tags">
                {allSkills.length > 0 ? (
                  allSkills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))
                ) : (
                  <span>Not added yet</span>
                )}
              </div>
            </div>

            <div className="social-description-divider"></div>

            <div className="social-extra-details">
              <h4>
                <FolderKanban size={16} />
                Projects
              </h4>

              {student.projects?.length > 0 ? (
                student.projects.map((project, index) => (
                  <div className="social-project-item" key={index}>
                    <strong>{project.name}</strong>
                    <p>{project.description}</p>

                    {project.technologies?.length > 0 ? (
                      <div className="social-detail-tags">
                        {project.technologies.map((tech, i) => (
                          <span key={i}>{tech}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>No projects added yet.</p>
              )}
            </div>

            <div className="social-description-divider"></div>
            <div className="social-extra-details">
              <h4>
                <Award size={16} />
                Achievements
              </h4>

              {student.achievements?.length > 0 ? (
                student.achievements.map((achievement, index) => (
                  <div className="social-achievement-item" key={index}>
                    <Award size={15} />
                    <span>{achievement}</span>
                  </div>
                ))
              ) : (
                <p>No achievements added yet.</p>
              )}
            </div>

          </div>
          <div className="student-social-links">

            {student.github ? (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            ) : null}

            {student.linkedin ? (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            ) : null}

            {student.portfolio ? (
              <a
                href={student.portfolio}
                target="_blank"
                rel="noreferrer"
                title="Portfolio"
                aria-label="Portfolio"
              >
                <Globe />
              </a>
            ) : null}

          </div>

        </div>

      </main>
    </div>
  );
}

export default StudentDetails;
