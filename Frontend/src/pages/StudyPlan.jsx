import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';
import { useAppContext } from '../context/AppContext';

function StudyPlan() {
  const { analysisData, studyPlan, setStudyPlan } = useAppContext();
  const [loading, setLoading] = useState(!studyPlan);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!analysisData) return;
    
    // Only fetch if we don't already have a plan
    if (studyPlan) return;

    const fetchPlan = async () => {
      try {
        const response = await fetch('http://localhost:8000/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            analysis: analysisData,
            exam: "JEE/GATE", // Defaulting for now
            level: "intermediate"
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStudyPlan(data);
        } else {
          setError(data.error || "Failed to generate plan");
        }
      } catch (err) {
        console.error("Plan generation error", err);
        setError("Network error while generating plan");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [analysisData, studyPlan, setStudyPlan]);

  if (!analysisData && !studyPlan) {
    return (
      <div className="text-center mt-5 text-white">
        <h4>No analysis found. Please take the diagnostic test first.</h4>
        <Link to="/test" className="btn btn-primary mt-3">Take Test</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}></div>
        <h4 className="mt-4 text-white">Our AI is crafting your perfect study plan...</h4>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-5 text-danger"><h4>{error}</h4></div>;
  }

  return (
    <div className="fade-in mt-4 position-relative">
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-3">
          <i className="bi bi-stars me-1"></i> Personalized for You
        </span>
        <h2 className="fw-bold">Your AI Study Plan</h2>
        <p className="text-muted">Structured roadmap based on your diagnostic analysis</p>
      </div>

      <div className="row justify-content-center pb-5">
        <div className="col-lg-8">
          {studyPlan?.study_plan?.monthly_goals?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-primary mb-3"><i className="bi bi-calendar-month me-2"></i> Monthly Goals</h4>
              <ul className="list-group list-group-flush mb-4">
                {studyPlan.study_plan.monthly_goals.map((goal, idx) => (
                  <li key={idx} className="list-group-item bg-transparent text-white border-secondary">
                    <i className="bi bi-check-circle text-success me-2"></i> {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {studyPlan?.study_plan?.weekly_schedule?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-primary mb-3"><i className="bi bi-calendar-week me-2"></i> Weekly Schedule</h4>
              <div className="d-flex flex-column gap-3">
                {studyPlan.study_plan.weekly_schedule.map((schedule, idx) => (
                  <div key={idx} className="glass-card p-3">
                    <p className="mb-0"><i className="bi bi-calendar2-event text-warning me-2"></i> {schedule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {studyPlan?.study_plan?.daily_routine_with_timings?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-primary mb-3"><i className="bi bi-clock-history me-2"></i> Daily Routine</h4>
              <div className="d-flex flex-column gap-3">
                {studyPlan.study_plan.daily_routine_with_timings.map((routine, idx) => (
                  <div key={idx} className="glass-card p-3 border-start border-4 border-info">
                    <p className="mb-0">{routine}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {studyPlan?.study_plan?.update_strategy && (
             <div className="alert alert-info mt-4">
               <i className="bi bi-info-circle-fill me-2"></i> {studyPlan.study_plan.update_strategy}
             </div>
          )}
        </div>
      </div>
      
      <div className="text-center mb-5 pb-4">
        <p className="text-muted small mb-3">Finished this plan? See how much you've improved.</p>
        <Link to="/retest" className="btn btn-warning px-5 py-3 rounded-pill shadow text-dark fw-bold fs-5">
          Take Adaptive Re-Test <i className="bi bi-arrow-repeat ms-2"></i>
        </Link>
      </div>

      <ChatWidget />
    </div>
  );
}

export default StudyPlan;
