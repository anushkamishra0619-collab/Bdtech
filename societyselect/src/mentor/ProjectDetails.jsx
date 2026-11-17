import {ArrowLeft,FolderKanban,Users,CalendarDays,GitBranch,ExternalLink,Globe,} from "lucide-react";
import MentorSidebar from "../Components/MentorSidebar";
import { navigateTo } from "../utils/navigation";
import "./ProjectDetails.css";

function ProjectDetails() {
  const projectId = window.location.pathname.split("/").pop();
  const projects = [
    {
      id: "1",
      title: "College Event Management Website",
      category: "Web Development",
      description:
        "Develop a responsive college event management platform where students can explore upcoming events, register for events, and track their participation. The platform should provide an easy-to-use interface for both students and administrators.",
      startDate: "01 Nov 2026",
      deadline: "30 Nov 2026",
      status: "Submitted",
      technologies: ["React", "CSS"],

      assignedStudents: [
        {
          id: 1,
          name: "Gargi Yadav",
          role: "Frontend Developer",
          github: "https://github.com/",
          deployment: "https://example.com",
        },
        {
          id: 2,
          name: "Paritosh",
          role: "Backend Developer",
          github: "https://github.com/",
          deployment: "https://example.com",
        },
      ],
    },
  ];

  const project = projects.find(
    (item) => item.id === projectId
  );

  if (!project) {
    return (
      <div className="project-details-layout">
        <MentorSidebar />
        <main className="project-details-page">
          <h2>Project not found</h2>
          <button
            className="back-project-btn"
            onClick={() => navigateTo("/mentor/projects")}
          >
            <ArrowLeft size={17} />
            Back to Projects
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="project-details-layout">
      <MentorSidebar />

      <main className="project-details-page">
        <button
          className="back-project-btn"
          onClick={() => navigateTo("/mentor/projects")}
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>
        <div className="project-details-header">
          <div>
            <br/>
            <h1>Project Details</h1>
          </div>
          <span
            className={`details-status ${project.status.toLowerCase().replace(" ", "-")}`}
          >
            {project.status}
          </span>
        </div>
        <section className="details-card">

          <h3 className="details-project-title">
            {project.title}
          </h3>

          <span className="details-category">
            {project.category}
          </span>

          <p className="details-description">
            {project.description}
          </p>

          <div className="details-info-grid">

            <div className="details-info-item">
              <CalendarDays size={18} />
              <div>
                <span>Start Date</span>
                <strong>{project.startDate}</strong>
              </div>
            </div>

            <div className="details-info-item">
              <CalendarDays size={18} />
              <div>
                <span>Deadline</span>
                <strong>{project.deadline}</strong>
              </div>
            </div>

            <div className="details-info-item">
              <Users size={18} />
              <div>
                <span>Assigned Students</span>
                <strong>{project.assignedStudents.length} Students</strong>
              </div>
            </div>

            <div className="details-info-item">
              <FolderKanban size={18} />
              <div>
                <span>Project Status</span>
                <strong>{project.status}</strong>
              </div>
            </div>

          </div>

          <div className="details-technologies">
            <h4>Technologies Used</h4>

            <div className="technology-tags">
              {project.technologies.map((technology) => (
                <span key={technology}>
                  {technology}
                </span>
              ))}
            </div>
          </div>

        </section>

        <section className="details-card">
          <div className="details-card-heading">
            <div>
              <h2>Assigned Students</h2>
            </div>
          </div>

          <div className="assigned-students-table-wrapper">
            <table className="assigned-students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Role</th>
                  <th>GitHub Repository</th>
                  <th>Deployment</th>
                </tr>
              </thead>

              <tbody>
                {project.assignedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="details-student">
                        <div className="student-avatar">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <strong>{student.name}</strong>
                          <span>Project Member</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="student-role">
                        {student.role}
                      </span>
                    </td>

                    <td>
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        className="student-project-link"
                      >
                       <GitBranch size={16} />
                        View Repository
                        <ExternalLink size={13} />
                      </a>
                    </td>

                    <td>
                      <a
                        href={student.deployment}
                        target="_blank"
                        rel="noreferrer"
                        className="student-project-link deployment-link"
                      >
                        <Globe size={16} />
                        Live Project
                        <ExternalLink size={13} />
                      </a>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </section>

      </main>
    </div>
  );
}

export default ProjectDetails;
