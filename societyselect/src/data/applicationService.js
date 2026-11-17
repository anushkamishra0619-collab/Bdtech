const APPLICATIONS_STORAGE_KEY = "societyselect.applications";

const parseWebUrl = (value) => {
  try {
    const url = new URL(value);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
};

const isValidGitHubProfileUrl = (value) => {
  const url = parseWebUrl(value);
  if (!url || !["github.com", "www.github.com"].includes(url.hostname)) {
    return false;
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  return (
    pathParts.length === 1 &&
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(pathParts[0])
  );
};

export const validateApplication = ({ society, student, formData }) => {
  const errors = {};

  for (const [field, label] of [
    ["fullName", "Full name"],
    ["studentNumber", "Student number"],
    ["branch", "Branch"],
    ["currentCgpa", "Current CGPA"],
  ]) {
    if (!String(student[field] ?? "").trim()) {
      errors[field] = `${label} is missing from your profile.`;
    }
  }

  if (
    !String(student.academicYear ?? "").trim() ||
    !String(student.currentSemester ?? "").trim()
  ) {
    errors.yearAndSemester = "Year and semester must be present in your profile.";
  }

  const availablePositions = society.details?.availablePositions ?? [];
  if (!availablePositions.some((position) => position.title === formData.position)) {
    errors.position = "Select an available position.";
  }

  const motivationText = String(formData.motivation ?? "");
  const motivationLength = motivationText.trim().length;
  if (motivationLength < 50) {
    errors.motivation = "Motivation must contain at least 50 characters.";
  } else if (motivationText.length > 600) {
    errors.motivation = "Motivation cannot exceed 600 characters.";
  }

  if (!String(formData.relevantSkills ?? "").trim()) {
    errors.relevantSkills = "Describe relevant skills or experience.";
  }

  if (!isValidGitHubProfileUrl(String(formData.githubUrl ?? "").trim())) {
    errors.githubUrl = "Enter a valid GitHub profile URL (for example, https://github.com/username).";
  }

  const portfolioUrl = String(formData.portfolioUrl ?? "").trim();
  if (portfolioUrl && !parseWebUrl(portfolioUrl)) {
    errors.portfolioUrl = "Enter a valid http or https portfolio URL.";
  }

  if (!formData.confirmed) {
    errors.confirmed = "Confirm that the information provided is accurate.";
  }

  return errors;
};

export const hasDuplicateApplication = (applications, societyId, studentNumber) =>
  applications.some(
    (application) =>
      application?.societyId === societyId &&
      application?.student?.studentNumber === studentNumber,
  );

export const getApplications = () => {
  const storedValue = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  if (!storedValue) return [];

  let applications;
  try {
    applications = JSON.parse(storedValue);
  } catch {
    throw new Error("Saved application data is unreadable. Clear the local application data and try again.");
  }

  if (
    !Array.isArray(applications) ||
    applications.some(
      (application) =>
        !application ||
        typeof application.applicationId !== "string" ||
        typeof application.societyId !== "string" ||
        typeof application.societyName !== "string" ||
        typeof application.position !== "string" ||
        typeof application.status !== "string" ||
        typeof application.submittedAt !== "string" ||
        !application.student ||
        typeof application.student.fullName !== "string" ||
        typeof application.student.studentNumber !== "string" ||
        !application.responses ||
        typeof application.responses !== "object",
    )
  ) {
    throw new Error("Saved application data has an invalid format.");
  }
  if (
    new Set(applications.map((application) => application.applicationId)).size !==
    applications.length
  ) {
    throw new Error("Saved application data contains duplicate IDs.");
  }

  return applications;
};

export const saveApplication = (application) => {
  const applications = getApplications();
  if (
    hasDuplicateApplication(
      applications,
      application.societyId,
      application.student.studentNumber,
    )
  ) {
    throw new Error("You have already submitted an application to this society.");
  }
  if (applications.some((item) => item.applicationId === application.applicationId)) {
    throw new Error("An application with this ID already exists. Please submit again.");
  }

  const updatedApplications = [application, ...applications];
  window.localStorage.setItem(
    APPLICATIONS_STORAGE_KEY,
    JSON.stringify(updatedApplications),
  );
  return updatedApplications;
};

export const createApplicationRecord = ({ society, student, formData }) => {
  const uniqueId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    applicationId: `SS-APP-${uniqueId}`,
    societyId: society.id,
    societyName: society.name,
    position: formData.position,
    student,
    responses: {
      motivation: formData.motivation.trim(),
      relevantSkills: formData.relevantSkills.trim(),
      githubUrl: formData.githubUrl.trim(),
      portfolioUrl: formData.portfolioUrl.trim(),
    },
    submittedAt: new Date().toISOString(),
    status: "Submitted",
  };
};
