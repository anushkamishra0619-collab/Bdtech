import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import MentorSidebar from "../Components/MentorSidebar";
import {
  getSocieties,
  saveSocieties,
  SOCIETIES_STORAGE_KEY,
} from "../data/societyService";
import "./MentorDashboard.css";

const createSocietyForm = (society) => ({
  name: society?.name ?? "",
  category: society?.category ?? "Technical",
  description: society?.description ?? "",
  about: society?.details?.about ?? "",
  objectives: (society?.details?.objectives ?? []).join("\n"),
  requiredSkills: (society?.details?.requiredSkills ?? []).join(", "),
  domains: (society?.details?.domains ?? []).join(", "),
  availablePositions: society?.details?.availablePositions?.map((position) => ({
    title: position.title ?? "",
    openings: position.openings ?? 0,
    description: position.description ?? "",
  })) ?? [{ title: "", openings: 1, description: "" }],
  eligibilityYear: society?.details?.eligibility?.year ?? "",
  eligibilityCriteria: society?.details?.eligibility?.criteria ?? "",
  deadline: society?.deadline ?? "",
  coordinatorName: society?.details?.facultyCoordinator?.name ?? "",
  coordinatorTitle: society?.details?.facultyCoordinator?.title ?? "",
  contactEmail: society?.details?.contactInfo?.email ?? "",
  contactPhone: society?.details?.contactInfo?.phone ?? "",
  socialLinks: (society?.details?.socialLinks ?? [])
    .map((link) => `${link.label ?? ""}|${link.url ?? ""}`)
    .join("\n"),
  achievements: (society?.details?.achievements ?? [])
    .map((achievement) => achievement.title ?? achievement.name ?? achievement)
    .join("\n"),
  isOpen: society?.isOpen ?? true,
  isActive: society?.isActive !== false,
});

const splitList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const makeSocietyId = (name, societies) => {
  const baseId = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "society";
  let id = baseId;
  let suffix = 2;
  while (societies.some((society) => society.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }
  return id;
};

const buildSociety = (form, existingSociety, societies) => {
  const name = form.name.trim();
  const eligibilityYear = form.eligibilityYear.trim();
  const eligibilityCriteria = form.eligibilityCriteria.trim();
  const socialLinks = form.socialLinks
    .split("\n")
    .map((line) => {
      const [label, ...urlParts] = line.split("|");
      return { label: label.trim(), url: urlParts.join("|").trim() };
    })
    .filter((link) => link.label && link.url);
  const facultyCoordinator = form.coordinatorName.trim()
    ? {
        name: form.coordinatorName.trim(),
        ...(form.coordinatorTitle.trim() && {
          title: form.coordinatorTitle.trim(),
        }),
      }
    : null;
  const contactInfo =
    form.contactEmail.trim() || form.contactPhone.trim()
      ? {
          ...(form.contactEmail.trim() && { email: form.contactEmail.trim() }),
          ...(form.contactPhone.trim() && { phone: form.contactPhone.trim() }),
        }
      : null;

  return {
    ...existingSociety,
    id: existingSociety?.id ?? makeSocietyId(name, societies),
    name,
    initials:
      existingSociety?.initials ??
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    category: form.category,
    description: form.description.trim(),
    deadline: form.deadline,
    isOpen: form.isOpen,
    isActive: form.isActive,
    details: {
      ...existingSociety?.details,
      dataStatus:
        existingSociety?.details?.dataStatus ??
        "Demonstration data · pending official confirmation",
      about: form.about.trim(),
      objectives: splitList(form.objectives),
      domains: splitList(form.domains),
      requiredSkills: splitList(form.requiredSkills),
      availablePositions: form.availablePositions
        .filter((position) => position.title.trim())
        .map((position) => ({
          title: position.title.trim(),
          openings: Math.max(0, Number(position.openings) || 0),
          ...(position.description.trim() && {
            description: position.description.trim(),
          }),
        })),
      eligibility:
        eligibilityYear || eligibilityCriteria
          ? {
              ...(eligibilityYear && { year: eligibilityYear }),
              ...(eligibilityCriteria && { criteria: eligibilityCriteria }),
            }
          : null,
      facultyCoordinator,
      contactInfo,
      socialLinks,
      activities: existingSociety?.details?.activities ?? [],
      achievements: splitList(form.achievements),
    },
  };
};

const MentorSocietyManagement = () => {
  const [authorized, setAuthorized] = useState(null);
  const [accessError, setAccessError] = useState("");
  const [mentorRole, setMentorRole] = useState("");
  const [societies, setSocieties] = useState([]);
  const [editingSocietyId, setEditingSocietyId] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(window.localStorage.getItem("user") ?? "null");
      const role = String(user?.role ?? "").toUpperCase();
      const hasSession = Boolean(window.localStorage.getItem("accessToken"));
      setMentorRole(role);
      setAuthorized(hasSession && ["MENTOR", "ADMIN"].includes(role));
      if (!hasSession || !["MENTOR", "ADMIN"].includes(role)) {
        setAccessError("Sign in with an authorized mentor or admin account to manage societies.");
      }
    } catch (authError) {
      setAuthorized(false);
      setAccessError(
        authError instanceof Error
          ? "Your local sign-in session could not be verified."
          : "Sign in with an authorized mentor or admin account to manage societies.",
      );
    }
  }, []);

  useEffect(() => {
    if (!authorized) return undefined;

    const loadSocieties = () => {
      try {
        setSocieties(getSocieties());
        setError("");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Society information could not be loaded.",
        );
      }
    };

    loadSocieties();
    const handleStorageChange = (event) => {
      if (!event.key || event.key === SOCIETIES_STORAGE_KEY) loadSocieties();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [authorized]);

  const closeEditor = () => {
    setForm(null);
    setEditingSocietyId(null);
    setError("");
  };

  const persistSocieties = (nextSocieties, successMessage) => {
    try {
      const savedSocieties = saveSocieties(nextSocieties);
      setSocieties(savedSocieties);
      setError("");
      setMessage(successMessage);
      closeEditor();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Society changes could not be saved.",
      );
    }
  };

  const handleSaveSociety = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.description.trim() || !form.deadline) {
      setError("Society name, description, and application deadline are required.");
      return;
    }

    const existingSociety = societies.find(
      (society) => society.id === editingSocietyId,
    );
    const updatedSociety = buildSociety(form, existingSociety, societies);
    const nextSocieties = existingSociety
      ? societies.map((society) =>
          society.id === editingSocietyId ? updatedSociety : society,
        )
      : [...societies, updatedSociety];

    persistSocieties(
      nextSocieties,
      existingSociety ? "Society details updated." : "Society added.",
    );
  };

  const handleToggleActive = (society) => {
    setMessage("");
    persistSocieties(
      societies.map((item) =>
        item.id === society.id
          ? { ...item, isActive: item.isActive === false }
          : item,
      ),
      society.isActive === false ? "Society activated." : "Society deactivated.",
    );
  };

  const updateForm = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const updatePosition = (index, name, value) => {
    setForm((current) => ({
      ...current,
      availablePositions: current.availablePositions.map((position, positionIndex) =>
        positionIndex === index
          ? { ...position, [name]: value }
          : position,
      ),
    }));
  };

  if (authorized === null) {
    return <main className="mentor-management-access">Checking mentor access...</main>;
  }

  if (!authorized) {
    return (
      <main className="mentor-management-access">
        <section>
          <h1>Society management access restricted</h1>
          <p>{accessError}</p>
          <a href="/login">Go to sign in</a>
          <small>
            This frontend role check is temporary; production access must also be
            enforced by the backend.
          </small>
        </section>
      </main>
    );
  }

  return (
    <div className="mentor-dashboard">
      <MentorSidebar />
      <main className="mentor-main mentor-society-main">
        <header className="mentor-header">
          <div className="mentor-header-text">
            <p className="mentor-breadcrumb">Workspace / Society Management</p>
            <h1>Society Management</h1>
            <p className="mentor-subtitle">
              Maintain society profiles, recruitment details, and availability.
            </p>
          </div>
          <div className="mentor-header-right">
            <div className="mentor-header-user">
              <div className="mentor-header-avatar">
                {mentorRole === "ADMIN" ? "A" : "M"}
              </div>
              <div>
                <h3>{mentorRole === "ADMIN" ? "Administrator" : "Mentor"}</h3>
                <p>Demonstration role check</p>
              </div>
            </div>
          </div>
        </header>

        <aside className="mentor-society-demo-banner">
          Society content is demonstration data until confirmed by an authorized
          college administrator.
        </aside>

        {error && <p className="mentor-society-feedback is-error" role="alert">{error}</p>}
        {message && <p className="mentor-society-feedback" role="status">{message}</p>}

        <section className="mentor-society-panel">
          <div className="mentor-society-toolbar">
            <div>
              <span className="mentor-section-label">SOCIETY DIRECTORY</span>
              <h2>{societies.length} societies</h2>
            </div>
            <button
              className="mentor-society-primary"
              type="button"
              onClick={() => {
                setEditingSocietyId(null);
                setForm(createSocietyForm());
                setError("");
                setMessage("");
              }}
            >
              <Plus size={17} /> Add Society
            </button>
          </div>

          {form && (
            <form className="mentor-society-editor" onSubmit={handleSaveSociety}>
              <div className="mentor-society-editor-heading">
                <h2>{editingSocietyId ? "Edit Society" : "Add Society"}</h2>
                <button type="button" onClick={closeEditor} aria-label="Close editor">
                  <X size={18} />
                </button>
              </div>

              <div className="mentor-society-form-grid">
                <label>
                  Society Name
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) => updateForm("category", event.target.value)}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </label>
                <label className="mentor-society-field-wide">
                  Description
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    required
                  />
                </label>
                <label className="mentor-society-field-wide">
                  About the Society
                  <textarea
                    rows="3"
                    value={form.about}
                    onChange={(event) => updateForm("about", event.target.value)}
                  />
                </label>
                <label>
                  Objectives (one per line)
                  <textarea
                    rows="3"
                    value={form.objectives}
                    onChange={(event) => updateForm("objectives", event.target.value)}
                  />
                </label>
                <label>
                  Required Skills (comma or line separated)
                  <textarea
                    rows="3"
                    value={form.requiredSkills}
                    onChange={(event) => updateForm("requiredSkills", event.target.value)}
                  />
                </label>
                <label>
                  Domains (comma or line separated)
                  <textarea
                    rows="3"
                    value={form.domains}
                    onChange={(event) => updateForm("domains", event.target.value)}
                  />
                </label>
                <label>
                  Eligibility Year
                  <input
                    value={form.eligibilityYear}
                    onChange={(event) => updateForm("eligibilityYear", event.target.value)}
                    placeholder="Leave blank if unspecified"
                  />
                </label>
                <label className="mentor-society-field-wide">
                  Eligibility Criteria
                  <textarea
                    rows="2"
                    value={form.eligibilityCriteria}
                    onChange={(event) => updateForm("eligibilityCriteria", event.target.value)}
                  />
                </label>
                <label>
                  Application Deadline
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(event) => updateForm("deadline", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Faculty Coordinator
                  <input
                    value={form.coordinatorName}
                    onChange={(event) => updateForm("coordinatorName", event.target.value)}
                    placeholder="Leave blank if unconfirmed"
                  />
                </label>
                <label>
                  Coordinator Title
                  <input
                    value={form.coordinatorTitle}
                    onChange={(event) => updateForm("coordinatorTitle", event.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label>
                  Contact Email
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) => updateForm("contactEmail", event.target.value)}
                    placeholder="Leave blank if unconfirmed"
                  />
                </label>
                <label>
                  Contact Phone
                  <input
                    value={form.contactPhone}
                    onChange={(event) => updateForm("contactPhone", event.target.value)}
                    placeholder="Leave blank if unconfirmed"
                  />
                </label>
                <label>
                  Social Links (one per line: label|URL)
                  <textarea
                    rows="3"
                    value={form.socialLinks}
                    onChange={(event) => updateForm("socialLinks", event.target.value)}
                    placeholder={"Website|https://..."}
                  />
                </label>
                <label>
                  Achievements (one per line)
                  <textarea
                    rows="3"
                    value={form.achievements}
                    onChange={(event) => updateForm("achievements", event.target.value)}
                  />
                </label>
              </div>

              <section className="mentor-society-positions">
                <div className="mentor-society-positions-heading">
                  <h3>Available Positions</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        availablePositions: [
                          ...current.availablePositions,
                          { title: "", openings: 1, description: "" },
                        ],
                      }))
                    }
                  >
                    <Plus size={15} /> Add Position
                  </button>
                </div>
                {form.availablePositions.map((position, index) => (
                  <div className="mentor-society-position-row" key={`position-${index}`}>
                    <label>
                      Position Title
                      <input
                        value={position.title}
                        onChange={(event) => updatePosition(index, "title", event.target.value)}
                      />
                    </label>
                    <label>
                      Openings
                      <input
                        type="number"
                        min="0"
                        value={position.openings}
                        onChange={(event) => updatePosition(index, "openings", event.target.value)}
                      />
                    </label>
                    <label>
                      Description
                      <input
                        value={position.description}
                        onChange={(event) => updatePosition(index, "description", event.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="mentor-society-remove-position"
                      aria-label={`Remove position ${index + 1}`}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          availablePositions: current.availablePositions.filter(
                            (_, positionIndex) => positionIndex !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </section>

              <div className="mentor-society-switches">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isOpen}
                    onChange={(event) => updateForm("isOpen", event.target.checked)}
                  />
                  Accepting applications
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateForm("isActive", event.target.checked)}
                  />
                  Active and visible to students
                </label>
              </div>

              <div className="mentor-society-editor-actions">
                <button type="button" className="mentor-society-secondary" onClick={closeEditor}>
                  Cancel
                </button>
                <button type="submit" className="mentor-society-primary">
                  <Save size={16} /> Save Society
                </button>
              </div>
            </form>
          )}

          {societies.length === 0 ? (
            <p className="mentor-society-empty">No society records are available.</p>
          ) : (
            <div className="mentor-society-grid">
              {societies.map((society) => (
                <article className="mentor-society-card" key={society.id}>
                  <div className="mentor-society-card-top">
                    <div className="mentor-society-initials">{society.initials}</div>
                    <div className="mentor-society-badges">
                      <span className={`mentor-society-category ${society.category.toLowerCase()}`}>
                        {society.category}
                      </span>
                      <span className={`mentor-society-state${society.isActive === false ? " inactive" : ""}`}>
                        {society.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </div>
                  </div>
                  <h3>{society.name}</h3>
                  <p>{society.description}</p>
                  <small>{society.details?.dataStatus ?? "Demonstration data"}</small>
                  <div className="mentor-society-card-facts">
                    <span>{society.details?.availablePositions?.length ?? 0} roles</span>
                    <span>Deadline: {society.deadline || "Not set"}</span>
                  </div>
                  <div className="mentor-society-card-actions">
                    <button
                      type="button"
                      className="mentor-society-secondary"
                      onClick={() => {
                        setEditingSocietyId(society.id);
                        setForm(createSocietyForm(society));
                        setError("");
                        setMessage("");
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      className="mentor-society-secondary"
                      onClick={() => handleToggleActive(society)}
                    >
                      {society.isActive === false ? "Activate" : "Deactivate"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MentorSocietyManagement;
