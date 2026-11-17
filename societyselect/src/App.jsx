import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AIRecommendations from "./pages/student/AIRecommendations";
import ApplicationTracking from "./pages/student/ApplicationTracking";
import AttendanceCalendar from "./pages/student/AttendanceCalendar";
import ExaminationResults from "./pages/student/ExaminationResults";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import GitHubAnalytics from "./pages/student/GitHubAnalytics";
import InterviewDetails from "./pages/student/InterviewDetails";
import LandingPage from "./LandingPage.jsx";
import LeaveRequest from "./pages/student/LeaveRequest";
import AssignedStudents from "./mentor/AssignedStudents";
import MentorDashboard from "./mentor/MentorDashboard";
import MentorSocietyManagement from "./mentor/MentorSocietyManagement";
import MyAttendance from "./pages/student/MyAttendance";
import MyPerformance from "./pages/student/MyPerformance";
import MyTasks from "./pages/student/MyTasks";
import Notifications from "./pages/student/Notifications";
import OnlineExamination from "./pages/student/OnlineExamination";
import ProbationDashboard from "./pages/student/ProbationDashboard";
import ProjectSubmission from "./pages/student/ProjectSubmission";
import CreateProject from "./Components/createproject.jsx";
import SocietyApplication from "./pages/student/SocietyApplication";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import Welcome from "./Components/welcome.jsx";

function LegacyRoutes() {
  const getRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path === "/login" || hash === "#login") return "login";
    if (path === "/forgot" || hash === "#forgot") return "forgot";
    if (path === "/mentor" || hash === "#mentor") return "mentor";
    if (path === "/createproject" || hash === "#createproject") {
      return "createproject";
    }
    if (
      path === "/register" ||
      path === "/signup" ||
      hash === "#register" ||
      hash === "#signup"
    ) {
      return "register";
    }

    return "landing";
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleLocationChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  if (route === "login") return <Welcome />;
  if (route === "register") return <Welcome initialMode="signup" />;
  if (route === "forgot") return <ForgotPassword />;
  if (route === "createproject") return <CreateProject />;
  if (route === "mentor") return <MentorDashboard />;
  return <LandingPage />;
}

function RootRoute() {
  const { hash } = useLocation();

  if (hash) return <LegacyRoutes />;

  // TODO: TEMPORARY DEVELOPMENT BYPASS — remove when student authentication is ready.
  return <Navigate to="/student/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LegacyRoutes />} />
        <Route path="/signup" element={<LegacyRoutes />} />
        <Route path="/register" element={<LegacyRoutes />} />
        <Route path="/forgot" element={<LegacyRoutes />} />
        <Route path="/mentor" element={<LegacyRoutes />} />
        <Route path="/mentor/students" element={<AssignedStudents />} />
        <Route path="/mentor/societies" element={<MentorSocietyManagement />} />
        <Route path="/createproject" element={<LegacyRoutes />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/application" element={<SocietyApplication />} />
        <Route path="/student/application-tracking" element={<ApplicationTracking />} />
        <Route path="/student/online-examination" element={<OnlineExamination />} />
        <Route path="/student/examination-results" element={<ExaminationResults />} />
        <Route path="/student/interview" element={<InterviewDetails />} />
        <Route path="/student/probation" element={<ProbationDashboard />} />
        <Route path="/student/tasks" element={<MyTasks />} />
        <Route path="/student/project-submission" element={<ProjectSubmission />} />
        <Route path="/student/github-analytics" element={<GitHubAnalytics />} />
        <Route path="/student/performance" element={<MyPerformance />} />
        <Route path="/student/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/settings" element={<StudentSettings />} />
        <Route path="/student/attendance" element={<MyAttendance />} />
        <Route path="/student/attendance-calendar" element={<AttendanceCalendar />} />
        <Route path="/student/leave-request" element={<LeaveRequest />} />
        <Route path="*" element={<LegacyRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
