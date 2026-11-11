import {
  Users,
  ClipboardCheck,
  FolderKanban,
  CalendarCheck,
  ArrowUpRight,
  Clock3,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import "./MentorDashboard.css";

const stats = [
  { title: "Assigned Students", value: "32", detail: "Across 4 societies", icon: Users },
  { title: "Pending Reviews", value: "08", detail: "Awaiting evaluation", icon: ClipboardCheck },
  { title: "Active Projects", value: "12", detail: "Currently in progress", icon: FolderKanban },
  { title: "Attendance Rate", value: "94%", detail: "This month", icon: CalendarCheck },
];

const students = [
  { name: "Aarav Sharma", society: "Coding Club", progress: 85, status: "Excellent" },
  { name: "Priya Verma", society: "AI & ML Society", progress: 72, status: "Good" },
  { name: "Rohan Gupta", society: "Web Development", progress: 58, status: "In Progress" },
  { name: "Ananya Singh", society: "Design Society", progress: 91, status: "Excellent" },
];

const reviews = [
  { name: "Aarav Sharma", project: "Portfolio Website", type: "Project Review", date: "Today, 10:30 AM", status: "Pending" },
  { name: "Priya Verma", project: "AI Chatbot", type: "Task Submission", date: "Yesterday", status: "Pending" },
  { name: "Rohan Gupta", project: "E-commerce Application", type: "Project Review", date: "Yesterday", status: "In Review" },
];

const sessions = [
  { time: "10:00 AM", title: "Student Progress Review", student: "Aarav Sharma" },
  { time: "12:30 PM", title: "Project Discussion", student: "Priya Verma" },
  { time: "03:00 PM", title: "Technical Guidance", student: "Rohan Gupta" },
];

function MentorDashboard() {
  return (
    <div className="mentor-page">
      <div className="mentor-container">

        {/* WELCOME */}
        <section className="mentor-welcome">
          <div>
            <span className="mentor-eyebrow">YOUR MENTORING SPACE</span>
            <h1>
              Guide their journey.
              <br />
              <em>Inspire their growth.</em>
            </h1>
            <p>
              Every student has potential waiting to be discovered.
              Help them turn their ideas, skills and ambitions into
              meaningful achievements.
            </p>
            <Link to="/mentor/students" className="mentor-primary-btn">
              Explore Students <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mentor-hero-image">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&auto=format&fit=crop&q=85"
              alt="Students collaborating"
            />
            <div className="mentor-floating-note">
              <span>✳</span>
              <div>
                <strong>Growth begins with guidance.</strong>
                <small>Make every interaction count.</small>
              </div>
            </div>
          </div>
        </section>
        <section className="mentor-stats-section">
          <div className="mentor-section-heading">
            <span className="mentor-eyebrow">YOUR OVERVIEW</span>
            <h2>A little progress, every day.</h2>
          </div>

          <div className="mentor-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="mentor-stat-card" key={stat.title}>
                  <div className="mentor-stat-icon">
                    <Icon size={22} />
                  </div>
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                  <span>{stat.detail}</span>
                </article>
              );
            })}
          </div>
        </section>
        <section className="mentor-students-section">
          <div className="mentor-section-heading">
            <span className="mentor-eyebrow">STUDENT DEVELOPMENT</span>
            <h2>Every achievement matters.</h2>
            <p>Follow the progress of students assigned to you.</p>
          </div>

          <div className="mentor-student-grid">
            {students.map((student, index) => (
              <article className="mentor-student-card" key={student.name}>
                <div className="mentor-student-top">
                  <div className="mentor-avatar">
                    {student.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <span className="mentor-student-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{student.name}</h3>
                <p>{student.society}</p>

                <div className="mentor-progress-info">
                  <span>Overall progress</span>
                  <strong>{student.progress}%</strong>
                </div>

                <div className="mentor-progress-track">
                  <div
                    className="mentor-progress-fill"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>

                <span className="mentor-performance">
                  {student.status}
                </span>

                <Link to="/mentor/students" className="mentor-card-link">
                  View Profile <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="mentor-feature-section">
          <div className="mentor-feature-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=85"
              alt="Students working together"
            />
          </div>

          <div className="mentor-feature-content">
            <span className="mentor-eyebrow mentor-light-eyebrow">
              YOUR DAILY RESPONSIBILITIES
            </span>
            <h2>Small steps. Meaningful growth.</h2>

            <div className="mentor-feature-list">
              <div>
                <span>→</span>
                <p><strong>Guide students</strong> through their learning and probation journey.</p>
              </div>
              <div>
                <span>→</span>
                <p><strong>Review projects</strong> and provide constructive feedback.</p>
              </div>
              <div>
                <span>→</span>
                <p><strong>Assign tasks</strong> that challenge and develop practical skills.</p>
              </div>
              <div>
                <span>→</span>
                <p><strong>Track performance</strong> and encourage consistent improvement.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mentor-work-section">
          <div className="mentor-section-heading">
            <span className="mentor-eyebrow">YOUR WORKSPACE</span>
            <h2>Stay connected. Stay organized.</h2>
          </div>

          <div className="mentor-work-grid">

            <div className="mentor-work-card">
              <div className="mentor-work-heading">
                <div>
                  <h3>Pending Reviews</h3>
                  <p>Submissions awaiting your feedback</p>
                </div>
                <ClipboardCheck size={22} />
              </div>

              {reviews.map((review) => (
                <div className="mentor-review-item" key={review.name}>
                  <div className="mentor-review-icon">
                    <FolderKanban size={19} />
                  </div>

                  <div className="mentor-review-details">
                    <strong>{review.project}</strong>
                    <span>{review.name} · {review.type}</span>
                    <small>{review.date}</small>
                  </div>

                  <span className="mentor-review-status">
                    {review.status}
                  </span>
                </div>
              ))}

              <Link to="/mentor/projects" className="mentor-bottom-link">
                Review All Submissions <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mentor-work-card">
              <div className="mentor-work-heading">
                <div>
                  <h3>Today's Schedule</h3>
                  <p>Your upcoming mentoring sessions</p>
                </div>
                <Clock3 size={22} />
              </div>

              {sessions.map((session) => (
                <div className="mentor-session-item" key={session.time}>
                  <span className="mentor-session-time">
                    {session.time}
                  </span>
                  <div>
                    <strong>{session.title}</strong>
                    <p>{session.student}</p>
                  </div>
                </div>
              ))}

              <Link to="/mentor/students" className="mentor-bottom-link">
                View Schedule <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mentor-quick-section">
          <div className="mentor-section-heading">
            <span className="mentor-eyebrow">TAKE ACTION</span>
            <h2>What would you like to do today?</h2>
          </div>

          <div className="mentor-action-grid">
            <Link to="/mentor/tasks" className="mentor-action-card">
              <ClipboardCheck size={24} />
              <h3>Assign a Task</h3>
              <p>Create practical tasks for your students.</p>
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/mentor/projects" className="mentor-action-card">
              <FolderKanban size={24} />
              <h3>Review Projects</h3>
              <p>Evaluate submissions and share feedback.</p>
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/mentor/attendance" className="mentor-action-card">
              <CalendarCheck size={24} />
              <h3>Mark Attendance</h3>
              <p>Maintain student attendance records.</p>
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/mentor/feedback" className="mentor-action-card">
              <MessageCircle size={24} />
              <h3>Give Feedback</h3>
              <p>Help students identify their strengths.</p>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
        <section className="mentor-closing-section">
          <span className="mentor-eyebrow mentor-light-eyebrow">
            THE IMPACT OF MENTORSHIP
          </span>
          <h2>
            Great mentors don't just teach.
            <br />
            They help others <em>believe.</em>
          </h2>
          <p>
            Every suggestion, every review and every opportunity
            to learn can make a difference.
          </p>
        </section>

        <footer className="mentor-footer">
          <strong>Society<span>Select</span> AI</strong>
          <p>Guiding potential. Inspiring possibilities.</p>
          <small>© 2026 SocietySelect. All rights reserved.</small>
        </footer>

      </div>
    </div>
  );
}

export default MentorDashboard;
