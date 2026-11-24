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
        <a className="student-sidebar-link" href="/student/profile">
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Profile</span>
        </a>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">RECRUITMENT JOURNEY</h2>
        <a className="student-sidebar-link" href="/student/application-tracking">
          <ClipboardList size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Application Tracking</span>
        </a>
        <a className="student-sidebar-link" href="/student/online-examination">
          <Monitor size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Online Examination</span>
        </a>
        <a className="student-sidebar-link" href="/student/examination-results">
          <FileCheck size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Examination Results</span>
        </a>
        <a className="student-sidebar-link" href="/student/interview">
          <CalendarDays size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Interview Details</span>
        </a>
        <a className="student-sidebar-link" href="/student/probation">
          <ChartNoAxesCombined size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Probation Dashboard</span>
        </a>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">MY WORK</h2>
        <a className="student-sidebar-link" href="/student/tasks">
          <ListTodo size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Tasks</span>
        </a>
        <a className="student-sidebar-link" href="/student/project-submission">
          <FileUp size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Project Submission</span>
        </a>
        <a className="student-sidebar-link" href="/student/ai-recommendations">
          <Lightbulb size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>AI Recommendations</span>
        </a>
      </div>
      <div className="student-sidebar-group">
        <h2 className="student-sidebar-group-heading">ATTENDANCE</h2>
        <a className="student-sidebar-link" href="/student/attendance">
          <CalendarCheck size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Attendance</span>
        </a>
        <a className="student-sidebar-link" href="/student/attendance-calendar">
          <CalendarDays size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Attendance Calendar</span>
        </a>
        <a className="student-sidebar-link" href="/student/leave-request">
          <CalendarClock size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Leave Request</span>
        </a>
      </div>
    </nav>
  </aside>
);

export default StudentSidebar;