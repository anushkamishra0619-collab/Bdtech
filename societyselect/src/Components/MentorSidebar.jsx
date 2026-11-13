import {GraduationCap,LayoutDashboard,Users,ClipboardCheck,FolderKanban,CalendarDays,MessageSquare,Settings,LogOut,} from "lucide-react";
import "./MentorSidebar.css";
const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/mentor",
  },
  {
    label: "My Students",
    icon: Users,
    href: "/mentor/students",
  },
  {
    label: "Task Reviews",
    icon: ClipboardCheck,
    href: "/mentor/tasks",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/mentor/projects",
  },
  {
    label: "Attendance",
    icon: CalendarDays,
    href: "/mentor/attendance",
  },
  {
    label: "Feedback",
    icon: MessageSquare,
    href: "/mentor/feedback",
  },
];

function MentorSidebar() {
  const currentPath = window.location.pathname;
  return (
    <aside className="mentor-sidebar">
      <div className="mentor-sidebar-brand">
        <div className="mentor-logo-text">
          <h2>SocietySelect</h2>
        </div>
      </div>
      <div className="mentor-sidebar-profile">
        <div className="mentor-profile-details">
          <h3>Alex Morgan</h3>
        </div>
      </div>
      <div className="mentor-sidebar-menu">
        <p className="mentor-menu-heading">WORKSPACE</p>
        <nav className="mentor-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.href ||
              (item.href !== "/mentor" &&
                currentPath.startsWith(item.href));
            return (
              <a
                href={item.href}
                key={item.label}
                className={`mentor-sidebar-link ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="mentor-sidebar-bottom">
        <a
          href="/mentor/settings"
          className={`mentor-sidebar-link ${
            currentPath === "/mentor/settings" ? "active" : ""
          }`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </a>

        <a href="/login" className="mentor-sidebar-link mentor-logout">
          <LogOut size={19} />
          <span>Log Out</span>
        </a>
      </div>

    </aside>
  );
}
export default MentorSidebar;
