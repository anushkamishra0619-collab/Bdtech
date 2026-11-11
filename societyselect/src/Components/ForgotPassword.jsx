
import { useState } from "react";
import {FaCheck, FaLock } from "react-icons/fa";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo behavior. Connect your password reset API here.
    setSubmitted(true);
  };

  return (
    <div className="forgot-page">

      <div className="forgot-container">

        {/* LEFT SIDE - FORGOT PASSWORD FORM */}

        <div className="forgot-form-panel">

          {!submitted ? (
            <form onSubmit={handleSubmit}>

              <div className="lock-icon">
                <FaLock aria-hidden="true" />
              </div>

              <h1>Forgot Password?</h1>

              <p className="forgot-description">
                Don't worry! It happens.
                Enter your registered email address
                and we'll help you reset your password.
              </p>

              <div className="forgot-input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <small>
                  Use your AKGEC email name12345@akgec.ac.in
                </small>
              </div>

              <div className="forgot-input-group">
                <label>Account Type</label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Mentor">Mentor</option>
                </select>
              </div>

              <button
                type="submit"
                className="forgot-submit-btn"
              >
                SEND RESET LINK
              </button>

            </form>
          ) : (

            /* SUCCESS MESSAGE */

            <div className="forgot-success">

              <div className="success-check">
                <FaCheck aria-hidden="true" />
              </div>

              <h1>Check Your Email!</h1>

              <p>
                If an account exists for
                <strong> {email} </strong>
                as a {role.toLowerCase()}, you can use
                the password reset instructions sent to it.
              </p>

              <button
                className="forgot-submit-btn"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
              >
                TRY ANOTHER EMAIL
              </button>

              <a href="#login" className="back-login">
                <FaArrowLeft aria-hidden="true" /> Back to Sign In
              </a>

            </div>
          )}

        </div>

        {/* RIGHT SIDE - WELCOME PANEL */}

        <div className="forgot-welcome-panel">

          <div className="forgot-welcome-content">

            <h2>
              Welcome To<br />
              The SocietySelect
            </h2>

            <p>
              Your journey towards discovering
              your technical potential starts here.
            </p>

            <a href="#login" className="welcome-signin-btn">
              SIGN IN
            </a>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
