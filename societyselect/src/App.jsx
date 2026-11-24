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
import StudentLayout from "./layouts/StudentLayout";
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
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="application" element={<SocietyApplication />} />
          <Route path="application-tracking" element={<ApplicationTracking />} />
          <Route path="online-examination" element={<OnlineExamination />} />
          <Route path="examination-results" element={<ExaminationResults />} />
          <Route path="interview" element={<InterviewDetails />} />
          <Route path="probation" element={<ProbationDashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="project-submission" element={<ProjectSubmission />} />
          <Route path="github-analytics" element={<GitHubAnalytics />} />
          <Route path="performance" element={<MyPerformance />} />
          <Route path="ai-recommendations" element={<AIRecommendations />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="attendance-calendar" element={<AttendanceCalendar />} />
          <Route path="leave-request" element={<LeaveRequest />} />
        </Route>
        <Route path="*" element={<LegacyRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
