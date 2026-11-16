import { useState } from "react";
import {
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

const StudentProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [personalInformation, setPersonalInformation] = useState(
    personalInformationData,
  );
  const [informationDraft, setInformationDraft] = useState(
    personalInformationData,
  );
  const [isEditingInformation, setIsEditingInformation] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const startEditingInformation = () => {
    setInformationDraft({ ...personalInformation });
    setIsEditingInformation(true);
  };

  const handleInformationChange = (event) => {
    const { name, value } = event.target;
    setInformationDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  };

  const savePersonalInformation = (event) => {
    event.preventDefault();
    setPersonalInformation({ ...informationDraft });
    setIsEditingInformation(false);
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
        <form onSubmit={savePersonalInformation}>
          <div className="profile-information-heading">
            <div>
              <p className="profile-information-eyebrow">Personal information</p>
              <h2 id="profile-information-title">Your details</h2>
            </div>
            <button
              className="profile-information-action"
              type={isEditingInformation ? "submit" : "button"}
              onClick={
                isEditingInformation ? undefined : startEditingInformation
              }
            >
              {isEditingInformation ? "Save Information" : "Edit Information"}
            </button>
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
                  <label
                    className="profile-information-label"
                    htmlFor={fieldId}
                  >
                    {field.label}
                  </label>
                  {isEditingInformation ? (
                    field.type === "textarea" ? (
                      <textarea
                        className="profile-information-control"
                        id={fieldId}
                        name={field.key}
                        value={value}
                        onChange={handleInformationChange}
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
                        className="profile-information-control"
                        id={fieldId}
                        name={field.key}
                        type={field.type}
                        value={value}
                        onChange={handleInformationChange}
                      />
                    )
                  ) : (
                    <p className="profile-information-value">
                      {field.key === "dateOfBirth"
                        ? formatDateOfBirth(value)
                        : value}
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
