import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  FileCheck,
  FileUp,
  Lightbulb,
  ListTodo,
  LogOut,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./studentsidebar.css";

const StudentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogoutDialogOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsLogoutDialogOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isLogoutDialogOpen]);

  return (
    <aside className={`student-sidebar${isCollapsed ? " is-collapsed" : ""}`}>
      <div className="student-sidebar-header">
        <div className="student-sidebar-brand" aria-label="SocietySelect AI">
          <span className="student-sidebar-brand-name">SocietySelect</span>
          <span className="student-sidebar-brand-ai">AI</span>
        </div>
        <button
          className="student-sidebar-toggle"
          type="button"
          aria-label={isCollapsed ? "Expand student sidebar" : "Collapse student sidebar"}
          aria-expanded={!isCollapsed}
          aria-controls="student-sidebar-navigation"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} strokeWidth={1.7} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={18} strokeWidth={1.7} aria-hidden="true" />
          )}
        </button>
      </div>
      <nav
        id="student-sidebar-navigation"
        className="student-sidebar-nav"
        aria-label="Student navigation"
      >
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">PROFILE</h2>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="My Profile"
          title={isCollapsed ? "My Profile" : undefined}
          to="/student/profile"
        >
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Profile</span>
        </NavLink>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">RECRUITMENT JOURNEY</h2>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Application Tracking"
          title={isCollapsed ? "Application Tracking" : undefined}
          to="/student/application-tracking"
        >
          <ClipboardList size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Application Tracking</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Online Examination"
          title={isCollapsed ? "Online Examination" : undefined}
          to="/student/online-examination"
        >
          <Monitor size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Online Examination</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Examination Results"
          title={isCollapsed ? "Examination Results" : undefined}
          to="/student/examination-results"
        >
          <FileCheck size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Examination Results</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Interview Details"
          title={isCollapsed ? "Interview Details" : undefined}
          to="/student/interview"
        >
          <CalendarDays size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Interview Details</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Probation Dashboard"
          title={isCollapsed ? "Probation Dashboard" : undefined}
          to="/student/probation"
        >
          <ChartNoAxesCombined size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Probation Dashboard</span>
        </NavLink>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">MY WORK</h2>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="My Tasks"
          title={isCollapsed ? "My Tasks" : undefined}
          to="/student/tasks"
        >
          <ListTodo size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Tasks</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Project Submission"
          title={isCollapsed ? "Project Submission" : undefined}
          to="/student/project-submission"
        >
          <FileUp size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Project Submission</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="AI Recommendations"
          title={isCollapsed ? "AI Recommendations" : undefined}
          to="/student/ai-recommendations"
        >
          <Lightbulb size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>AI Recommendations</span>
        </NavLink>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">ATTENDANCE</h2>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="My Attendance"
          title={isCollapsed ? "My Attendance" : undefined}
          to="/student/attendance"
        >
          <CalendarCheck size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Attendance</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Attendance Calendar"
          title={isCollapsed ? "Attendance Calendar" : undefined}
          to="/student/attendance-calendar"
        >
          <CalendarDays size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Attendance Calendar</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
          aria-label="Leave Request"
          title={isCollapsed ? "Leave Request" : undefined}
          to="/student/leave-request"
        >
          <CalendarClock size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Leave Request</span>
        </NavLink>
      </div>
    </nav>
      <button
        className="student-sidebar-logout"
        type="button"
        aria-label="Logout"
        title={isCollapsed ? "Logout" : undefined}
        onClick={() => setIsLogoutDialogOpen(true)}
      >
        <LogOut size={18} strokeWidth={1.7} aria-hidden="true" />
        <span>Logout</span>
      </button>
      {isLogoutDialogOpen && (
        <div className="student-sidebar-logout-overlay">
          <section
            className="student-sidebar-logout-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="student-logout-title"
            aria-describedby="student-logout-description"
            tabIndex={-1}
          >
          <h2 id="student-logout-title">Log out?</h2>
          <p id="student-logout-description">
            Are you sure you want to log out of SocietySelect AI?
          </p>
          <div className="student-sidebar-logout-actions">
            <button
              className="student-sidebar-logout-cancel"
              type="button"
              autoFocus
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="student-sidebar-logout-confirm"
              type="button"
              onClick={() => navigate("/login")}
            >
              Confirm Logout
            </button>
          </div>
          </section>
        </div>
      )}
    </aside>
  );
};

export default StudentSidebar;