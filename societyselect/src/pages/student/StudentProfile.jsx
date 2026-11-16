import { useState } from "react";
import {
  academicInformationData,
  personalInformationData,
  profileCompletionData,
  studentData,
} from "../../data/studentProfileData";
import "../../styles/profile.css";

const personalInformationFields = [
  { key: "fullName", label: "Full Name", type: "text" },
  { key: "personalEmail", label: "Personal Email", type: "email" },
  { key: "collegeEmail", label: "College Email", type: "email" },
  { key: "phoneNumber", label: "Phone Number", type: "tel" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "gender", label: "Gender", type: "select" },
  { key: "address", label: "Address", type: "textarea", isWide: true },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
];

const academicInformationFields = [
  { key: "universityName", label: "University Name", type: "text" },
  { key: "universityRollNumber", label: "University Roll Number", type: "text" },
  { key: "studentId", label: "Student ID", type: "text" },
  { key: "course", label: "Course", type: "text" },
  { key: "branch", label: "Branch", type: "text" },
  { key: "academicYear", label: "Academic Year", type: "text" },
  { key: "currentSemester", label: "Current Semester", type: "text" },
  { key: "admissionYear", label: "Admission Year", type: "number" },
  {
    key: "currentCgpa",
    label: "Current CGPA",
    type: "number",
    min: "0",
    max: "10",
    step: "0.01",
    suffix: " / 10",
  },
  { key: "academicPerformance", label: "Academic Performance", type: "text" },
];

const validatePersonalInformation = (information) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneDigits = information.phoneNumber.replace(/\D/g, "");
  const phonePattern = /^\+?[\d\s().-]+$/;

  if (!emailPattern.test(information.personalEmail)) {
    errors.personalEmail = "Enter a valid personal email address.";
  }
  if (!emailPattern.test(information.collegeEmail)) {
    errors.collegeEmail = "Enter a valid college email address.";
  }
  if (
    !phonePattern.test(information.phoneNumber) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phoneNumber = "Enter a valid phone number with 7 to 15 digits.";
  }

  return errors;
};

const StudentProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [personalInformation, setPersonalInformation] = useState(
    personalInformationData,
  );
  const [informationDraft, setInformationDraft] = useState(
    personalInformationData,
  );
  const [isEditingInformation, setIsEditingInformation] = useState(false);
  const [informationErrors, setInformationErrors] = useState({});
  const [academicInformation, setAcademicInformation] = useState(
    academicInformationData,
  );
  const [academicInformationDraft, setAcademicInformationDraft] = useState(
    academicInformationData,
  );
  const [isEditingAcademicInformation, setIsEditingAcademicInformation] =
    useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const startEditingInformation = () => {
    setInformationDraft({ ...personalInformation });
    setInformationErrors({});
    setIsEditingInformation(true);
  };

  const handleInformationChange = (event) => {
    const { name, value } = event.target;
    setInformationDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
    setInformationErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const savePersonalInformation = (event) => {
    event.preventDefault();
    const errors = validatePersonalInformation(informationDraft);
    if (Object.keys(errors).length > 0) {
      setInformationErrors(errors);
      return;
    }

    setPersonalInformation({ ...informationDraft });
    setInformationErrors({});
    setIsEditingInformation(false);
  };

  const cancelPersonalInformationEdit = () => {
    setInformationDraft({ ...personalInformation });
    setInformationErrors({});
    setIsEditingInformation(false);
  };

  const startEditingAcademicInformation = () => {
    setAcademicInformationDraft({ ...academicInformation });
    setIsEditingAcademicInformation(true);
  };

  const handleAcademicInformationChange = (event) => {
    const { name, value } = event.target;
    setAcademicInformationDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  };

  const saveAcademicInformation = (event) => {
    event.preventDefault();
    setAcademicInformation({ ...academicInformationDraft });
    setIsEditingAcademicInformation(false);
  };

  const cancelAcademicInformationEdit = () => {
    setAcademicInformationDraft({ ...academicInformation });
    setIsEditingAcademicInformation(false);
  };

  const formatDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) return "Not provided";

    return new Date(`${dateOfBirth}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="student-profile-page">
      <header className="profile-navbar">
        <a className="profile-brand" href="/student/dashboard" aria-label="SocietySelect AI home">
          Society<em>Select</em> <span>AI</span>
        </a>

        <nav
          id="profile-navigation"
          className={`profile-nav${isMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a className="profile-nav-link" href="/student/dashboard" onClick={closeMenu}>
            Dashboard
          </a>
          <a
            className="profile-nav-link active"
            href="/student/profile"
            aria-current="page"
            onClick={closeMenu}
          >
            Profile
          </a>
          <a className="profile-nav-link" href="/student/performance" onClick={closeMenu}>
            Performance
          </a>
          <a className="profile-nav-link" href="/student/notifications" onClick={closeMenu}>
            Notifications
          </a>
        </nav>

        <a className="profile-avatar" href="/student/profile" aria-label="Student profile">
          {studentData.avatarInitial}
        </a>

        <button
          className={`profile-menu-toggle${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="profile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <section className="profile-hero" aria-labelledby="profile-hero-name">
        <div className="profile-hero-heading">
          <div className="profile-hero-identity">
            <span className="profile-hero-avatar" aria-hidden="true">
              {studentData.avatarInitial}
            </span>
            <div className="profile-hero-copy">
              <p className="profile-hero-eyebrow">Student Profile</p>
              <h1 id="profile-hero-name">{studentData.name}</h1>
              <div className="profile-hero-badges">
                <span className="profile-hero-badge">{studentData.societyRole}</span>
                <span className="profile-hero-badge profile-hero-status">
                  Application · {studentData.applicationStatus}
                </span>
              </div>
            </div>
          </div>
          <button className="profile-edit-button" type="button">
            Edit Profile
          </button>
        </div>

        <div className="profile-hero-details">
          <div className="profile-detail">
            <span className="profile-detail-label">Student ID</span>
            <span className="profile-detail-value">{studentData.studentId}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">University Roll No.</span>
            <span className="profile-detail-value">{studentData.universityRollNumber}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Branch</span>
            <span className="profile-detail-value">{studentData.branch}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Academic Year</span>
            <span className="profile-detail-value">{studentData.academicYear}</span>
          </div>
          <div className="profile-detail profile-detail-college">
            <span className="profile-detail-label">College</span>
            <span className="profile-detail-value">{studentData.college}</span>
          </div>
        </div>
      </section>

      <section
        className="profile-completion"
        aria-labelledby="profile-completion-title"
      >
        <div className="profile-completion-summary">
          <p className="profile-completion-eyebrow">Profile completion</p>
          <div className="profile-completion-heading">
            <h2 id="profile-completion-title">Almost there</h2>
            <p className="profile-completion-percentage">
              <span>{profileCompletionData.percentage}</span>%
              <span className="profile-completion-caption">complete</span>
            </p>
          </div>
          <div
            className="profile-completion-track"
            role="progressbar"
            aria-label="Profile completion"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={profileCompletionData.percentage}
            style={{
              "--profile-completion": `${profileCompletionData.percentage}%`,
            }}
          >
            <span className="profile-completion-fill" />
          </div>
          <div className="profile-completed-sections">
            <h3>Completed sections</h3>
            <ul>
              {profileCompletionData.completedSections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="profile-completion-next">
          <h3>Still missing</h3>
          <ul className="profile-missing-list">
            {profileCompletionData.missingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="profile-completion-action" href="/student/settings">
            Complete Profile <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section
        className="profile-information"
        aria-labelledby="profile-information-title"
      >
        <form onSubmit={savePersonalInformation} noValidate>
          <div className="profile-information-heading">
            <div>
              <p className="profile-information-eyebrow">Personal information</p>
              <h2 id="profile-information-title">Your details</h2>
            </div>
            {isEditingInformation ? (
              <div className="profile-information-actions">
                <button
                  className="profile-information-action"
                  type="submit"
                >
                  Save Changes
                </button>
                <button
                  className="profile-information-action is-secondary"
                  type="button"
                  onClick={cancelPersonalInformationEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="profile-information-action"
                type="button"
                onClick={startEditingInformation}
              >
                Edit Information
              </button>
            )}
          </div>

          <div className="profile-information-grid">
            {personalInformationFields.map((field) => {
              const value = isEditingInformation
                ? informationDraft[field.key]
                : personalInformation[field.key];
              const fieldId = `personal-information-${field.key}`;

              return (
                <div
                  className={`profile-information-field${
                    field.isWide ? " is-wide" : ""
                  }`}
                  key={field.key}
                >
                  {isEditingInformation ? (
                    <label
                      className="profile-information-label"
                      htmlFor={fieldId}
                    >
                      {field.label}
                    </label>
                  ) : (
                    <p className="profile-information-label">{field.label}</p>
                  )}
                  {isEditingInformation ? (
                    field.type === "textarea" ? (
                      <textarea
                        className="profile-information-control"
                        id={fieldId}
                        name={field.key}
                        value={value}
                        onChange={handleInformationChange}
                        aria-invalid={Boolean(informationErrors[field.key])}
                        aria-describedby={
                          informationErrors[field.key]
                            ? `${fieldId}-error`
                            : undefined
                        }
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="profile-information-control"
                        id={fieldId}
                        name={field.key}
                        value={value}
                        onChange={handleInformationChange}
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    ) : (
                      <input
                        className={`profile-information-control${
                          informationErrors[field.key] ? " is-invalid" : ""
                        }`}
                        id={fieldId}
                        name={field.key}
                        type={field.type}
                        value={value}
                        onChange={handleInformationChange}
                        aria-invalid={Boolean(informationErrors[field.key])}
                        aria-describedby={
                          informationErrors[field.key]
                            ? `${fieldId}-error`
                            : undefined
                        }
                      />
                    )
                  ) : (
                    <p className="profile-information-value">
                      {field.key === "dateOfBirth"
                        ? formatDateOfBirth(value)
                        : value}
                    </p>
                  )}
                  {isEditingInformation && informationErrors[field.key] && (
                    <p
                      className="profile-information-error"
                      id={`${fieldId}-error`}
                      role="alert"
                    >
                      {informationErrors[field.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </section>

      <section
        className="profile-information"
        aria-labelledby="academic-information-title"
      >
        <form
          onSubmit={saveAcademicInformation}
          noValidate
        >
          <div className="profile-information-heading">
            <div>
              <p className="profile-information-eyebrow">
                Academic information
              </p>
              <h2 id="academic-information-title">Your academic identity</h2>
            </div>
            {isEditingAcademicInformation ? (
              <div className="profile-information-actions">
                <button className="profile-information-action" type="submit">
                  Save Changes
                </button>
                <button
                  className="profile-information-action is-secondary"
                  type="button"
                  onClick={cancelAcademicInformationEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="profile-information-action"
                type="button"
                onClick={startEditingAcademicInformation}
              >
                Edit Information
              </button>
            )}
          </div>

          <div className="profile-information-grid">
            {academicInformationFields.map((field) => {
              const value = isEditingAcademicInformation
                ? academicInformationDraft[field.key]
                : academicInformation[field.key];
              const fieldId = `academic-information-${field.key}`;

              return (
                <div className="profile-information-field" key={field.key}>
                  {isEditingAcademicInformation ? (
                    <label
                      className="profile-information-label"
                      htmlFor={fieldId}
                    >
                      {field.label}
                    </label>
                  ) : (
                    <p className="profile-information-label">{field.label}</p>
                  )}
                  {isEditingAcademicInformation ? (
                    <input
                      className="profile-information-control"
                      id={fieldId}
                      name={field.key}
                      type={field.type}
                      value={value}
                      onChange={handleAcademicInformationChange}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                    />
                  ) : (
                    <p className="profile-information-value">
                      {value}
                      {field.suffix || ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </section>
    </main>
  );
};

export default StudentProfile;
