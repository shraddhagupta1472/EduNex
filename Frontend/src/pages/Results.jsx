import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ChatWidget from '../components/ChatWidget';

function Results() {
  const { initialTestResults, setAnalysisData } = useAppContext();
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  if (!initialTestResults) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-white">No test results found.</h4>
        <Link to="/test" className="btn btn-primary mt-3">Take Diagnostic Test</Link>
      </div>
    );
  }

  const result = initialTestResults;
  const percentage = Math.round((result.score / result.total_questions) * 100);

  const handleGeneratePlan = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_scores: result.topic_scores })
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalysisData(data.result);
        navigate('/plan');
      } else {
        alert("Error analyzing results: " + data.error);
      }
    } catch (error) {
      console.error("Analysis error", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fade-in mt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Your Performance Analysis</h2>
        <p className="text-muted">AI-generated insights based on your diagnostic test</p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Score Card */}
        <div className="col-md-5">
          <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
            <h5 className="text-muted mb-4">Overall Score</h5>
            <div className="position-relative d-inline-block mx-auto mb-3">
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="10" 
                  strokeDasharray={`${percentage * 2.827} 282.7`} 
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="position-absolute top-50 start-50 translate-middle">
                <h2 className="fw-bold mb-0">{percentage}%</h2>
              </div>
            </div>
            <h4 className={`text-${result.level === 'Advanced' ? 'success' : result.level === 'Intermediate' ? 'warning' : 'danger'}`}>
              {result.level} Level
            </h4>
            <p className="text-muted small mt-2">{result.message}</p>
          </div>
        </div>

        {/* Topics Card */}
        <div className="col-md-7">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4">Topic Breakdown</h5>
            
            {Object.entries(result.topic_scores).map(([topic, score], idx) => (
              <div key={idx} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>{topic}</span>
                  <span className="text-muted">{Math.round(score * 100)}%</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className={`progress-bar ${score >= 0.8 ? 'bg-success' : score >= 0.5 ? 'bg-warning' : 'bg-danger'}`} 
                    role="progressbar" 
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="mt-5 text-center">
              <p className="text-muted small mb-3">Ready to improve these areas?</p>
              <button 
                className="btn btn-primary px-4 py-2 w-100 rounded-pill shadow"
                onClick={handleGeneratePlan}
                disabled={analyzing}
              >
                {analyzing ? 'Generating Plan...' : 'Generate AI Study Plan'} <i className="bi bi-magic ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}

export default Results;
