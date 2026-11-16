import {Plus,Search,FolderKanban,Clock,CheckCircle2,FileText,CalendarDays,Users,Eye,} from "lucide-react";
import MentorSidebar from "../Components/MentorSidebar";
import { navigateTo } from "../utils/navigation";
import "./ProjectReview.css";
function ProjectReview() {
  const projects = [
    {
      id: 1,
      title: "College Event Management Website",
      category: "Web Development",
      students: "Team A",
      deadline: "30 Nov 2026",
      status: "Submitted",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Submitted") return "submitted";
    if (status === "Under Review") return "review";
    return "active";
  };

  return (
    <div className="project-review-layout">
      <MentorSidebar />
      <main className="project-review-page">
        <div className="project-page-header">
          <div>
            <h1>Project Review</h1>
          </div>
          <button
            className="create-project-btn"
            onClick={() => navigateTo("/mentor/create-project")}
          >
            <Plus size={19} />
            Create New Project
          </button>
        </div>
        <section className="project-list-section">
          <div className="project-list-heading">
            <div>
              <h2>All Projects</h2>
            </div>
          </div>

          <div className="project-table-wrapper">
            <table className="project-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-name-cell">
                        <div className="project-row-icon">
                          <FolderKanban size={19} />
                        </div>
                        <div>
                          <strong>{project.title}</strong>
                          <span>{project.category}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="project-student-cell">
                        <Users size={16} />
                        {project.students}
                      </div>
                    </td>

                    <td>
                      <div className="project-deadline">
                        <CalendarDays size={15} />
                        {project.deadline}
                      </div>
                    </td>

                    <td>
                      <span className={`project-status ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="project-review-action"
                        onClick={() => navigateTo(`/mentor/project-review/${project.id}`)}
                      >
                        <Eye size={17} />
                        View
                      </button>
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

export default ProjectReview;