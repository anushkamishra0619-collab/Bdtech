import {
  FiUser,
  FiLock,
  FiCheck,
  FiLoader,
  FiBookOpen,
  FiBell,
  FiAward,
  FiCalendar,
} from "react-icons/fi";
import { FaGraduationCap, FaMousePointer } from "react-icons/fa";
import "./LoginAnimation.css";

const LoginAnimation = () => (
  <div className="anim" aria-hidden="true">
    {/* Floating icons around the window */}
    <div className="float f1"><FaGraduationCap /></div>
    <div className="float f2"><FiBookOpen /></div>
    <div className="float f3"><FiBell /></div>
    <div className="float f4"><FiAward /></div>

    <div className="win">
      <div className="win-bar">
        <span />
        <span />
        <span />
      </div>

      <div className="win-body">
        {/* Scene 1: login form being filled in */}
        <div className="layer login-layer">
          <div className="avatar"><FiUser /></div>

          <div className="fld">
            <FiUser className="fld-icon" />
            <span className="typed t-user">anushka_21</span>
          </div>

          <div className="fld">
            <FiLock className="fld-icon" />
            <span className="typed t-pass">••••••••</span>
          </div>

          <div className="btn">
            <span className="btn-label">Login</span>
            <span className="btn-spinwrap"><FiLoader /></span>
          </div>
        </div>

        {/* Scene 2: success + mini dashboard */}
        <div className="layer ok-layer">
          <div className="ok-check"><FiCheck /></div>
          <p className="ok-title">Welcome back!</p>

          <div className="stat">
            <FiBookOpen />
            <span>Courses</span>
            <div className="track"><i className="fill f-a" /></div>
          </div>
          <div className="stat">
            <FiCalendar />
            <span>Attendance</span>
            <div className="track"><i className="fill f-b" /></div>
          </div>
          <div className="stat">
            <FiAward />
            <span>Results</span>
            <div className="track"><i className="fill f-c" /></div>
          </div>
        </div>

        {/* Mouse pointer that clicks the Login button */}
        <FaMousePointer className="cursor" />
      </div>
    </div>
  </div>
);

export default LoginAnimation;