import { useState } from "react";
import {
  achievementsData,
  additionalProfileData,
  academicInformationData,
  collegeSocietyData,
  extracurricularActivitiesData,
  githubActivityData,
  performanceData,
  personalInformationData,
  profileCompletionData,
  profileDocumentsData,
  profileSummaryData,
  studentData,
  studentProjectsData,
  technicalSkillsData,
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

const emptyProjectDraft = {
  name: "",
  description: "",
  technologyStack: "",
  role: "Full Stack",
  githubUrl: "",
  liveDemoUrl: "",
  status: "In Progress",
};

const validateProject = (project) => {
  const errors = {};
  const validateUrl = (value) => {
    if (!value.trim()) return true;

    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!project.name.trim()) {
    errors.name = "Enter a project name.";
  }
  if (!validateUrl(project.githubUrl)) {
    errors.githubUrl = "Enter a valid HTTP or HTTPS repository URL.";
  }
  if (!validateUrl(project.liveDemoUrl)) {
    errors.liveDemoUrl = "Enter a valid HTTP or HTTPS demo URL.";
  }

  return errors;
};

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

const cloneTechnicalSkills = (categories) =>
  categories.map((category) => ({
    ...category,
    skills: category.skills.map((skill) => ({ ...skill })),
  }));

const EditableProfileCollection = ({
  eyebrow,
  title,
  addLabel,
  fields,
  initialRecords,
  emptyText,
  renderRecord,
}) => {
  const [records, setRecords] = useState(() =>
    initialRecords.map((record) => ({ ...record })),
  );
  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const beginAdd = () => {
    setDraft(
      Object.fromEntries(fields.map((field) => [field.key, field.defaultValue || ""])),
    );
    setEditingId(null);
    setErrors({});
  };

  const beginEdit = (record) => {
    setDraft({ ...record });
    setEditingId(record.id);
    setErrors({});
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditingId(null);
    setErrors({});
  };

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const saveRecord = (event) => {
    event.preventDefault();
    const nextErrors = {};
    fields.forEach((field) => {
      if (field.required && !String(draft[field.key] || "").trim()) {
        nextErrors[field.key] = `${field.label} is required.`;
      }
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const savedRecord = {
      ...draft,
      id: editingId || `${title.toLowerCase().replace(/\W+/g, "-")}-${Date.now()}`,
    };
    setRecords((currentRecords) =>
      editingId
        ? currentRecords.map((record) =>
            record.id === editingId ? savedRecord : record,
          )
        : [...currentRecords, savedRecord],
    );
    cancelEdit();
  };

  const deleteRecord = (recordId) => {
    setRecords((currentRecords) =>
      currentRecords.filter((record) => record.id !== recordId),
    );
    if (expandedId === recordId) setExpandedId(null);
    if (editingId === recordId) cancelEdit();
  };

  return (
    <section className="profile-information profile-extra-section">
      <div className="profile-information-heading">
        <div>
          <p className="profile-information-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {!draft && (
          <button
            className="profile-information-action"
            type="button"
            onClick={beginAdd}
          >
            {addLabel}
          </button>
        )}
      </div>

      {draft && (
        <form className="profile-extra-form" onSubmit={saveRecord} noValidate>
          <div className="profile-extra-form-grid">
            {fields.map((field) => {
              const fieldId = `${title.toLowerCase().replace(/\W+/g, "-")}-${field.key}`;
              return (
                <div
                  className={`profile-information-field${field.wide ? " is-wide" : ""}`}
                  key={field.key}
                >
                  <label className="profile-information-label" htmlFor={fieldId}>
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="profile-information-control"
                      id={fieldId}
                      name={field.key}
                      value={draft[field.key]}
                      onChange={updateDraft}
                    >
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      className="profile-information-control"
                      id={fieldId}
                      name={field.key}
                      value={draft[field.key]}
                      onChange={updateDraft}
                      rows="3"
                    />
                  ) : (
                    <input
                      className={`profile-information-control${errors[field.key] ? " is-invalid" : ""}`}
                      id={fieldId}
                      name={field.key}
                      type={field.type || "text"}
                      value={draft[field.key]}
                      onChange={updateDraft}
                      required={field.required}
                      aria-invalid={Boolean(errors[field.key])}
                    />
                  )}
                  {errors[field.key] && (
                    <p className="profile-information-error" role="alert">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="profile-information-actions profile-extra-form-actions">
            <button className="profile-information-action" type="submit">
              {editingId ? "Save Changes" : "Save"}
            </button>
            <button
              className="profile-information-action is-secondary"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {records.length ? (
        <div className="profile-record-grid">
          {records.map((record) => (
            <article className="profile-record-card" key={record.id}>
              {renderRecord(record, {
                isExpanded: expandedId === record.id,
                toggleDetails: () =>
                  setExpandedId((currentId) =>
                    currentId === record.id ? null : record.id,
                  ),
              })}
              <div className="profile-record-actions">
                <button type="button" onClick={() => beginEdit(record)}>
                  Edit
                </button>
                <button
                  className="is-delete"
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !draft && <p className="profile-extra-empty">{emptyText}</p>
      )}
    </section>
  );
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
  const [technicalSkills, setTechnicalSkills] = useState(() =>
    cloneTechnicalSkills(technicalSkillsData),
  );
  const [technicalSkillsDraft, setTechnicalSkillsDraft] = useState(() =>
    cloneTechnicalSkills(technicalSkillsData),
  );
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkills, setNewSkills] = useState({});
  const [skillErrors, setSkillErrors] = useState({});
  const [projects, setProjects] = useState(() =>
    studentProjectsData.map((project) => ({
      ...project,
      technologyStack: [...project.technologyStack],
    })),
  );
  const [projectDraft, setProjectDraft] = useState(emptyProjectDraft);
  const [projectErrors, setProjectErrors] = useState({});
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [societies, setSocieties] = useState(() =>
    collegeSocietyData.appliedSocieties.map((society) => ({ ...society })),
  );
  const [isEditingSocieties, setIsEditingSocieties] = useState(false);
  const [societiesDraft, setSocietiesDraft] = useState([]);
  const [performance, setPerformance] = useState({ ...performanceData });
  const [performanceDraft, setPerformanceDraft] = useState({
    ...performanceData,
  });
  const [isEditingPerformance, setIsEditingPerformance] = useState(false);
  const [githubActivity, setGithubActivity] = useState({
    ...githubActivityData,
    recentProjects: githubActivityData.recentProjects.map((project) => ({
      ...project,
    })),
    recentActivity: githubActivityData.recentActivity.map((activity) => ({
      ...activity,
    })),
    contributionActivity: [...githubActivityData.contributionActivity],
  });
  const [githubDraft, setGithubDraft] = useState({ ...githubActivityData });
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [documents, setDocuments] = useState(() =>
    profileDocumentsData.map((document) => ({ ...document })),
  );
  const [previewDocument, setPreviewDocument] = useState(null);
  const [additionalProfile, setAdditionalProfile] = useState({
    ...additionalProfileData,
    interests: [...additionalProfileData.interests],
    languages: [...additionalProfileData.languages],
  });
  const [additionalDraft, setAdditionalDraft] = useState({
    ...additionalProfileData,
    interests: additionalProfileData.interests.join(", "),
    languages: additionalProfileData.languages.join(", "),
  });
  const [isEditingAdditional, setIsEditingAdditional] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(profileSummaryData.lastUpdated);

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

  const startEditingSkills = () => {
    setTechnicalSkillsDraft(cloneTechnicalSkills(technicalSkills));
    setNewSkills({});
    setSkillErrors({});
    setIsEditingSkills(true);
  };

  const handleNewSkillChange = (categoryId, value) => {
    setNewSkills((currentSkills) => ({
      ...currentSkills,
      [categoryId]: value,
    }));
    setSkillErrors((currentErrors) => ({
      ...currentErrors,
      [categoryId]: "",
    }));
  };

  const addSkill = (categoryId) => {
    const name = (newSkills[categoryId] || "").trim();
    if (!name) return;

    const category = technicalSkillsDraft.find(
      (item) => item.id === categoryId,
    );
    if (
      category.skills.some(
        (skill) => skill.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setSkillErrors((currentErrors) => ({
        ...currentErrors,
        [categoryId]: "This skill is already in the category.",
      }));
      return;
    }

    setTechnicalSkillsDraft((currentCategories) =>
      currentCategories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              skills: [...item.skills, { name, proficiency: 70 }],
            }
          : item,
      ),
    );
    setNewSkills((currentSkills) => ({ ...currentSkills, [categoryId]: "" }));
    setSkillErrors((currentErrors) => ({
      ...currentErrors,
      [categoryId]: "",
    }));
  };

  const removeSkill = (categoryId, skillName) => {
    setTechnicalSkillsDraft((currentCategories) =>
      currentCategories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              skills: item.skills.filter((skill) => skill.name !== skillName),
            }
          : item,
      ),
    );
  };

  const saveTechnicalSkills = (event) => {
    event.preventDefault();
    setTechnicalSkills(cloneTechnicalSkills(technicalSkillsDraft));
    setNewSkills({});
    setSkillErrors({});
    setIsEditingSkills(false);
  };

  const cancelTechnicalSkillsEdit = () => {
    setTechnicalSkillsDraft(cloneTechnicalSkills(technicalSkills));
    setNewSkills({});
    setSkillErrors({});
    setIsEditingSkills(false);
  };

  const openNewProjectForm = () => {
    setProjectDraft({ ...emptyProjectDraft });
    setProjectErrors({});
    setEditingProjectId(null);
    setIsProjectFormOpen(true);
  };

  const openEditProjectForm = (project) => {
    setProjectDraft({
      ...project,
      technologyStack: project.technologyStack.join(", "),
    });
    setProjectErrors({});
    setEditingProjectId(project.id);
    setIsProjectFormOpen(true);
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
    setProjectErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const saveProject = (event) => {
    event.preventDefault();
    const errors = validateProject(projectDraft);
    if (Object.keys(errors).length > 0) {
      setProjectErrors(errors);
      return;
    }

    const savedProject = {
      ...projectDraft,
      id: editingProjectId || `project-${Date.now()}`,
      name: projectDraft.name.trim(),
      description: projectDraft.description.trim(),
      technologyStack: projectDraft.technologyStack
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      githubUrl: projectDraft.githubUrl.trim(),
      liveDemoUrl: projectDraft.liveDemoUrl.trim(),
    };

    setProjects((currentProjects) =>
      editingProjectId
        ? currentProjects.map((project) =>
            project.id === editingProjectId ? savedProject : project,
          )
        : [...currentProjects, savedProject],
    );
    setIsProjectFormOpen(false);
    setEditingProjectId(null);
    setProjectDraft({ ...emptyProjectDraft });
    setProjectErrors({});
  };

  const cancelProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProjectId(null);
    setProjectDraft({ ...emptyProjectDraft });
    setProjectErrors({});
  };

  const deleteProject = (projectId) => {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    );
    if (editingProjectId === projectId) cancelProjectForm();
  };

  const startEditingSocieties = () => {
    setSocietiesDraft(societies.map((society) => ({ ...society })));
    setIsEditingSocieties(true);
  };

  const updateSocietyDraft = (societyId, field, value) => {
    setSocietiesDraft((currentSocieties) =>
      currentSocieties.map((society) =>
        society.id === societyId ? { ...society, [field]: value } : society,
      ),
    );
  };

  const addSociety = () => {
    setSocietiesDraft((currentSocieties) => [
      ...currentSocieties,
      {
        id: `society-${Date.now()}`,
        name: "",
        role: "Applicant",
        applicationStatus: "Applied",
        recruitmentProgress: "Application submitted",
        examStatus: "Pending",
        interviewStatus: "Pending",
        probationStatus: "Not Started",
      },
    ]);
  };

  const saveSocieties = (event) => {
    event.preventDefault();
    const savedSocieties = societiesDraft
      .filter((society) => society.name.trim())
      .map((society) => ({ ...society, name: society.name.trim() }));
    setSocieties(savedSocieties);
    setIsEditingSocieties(false);
    setLastUpdated("Today");
  };

  const cancelSocietyEdit = () => {
    setSocietiesDraft(societies.map((society) => ({ ...society })));
    setIsEditingSocieties(false);
  };

  const startEditingPerformance = () => {
    setPerformanceDraft({ ...performance });
    setIsEditingPerformance(true);
  };

  const handlePerformanceChange = (event) => {
    const { name, value } = event.target;
    setPerformanceDraft((currentDraft) => ({
      ...currentDraft,
      [name]: name === "mentorFeedback" ? value : Number(value),
    }));
  };

  const savePerformance = (event) => {
    event.preventDefault();
    setPerformance({ ...performanceDraft });
    setIsEditingPerformance(false);
    setLastUpdated("Today");
  };

  const cancelPerformanceEdit = () => {
    setPerformanceDraft({ ...performance });
    setIsEditingPerformance(false);
  };

  const startEditingGithub = () => {
    setGithubDraft({ ...githubActivity });
    setIsEditingGithub(true);
  };

  const handleGithubChange = (event) => {
    const { name, value } = event.target;
    setGithubDraft((currentDraft) => ({
      ...currentDraft,
      [name]: ["repositoryCount", "contributionsThisYear", "commitsThisMonth"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const saveGithub = (event) => {
    event.preventDefault();
    try {
      const profileUrl = new URL(githubDraft.profileUrl);
      if (!["http:", "https:"].includes(profileUrl.protocol)) return;
    } catch {
      return;
    }

    setGithubActivity({ ...githubActivity, ...githubDraft });
    setIsEditingGithub(false);
    setLastUpdated("Today");
  };

  const cancelGithubEdit = () => {
    setGithubDraft({ ...githubActivity });
    setIsEditingGithub(false);
  };

  const uploadDocument = (documentId, file) => {
    if (!file) return;
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              fileName: file.name,
              verificationStatus: "Pending",
              updated: "Uploaded just now",
            }
          : document,
      ),
    );
    setLastUpdated("Today");
  };

  const startEditingAdditional = () => {
    setAdditionalDraft({
      ...additionalProfile,
      interests: additionalProfile.interests.join(", "),
      languages: additionalProfile.languages.join(", "),
    });
    setIsEditingAdditional(true);
  };

  const handleAdditionalChange = (event) => {
    const { name, value } = event.target;
    setAdditionalDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  };

  const saveAdditionalProfile = (event) => {
    event.preventDefault();
    setAdditionalProfile({
      ...additionalDraft,
      interests: additionalDraft.interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      languages: additionalDraft.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setIsEditingAdditional(false);
    setLastUpdated("Today");
  };

  const cancelAdditionalEdit = () => {
    setAdditionalDraft({
      ...additionalProfile,
      interests: additionalProfile.interests.join(", "),
      languages: additionalProfile.languages.join(", "),
    });
    setIsEditingAdditional(false);
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

      <section
        className="profile-information profile-skills-section"
        aria-labelledby="technical-skills-title"
      >
        <form onSubmit={saveTechnicalSkills} noValidate>
          <div className="profile-information-heading">
            <div>
              <p className="profile-information-eyebrow">
                Technical skills &amp; domains
              </p>
              <h2 id="technical-skills-title">What you build with</h2>
            </div>
            {isEditingSkills ? (
              <div className="profile-information-actions">
                <button className="profile-information-action" type="submit">
                  Save Skills
                </button>
                <button
                  className="profile-information-action is-secondary"
                  type="button"
                  onClick={cancelTechnicalSkillsEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="profile-information-action"
                type="button"
                onClick={startEditingSkills}
              >
                Edit Skills
              </button>
            )}
          </div>

          <div className="profile-skill-categories">
            {technicalSkills.map((category) => {
              const editableCategory = isEditingSkills
                ? technicalSkillsDraft.find((item) => item.id === category.id)
                : category;

              return (
                <section
                  className="profile-skill-category"
                  aria-labelledby={`skill-category-${category.id}`}
                  key={category.id}
                >
                  <h3 id={`skill-category-${category.id}`}>
                    {category.category}
                  </h3>
                  <div className="profile-skill-tags">
                    {editableCategory.skills.map((skill) => (
                      <span className="profile-skill-tag" key={skill.name}>
                        <span>{skill.name}</span>
                        {skill.proficiency != null && (
                          <span className="profile-skill-proficiency">
                            {skill.proficiency}%
                          </span>
                        )}
                        {isEditingSkills && (
                          <button
                            className="profile-skill-remove"
                            type="button"
                            aria-label={`Remove ${skill.name} from ${category.category}`}
                            onClick={() =>
                              removeSkill(category.id, skill.name)
                            }
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditingSkills && (
                    <div className="profile-skill-add">
                      <input
                        className="profile-information-control"
                        type="text"
                        aria-label={`New skill for ${category.category}`}
                        placeholder="Add a skill"
                        value={newSkills[category.id] || ""}
                        onChange={(event) =>
                          handleNewSkillChange(category.id, event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addSkill(category.id);
                          }
                        }}
                      />
                      <button
                        className="profile-skill-add-button"
                        type="button"
                        disabled={!(newSkills[category.id] || "").trim()}
                        onClick={() => addSkill(category.id)}
                      >
                        Add
                      </button>
                    </div>
                  )}
                  {skillErrors[category.id] && (
                    <p className="profile-information-error" role="alert">
                      {skillErrors[category.id]}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </form>
      </section>

      <section
        className="profile-information profile-projects-section"
        aria-labelledby="projects-title"
      >
        <div className="profile-information-heading">
          <div>
            <p className="profile-information-eyebrow">
              Projects &amp; contributions
            </p>
            <h2 id="projects-title">Selected work</h2>
          </div>
          <button
            className="profile-information-action"
            type="button"
            onClick={openNewProjectForm}
          >
            Add Project
          </button>
        </div>

        {isProjectFormOpen && (
          <form
            className="profile-project-form"
            onSubmit={saveProject}
            noValidate
          >
            <h3>{editingProjectId ? "Edit project" : "New project"}</h3>
            <div className="profile-project-form-grid">
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-name"
                >
                  Project Name
                </label>
                <input
                  className={`profile-information-control${
                    projectErrors.name ? " is-invalid" : ""
                  }`}
                  id="project-name"
                  name="name"
                  type="text"
                  value={projectDraft.name}
                  onChange={handleProjectChange}
                  aria-invalid={Boolean(projectErrors.name)}
                  aria-describedby={
                    projectErrors.name ? "project-name-error" : undefined
                  }
                  required
                />
                {projectErrors.name && (
                  <p
                    className="profile-information-error"
                    id="project-name-error"
                    role="alert"
                  >
                    {projectErrors.name}
                  </p>
                )}
              </div>
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-technology-stack"
                >
                  Technology Stack
                </label>
                <input
                  className="profile-information-control"
                  id="project-technology-stack"
                  name="technologyStack"
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={projectDraft.technologyStack}
                  onChange={handleProjectChange}
                />
              </div>
              <div className="profile-information-field is-wide">
                <label
                  className="profile-information-label"
                  htmlFor="project-description"
                >
                  Description
                </label>
                <textarea
                  className="profile-information-control"
                  id="project-description"
                  name="description"
                  value={projectDraft.description}
                  onChange={handleProjectChange}
                  rows="3"
                />
              </div>
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-role"
                >
                  Project Role
                </label>
                <select
                  className="profile-information-control"
                  id="project-role"
                  name="role"
                  value={projectDraft.role}
                  onChange={handleProjectChange}
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Full Stack</option>
                </select>
              </div>
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-status"
                >
                  Project Status
                </label>
                <select
                  className="profile-information-control"
                  id="project-status"
                  name="status"
                  value={projectDraft.status}
                  onChange={handleProjectChange}
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-github-url"
                >
                  GitHub Repository Link
                </label>
                <input
                  className={`profile-information-control${
                    projectErrors.githubUrl ? " is-invalid" : ""
                  }`}
                  id="project-github-url"
                  name="githubUrl"
                  type="url"
                  placeholder="https://github.com/..."
                  value={projectDraft.githubUrl}
                  onChange={handleProjectChange}
                  aria-invalid={Boolean(projectErrors.githubUrl)}
                  aria-describedby={
                    projectErrors.githubUrl
                      ? "project-github-url-error"
                      : undefined
                  }
                />
                {projectErrors.githubUrl && (
                  <p
                    className="profile-information-error"
                    id="project-github-url-error"
                    role="alert"
                  >
                    {projectErrors.githubUrl}
                  </p>
                )}
              </div>
              <div className="profile-information-field">
                <label
                  className="profile-information-label"
                  htmlFor="project-live-demo-url"
                >
                  Live Demo Link
                </label>
                <input
                  className={`profile-information-control${
                    projectErrors.liveDemoUrl ? " is-invalid" : ""
                  }`}
                  id="project-live-demo-url"
                  name="liveDemoUrl"
                  type="url"
                  placeholder="https://..."
                  value={projectDraft.liveDemoUrl}
                  onChange={handleProjectChange}
                  aria-invalid={Boolean(projectErrors.liveDemoUrl)}
                  aria-describedby={
                    projectErrors.liveDemoUrl
                      ? "project-live-demo-url-error"
                      : undefined
                  }
                />
                {projectErrors.liveDemoUrl && (
                  <p
                    className="profile-information-error"
                    id="project-live-demo-url-error"
                    role="alert"
                  >
                    {projectErrors.liveDemoUrl}
                  </p>
                )}
              </div>
            </div>
            <div className="profile-information-actions profile-project-form-actions">
              <button className="profile-information-action" type="submit">
                {editingProjectId ? "Save Changes" : "Save Project"}
              </button>
              <button
                className="profile-information-action is-secondary"
                type="button"
                onClick={cancelProjectForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="profile-project-grid">
          {projects.map((project) => (
            <article className="profile-project-card" key={project.id}>
              <div className="profile-project-thumbnail" aria-hidden="true">
                <span className="profile-project-thumbnail-mark">
                  {project.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="profile-project-thumbnail-line" />
                <span className="profile-project-thumbnail-line" />
              </div>
              <div className="profile-project-content">
                <div className="profile-project-title-row">
                  <h3>{project.name}</h3>
                  <span
                    className={`profile-project-status status-${project.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="profile-project-description">
                  {project.description}
                </p>
                <p className="profile-project-role">Role · {project.role}</p>
                <div className="profile-project-technologies">
                  {project.technologyStack.map((technology) => (
                    <span className="profile-project-technology" key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="profile-project-footer">
                  <div className="profile-project-links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                  <div className="profile-project-actions">
                    <button
                      className="profile-project-manage"
                      type="button"
                      onClick={() => openEditProjectForm(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="profile-project-manage is-delete"
                      type="button"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && !isProjectFormOpen && (
            <p className="profile-project-empty">
              No projects added yet. Add a project to showcase your work.
            </p>
          )}
        </div>
      </section>

      <EditableProfileCollection
        eyebrow="Recognition & learning"
        title="Achievements & Certifications"
        addLabel="Add Achievement"
        fields={[
          { key: "title", label: "Certificate or achievement", required: true },
          { key: "organization", label: "Issuing organization" },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: ["Certificate", "Award", "Competition", "Achievement"],
          },
          { key: "date", label: "Date", type: "date" },
          {
            key: "description",
            label: "Details",
            type: "textarea",
            wide: true,
          },
          {
            key: "verificationStatus",
            label: "Verification",
            type: "select",
            options: ["Verified", "Pending", "Unverified"],
          },
          { key: "verificationUrl", label: "Certificate verification link", type: "url" },
        ]}
        initialRecords={achievementsData}
        emptyText="Add certificates, awards, and other achievements."
        renderRecord={(record, { isExpanded, toggleDetails }) => (
          <>
            <div className="profile-record-topline">
              <span className="profile-record-kind">{record.type}</span>
              <span
                className={`profile-status-badge status-${record.verificationStatus
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {record.verificationStatus}
              </span>
            </div>
            <h3>{record.title}</h3>
            <p className="profile-record-meta">
              {record.organization}
              {record.date &&
                ` · ${new Date(`${record.date}T00:00:00`).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}`}
            </p>
            {isExpanded && (
              <p className="profile-record-description">{record.description}</p>
            )}
            <div className="profile-record-links">
              <button type="button" onClick={toggleDetails}>
                {isExpanded ? "Hide details" : "View details"}
              </button>
              {record.verificationUrl && (
                <a href={record.verificationUrl} target="_blank" rel="noreferrer">
                  Verify certificate
                </a>
              )}
            </div>
          </>
        )}
      />

      <section
        className="profile-information profile-extra-section"
        aria-labelledby="society-information-title"
      >
        <div className="profile-information-heading">
          <div>
            <p className="profile-information-eyebrow">Campus involvement</p>
            <h2 id="society-information-title">College Society Information</h2>
          </div>
          {!isEditingSocieties ? (
            <button
              className="profile-information-action"
              type="button"
              onClick={startEditingSocieties}
            >
              Edit Societies
            </button>
          ) : (
            <div className="profile-information-actions">
              <button
                className="profile-information-action"
                type="submit"
                form="societies-form"
              >
                Save Changes
              </button>
              <button
                className="profile-information-action is-secondary"
                type="button"
                onClick={cancelSocietyEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <form id="societies-form" onSubmit={saveSocieties}>
          <div className="profile-society-list">
            {(isEditingSocieties ? societiesDraft : societies).map((society) => (
              <article className="profile-society-card" key={society.id}>
                <div className="profile-society-heading">
                  {isEditingSocieties ? (
                    <input
                      className="profile-information-control"
                      aria-label="Society name"
                      value={society.name}
                      required
                      onChange={(event) =>
                        updateSocietyDraft(society.id, "name", event.target.value)
                      }
                    />
                  ) : (
                    <h3>{society.name}</h3>
                  )}
                  <span className="profile-status-badge status-in-progress">
                    {society.role}
                  </span>
                </div>
                <div className="profile-society-details">
                  {[
                    ["Application status", "applicationStatus", ["Applied", "In Review", "Shortlisted", "Accepted", "Rejected"]],
                    ["Recruitment progress", "recruitmentProgress"],
                    ["Exam", "examStatus", ["Pending", "Scheduled", "Passed", "Not Required"]],
                    ["Interview", "interviewStatus", ["Pending", "Scheduled", "Passed", "Not Required"]],
                    ["Probation", "probationStatus", ["Not Started", "In Progress", "Completed"]],
                    ["Membership role", "role", ["Applicant", "Probationer", "Member", "Lead"]],
                  ].map(([label, key, options]) => (
                    <div className="profile-society-detail" key={key}>
                      <span className="profile-information-label">{label}</span>
                      {isEditingSocieties && options ? (
                        <select
                          className="profile-information-control"
                          aria-label={`${label} for ${society.name || "new society"}`}
                          value={society[key]}
                          onChange={(event) =>
                            updateSocietyDraft(society.id, key, event.target.value)
                          }
                        >
                          {options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : isEditingSocieties ? (
                        <input
                          className="profile-information-control"
                          aria-label={label}
                          value={society[key]}
                          onChange={(event) =>
                            updateSocietyDraft(society.id, key, event.target.value)
                          }
                        />
                      ) : (
                        <strong>{society[key]}</strong>
                      )}
                    </div>
                  ))}
                </div>
                {isEditingSocieties && (
                  <button
                    className="profile-record-remove"
                    type="button"
                    onClick={() =>
                      setSocietiesDraft((current) =>
                        current.filter((item) => item.id !== society.id),
                      )
                    }
                  >
                    Remove society
                  </button>
                )}
              </article>
            ))}
          </div>
          {isEditingSocieties && (
            <div className="profile-society-edit-footer">
              <button
                className="profile-completion-action"
                type="button"
                onClick={addSociety}
              >
                Add Society
              </button>
            </div>
          )}
        </form>
      </section>

      <section
        className="profile-information profile-extra-section"
        aria-labelledby="performance-title"
      >
        <div className="profile-information-heading">
          <div>
            <p className="profile-information-eyebrow">Growth &amp; feedback</p>
            <h2 id="performance-title">Performance &amp; Evaluation</h2>
          </div>
          {!isEditingPerformance ? (
            <button
              className="profile-information-action"
              type="button"
              onClick={startEditingPerformance}
            >
              Edit Evaluation
            </button>
          ) : (
            <div className="profile-information-actions">
              <button
                className="profile-information-action"
                type="submit"
                form="performance-form"
              >
                Save Changes
              </button>
              <button
                className="profile-information-action is-secondary"
                type="button"
                onClick={cancelPerformanceEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <form id="performance-form" onSubmit={savePerformance}>
          <div className="profile-performance-score">
            <div className="profile-performance-overall">
              <span>Overall performance</span>
              {isEditingPerformance ? (
                <input
                  className="profile-information-control"
                  aria-label="Overall performance score"
                  type="number"
                  min="0"
                  max="100"
                  value={performanceDraft.overallScore}
                  name="overallScore"
                  onChange={handlePerformanceChange}
                />
              ) : (
                <strong>{performance.overallScore}<small>/100</small></strong>
              )}
            </div>
            <div className="profile-performance-metrics">
              {[
                ["Technical skills", "technicalSkillsScore"],
                ["Communication", "communicationScore"],
                ["Teamwork", "teamworkScore"],
              ].map(([label, key]) => {
                const score = performance[key];
                return (
                  <div className="profile-performance-metric" key={key}>
                    <div className="profile-performance-label">
                      <span>{label}</span>
                      {isEditingPerformance ? (
                        <input
                          className="profile-performance-number"
                          aria-label={`${label} score`}
                          type="number"
                          min="0"
                          max="100"
                          name={key}
                          value={performanceDraft[key]}
                          onChange={handlePerformanceChange}
                        />
                      ) : (
                        <strong>{score}%</strong>
                      )}
                    </div>
                    <div
                      className="profile-performance-track"
                      role="progressbar"
                      aria-label={`${label} score`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={score}
                    >
                      <span style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="profile-feedback">
            <h3>Mentor feedback</h3>
            {isEditingPerformance ? (
              <textarea
                className="profile-information-control"
                name="mentorFeedback"
                aria-label="Mentor feedback"
                rows="3"
                value={performanceDraft.mentorFeedback}
                onChange={handlePerformanceChange}
              />
            ) : (
              <p>{performance.mentorFeedback}</p>
            )}
          </div>
        </form>
        <div className="profile-evaluation-history">
          <h3>Evaluation history</h3>
          <div className="profile-evaluation-list">
            {performance.evaluationHistory.map((evaluation) => (
              <div className="profile-evaluation-item" key={evaluation.period}>
                <span>{evaluation.period}</span>
                <strong>{evaluation.score}%</strong>
                <small>{evaluation.evaluator}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="profile-information profile-extra-section"
        aria-labelledby="github-activity-title"
      >
        <div className="profile-information-heading">
          <div>
            <p className="profile-information-eyebrow">Open source &amp; code</p>
            <h2 id="github-activity-title">GitHub &amp; Development Activity</h2>
          </div>
          {!isEditingGithub ? (
            <button
              className="profile-information-action"
              type="button"
              onClick={startEditingGithub}
            >
              Edit Activity
            </button>
          ) : (
            <div className="profile-information-actions">
              <button
                className="profile-information-action"
                type="submit"
                form="github-form"
              >
                Save Changes
              </button>
              <button
                className="profile-information-action is-secondary"
                type="button"
                onClick={cancelGithubEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <form id="github-form" onSubmit={saveGithub} noValidate>
          {isEditingGithub ? (
            <div className="profile-github-edit-grid">
              <label className="profile-information-field">
                <span className="profile-information-label">GitHub username</span>
                <input
                  className="profile-information-control"
                  name="username"
                  value={githubDraft.username}
                  onChange={handleGithubChange}
                />
              </label>
              <label className="profile-information-field">
                <span className="profile-information-label">Profile link</span>
                <input
                  className="profile-information-control"
                  name="profileUrl"
                  type="url"
                  value={githubDraft.profileUrl}
                  onChange={handleGithubChange}
                />
              </label>
              {[
                ["Repositories", "repositoryCount"],
                ["Contributions this year", "contributionsThisYear"],
                ["Commits this month", "commitsThisMonth"],
              ].map(([label, key]) => (
                <label className="profile-information-field" key={key}>
                  <span className="profile-information-label">{label}</span>
                  <input
                    className="profile-information-control"
                    type="number"
                    min="0"
                    name={key}
                    value={githubDraft[key]}
                    onChange={handleGithubChange}
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="profile-github-overview">
              <a
                className="profile-github-identity"
                href={githubActivity.profileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="profile-github-mark" aria-hidden="true">GH</span>
                <span>@{githubActivity.username}</span>
                <span aria-hidden="true">↗</span>
              </a>
              <div className="profile-github-stats">
                <div><strong>{githubActivity.repositoryCount}</strong><span>Repositories</span></div>
                <div><strong>{githubActivity.contributionsThisYear}</strong><span>Contributions</span></div>
                <div><strong>{githubActivity.commitsThisMonth}</strong><span>Commits this month</span></div>
              </div>
            </div>
          )}
        </form>
        <div className="profile-contribution-panel">
          <div className="profile-subsection-heading">
            <h3>Contribution activity</h3>
            <span>Last 12 weeks · {githubActivity.contributionsThisYear} this year</span>
          </div>
          <div
            className="profile-contribution-grid"
            role="img"
            aria-label="Mock contribution activity over the last 12 weeks"
          >
            {githubActivity.contributionActivity.map((level, index) => (
              <span
                className={`profile-contribution-day level-${level}`}
                key={`${index}-${level}`}
                title={`${level} contribution${level === 1 ? "" : "s"}`}
              />
            ))}
          </div>
          <div className="profile-contribution-legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                className={`profile-contribution-day level-${level}`}
                key={level}
              />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="profile-github-lists">
          <div>
            <h3>Recent repositories</h3>
            {githubActivity.recentProjects.map((project) => (
              <div className="profile-github-list-item" key={project.name}>
                <strong>{project.name}</strong>
                <span>{project.language} · {project.updated}</span>
              </div>
            ))}
          </div>
          <div>
            <h3>Development activity</h3>
            {githubActivity.recentActivity.map((activity) => (
              <div className="profile-github-list-item" key={activity.title}>
                <strong>{activity.title}</strong>
                <span>{activity.kind} · {activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditableProfileCollection
        eyebrow="Beyond the classroom"
        title="Extra-curricular Activities"
        addLabel="Add Activity"
        fields={[
          { key: "title", label: "Club, volunteering, or event", required: true },
          { key: "role", label: "Role" },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: ["Club", "Volunteering", "Event", "Leadership"],
          },
          { key: "period", label: "Participation period" },
          { key: "description", label: "Contribution", type: "textarea", wide: true },
        ]}
        initialRecords={extracurricularActivitiesData}
        emptyText="Add clubs, volunteering, events, or leadership activities."
        renderRecord={(activity) => (
          <>
            <div className="profile-record-topline">
              <span className="profile-record-kind">{activity.category}</span>
            </div>
            <h3>{activity.title}</h3>
            <p className="profile-record-meta">{activity.role} · {activity.period}</p>
            <p className="profile-record-description">{activity.description}</p>
          </>
        )}
      />

      <section
        className="profile-information profile-extra-section"
        aria-labelledby="documents-title"
      >
        <div className="profile-information-heading">
          <div>
            <p className="profile-information-eyebrow">Secure records</p>
            <h2 id="documents-title">Documents &amp; Verification</h2>
          </div>
          <span className="profile-documents-note">Demo upload · local session only</span>
        </div>
        <div className="profile-documents-grid">
          {documents.map((document) => (
            <article className="profile-document-card" key={document.id}>
              <div className="profile-document-icon" aria-hidden="true">PDF</div>
              <div className="profile-document-copy">
                <h3>{document.name}</h3>
                <p>{document.fileName}</p>
                <small>{document.updated}</small>
              </div>
              <span
                className={`profile-status-badge status-${document.verificationStatus.toLowerCase()}`}
              >
                {document.verificationStatus}
              </span>
              <div className="profile-document-actions">
                <button
                  type="button"
                  onClick={() => setPreviewDocument(document)}
                >
                  Preview
                </button>
                <label className="profile-document-upload">
                  Upload replacement
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    aria-label={`Upload replacement ${document.name}`}
                    onChange={(event) =>
                      uploadDocument(document.id, event.target.files?.[0])
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
        {previewDocument && (
          <div
            className="profile-preview-backdrop"
            role="presentation"
            onClick={() => setPreviewDocument(null)}
          >
            <div
              className="profile-preview-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="document-preview-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="profile-information-heading">
                <div>
                  <p className="profile-information-eyebrow">Document preview</p>
                  <h2 id="document-preview-title">{previewDocument.name}</h2>
                </div>
                <button
                  className="profile-information-action is-secondary"
                  type="button"
                  onClick={() => setPreviewDocument(null)}
                >
                  Close
                </button>
              </div>
              <div className="profile-preview-paper">
                <span className="profile-document-icon" aria-hidden="true">PDF</span>
                <strong>{previewDocument.fileName}</strong>
                <p>Preview is a mock display. Uploaded files are not stored or transmitted.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        className="profile-information profile-extra-section"
        aria-labelledby="additional-details-title"
      >
        <form onSubmit={saveAdditionalProfile}>
          <div className="profile-information-heading">
            <div>
              <p className="profile-information-eyebrow">A little more about you</p>
              <h2 id="additional-details-title">Additional Profile Details</h2>
            </div>
            {!isEditingAdditional ? (
              <button
                className="profile-information-action"
                type="button"
                onClick={startEditingAdditional}
              >
                Edit Details
              </button>
            ) : (
              <div className="profile-information-actions">
                <button className="profile-information-action" type="submit">
                  Save Changes
                </button>
                <button
                  className="profile-information-action is-secondary"
                  type="button"
                  onClick={cancelAdditionalEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {isEditingAdditional ? (
            <div className="profile-additional-grid">
              <label className="profile-information-field">
                <span className="profile-information-label">Interests (comma separated)</span>
                <input
                  className="profile-information-control"
                  name="interests"
                  value={additionalDraft.interests}
                  onChange={handleAdditionalChange}
                />
              </label>
              <label className="profile-information-field">
                <span className="profile-information-label">Languages (comma separated)</span>
                <input
                  className="profile-information-control"
                  name="languages"
                  value={additionalDraft.languages}
                  onChange={handleAdditionalChange}
                />
              </label>
              <label className="profile-information-field profile-additional-wide">
                <span className="profile-information-label">Career goals</span>
                <textarea
                  className="profile-information-control"
                  name="careerGoals"
                  rows="3"
                  value={additionalDraft.careerGoals}
                  onChange={handleAdditionalChange}
                />
              </label>
              <label className="profile-information-field">
                <span className="profile-information-label">Portfolio URL</span>
                <input
                  className="profile-information-control"
                  name="portfolioUrl"
                  type="url"
                  value={additionalDraft.portfolioUrl}
                  onChange={handleAdditionalChange}
                />
              </label>
              <label className="profile-information-field">
                <span className="profile-information-label">LinkedIn URL</span>
                <input
                  className="profile-information-control"
                  name="linkedInUrl"
                  type="url"
                  value={additionalDraft.linkedInUrl}
                  onChange={handleAdditionalChange}
                />
              </label>
              <label className="profile-information-field">
                <span className="profile-information-label">Profile visibility</span>
                <select
                  className="profile-information-control"
                  name="visibility"
                  value={additionalDraft.visibility}
                  onChange={handleAdditionalChange}
                >
                  <option>Public</option>
                  <option>Society members</option>
                  <option>Private</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="profile-additional-grid">
              <div className="profile-additional-item profile-additional-wide">
                <span className="profile-information-label">Career goals</span>
                <p>{additionalProfile.careerGoals}</p>
              </div>
              <div className="profile-additional-item">
                <span className="profile-information-label">Interests</span>
                <div className="profile-project-technologies">
                  {additionalProfile.interests.map((interest) => (
                    <span className="profile-project-technology" key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="profile-additional-item">
                <span className="profile-information-label">Languages</span>
                <div className="profile-project-technologies">
                  {additionalProfile.languages.map((language) => (
                    <span className="profile-project-technology" key={language}>
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              <div className="profile-additional-item">
                <span className="profile-information-label">Portfolio</span>
                <a href={additionalProfile.portfolioUrl} target="_blank" rel="noreferrer">
                  {additionalProfile.portfolioUrl}
                </a>
              </div>
              <div className="profile-additional-item">
                <span className="profile-information-label">LinkedIn</span>
                <a href={additionalProfile.linkedInUrl} target="_blank" rel="noreferrer">
                  {additionalProfile.linkedInUrl}
                </a>
              </div>
              <div className="profile-additional-item">
                <span className="profile-information-label">Profile visibility</span>
                <span className="profile-status-badge status-verified">
                  {additionalProfile.visibility}
                </span>
              </div>
            </div>
          )}
        </form>
      </section>

      <section
        className="profile-summary-card"
        aria-labelledby="profile-summary-title"
      >
        <div className="profile-summary-main">
          <p className="profile-information-eyebrow">Your SocietySelect profile</p>
          <h2 id="profile-summary-title">{profileSummaryData.profileOwner}</h2>
          <p>{profileSummaryData.headline}</p>
          <div className="profile-summary-highlights">
            <span>{academicInformation.college}</span>
            <span>{studentData.societyRole}</span>
            <span>{projects.length} projects</span>
            <span>{achievementsData.length} achievements listed</span>
          </div>
        </div>
        <div className="profile-summary-completion">
          <span>Profile completion</span>
          <strong>{profileCompletionData.percentage}%</strong>
          <div className="profile-completion-track" role="progressbar" aria-label="Profile completion summary" aria-valuemin="0" aria-valuemax="100" aria-valuenow={profileCompletionData.percentage}>
            <span className="profile-completion-fill" />
          </div>
          <small>Last updated {lastUpdated}</small>
        </div>
      </section>
    </main>
  );
};

export default StudentProfile;
