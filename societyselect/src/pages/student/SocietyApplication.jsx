import { useEffect, useMemo, useState } from "react";
import { societiesData } from "../../data/societiesData";
import {
  academicInformationData,
  studentData,
} from "../../data/studentProfileData";
import {
  createApplicationRecord,
  getApplications,
  hasDuplicateApplication,
  saveApplication,
  validateApplication,
} from "../../data/applicationService";
import {
  getSocieties,
  SOCIETIES_STORAGE_KEY,
} from "../../data/societyService";
import "../../styles/SocietyApplication.css";

const formatDeadline = (deadline) =>
  new Date(`${deadline}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const daysUntilDeadline = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const closingDate = new Date(`${deadline}T00:00:00`);
  return Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));
};

const availablePositionCount = (society) =>
  (society.details?.availablePositions ?? []).reduce(
    (total, position) => total + (position.openings ?? 0),
    0,
  );

const createEmptyApplicationForm = () => ({
  position: "",
  motivation: "",
  relevantSkills: "",
  githubUrl: "",
  portfolioUrl: "",
  confirmed: false,
});

const getStudentApplicationDetails = () => ({
  fullName: studentData.name ?? "",
  studentNumber: studentData.studentId ?? "",
  branch: academicInformationData.branch ?? studentData.branch ?? "",
  academicYear: academicInformationData.academicYear ?? studentData.academicYear ?? "",
  currentSemester: academicInformationData.currentSemester ?? "",
  yearAndSemester: [
    academicInformationData.academicYear ?? studentData.academicYear,
    academicInformationData.currentSemester,
  ]
    .filter(Boolean)
    .join(" · "),
  currentCgpa: academicInformationData.currentCgpa ?? "",
});

const getCurrentApplicationStatus = (society, applications, studentNumber) =>
  applications.find(
    (application) =>
      application.societyId === society.id &&
      application.student?.studentNumber === studentNumber,
  )?.status ?? society.applicationStatus ?? "Not Applied";

const SocietyApplicationForm = ({
  society,
  formData,
  fieldErrors,
  submissionError,
  submissionResult,
  onChange,
  onBack,
  onSubmit,
}) => {
  const positions = society.details?.availablePositions ?? [];
  const student = getStudentApplicationDetails();
  const studentFields = [
    { name: "fullName", label: "Full Name", value: student.fullName },
    { name: "studentNumber", label: "Student Number", value: student.studentNumber },
    { name: "branch", label: "Branch", value: student.branch },
    { name: "yearAndSemester", label: "Year and Semester", value: student.yearAndSemester },
    {
      name: "currentCgpa",
      label: "Current CGPA",
      value: student.currentCgpa ? `${student.currentCgpa} / 10` : "",
    },
  ];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    onChange(name, type === "checkbox" ? checked : value);
  };

  const renderError = (name) =>
    fieldErrors[name] && (
      <small className="society-application-error" id={`application-error-${name}`} role="alert">
        {fieldErrors[name]}
      </small>
    );

  const renderStudentField = ({ name, label, value }) => (
    <label className="society-application-field" key={name}>
      <span>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        placeholder="Not provided in profile"
        readOnly
        aria-readonly="true"
        aria-invalid={Boolean(fieldErrors[name])}
        aria-describedby={fieldErrors[name] ? `application-error-${name}` : undefined}
      />
      {renderError(name)}
    </label>
  );

  return (
    <div className="society-listing-content society-application-content">
      <nav className="society-breadcrumbs" aria-label="Breadcrumb">
        <a href="/student/dashboard">Dashboard</a>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={onBack}>
          Society Applications
        </button>
        <span aria-hidden="true">/</span>
        <span>{society.name}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Apply</span>
      </nav>

      <header className="society-application-intro">
        <h1>
          Apply to <em>{society.name}</em>
        </h1>
        <p>
          Closing {formatDeadline(society.deadline)}
          {daysUntilDeadline(society.deadline) >= 0 &&
            ` · ${daysUntilDeadline(society.deadline)} days left`}
        </p>
      </header>

      <aside className="society-eligibility-notice society-application-eligibility">
        <p>
          <strong>Eligibility</strong>
          <span>
            — {society.details?.eligibility?.criteria ?? "Eligibility information is not provided."}
          </span>
        </p>
      </aside>

      {submissionResult ? (
        <section className="society-application-success" role="status">
          <span className="society-application-success-mark" aria-hidden="true">✓</span>
          <p className="society-eyebrow">Application received</p>
          <h2>Your application has been submitted</h2>
          <p>
            Your application to <strong>{submissionResult.societyName}</strong> for{" "}
            <strong>{submissionResult.position}</strong> is now marked as submitted.
          </p>
          <dl>
            <div>
              <dt>Application ID</dt>
              <dd>{submissionResult.applicationId}</dd>
            </div>
            <div>
              <dt>Submitted</dt>
              <dd>{new Date(submissionResult.submittedAt).toLocaleString()}</dd>
            </div>
          </dl>
          <div className="society-application-success-actions">
            <button className="society-secondary-button" type="button" onClick={onBack}>
              Back to Society Details
            </button>
            <a className="society-primary-button" href="/student/application-tracking">
              View Application Tracking
            </a>
          </div>
        </section>
      ) : (
        <form className="society-application-form" onSubmit={onSubmit} noValidate>
          <h2 className="society-application-section-title">Student Details</h2>
          <p className="society-application-demo-note">
            Student details are shown from the current demonstration profile. Please verify them before submitting.
          </p>

          {submissionError && (
            <p className="society-application-submit-error" role="alert">
              {submissionError}
            </p>
          )}

          <div className="society-application-grid society-application-student-grid">
            {studentFields.map(renderStudentField)}

            <label className="society-application-field">
              <span>Position Applying For</span>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={positions.length === 0}
                aria-invalid={Boolean(fieldErrors.position)}
                aria-describedby={fieldErrors.position ? "application-error-position" : undefined}
              >
                {positions.length === 0 ? (
                  <option value="">No positions available</option>
                ) : (
                    <>
                      <option value="">Select a position</option>
                      {positions.map((position) => (
                        <option value={position.title} key={position.title}>
                          {position.title}
                        </option>
                      ))}
                    </>
                )}
              </select>
              {renderError("position")}
            </label>
          </div>

          <div className="society-application-fields">
            <label className="society-application-field society-application-field-wide">
              <span>Why do you want to join?</span>
              <textarea
                name="motivation"
                rows="5"
                value={formData.motivation}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.motivation)}
                aria-describedby={[
                  "application-motivation-help",
                  fieldErrors.motivation && "application-error-motivation",
                ].filter(Boolean).join(" ")}
              />
              <div className="society-application-field-meta">
                {renderError("motivation")}
                <span id="application-motivation-help" aria-live="polite">
                  {formData.motivation.length}/600 · minimum 50 characters
                </span>
              </div>
            </label>

            <label className="society-application-field society-application-field-wide">
              <span>Relevant Skills and Experience</span>
              <textarea
                name="relevantSkills"
                rows="5"
                value={formData.relevantSkills}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.relevantSkills)}
                aria-describedby={fieldErrors.relevantSkills ? "application-error-relevantSkills" : undefined}
              />
              {renderError("relevantSkills")}
            </label>

            <div className="society-application-grid society-application-link-grid">
              <label className="society-application-field">
                <span>GitHub Profile URL</span>
                <input
                  type="text"
                  inputMode="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  aria-invalid={Boolean(fieldErrors.githubUrl)}
                  aria-describedby={fieldErrors.githubUrl ? "application-error-githubUrl" : undefined}
                />
                {renderError("githubUrl")}
              </label>
              <label className="society-application-field">
                <span>Portfolio URL <em>(Optional)</em></span>
                <input
                  type="text"
                  inputMode="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://"
                  aria-invalid={Boolean(fieldErrors.portfolioUrl)}
                  aria-describedby={fieldErrors.portfolioUrl ? "application-error-portfolioUrl" : undefined}
                />
                {renderError("portfolioUrl")}
              </label>
            </div>

            <div className="society-application-confirmation-wrap">
              <label className="society-application-confirmation">
                <input
                  type="checkbox"
                  name="confirmed"
                  checked={formData.confirmed}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.confirmed)}
                  aria-describedby={fieldErrors.confirmed ? "application-error-confirmed" : undefined}
                />
                <span>I confirm that the information provided is accurate.</span>
              </label>
              {renderError("confirmed")}
            </div>

            <div className="society-application-actions">
              <button
                className="society-secondary-button"
                type="button"
                onClick={onBack}
              >
                Back to Details
              </button>
              <button className="society-primary-button" type="submit">
                Submit Application
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const SocietyDetailsView = ({
  society,
  applicationStatus,
  hasApplication,
  onBack,
  onApply,
}) => {
  const daysRemaining = daysUntilDeadline(society.deadline);
  const details = society.details ?? {};
  const positions = details.availablePositions ?? [];
  const skills = details.requiredSkills ?? [];

  return (
    <div className="society-listing-content society-details-content">
      <nav className="society-breadcrumbs" aria-label="Breadcrumb">
        <a href="/student/dashboard">Dashboard</a>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={onBack}>
          Society Applications
        </button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{society.name}</span>
      </nav>

      <button
        className="society-back-button"
        type="button"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Back to Society Applications
      </button>

      <section className="society-details-hero" aria-labelledby="society-details-title">
        <div className="society-details-heading">
          <span className={`society-category-label ${society.category.toLowerCase()}`}>
            {society.category}
          </span>
          <span className="society-card-initial" aria-hidden="true">
            {society.initials}
          </span>
        </div>
        <h1 id="society-details-title">{society.name}</h1>
        <p>{society.description}</p>
      </section>

      {details.dataStatus && (
        <aside className="society-demo-notice">
          <strong>{details.dataStatus}</strong>
          <span>
            Society details are for demonstration only; confirm official information
            with the college before applying.
          </span>
        </aside>
      )}

      <section className="society-details-panel" aria-label={`${society.name} details`}>
        <div className="society-details-facts">
          <div className="society-details-fact">
            <span className="society-field-label">Available positions</span>
            <strong>{availablePositionCount(society)} open · {positions.length} roles</strong>
          </div>
          <div className="society-details-fact">
            <span className="society-field-label">Application deadline</span>
            <strong>
              {formatDeadline(society.deadline)}
              <em>
                {daysRemaining >= 0
                  ? `${daysRemaining} days left`
                  : "Applications closed"}
              </em>
            </strong>
          </div>
          {(details.eligibility?.year || details.eligibility?.criteria) && (
            <div className="society-details-fact">
              <span className="society-field-label">Eligibility</span>
              <strong className="society-eligible">
                {details.eligibility.year}
                <em>{details.eligibility.criteria}</em>
              </strong>
            </div>
          )}
          <div className="society-details-fact">
            <span className="society-field-label">Application status</span>
            <strong>{applicationStatus}</strong>
          </div>
        </div>

        {details.about && (
          <section className="society-details-section">
            <h2>About the society</h2>
            <p className="society-details-copy">{details.about}</p>
          </section>
        )}

        {details.objectives?.length > 0 && (
          <section className="society-details-section">
            <h2>Objectives</h2>
            <ul className="society-details-list">
              {details.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {details.domains?.length > 0 && (
          <section className="society-details-section">
            <h2>Domains</h2>
            <div className="society-details-roles">
              {details.domains.map((domain) => (
                <span key={domain}>{domain}</span>
              ))}
            </div>
          </section>
        )}

        {positions.length > 0 && (
          <section className="society-details-section">
            <h2>Available roles</h2>
            <div className="society-details-role-list">
              {positions.map((position) => (
                <article key={position.title} className="society-details-role">
                  <div>
                    <h3>{position.title}</h3>
                    {position.description && <p>{position.description}</p>}
                  </div>
                  {position.openings != null && (
                    <span>
                      {position.openings} {position.openings === 1 ? "opening" : "openings"}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="society-details-section">
            <h2>Required skills</h2>
            <div className="society-skill-tags">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {details.facultyCoordinator && (
          <section className="society-details-section">
            <h2>Faculty coordinator</h2>
            <p className="society-details-copy">
              {details.facultyCoordinator.name}
              {details.facultyCoordinator.title && ` · ${details.facultyCoordinator.title}`}
            </p>
          </section>
        )}

        {details.contactInfo && (
          <section className="society-details-section">
            <h2>Contact information</h2>
            <div className="society-details-contact">
              {details.contactInfo.email && (
                <a href={`mailto:${details.contactInfo.email}`}>
                  {details.contactInfo.email}
                </a>
              )}
              {details.contactInfo.phone && <span>{details.contactInfo.phone}</span>}
            </div>
          </section>
        )}

        {details.socialLinks?.length > 0 && (
          <section className="society-details-section">
            <h2>Social media</h2>
            <div className="society-details-roles">
              {details.socialLinks.map((link) => (
                <a
                  className="society-details-social-link"
                  href={link.url}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {details.activities?.length > 0 && (
          <section className="society-details-section">
            <h2>Activities</h2>
            <ul className="society-details-list">
              {details.activities.map((activity, index) => (
                <li key={activity.title ?? activity.name ?? index}>
                  {activity.title ?? activity.name ?? activity}
                  {activity.description && ` — ${activity.description}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {details.achievements?.length > 0 && (
          <section className="society-details-section">
            <h2>Activities and achievements</h2>
            <ul className="society-details-list">
              {details.achievements.map((achievement, index) => (
                <li key={achievement.title ?? achievement.name ?? index}>
                  {achievement.title ?? achievement.name ?? achievement}
                  {achievement.description && ` — ${achievement.description}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="society-details-actions">
          <button
            className="society-back-button society-details-back-bottom"
            type="button"
            onClick={onBack}
          >
            <span aria-hidden="true">←</span> Back to Society Applications
          </button>
          <button
            className="society-primary-button society-details-apply-button"
            type="button"
            disabled={
              society.isActive === false ||
              !society.isOpen ||
              !positions.length ||
              hasApplication
            }
            onClick={onApply}
          >
            {hasApplication
              ? `${applicationStatus} ✓`
              : society.isActive === false
                ? "Society Inactive"
              : !positions.length
                ? "No Positions Available"
              : !society.isOpen
                ? "Applications Closed"
                : <>Apply Now <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </section>
    </div>
  );
};

const SocietyApplication = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("deadline");
  const [activeView, setActiveView] = useState("listing");
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societies, setSocieties] = useState(societiesData);
  const [societyDataError, setSocietyDataError] = useState("");
  const [applications, setApplications] = useState([]);
  const [storageError, setStorageError] = useState("");
  const [applicationForm, setApplicationForm] = useState({
    position: "",
    motivation: "",
    relevantSkills: "",
    githubUrl: "",
    portfolioUrl: "",
    confirmed: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [notice, setNotice] = useState("");
  const studentDetails = getStudentApplicationDetails();

  useEffect(() => {
    try {
      setApplications(getApplications());
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "Saved applications could not be loaded.",
      );
    }
  }, []);

  useEffect(() => {
    const loadSocieties = () => {
      try {
        const updatedSocieties = getSocieties();
        setSocieties(updatedSocieties);
        setSocietyDataError("");
        setSelectedSociety((current) =>
          current
            ? updatedSocieties.find((society) => society.id === current.id) ?? current
            : current,
        );
      } catch (error) {
        setSocietyDataError(
          error instanceof Error ? error.message : "Society information could not be loaded.",
        );
      }
    };

    loadSocieties();
    const handleSocietyStorageChange = (event) => {
      if (!event.key || event.key === SOCIETIES_STORAGE_KEY) loadSocieties();
    };
    window.addEventListener("storage", handleSocietyStorageChange);
    return () => window.removeEventListener("storage", handleSocietyStorageChange);
  }, []);

  const activeSocieties = societies.filter((society) => society.isActive !== false);
  const openSocieties = activeSocieties.filter((society) => society.isOpen);
  const currentStudentApplications = applications.filter(
    (application) =>
      application.student?.studentNumber === studentDetails.studentNumber,
  );
  const myApplications = new Set([
    ...societies
    .filter(
      (society) =>
        society.applicationStatus &&
        society.applicationStatus !== "Not Applied",
    )
      .map((society) => society.id),
    ...currentStudentApplications.map((application) => application.societyId),
  ]).size;
  const inReview = new Set([
    ...societies
      .filter((society) => society.applicationStatus === "In Review")
      .map((society) => society.id),
    ...currentStudentApplications
      .filter((application) => application.status === "In Review")
      .map((application) => application.societyId),
  ]).size;
  const closingThisWeek = openSocieties.filter((society) => {
    const daysRemaining = daysUntilDeadline(society.deadline);
    return daysRemaining >= 0 && daysRemaining <= 7;
  });

  const visibleSocieties = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return societies
      .filter(
        (society) =>
          society.isActive !== false &&
          (activeFilter === "All" || society.category === activeFilter),
      )
      .filter((society) => {
        if (!normalizedQuery) return true;
        return [
          society.name,
          society.description,
          society.category,
          ...(society.details?.requiredSkills ?? []),
          ...(society.details?.availablePositions ?? []).map((position) => position.title),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((first, second) => {
        if (sortOrder === "name") return first.name.localeCompare(second.name);
        if (sortOrder === "positions") {
          return availablePositionCount(second) - availablePositionCount(first);
        }
        return first.deadline.localeCompare(second.deadline);
      });
  }, [activeFilter, searchQuery, sortOrder, societies]);

  const closeMenu = () => setIsMenuOpen(false);
  const openSocietyDetails = (society) => {
    setSelectedSociety(society);
    setActiveView("details");
  };
  const openApplication = (society) => {
    if (society.isActive === false) {
      setNotice("This society is currently inactive.");
      return;
    }
    if (!society.isOpen) {
      setNotice("Applications for this society are closed.");
      return;
    }
    if (!society.details?.availablePositions?.length) {
      setNotice("There are no positions available for this society.");
      return;
    }
    if (
      getCurrentApplicationStatus(
        society,
        applications,
        studentDetails.studentNumber,
      ) !== "Not Applied" ||
      hasDuplicateApplication(applications, society.id, studentDetails.studentNumber)
    ) {
      setNotice("An application for this society has already been recorded.");
      return;
    }
    setSelectedSociety(society);
    setApplicationForm(createEmptyApplicationForm());
    setFieldErrors({});
    setSubmitAttempted(false);
    setSubmissionError("");
    setSubmissionResult(null);
    setActiveView("application");
  };
  const handleApplicationChange = (name, value) => {
    const updatedForm = { ...applicationForm, [name]: value };
    setApplicationForm(updatedForm);
    setSubmissionError("");
    if (submitAttempted && selectedSociety) {
      setFieldErrors(
        validateApplication({
          society: selectedSociety,
          student: studentDetails,
          formData: updatedForm,
        }),
      );
    }
  };
  const handleApplicationSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    if (!selectedSociety) return;
    setSubmissionError("");

    let latestSociety;
    try {
      latestSociety = getSocieties().find(
        (society) => society.id === selectedSociety.id,
      );
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "Society information could not be checked.",
      );
      return;
    }

    if (!latestSociety) {
      setSubmissionError("This society is no longer available.");
      return;
    }
    if (latestSociety.isActive === false || !latestSociety.isOpen) {
      setSubmissionError("This society is not accepting applications.");
      return;
    }
    if (!latestSociety.details?.availablePositions?.length) {
      setSubmissionError("There are no positions available for this society.");
      return;
    }

    setSelectedSociety(latestSociety);
    const errors = validateApplication({
      society: latestSociety,
      student: studentDetails,
      formData: applicationForm,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const application = createApplicationRecord({
      society: latestSociety,
      student: studentDetails,
      formData: applicationForm,
    });
    try {
      const updatedApplications = saveApplication(application);
      setApplications(updatedApplications);
      setSubmissionResult(application);
      setSubmissionError("");
      setStorageError("");
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "The application could not be saved.",
      );
    }
  };
  const selectedApplicationStatus = selectedSociety
    ? getCurrentApplicationStatus(
        selectedSociety,
        applications,
        studentDetails.studentNumber,
      )
    : "";

  return (
    <main className={`society-listing-page${activeView !== "listing" ? " is-viewing-details" : ""}`}>
      <header className="society-navbar">
        <a
          className="society-navbar-brand"
          href="/student/dashboard"
          aria-label="SocietySelect AI home"
        >
          <span>SocietySelect</span>
          <small>AI</small>
        </a>
        <nav
          id="society-navigation"
          className={`society-navbar-links${isMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="/student/dashboard" onClick={closeMenu}>Dashboard</a>
          <a href="/student/profile" onClick={closeMenu}>Profile</a>
          <a
            href="/student/application"
            className="active"
            aria-current="page"
            onClick={closeMenu}
          >
            Society Applications
          </a>
          <a href="/student/application-tracking" onClick={closeMenu}>
            Application Tracking
          </a>
        </nav>
        <label className="society-preview-control">
          <span>Preview as</span>
          <select aria-label="Preview as">
            <option>2nd Year</option>
          </select>
        </label>
        <a
          className="society-navbar-profile"
          href="/student/profile"
          aria-label={`Profile for ${studentData.name}`}
        >
          {studentData.avatarInitial}
        </a>
        <button
          className={`society-navbar-toggle${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="society-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {storageError && (
        <p className="society-application-submit-error society-application-storage-error" role="alert">
          {storageError}
        </p>
      )}
      {societyDataError && (
        <p className="society-application-submit-error society-application-storage-error" role="alert">
          {societyDataError}
        </p>
      )}

      {activeView === "application" && selectedSociety ? (
        <SocietyApplicationForm
          society={selectedSociety}
          formData={applicationForm}
          fieldErrors={fieldErrors}
          submissionError={submissionError}
          submissionResult={submissionResult}
          onChange={handleApplicationChange}
          onBack={() => setActiveView("details")}
          onSubmit={handleApplicationSubmit}
        />
      ) : activeView === "details" && selectedSociety ? (
        <SocietyDetailsView
          society={selectedSociety}
          applicationStatus={selectedApplicationStatus}
          hasApplication={selectedApplicationStatus !== "Not Applied"}
          onBack={() => {
            setSelectedSociety(null);
            setActiveView("listing");
          }}
          onApply={() => openApplication(selectedSociety)}
        />
      ) : (
      <div className="society-listing-content">
        <nav className="society-breadcrumbs" aria-label="Breadcrumb">
          <a href="/student/dashboard">Dashboard</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Society Applications</span>
        </nav>

        <section className="society-listing-intro">
          <div>
            <p className="society-eyebrow">Find your community</p>
            <h1>Society <em>Applications</em></h1>
            <p className="society-listing-subtitle">
              Discover and apply to college societies.
            </p>
          </div>
        </section>

        <section className="society-stat-grid" aria-label="Application statistics">
          <article className="society-stat-card">
            <span>Open Societies</span><strong>{openSocieties.length}</strong>
          </article>
          <article className="society-stat-card">
            <span>My Applications</span><strong>{myApplications}</strong>
          </article>
          <article className="society-stat-card">
            <span>In Review</span><strong>{inReview}</strong>
          </article>
          <article className="society-stat-card">
            <span>Closing This Week</span><strong>{closingThisWeek.length}</strong>
          </article>
        </section>

        <aside className="society-eligibility-notice">
          <p>
            <strong>✓ Eligible</strong>
            <span>— you are a 2nd-year student, so you can apply to any open society.</span>
          </p>
        </aside>

        <section className="society-directory" aria-labelledby="society-directory-title">
          <div className="society-directory-controls">
            <label className="society-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                type="search"
                placeholder="Search societies, skills or roles"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search societies"
              />
            </label>
            <div className="society-filter-tabs" role="group" aria-label="Filter by category">
              {["All", "Technical", "Cultural"].map((filter) => (
                <button
                  className={activeFilter === filter ? "active" : ""}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="society-sort-control">
              <span>Sort by</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                aria-label="Sort societies"
              >
                <option value="deadline">Deadline</option>
                <option value="name">Name A–Z</option>
                <option value="positions">Most positions</option>
              </select>
            </label>
          </div>
          <p className="society-result-count">
            {visibleSocieties.length} societies found
          </p>

          <div className="society-card-grid">
            {visibleSocieties.map((society) => (
              <article className="society-card" key={society.id}>
                <div className="society-card-content">
                  <div className="society-card-heading">
                    <span className="society-card-initial" aria-hidden="true">
                      {society.initials}
                    </span>
                    <span className={`society-category-label ${society.category.toLowerCase()}`}>
                      {society.category}
                    </span>
                  </div>
                  <h3>{society.name}</h3>
                  <p className="society-card-description">{society.description}</p>
                  <div className="society-card-skills">
                    <span className="society-field-label">Skills</span>
                    <div className="society-skill-tags">
                      {(society.details?.requiredSkills ?? []).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="society-card-facts">
                    <div>
                      <span className="society-field-label">Available positions</span>
                      <strong>
                        {availablePositionCount(society)} open · {society.details?.availablePositions?.length ?? 0} roles
                      </strong>
                    </div>
                    <div>
                      <span className="society-field-label">Application deadline</span>
                      <strong>
                        {formatDeadline(society.deadline)}
                        <em>{daysUntilDeadline(society.deadline)} days left</em>
                      </strong>
                    </div>
                    <div>
                      <span className="society-field-label">Eligibility</span>
                      <strong className="society-eligible">
                        {society.details?.eligibility?.year
                          ? `✓ Eligible · ${society.details.eligibility.year} only`
                          : "Eligibility details unavailable"}
                      </strong>
                    </div>
                  </div>
                  <div className="society-card-actions">
                    <button
                      className="society-secondary-button"
                      type="button"
                      onClick={() => openSocietyDetails(society)}
                    >
                      View Details
                    </button>
                    <button
                      className={`society-primary-button${getCurrentApplicationStatus(society, applications, studentDetails.studentNumber) !== "Not Applied" ? " is-applied" : ""}`}
                      type="button"
                      disabled={
                        !society.isOpen ||
                        !society.details?.availablePositions?.length ||
                        getCurrentApplicationStatus(society, applications, studentDetails.studentNumber) !== "Not Applied"
                      }
                      onClick={() => openApplication(society)}
                    >
                      {getCurrentApplicationStatus(society, applications, studentDetails.studentNumber) !== "Not Applied"
                        ? `${getCurrentApplicationStatus(society, applications, studentDetails.studentNumber)} ✓`
                        : !society.isOpen
                          ? "Applications Closed"
                          : <>Apply Now <span aria-hidden="true">→</span></>}
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visibleSocieties.length === 0 && (
              <div className="society-empty-state">
                <span aria-hidden="true">⌕</span>
                <h3>No matching societies</h3>
                <p>Try a different search or category filter.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      )}

      {notice && (
        <div
          className="society-dialog-backdrop"
          role="presentation"
          onClick={() => setNotice("")}
        >
          <section
            className="society-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="society-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="society-dialog-close"
              type="button"
              aria-label="Close dialog"
              onClick={() => setNotice("")}
            >
              ×
            </button>
            <span className="society-eyebrow">Applications</span>
            <h2 id="society-dialog-title">Coming soon</h2>
            <p>{notice}</p>
            <button
              className="society-primary-button"
              type="button"
              onClick={() => setNotice("")}
            >
              Understood
            </button>
          </section>
        </div>
      )}
    </main>
  );
};

export default SocietyApplication;
