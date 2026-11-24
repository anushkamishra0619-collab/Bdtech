import { UserRound } from "lucide-react";
import "./studentsidebar.css";

const StudentSidebar = () => (
  <aside className="student-sidebar">
    <div className="student-sidebar-brand" aria-label="SocietySelect AI">
      <span className="student-sidebar-brand-name">SocietySelect</span>
      <span className="student-sidebar-brand-ai">AI</span>
    </div>
    <nav className="student-sidebar-nav" aria-label="Student navigation">
      <div className="student-sidebar-profile-group">
        <h2 className="student-sidebar-group-heading">PROFILE</h2>
        <a className="student-sidebar-link" href="/student/profile">
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>My Profile</span>
        </a>
      </div>
      <h2 className="student-sidebar-group-heading">RECRUITMENT JOURNEY</h2>
      <h2 className="student-sidebar-group-heading">MY WORK</h2>
      <h2 className="student-sidebar-group-heading">ATTENDANCE</h2>
    </nav>
  </aside>
);

export default StudentSidebar;