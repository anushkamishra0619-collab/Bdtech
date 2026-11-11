
import { useState } from "react";
import { FaGoogle, FaLinkedinIn, FaTimes } from "react-icons/fa";
import "./welcome.css";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loginRole, setLoginRole] = useState("Student");
  const [signupRole, setSignupRole] = useState("Student");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      setShowProfileForm(true);
      return;
    }

    alert(`Login submitted as ${loginRole}!`);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setShowProfileForm(false);
    alert(`Account creation submitted as ${signupRole}!`);
  };

  return (
    <div className={`auth-page ${isSignup ? "signup-active" : ""}`}>
      <div className={`auth-container ${isSignup ? "active" : ""}`}>

        {/* LOGIN FORM */}
        <div className="form-panel login-panel">
          <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>

            <div className="social-icons">
              <button type="button" aria-label="Google"><FaGoogle aria-hidden="true" /></button>
              <button type="button" aria-label="LinkedIn"><FaLinkedinIn aria-hidden="true" /></button>
            </div>

            <span className="form-hint">
              or use your email account
            </span>

            <input
              type="email"
              placeholder="Email"
              pattern="[A-Za-z][A-Za-z0-9._-]*[0-9]+\.?@akgec\.ac\.in"
              title="Use your AKGEC email with your name and student number, for example name12345.@akgec.ac.in"
              required
            />
            <span className="email-hint">
              Use your AKGEC email: name12345@akgec.ac.in
            </span>

            <input
              type="password"
              placeholder="Password"
              required
            />

            <label className="role-label" htmlFor="login-role">
              Sign in as
            </label>
            <select
              id="login-role"
              className="role-select"
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value)}
            >
              <option>Student</option>
              <option>Mentor</option>
            </select>

            <a href="#forgot" className="forgot-link">
              Forgot your password?
            </a>

            <button className="auth-button" type="submit">
              SIGN IN
            </button>
          </form>
        </div>

        {/* SIGNUP FORM */}
        <div className="form-panel signup-panel">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>

            <div className="social-icons">
              <button type="button" aria-label="Google"><FaGoogle aria-hidden="true" /></button>
              <button type="button" aria-label="LinkedIn"><FaLinkedinIn aria-hidden="true" /></button>
            </div>

            <span className="form-hint">
              or register using your email
            </span>

            <input
              type="text"
              placeholder="Name"
              required
            />

            <input
              type="email"
              placeholder="Email"
              pattern="[A-Za-z][A-Za-z0-9._-]*[0-9]+\.?@akgec\.ac\.in"
              title="Use your AKGEC email with your name and student number, for example name12345.@akgec.ac.in"
              required
            />
            <span className="email-hint">
              Use your AKGEC email: name12345.@akgec.ac.in
            </span>

            <input
              type="password"
              placeholder="Password"
              required
              minLength={8}
            />

            <label className="role-label" htmlFor="signup-role">
              Sign up as
            </label>
            <select
              id="signup-role"
              className="role-select"
              value={signupRole}
              onChange={(e) => setSignupRole(e.target.value)}
            >
              <option>Student</option>
              <option>Mentor</option>
            </select>

            <button className="auth-button" type="submit">
              SIGN UP
            </button>
          </form>
        </div>

        {/* ORANGE WELCOME PANEL */}
        <div className="welcome-panel">
          {!isSignup ? (
            <div className="welcome-content">
              <h2>Welcome To<br />The SocietySelect</h2>
              <p>New Here?</p>

              <button
                className="switch-button"
                onClick={() => setIsSignup(true)}
              >
                SIGN UP
              </button>
            </div>
          ) : (
            <div className="welcome-content">
              <h2>Welcome back To<br />The SocietySelect</h2>
              <p className="existing-account-prompt">Already have an account?</p>

              <button
                className="switch-button"
                onClick={() => setIsSignup(false)}
              >
                SIGN IN
              </button>
            </div>
          )}
        </div>

      </div>

      {showProfileForm && (
        <div className="profile-modal-overlay">
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <button
              className="profile-modal-close"
              type="button"
              aria-label="Close profile form"
              onClick={() => setShowProfileForm(false)}
            >
              <FaTimes aria-hidden="true" />
            </button>
            <h2 id="profile-modal-title">Tell us about your experience</h2>
            <p>Add your professional domain and years of experience.</p>

            <form onSubmit={handleProfileSubmit}>
              <label htmlFor="profile-domain">Domain</label>
              <input
                id="profile-domain"
                name="domain"
                type="text"
                placeholder="e.g. Frontend development or finance"
                required
              />

              <label htmlFor="profile-experience">Years of experience</label>
              <input
                id="profile-experience"
                name="experience"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 2"
                required
              />

              <button className="auth-button" type="submit">
                COMPLETE SIGN UP
              </button>
            </form>
          </section>
        </div>
      )}

    </div>
  );
}
