
import { useState } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaPlus,
  FaTimes
} from "react-icons/fa";
import "./SignupForm.css";

const domains = [
  "Web Development",
  "App Development",
  "AI / Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Competitive Programming",
  "UI / UX Design",
  "IoT"
];

const skillsList = [
  "C", "C++", "Python", "Java", "JavaScript",
  "React", "Node.js", "HTML", "CSS",
  "SQL", "Machine Learning", "DSA"
];

export default function SignupForm() {
  const [showProfile, setShowProfile] = useState(false);
  const [success, setSuccess] = useState(false);

  const [basicData, setBasicData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [studentData, setStudentData] = useState({
    college: "",
    university: "",
    branch: "",
    year: "",
    enrollment: "",
    phone: "",
    domains: [],
    skills: []
  });

  const updateBasic = (e) => {
    setBasicData({
      ...basicData,
      [e.target.name]: e.target.value
    });
  };

  const updateStudent = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };

  const toggleSelection = (field, value) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    setShowProfile(true);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    console.log("Registration Data:", {
      ...basicData,
      ...studentData
    });

    setSuccess(true);
    setShowProfile(false);
  };

  return (
    <div className="signup-page">

      <div className="signup-card">
        <div className="signup-heading">
          <span className="signup-logo">SA</span>
          <h1>Create Account</h1>
          <p>Join SocietySelect AI and explore your potential.</p>
        </div>

        <form onSubmit={handleBasicSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={basicData.name}
            onChange={updateBasic}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your college email"
            value={basicData.email}
            onChange={updateBasic}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={basicData.password}
            onChange={updateBasic}
            minLength={8}
            required
          />

          <button type="submit" className="signup-main-btn">
            SIGN UP <FaArrowRight aria-hidden="true" />
          </button>
        </form>

        <p className="login-text">
          Already have an account? <a href="#login">Sign In</a>
        </p>
      </div>

      {/* STUDENT PROFILE POPUP */}

      {showProfile && (
        <div className="popup-overlay">
          <div className="profile-popup">

            <button
              type="button"
              className="popup-close"
              onClick={() => setShowProfile(false)}
            >
              <FaTimes aria-hidden="true" />
            </button>

            <div className="popup-heading">
              <span className="step-tag">STEP 2 OF 2</span>
              <h2>Complete Your Profile</h2>
              <p>Tell us more about your academic and technical background.</p>
            </div>

            <form onSubmit={handleFinalSubmit}>

              <div className="form-grid">
                <div className="field">
                  <label>College Name</label>
                  <input
                    name="college"
                    placeholder="Enter college name"
                    value={studentData.college}
                    onChange={updateStudent}
                    required
                  />
                </div>

                <div className="field">
                  <label>University</label>
                  <input
                    name="university"
                    placeholder="Enter university"
                    value={studentData.university}
                    onChange={updateStudent}
                    required
                  />
                </div>

                <div className="field">
                  <label>Branch / Department</label>
                  <select
                    name="branch"
                    value={studentData.branch}
                    onChange={updateStudent}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option>CSE</option>
                    <option>IT</option>
                    <option>ECE</option>
                    <option>Electrical</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label>Current Year</label>
                  <select
                    name="year"
                    value={studentData.year}
                    onChange={updateStudent}
                    required
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>

                <div className="field">
                  <label>Enrollment Number</label>
                  <input
                    name="enrollment"
                    placeholder="Enter enrollment number"
                    value={studentData.enrollment}
                    onChange={updateStudent}
                    required
                  />
                </div>

                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    value={studentData.phone}
                    onChange={updateStudent}
                    required
                  />
                </div>
              </div>

              {/* DOMAIN SELECTION */}

              <div className="selection-section">
                <label>Choose Your Technical Domains</label>
                <p>Select all domains that interest you.</p>

                <div className="selection-grid">
                  {domains.map((domain) => (
                    <button
                      type="button"
                      key={domain}
                      className={`selection-chip ${
                        studentData.domains.includes(domain)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleSelection("domains", domain)
                      }
                    >
                      {studentData.domains.includes(domain) ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaPlus aria-hidden="true" />
                      )}
                      {domain}
                    </button>
                  ))}
                </div>

                {studentData.domains.length === 0 && (
                  <small className="selection-hint">
                    Select at least one domain.
                  </small>
                )}
              </div>

              {/* SKILLS SELECTION */}

              <div className="selection-section">
                <label>Your Technical Skills</label>
                <p>Select the technologies you know.</p>

                <div className="selection-grid">
                  {skillsList.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      className={`selection-chip ${
                        studentData.skills.includes(skill)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleSelection("skills", skill)
                      }
                    >
                      {studentData.skills.includes(skill) ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaPlus aria-hidden="true" />
                      )}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="complete-btn"
                disabled={studentData.domains.length === 0}
              >
                COMPLETE REGISTRATION <FaArrowRight aria-hidden="true" />
              </button>

            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="popup-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <FaCheck aria-hidden="true" />
            </div>
            <h2>Registration Successful!</h2>
            <p>
              Welcome to SocietySelect AI, {basicData.name}.
              Your student profile has been created.
            </p>
            <button
              className="complete-btn"
              onClick={() => setSuccess(false)}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
