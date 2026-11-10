import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./welcome.css";
import LoginAnimation from "./LoginAnimation"; 

const createEmptyForm = () => ({
    username: "",
    fullName: "",
    email: "",
    studentId: "",
    institution: "",
    phone: "",
    expertise: "",
    yearsExperience: "",
    domain: "",
    password: "",
    confirmPassword: "",
});

const Welcome = () => {
    const [loginRole, setLoginRole] = useState("Student");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showMentorDetails, setShowMentorDetails] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState(createEmptyForm);

    const resetForm = () => {
        setForm(createEmptyForm());
        setShowPassword(false);
    };

    const handleRoleChange = (role) => {
        if (role !== loginRole) {
            resetForm();
            setShowMentorDetails(false);
            setLoginRole(role);
        }
    };

    const handlePageChange = () => {
        resetForm();
        setShowMentorDetails(false);
        setIsSignUp((current) => !current);
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit=(e)=>{
        e.preventDefault();
        if (!isSignUp && loginRole === "Mentor") {
            setShowMentorDetails(true);
        }
    }

    const handleMentorDetailsSubmit = (e) => {
        e.preventDefault();
        setShowMentorDetails(false);
    };

    return(
        <div className="welcome-page">
            <div className="welcome-card">
                <section className="welcome-left">
                    <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-role" role="group" aria-label="Choose account type">
                      {["Student", "Mentor"].map((role) => (
                        <button
                          key={role}
                          type="button"
                          className={`role-option${loginRole === role ? " active" : ""}`}
                          aria-pressed={loginRole === role}
                          onClick={() => handleRoleChange(role)}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    <h1 className="login-title">{isSignUp ? "Create account" : `${loginRole} Login`}</h1>
                    <p className="login-subtitle">
                      {isSignUp
                        ? `Create your ${loginRole.toLowerCase()} account.`
                        : `Enter your ${loginRole.toLowerCase()} account details.`}
                    </p>
                    {isSignUp && (
                      <div className="field">
                        <input type="text" name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} autoComplete="name" required />
                      </div>
                    )}
                    <div className="field">
                      <input
                        type={isSignUp ? "email" : "text"}
                        name={isSignUp ? "email" : "username"}
                        placeholder={isSignUp ? "name@akgec.ac.in" : "Username or email"}
                        value={isSignUp ? form.email : form.username}
                        onChange={handleChange}
                        autoComplete={isSignUp ? "email" : "username"}
                        pattern={isSignUp ? "[A-Za-z0-9._%+-]+@akgec\\.ac\\.in" : undefined}
                        title={isSignUp ? "Use your official @akgec.ac.in college email address." : undefined}
                        required
                      />
                    </div>
                    {isSignUp && (
                      <>
                        <div className="field">
                          <input type="text" name="studentId" placeholder="Student number" value={form.studentId} onChange={handleChange} required />
                        </div>
                        {loginRole === "Student" && (
                          <div className="field">
                            <input type="text" name="institution" placeholder="School or institution" value={form.institution} onChange={handleChange} required />
                          </div>
                        )}
                        <div className="field">
                          <input type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} autoComplete="tel" required />
                        </div>
                      </>
                    )}
                    <div className="field">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        required
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FiEye /> : <FiEyeOff />}
                      </button>
                    </div>
                    {isSignUp && (
                      <div className="field">
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    )}
              {!isSignUp && (
                <a href="#forgot" className="forgot">
                  Forgot Password?
                </a>
              )}
            <button type="submit" className={`login-btn${isSignUp ? " signup-submit" : ""}`}>
              {isSignUp ? `Sign up as ${loginRole}` : `Login as ${loginRole}`}
            </button>
          </form>
          <div className="signup-row">
            <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
            <button type="button" className="signup-btn" onClick={handlePageChange}>
              {isSignUp ? "Back to Login" : "Sign up"}
            </button>
          </div>
        </section>
                <section className="welcome-right">
          <div className="blob blob-1" />
          <div className="blob blob-2" />

          <div className="welcome-text">
            <h2>
              <strong>Welcome to</strong>
              <br />
              {loginRole.toLowerCase()} portal
            </h2>
            <p>{isSignUp ? "Create an account to get started" : "Login to access your account"}</p>
          </div>

          <LoginAnimation
 />
        </section>
      </div>
      {showMentorDetails && (
        <div className="modal-backdrop">
          <form
            className="mentor-dialog"
            onSubmit={handleMentorDetailsSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-details-title"
          >
            <button
              type="button"
              className="dialog-close"
              aria-label="Return to login"
              onClick={() => {
                setShowMentorDetails(false);
                setIsSignUp(false);
              }}
            >
              &times;
            </button>
            <h2 id="mentor-details-title">Mentor profile details</h2>
            <p>Tell us about your experience and mentoring domain.</p>
            <div className="field">
              <input
                type="text"
                name="expertise"
                placeholder="Area of expertise"
                value={form.expertise}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <input
                type="number"
                name="yearsExperience"
                placeholder="Years of experience"
                value={form.yearsExperience}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="domain"
                placeholder="Mentoring domain"
                value={form.domain}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">Save details</button>
          </form>
        </div>
      )}
    </div>

    );
};
export default Welcome;