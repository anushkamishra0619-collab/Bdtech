
import React, { useMemo, useState } from "react";
import MentorSidebar from "./MentorSidebar";
import "./FinalSelection.css";

const initialCandidates = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Developer",
    branch: "B.Tech CSE, 3rd Year",
    skills: "React • TypeScript • UI/UX",
    score: 9.6,
    status: "Selected",
    initials: "AS",
    scores: {
      technical: 9.5,
      communication: 9.7,
      problemSolving: 9.6,
      behavior: 9.5,
    },
    highlights: [
      "Excellent technical skills in React",
      "Strong communication skills",
      "Completed all assigned tasks",
      "Active in society activities",
    ],
    recommendation:
      "Aarav is a top performer with excellent skills and consistent progress. Recommend for final selection.",
    activity: "Project submission evaluated - Score: 9.5/10",
  },
  {
    id: 2,
    name: "Sneha Gupta",
    role: "UI/UX Designer",
    branch: "B.Tech CSE",
    skills: "Figma • Design • Creativity",
    score: 9.2,
    status: "Selected",
    initials: "SG",
    scores: {
      technical: 9.3,
      communication: 9.4,
      problemSolving: 9.0,
      behavior: 9.2,
    },
    highlights: [
      "Creative and user-focused designs",
      "Good communication skills",
      "Consistent task completion",
      "Excellent design portfolio",
    ],
    recommendation:
      "Sneha demonstrates strong design ability and consistent performance. Recommended for selection.",
    activity: "Interview evaluation completed - Score: 9.4/10",
  },
  {
    id: 3,
    name: "Rahul Singh",
    role: "AI/ML Developer",
    branch: "B.Tech CSE",
    skills: "Python • Machine Learning",
    score: 8.9,
    status: "Waitlisted",
    initials: "RS",
    scores: {
      technical: 9.2,
      communication: 8.5,
      problemSolving: 9.0,
      behavior: 8.9,
    },
    highlights: [
      "Good machine learning knowledge",
      "Strong problem-solving ability",
      "Needs improvement in communication",
      "Good project contribution",
    ],
    recommendation:
      "Rahul has strong technical potential. Consider waitlisting while reviewing available positions.",
    activity: "Technical assessment completed - Score: 9.2/10",
  },
  {
    id: 4,
    name: "Priya Verma",
    role: "Backend Developer",
    branch: "B.Tech CSE",
    skills: "Django • APIs • Databases",
    score: 8.7,
    status: "Pending",
    initials: "PV",
    scores: {
      technical: 8.8,
      communication: 8.6,
      problemSolving: 8.9,
      behavior: 8.5,
    },
    highlights: [
      "Good backend development skills",
      "Understands API development",
      "Regular task submissions",
      "Good database knowledge",
    ],
    recommendation:
      "Priya has demonstrated good backend skills. A final mentor review is recommended.",
    activity: "Backend project review completed - Score: 8.8/10",
  },
  {
    id: 5,
    name: "Karan Mehta",
    role: "Full Stack Developer",
    branch: "B.Tech CSE",
    skills: "MERN • Node.js • Express",
    score: 8.4,
    status: "Pending",
    initials: "KM",
    scores: {
      technical: 8.5,
      communication: 8.2,
      problemSolving: 8.6,
      behavior: 8.3,
    },
    highlights: [
      "Understands full-stack development",
      "Good JavaScript fundamentals",
      "Participates in team activities",
      "Can improve project consistency",
    ],
    recommendation:
      "Karan has good development fundamentals. Review his overall project contribution before making a decision.",
    activity: "Full-stack project evaluated - Score: 8.5/10",
  },
  {
    id: 6,
    name: "Meera Kapoor",
    role: "Frontend Developer",
    branch: "B.Tech IT",
    skills: "JavaScript • CSS • React",
    score: 7.9,
    status: "Pending",
    initials: "MK",
    scores: {
      technical: 8.0,
      communication: 7.8,
      problemSolving: 8.1,
      behavior: 7.7,
    },
    highlights: [
      "Good frontend fundamentals",
      "Shows willingness to learn",
      "Needs more practice with React",
      "Participates in team discussions",
    ],
    recommendation:
      "Meera shows learning potential. Consider her progress and project quality before making a decision.",
    activity: "Probation review updated",
  },
];

const statusClass = (status) =>
  status.toLowerCase().replace(/\s+/g, "-");

function FinalSelection() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeTab, setActiveTab] = useState("Top Candidates");
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [decision, setDecision] = useState("Selected");
  const [filterOpen, setFilterOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedId
  );

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (activeTab === "Selected") {
      result = result.filter((c) => c.status === "Selected");
    } else if (activeTab === "Waitlisted") {
      result = result.filter((c) => c.status === "Waitlisted");
    } else if (activeTab === "Pending Review") {
      result = result.filter((c) => c.status === "Pending");
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.role.toLowerCase().includes(term) ||
          c.skills.toLowerCase().includes(term)
      );
    }

    if (activeTab === "Top Candidates") {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [candidates, activeTab, search]);

  const totalApplicants = 48;
  const shortlisted = 24;
  const selectedCount = candidates.filter(
    (c) => c.status === "Selected"
  ).length;
  const pendingCount = candidates.filter(
    (c) => c.status === "Pending"
  ).length;

  const handleConfirmDecision = () => {
    if (!selectedCandidate) return;

    setCandidates((previous) =>
      previous.map((candidate) =>
        candidate.id === selectedId
          ? { ...candidate, status: decision }
          : candidate
      )
    );

    setMessage(
      `${selectedCandidate.name} has been marked as ${decision}.`
    );

    setTimeout(() => setMessage(""), 3500);
  };

  const chooseCandidate = (candidate) => {
    setSelectedId(candidate.id);
    setDecision(
      candidate.status === "Pending" ? "Selected" : candidate.status
    );
    setMessage("");
  };

  const visibleCandidates = filteredCandidates.slice(
    (page - 1) * 5,
    page * 5
  );

  return (
    <div className="fs-layout">
      <MentorSidebar />

      {/* Main content */}
      <main className="fs-main">
        <div className="fs-content">
          {/* Page heading */}
          <section className="fs-heading">
            <div className="fs-heading-icon">★</div>
            <div>
              <h1>Final Selection</h1>
              <p>
                Review evaluations and make the final decision for society
                recruitment.
              </p>
            </div>

            <button className="fs-recruitment-button">
              Recruitment 2026 <span>⌄</span>
            </button>
          </section>

          {/* Statistics */}
          <section className="fs-stats">
            <div className="fs-stat-card purple">
              <div className="fs-stat-icon">♟</div>
              <div>
                <span>Total Applicants</span>
                <strong>{totalApplicants}</strong>
                <small>↑ +12%</small>
              </div>
            </div>

            <div className="fs-stat-card green">
              <div className="fs-stat-icon">✓</div>
              <div>
                <span>Shortlisted</span>
                <strong>{shortlisted}</strong>
                <small>↑ +8%</small>
              </div>
            </div>

            <div className="fs-stat-card orange">
              <div className="fs-stat-icon">🏆</div>
              <div>
                <span>Selected</span>
                <strong>{selectedCount}</strong>
                <small>✓</small>
              </div>
            </div>

            <div className="fs-stat-card blue">
              <div className="fs-stat-icon">◷</div>
              <div>
                <span>Pending Review</span>
                <strong>{pendingCount}</strong>
                <small>Awaiting decision</small>
              </div>
            </div>
          </section>

          {/* Main two-column section */}
          <section className="fs-workspace">
            {/* Candidate list */}
            <div className="fs-candidate-panel">
              <div className="fs-tabs">
                {[
                  "Top Candidates",
                  "All Candidates",
                  "Selected",
                  "Waitlisted",
                  "Pending Review",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => {
                      setActiveTab(tab);
                      setPage(1);
                    }}
                  >
                    {tab === "Top Candidates" && "🏆 "}
                    {tab === "Selected" && "✓ "}
                    {tab === "Waitlisted" && "⌛ "}
                    {tab}
                  </button>
                ))}
              </div>

              <div className="fs-search-row">
                <div className="fs-candidate-search">
                  <span>⌕</span>
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name, skills or role..."
                  />
                </div>

                <div className="fs-filter-wrap">
                  <button
                    className="fs-filter-button"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    ☷ Filter <span>⌄</span>
                  </button>

                  {filterOpen && (
                    <div className="fs-filter-menu">
                      {["All Candidates", "Selected", "Waitlisted", "Pending Review"].map(
                        (tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setFilterOpen(false);
                              setPage(1);
                            }}
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="fs-candidate-list">
                {visibleCandidates.map((candidate, index) => (
                  <button
                    key={candidate.id}
                    className={`fs-candidate-card ${
                      selectedId === candidate.id ? "chosen" : ""
                    }`}
                    onClick={() => chooseCandidate(candidate)}
                  >
                    <div className={`fs-avatar avatar-${index % 5}`}>
                      {candidate.initials}
                    </div>

                    <div className="fs-candidate-info">
                      <strong>
                        {candidate.name} <span className="fs-verified">✓</span>
                      </strong>
                      <span>{candidate.role} • {candidate.branch}</span>
                      <small>{candidate.skills}</small>
                    </div>

                    <div className="fs-candidate-score">
                      <strong>{candidate.score.toFixed(1)} / 10</strong>
                      <small>Overall Score</small>
                    </div>

                    <span className={`fs-status ${statusClass(candidate.status)}`}>
                      {candidate.status === "Selected" && "✓ "}
                      {candidate.status === "Waitlisted" && "⌛ "}
                      {candidate.status === "Pending" && "◷ "}
                      {candidate.status}
                    </span>
                  </button>
                ))}

                {visibleCandidates.length === 0 && (
                  <div className="fs-empty">
                    No candidates found. Try another search.
                  </div>
                )}
              </div>

              <div className="fs-pagination">
                <span>
                  Showing {filteredCandidates.length === 0 ? 0 : (page - 1) * 5 + 1}–
                  {Math.min(page * 5, filteredCandidates.length)} of{" "}
                  {filteredCandidates.length} candidates
                </span>
                <div>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </button>
                  <button className="current">{page}</button>
                  <button
                    disabled={page * 5 >= filteredCandidates.length}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate details */}
            {selectedCandidate ? (
              <div className="fs-details-panel">
                <div className="fs-detail-header">
                  <div className="fs-large-avatar">
                    {selectedCandidate.initials}
                  </div>

                  <div className="fs-detail-person">
                    <h2>{selectedCandidate.name}</h2>
                    <span className={`fs-status ${statusClass(selectedCandidate.status)}`}>
                      {selectedCandidate.status}
                    </span>
                    <p>
                      {selectedCandidate.role} • {selectedCandidate.branch}
                    </p>
                  </div>

                  <div className="fs-overall-score">
                    <span>⭐ Overall Score</span>
                    <strong>{selectedCandidate.score.toFixed(1)} / 10</strong>
                  </div>
                </div>

                <div className="fs-detail-body">
                  <div className="fs-detail-tabs">
                    <button className="active">▥ Evaluation Details</button>
                    <button onClick={() => setMessage("Project and skills details can be connected here.")}>
                      <>‹› Project & Skills</>
                    </button>
                    <button onClick={() => setMessage("Interview feedback can be connected here.")}>
                      ▣ Interview Feedback
                    </button>
                    <button onClick={() => setMessage("Activity history can be connected here.")}>
                      ◷ Activity Log
                    </button>
                  </div>

                  <div className="fs-evaluation-grid">
                    <div className="fs-score-section">
                      <h3>Score Breakdown</h3>

                      <div className="fs-score-content">
                        <div
                          className="fs-score-ring"
                          style={{
                            "--score": `${selectedCandidate.score * 10}%`,
                          }}
                        >
                          <div>
                            <strong>{selectedCandidate.score.toFixed(1)}</strong>
                            <span>/ 10</span>
                          </div>
                        </div>

                        <div className="fs-score-legend">
                          {[
                            ["Technical Skills", selectedCandidate.scores.technical, "purple"],
                            ["Communication", selectedCandidate.scores.communication, "blue"],
                            ["Problem Solving", selectedCandidate.scores.problemSolving, "orange"],
                            ["Overall Behavior", selectedCandidate.scores.behavior, "green"],
                          ].map(([label, score, color]) => (
                            <div key={label}>
                              <span className={`fs-dot ${color}`} />
                              <span>{label}</span>
                              <strong>{score.toFixed(1)}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="fs-highlights">
                      <h3>Key Highlights</h3>
                      {selectedCandidate.highlights.map((item) => (
                        <p key={item}>
                          <span>✓</span> {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="fs-decision-grid">
                    <div className="fs-recommendation">
                      <h3>✧ Mentor Recommendation</h3>
                      <p>{selectedCandidate.recommendation}</p>
                    </div>

                    <div className="fs-final-decision">
                      <h3>⚒ Final Decision</h3>
                      <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                      >
                        <option value="Selected">✓ Select for Society</option>
                        <option value="Waitlisted">⌛ Add to Waitlist</option>
                        <option value="Rejected">✕ Reject Candidate</option>
                      </select>

                      <button onClick={handleConfirmDecision}>
                        ✓ Confirm Decision
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div className="fs-feedback-message" role="status">
                      {message}
                    </div>
                  )}

                  <div className="fs-recent-activity">
                    <div className="fs-activity-heading">
                      <h3>◷ Recent Activity</h3>
                      <button onClick={() => setMessage("Full activity history is not connected yet.")}>
                        View Full History →
                      </button>
                    </div>

                    <div className="fs-activity-item">
                      <span className="fs-activity-dot" />
                      <small>Today, 11:30 AM</small>
                      <p>{selectedCandidate.activity}</p>
                    </div>

                    <div className="fs-activity-item">
                      <span className="fs-activity-dot secondary" />
                      <small>Yesterday</small>
                      <p>Candidate evaluation updated by mentor</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fs-details-panel fs-no-selection">
                Select a candidate to view their evaluation.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default FinalSelection;
