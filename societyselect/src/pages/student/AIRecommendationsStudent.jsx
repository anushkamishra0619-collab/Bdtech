import {Sparkles,RefreshCw,Target,TrendingUp,Star,BookOpen,Lightbulb,CheckCircle2,ArrowRight,
  Compass,} from "lucide-react";
import "./AIRecommendationsStudent.css";
function AIRecommendationStudent() {
  const societies = [
    {
      name: "Coding Club",
      shortName: "CC",
      category: "Programming Society",
      match: 89,
      members: 150,
      description:
        "Practice coding, participate in competitions and strengthen your problem-solving skills.",
      skills: ["DSA", "Competitive Coding", "Problem Solving"],
      interest: 88,
      skillsMatch: 93,
      activityMatch: 86,
      growthMatch: 90,
      insight: [
        "Your programming foundation matches the club's requirements.",
        "Helps improve problem-solving and algorithmic thinking.",
        "Offers opportunities for peer learning and coding events.",
      ],
      icon: Target,
    },
  ];

  const highestMatch = Math.max(...societies.map((s) => s.match));
  const strongMatches = societies.filter((s) => s.match >= 85).length;
  const averageMatch = Math.round(
    societies.reduce((total, s) => total + s.match, 0) /
      societies.length
  );

  const handleRefresh = () => {
    console.log("Refresh society recommendations");
  };

  return (
    <div className="air-page">
      <main className="air-content">
        <header className="air-header">
          <div>
            <div className="air-eyebrow">
              <Sparkles size={15} />
              INTELLIGENT STUDENT INSIGHTS
            </div>
            <h1>AI Society Recommendations</h1>
          </div>

          <button className="air-refresh-btn" onClick={handleRefresh}>
            <RefreshCw size={18} />
            Refresh Insights
          </button>
        </header>

        <section className="air-stats-grid">
          <div className="air-stat-card">
            <p>Total Recommended Societies</p>
            <h2>{societies.length}</h2>
            <span>Societies matched with your profile</span>
          </div>

          <div className="air-stat-card">
            <p>Strong Matches</p>
            <h2>{strongMatches}</h2>
            <span>High compatibility with your interests</span>
          </div>

          <div className="air-stat-card">
            <p>Other Recommended</p>
            <h2>{societies.length - strongMatches}</h2>
            <span>Explore and grow your skills</span>
          </div>

          <div className="air-stat-card">
            <p>Average Match Score</p>
            <h2>{averageMatch}%</h2>
            <span>Across recommended societies</span>
          </div>
        </section>

        <section className="air-recommendations-container">
          <div className="air-section-title">
            <h2>Society Recommendations</h2>
          </div>

          <div className="air-society-list">
            {societies.map((society, index) => {
              const Icon = society.icon;

              return (
                <article className="air-society-card" key={index}>
                  <div className="air-society-heading">
                    <div className="air-society-profile">
                      <div className="air-society-avatar">
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3>{society.name}</h3>
                        <div className="air-society-meta">
                          {society.category}
                          <span>•</span>
                          {society.members} Members
                        </div>
                      </div>
                    </div>

                    <div className="air-match-badge">
                      <Star size={15} />
                      {society.match}% Match
                    </div>
                  </div>

                  <div className="air-society-metrics">
                    <div className="air-overall-score">
                      <span>Match Score</span>
                      <strong>{society.match}%</strong>
                    </div>

                    <div className="air-metric">
                      <div className="air-metric-label">
                        <Target size={15} />
                        <span>Skills Match</span>
                        <strong>{society.skillsMatch}%</strong>
                      </div>

                      <div className="air-progress-track">
                        <div
                          className="air-progress-fill"
                          style={{ width: `${society.skillsMatch}%` }}
                        />
                      </div>
                    </div>

                    <div className="air-metric">
                      <div className="air-metric-label">
                        <BookOpen size={15} />
                        <span>Interest</span>
                        <strong>{society.interest}%</strong>
                      </div>

                      <div className="air-progress-track">
                        <div
                          className="air-progress-fill"
                          style={{ width: `${society.interest}%` }}
                        />
                      </div>
                    </div>

                    <div className="air-metric">
                      <div className="air-metric-label">
                        <TrendingUp size={15} />
                        <span>Activities</span>
                        <strong>{society.activityMatch}%</strong>
                      </div>

                      <div className="air-progress-track">
                        <div
                          className="air-progress-fill"
                          style={{ width: `${society.activityMatch}%` }}
                        />
                      </div>
                    </div>

                    <div className="air-metric">
                      <div className="air-metric-label">
                        <Compass size={15} />
                        <span>Growth</span>
                        <strong>{society.growthMatch}%</strong>
                      </div>

                      <div className="air-progress-track">
                        <div
                          className="air-progress-fill"
                          style={{ width: `${society.growthMatch}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="air-insight-box">
                    <div className="air-insight-heading">
                      <Lightbulb size={18} />
                      <strong>AI Insight</strong>
                    </div>

                    <p className="air-insight-summary">
                      {society.description}
                    </p>

                    <ul>
                      {society.insight.map((item, i) => (
                        <li key={i}>
                          <CheckCircle2 size={15} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="air-society-footer">
                    <div className="air-skills">
                      {society.skills.map((skill, i) => (
                        <span key={i}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AIRecommendationStudent;
