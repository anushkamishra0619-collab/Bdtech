import { useState, useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiX,
  FiSave,
} from "react-icons/fi";
import "./InterviewManagement.css";

const CRITERIA = [
  { key: "communication", label: "Communication" },
  { key: "technical", label: "Technical understanding" },
  { key: "confidence", label: "Confidence in explaining" },
  { key: "problemSolving", label: "Problem solving" },
];

const EMPTY_SCORES = {
  communication: 5,
  technical: 5,
  confidence: 5,
  problemSolving: 5,
};

const DECISIONS = ["Shortlist", "Hold", "Reject"];
const FILTERS = ["All", "Scheduled", "Completed", "Not Scheduled"];

// Sample data. Replace with an API call once FastAPI is ready.
const initialCandidates = [
  { id: 1, name: "Aarav Sharma", branch: "CSE · 2nd Yr", exam: 82, date: "15 Nov, 10:00 AM", mode: "Online", status: "Scheduled" },
  { id: 2, name: "Riya Verma", branch: "IT · 2nd Yr", exam: 76, date: "15 Nov, 11:30 AM", mode: "Offline", status: "Scheduled" },
  {
    id: 3, name: "Kabir Singh", branch: "CSE · 3rd Yr", exam: 88,
    date: "13 Nov, 04:00 PM", mode: "Online", status: "Completed",
    evaluation: {
      scores: { communication: 8, technical: 9, confidence: 7, problemSolving: 8 },
      feedback: "Strong DSA fundamentals, explains approach clearly.",
      decision: "Shortlist",
      total: 80,
    },
  },
  {
    id: 4, name: "Neha Gupta", branch: "ECE · 2nd Yr", exam: 71,
    date: "13 Nov, 05:00 PM", mode: "Offline", status: "Completed",
    evaluation: {
      scores: { communication: 7, technical: 6, confidence: 8, problemSolving: 7 },
      feedback: "Good UI sense, needs more depth in JavaScript.",
      decision: "Hold",
      total: 70,
    },
  },
  { id: 5, name: "Arjun Patel", branch: "CSE · 2nd Yr", exam: 79, date: "Not set", mode: "-", status: "Not Scheduled" },
  { id: 6, name: "Sneha Rao", branch: "IT · 3rd Yr", exam: 84, date: "Not set", mode: "-", status: "Not Scheduled" },
];

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const InterviewManagement = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  // Evaluation panel state
  const [selectedId, setSelectedId] = useState(null);
  const [scores, setScores] = useState(EMPTY_SCORES);
  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState("");

  // Schedule modal state
  const [showModal, setShowModal] = useState(false);
  const [schedule, setSchedule] = useState({ id: "", date: "", time: "", mode: "Online" });

  const stats = useMemo(
    () => ({
      total: candidates.length,
      scheduled: candidates.filter((c) => c.status === "Scheduled").length,
      completed: candidates.filter((c) => c.status === "Completed").length,
      unscheduled: candidates.filter((c) => c.status === "Not Scheduled").length,
    }),
    [candidates]
  );

  const statCards = [
    { label: "Shortlisted", value: stats.total, icon: <FiUsers /> },
    { label: "Scheduled", value: stats.scheduled, icon: <FiCalendar /> },
    { label: "Completed", value: stats.completed, icon: <FiCheckCircle /> },
    { label: "Not scheduled", value: stats.unscheduled, icon: <FiClock /> },
  ];

  const visible = candidates.filter(
    (c) =>
      (filter === "All" || c.status === filter) &&
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  const selected = candidates.find((c) => c.id === selectedId);

  // Average of the four scores (each out of 10), shown out of 100
  const total = Math.round(
    (Object.values(scores).reduce((a, b) => a + b, 0) / CRITERIA.length) * 10
  );

  const openEvaluation = (c) => {
    setSelectedId(c.id);
    setScores(c.evaluation?.scores || EMPTY_SCORES);
    setFeedback(c.evaluation?.feedback || "");
    setDecision(c.evaluation?.decision || "");
  };

  const openSchedule = (id = "") => {
    setSchedule({ id: String(id), date: "", time: "", mode: "Online" });
    setShowModal(true);
  };

  const saveEvaluation = () => {
    if (!selected) return;
    // TODO: send to FastAPI here, e.g. POST /api/interviews/:id/evaluation
    setCandidates((list) =>
      list.map((c) =>
        c.id === selected.id
          ? { ...c, status: "Completed", evaluation: { scores, feedback, decision, total } }
          : c
      )
    );
  };

  const saveSchedule = (e) => {
    e.preventDefault();
    const id = Number(schedule.id);
    // TODO: send to FastAPI here, e.g. POST /api/interviews
    setCandidates((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, status: "Scheduled", date: `${schedule.date}, ${schedule.time}`, mode: schedule.mode }
          : c
      )
    );
    setShowModal(false);
  };

  return (
    <div className="im-page">
      {/* Header */}
      <header className="im-head">
        <div>
          <h1 className="im-title">Interview Management</h1>
          <p className="im-sub">Schedule interviews and score shortlisted candidates</p>
        </div>
        <button className="im-primary" onClick={() => openSchedule()}>
          <FiPlus /> Schedule Interview
        </button>
      </header>

      {/* Stat cards */}
      <section className="im-stats">
        {statCards.map((s) => (
          <div className="im-stat" key={s.label}>
            <div className="im-stat-icon">{s.icon}</div>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="im-grid">
        {/* Candidate list */}
        <section className="im-card">
          <div className="im-toolbar">
            <label className="im-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search candidate"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="im-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`im-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 && <p className="im-none">No candidates found.</p>}

          {visible.map((c) => (
            <div key={c.id} className={`im-row ${selectedId === c.id ? "selected" : ""}`}>
              <div className="im-person">
                <div className="im-avatar">{initials(c.name)}</div>
                <div>
                  <p className="im-name">{c.name}</p>
                  <p className="im-meta">{c.branch}</p>
                </div>
              </div>

              <div className="im-when">
                <span>{c.date}</span>
                <span className="im-meta">{c.mode}</span>
              </div>

              <span className={`im-badge status-${c.status.toLowerCase().replace(" ", "-")}`}>
                {c.status}
              </span>

              <button
                type="button"
                className="im-row-btn"
                onClick={() =>
                  c.status === "Not Scheduled" ? openSchedule(c.id) : openEvaluation(c)
                }
              >
                {c.status === "Completed"
                  ? "View / Edit"
                  : c.status === "Scheduled"
                  ? "Evaluate"
                  : "Schedule"}
              </button>
            </div>
          ))}
        </section>

        {/* Evaluation panel */}
        <aside className="im-eval">
          {!selected ? (
            <div className="im-empty">
              <FiUsers size={28} />
              <p>Select a candidate to start the evaluation</p>
            </div>
          ) : (
            <div className="im-eval-body">
              <div className="im-eval-head">
                <div>
                  <h2 className="im-eval-name">{selected.name}</h2>
                  <p className="im-eval-meta">
                    {selected.branch} · Exam {selected.exam}/100
                  </p>
                </div>
                <div className="im-total">
                  {total}
                  <small>/100</small>
                </div>
              </div>

              {CRITERIA.map((c) => (
                <div className="im-crit" key={c.key}>
                  <div className="im-crit-label">
                    <span>{c.label}</span>
                    <span>{scores[c.key]}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[c.key]}
                    onChange={(e) =>
                      setScores({ ...scores, [c.key]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}

              <textarea
                placeholder="Write feedback for this candidate..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <div className="im-chips">
                {DECISIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`im-chip ${decision === d ? "active" : ""}`}
                    onClick={() => setDecision(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="im-save"
                onClick={saveEvaluation}
                disabled={!decision}
              >
                <FiSave /> Save evaluation
              </button>
              <p className="im-note">Final selection is decided by the society admin.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Schedule modal */}
      {showModal && (
        <div className="im-overlay" onClick={() => setShowModal(false)}>
          <form
            className="im-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={saveSchedule}
          >
            <div className="im-modal-head">
              <h2>Schedule Interview</h2>
              <button type="button" className="im-close" onClick={() => setShowModal(false)} aria-label="Close">
                <FiX />
              </button>
            </div>

            <div className="im-field">
              <select
                required
                value={schedule.id}
                onChange={(e) => setSchedule({ ...schedule, id: e.target.value })}
              >
                <option value="">Select candidate</option>
                {candidates
                  .filter((c) => c.status !== "Completed")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="im-field">
              <input
                type="date"
                required
                value={schedule.date}
                onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
              />
            </div>

            <div className="im-field">
              <input
                type="time"
                required
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
              />
            </div>

            <div className="im-field">
              <select
                value={schedule.mode}
                onChange={(e) => setSchedule({ ...schedule, mode: e.target.value })}
              >
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

            <button type="submit" className="im-primary im-full">
              Confirm schedule
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InterviewManagement;