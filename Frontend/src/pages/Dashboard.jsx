import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Dashboard() {
  const { initialTestResults, retestResults } = useAppContext();

  if (!initialTestResults) {
    return (
      <div className="text-center mt-5 text-white">
        <h4>No initial test found. Please take the diagnostic test.</h4>
        <Link to="/test" className="btn btn-primary mt-3">Take Test</Link>
      </div>
    );
  }

  // Use real data from Context
  const initialData = {
    score: Math.round((initialTestResults.score / initialTestResults.total_questions) * 100) || 0,
    level: initialTestResults.level || "Unknown",
    topics: initialTestResults.topic_scores || {}
  };

  return (
    <div className="fade-in mt-4">
      {/* Gamification Header Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="glass-card p-4 d-flex justify-content-between align-items-center border-warning border-opacity-50">
            <div>
              <h4 className="mb-1 text-warning fw-bold"><i className="bi bi-fire me-2"></i>3 Day Streak!</h4>
              <p className="mb-0 text-muted small">You've completed your daily goals for 3 days straight.</p>
            </div>
            <div className="text-end">
              <span className="badge bg-success bg-opacity-25 text-success border border-success px-3 py-2 rounded-pill">
                <i className="bi bi-check-circle-fill me-1"></i> Today's Task Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="fw-bold">Your Progress Dashboard</h2>
        <p className="text-muted">Track your improvement across learning sessions</p>
      </div>

      {/* High-level Summary */}
      <div className="row g-4 mb-5 justify-content-center">
        {/* Initial Test Stats */}
        <div className="col-md-5">
          <div className="glass-card p-4 text-center h-100">
            <h6 className="text-muted text-uppercase mb-3">Diagnostic Score</h6>
            <h2 className="text-danger fw-bold">{initialData.score}%</h2>
            <p className="text-muted small mb-0">{initialData.level}</p>
          </div>
        </div>
        
        {/* Retest Stats or Placeholder */}
        <div className="col-md-5">
          {retestResults ? (
            <div className="glass-card p-4 text-center h-100 position-relative border-primary border-opacity-50">
              <div className="position-absolute top-0 start-50 translate-middle">
                <span className={`badge ${retestResults.improvement > 0 ? 'bg-primary' : 'bg-secondary'} px-3 py-2 rounded-pill`}>
                  <i className={`bi ${retestResults.improvement > 0 ? 'bi-graph-up-arrow' : 'bi-dash'} me-1`}></i> 
                  {retestResults.improvement > 0 ? '+' : ''}{retestResults.improvement}% Growth
                </span>
              </div>
              <h6 className="text-muted text-uppercase mb-3 mt-3">Re-Test Score</h6>
              <h2 className="text-success fw-bold">{retestResults.new_score}%</h2>
              <p className="text-muted small mb-0">Updated Level</p>
            </div>
          ) : (
            <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center bg-primary bg-opacity-10 border-primary border-opacity-25">
              <p className="text-muted small mb-3">You haven't taken a re-test yet.</p>
              <Link to="/retest" className="btn btn-warning rounded-pill shadow btn-sm text-dark fw-bold">
                Take Re-Test <i className="bi bi-arrow-repeat ms-1"></i>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Topic-wise Comparison */}
      <div className="glass-card p-4 p-md-5">
        <h4 className="mb-4 d-flex align-items-center">
          <i className="bi bi-bar-chart-fill text-primary me-2"></i> Topic Mastery Breakdown
        </h4>
        
        <div className="row g-4">
          <div className="col-12">
            <div className="d-flex justify-content-end mb-3 gap-3">
              <span className="badge bg-secondary bg-opacity-50 text-light"><i className="bi bi-circle-fill text-secondary me-1" style={{fontSize: '0.6rem'}}></i> Initial</span>
              {retestResults && <span className="badge bg-success bg-opacity-25 text-success"><i className="bi bi-circle-fill text-success me-1" style={{fontSize: '0.6rem'}}></i> Re-Test</span>}
            </div>
          </div>

          {Object.keys(initialData.topics).map((topic, idx) => {
            const initialScore = initialData.topics[topic]; // It's already a percentage from the backend
            let retestScore = null;
            let diff = 0;
            
            if (retestResults) {
              // Simulated topic score based on overall improvement for display purposes
              retestScore = Math.min(100, initialScore + (retestResults.improvement || 0));
              diff = retestScore - initialScore;
            }

            return (
              <div key={idx} className="col-12 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">{topic}</span>
                  {retestScore !== null && (
                    <span className={`small fw-bold ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                    </span>
                  )}
                </div>
                
                {/* Initial Progress Bar */}
                <div className="progress mb-2" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="progress-bar bg-secondary" role="progressbar" style={{ width: `${initialScore}%` }}></div>
                </div>
                
                {/* Re-Test Progress Bar (Only shown if retest taken) */}
                {retestScore !== null && (
                  <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${retestScore}%` }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
