
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AIRecommendations from "./pages/student/AIRecommendations";
import ApplicationTracking from "./pages/student/ApplicationTracking";
import AttendanceCalendar from "./pages/student/AttendanceCalendar";
import ExaminationResults from "./pages/student/ExaminationResults";
import GitHubAnalytics from "./pages/student/GitHubAnalytics";
import InterviewDetails from "./pages/student/InterviewDetails";
import LeaveRequest from "./pages/student/LeaveRequest";
import MyAttendance from "./pages/student/MyAttendance";
import MyPerformance from "./pages/student/MyPerformance";
import MyTasks from "./pages/student/MyTasks";
import Notifications from "./pages/student/Notifications";
import OnlineExamination from "./pages/student/OnlineExamination";
import ProbationDashboard from "./pages/student/ProbationDashboard";
import ProjectSubmission from "./pages/student/ProjectSubmission";
import SocietyApplication from "./pages/student/SocietyApplication";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
