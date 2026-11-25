import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/studentsidebar";
import "./StudentLayout.css";

const StudentLayout = () => (
  <div className="student-layout">
    <StudentSidebar />
    <div className="student-layout-content">
      <Outlet />
    </div>
  </div>
);

export default StudentLayout;
