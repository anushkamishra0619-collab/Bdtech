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
  Monitor,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./studentsidebar.css";

const StudentSidebar = () => (
  <aside className="student-sidebar">
    <div className="student-sidebar-brand" aria-label="SocietySelect AI">
      <span className="student-sidebar-brand-name">SocietySelect</span>
      <span className="student-sidebar-brand-ai">AI</span>
    </div>
    <nav className="student-sidebar-nav" aria-label="Student navigation">
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">PROFILE</h2>
        <NavLink
          className={({ isActive }) =>
            `student-sidebar-link${isActive ? " active" : ""}`
          }
          end
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
          to="/student/leave-request"
        >
          <CalendarClock size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Leave Request</span>
        </NavLink>
      </div>
    </nav>
  </aside>
);

export default StudentSidebar;