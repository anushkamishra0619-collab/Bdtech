import "./studentsidebar.css";

const StudentSidebar = () => (
  <aside className="student-sidebar">
    <div className="student-sidebar-brand" aria-label="SocietySelect AI">
      <span className="student-sidebar-brand-name">SocietySelect</span>
      <span className="student-sidebar-brand-ai">AI</span>
    </div>
    <nav className="student-sidebar-nav" aria-label="Student navigation">
      <h2 className="student-sidebar-group-heading">PROFILE</h2>
      <h2 className="student-sidebar-group-heading">RECRUITMENT JOURNEY</h2>
      <h2 className="student-sidebar-group-heading">MY WORK</h2>
      <h2 className="student-sidebar-group-heading">ATTENDANCE</h2>
    </nav>
  </aside>
);

export default StudentSidebar;