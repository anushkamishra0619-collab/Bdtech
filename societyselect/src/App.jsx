import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage.jsx";
import Welcome from "./Components/welcome.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import Interviewpage from "./Components/Interviewpage.jsx";
import MentorDashboard from "./mentor/MentorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import SocietyApplication from "./pages/student/SocietyApplication.jsx";
import ApplicationTracking from "./pages/student/ApplicationTracking.jsx";
import InterviewDetails from "./pages/student/InterviewDetails.jsx";
import MyTasks from "./pages/student/MyTasks.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import StudentSettings from "./pages/student/StudentSettings.jsx";
import AssignedStudents from "./mentor/AssignedStudents";
import StudentDetails from "./mentor/StudentDetails";
import ProjectReview from "./mentor/ProjectReview";
import ProjectDetails from "./mentor/ProjectDetails";
import ErrorPage from "./Components/ErrorPage.jsx";

function App() {
  const getRoute = () => {
    const rawPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const rawHash = (window.location.hash || "").replace(/^#\/?/, "").replace(/\/+$/, "");

    const path = rawPath.toLowerCase();
    const hash = rawHash.toLowerCase();

    if (path === "/login" || hash === "login") return "login";
    if (path === "/forgot" || hash === "forgot") return "forgot";
    if (
      path === "/interviewpage" ||
      path === "/mentor/interviews" ||
      hash === "interviewpage" ||
      hash === "mentor/interviews"
    ) {
      return "interviewpage";
    }

    // Student Details route: /mentor/students/:id or #mentor/students/:id
    if (
      /^\/mentor\/students\/\d+/i.test(path) ||
      /^mentor\/students\/\d+/i.test(hash) ||
      (path.startsWith("/mentor/students/") && path.length > "/mentor/students/".length) ||
      (hash.startsWith("mentor/students/") && hash.length > "mentor/students/".length)
    ) {
      return "studentdetails";
    }

    // Assigned Students list route: /mentor/students or #mentor/students
    if (
      path === "/mentor/students" ||
      hash === "mentor/students"
    ) {
      return "assignedstudents";
    }

    if (path === "/mentor" || hash === "mentor") return "mentor";

    if (
      path === "/student" ||
      path === "/student/dashboard" ||
      hash === "student" ||
      hash === "student/dashboard"
    ) {
      return "student";
    }

    if (path === "/student/apply" || path === "/student/application") {
      return "studentApplication";
    }
    if (
      path === "/student/application-tracking" ||
      hash === "student/application-tracking"
    ) {
      return "applicationTracking";
    }
    if (path === "/student/interview" || hash === "student/interview") {
      return "studentInterview";
    }
    if (path === "/student/tasks" || hash === "student/tasks") {
      return "studentTasks";
    }
    if (path === "/student/profile" || hash === "student/profile") {
      return "studentProfile";
    }
    if (path === "/student/settings" || hash === "student/settings") {
      return "studentSettings";
    }

    if (path === "/createproject" || hash === "createproject") {
      return "createproject";
    }
    if (path === "/mentor/projects") {
      return "projectReview";
    }

    if (path.startsWith("/mentor/project-review/")) {
      return "projectDetails";
    }
    if (
      path === "/register" ||
      hash === "register" ||
      hash === "signup"
    ) {
      return "register";
    }

    if (
      path === "/error" ||
      path === "/500" ||
      hash === "error" ||
      hash === "500"
    ) {
      return "serverError";
    }

    if (path === "/" && !rawHash) return "landing";
    if (rawHash === "" && path !== "/") return "error";

    if (rawHash) return "error";
    return "landing";
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  if (route === "login") return <Welcome />;

  if (route === "register") {
    return <Welcome initialMode="signup" />;
  }

  if (route === "forgot") return <ForgotPassword />;
  if (route === "interviewpage") return <Interviewpage />;
  if (route === "assigned-students") return <AssignedStudents />;
  if (route === "mentor") return <MentorDashboard />;
  if (route === "assignedstudents") return <AssignedStudents />;
  if (route === "studentdetails") return <StudentDetails />;
  if (route === "student") return <StudentDashboard />;
  if (route === "studentApplication") return <SocietyApplication />;
  if (route === "applicationTracking") return <ApplicationTracking />;
  if (route === "studentInterview") return <InterviewDetails />;
  if (route === "studentTasks") return <MyTasks />;
  if (route === "studentProfile") return <StudentProfile />;
  if (route === "studentSettings") return <StudentSettings />;
  if (route === "projectReview") return <ProjectReview />;
  if (route === "projectDetails") return <ProjectDetails />;
  if (route === "serverError") {
    return (
      <ErrorPage
        code="500"
        title="Something went wrong"
        message="An unexpected error occurred. Please retry or return to the home page."
      />
    );
  }
  if (route === "error") return <ErrorPage />;
  return <LandingPage />;
}

export default App;
