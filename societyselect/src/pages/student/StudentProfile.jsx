import { useState } from "react";
import {
  academicInformationData,
  personalInformationData,
  profileCompletionData,
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
    </main>
  );
};

export default StudentProfile;
