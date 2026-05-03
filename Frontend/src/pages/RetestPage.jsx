import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function RetestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { initialTestResults, setRetestResults } = useAppContext();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8000/questions');
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectOption = (optionIndex) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id - 1]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!initialTestResults) {
      alert("No initial test found to compare against. Please take the diagnostic test first.");
      navigate('/test');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = {};
      Object.keys(answers).forEach((k) => {
        formattedAnswers[k] = answers[k];
      });

      const response = await fetch('http://localhost:8000/retest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: formattedAnswers,
          previous_score: initialTestResults.score
        })
      });
      
      const result = await response.json();
      
      if (response.ok && !result.error) {
        setRetestResults(result);
        navigate('/dashboard');
      } else {
        alert("Error submitting retest: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Retest submit error", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;
  if (!questions.length) return <div className="text-center mt-5 text-white">No questions available. Is backend running?</div>;

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fade-in d-flex justify-content-center mt-4">
      <div className="col-12 col-md-10 col-lg-8">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="badge bg-warning text-dark mb-2"><i className="bi bi-arrow-repeat me-1"></i> Adaptive Re-Test</span>
            <h3 className="mb-0 fw-bold">Focus Area Evaluation</h3>
          </div>
          <span className="badge bg-secondary">Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        <div className="progress mb-4" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="glass-card p-4 p-md-5 mb-4 border-warning border-opacity-25">
          <div className="d-flex justify-content-between mb-3">
             <span className="badge bg-warning text-dark bg-opacity-75 border border-warning border-opacity-50">{question.topic}</span>
          </div>
          <h4 className="mb-4">{question.question}</h4>
          
          <div className="d-flex flex-column gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`btn text-start p-3 rounded-3 ${answers[currentQuestion] === idx ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
                onClick={() => handleSelectOption(idx)}
              >
                <div className="d-flex align-items-center">
                  <span className={`me-3 fw-bold ${answers[currentQuestion] === idx ? 'text-dark' : 'text-muted'}`}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-outline-light px-4" 
            onClick={handlePrev} 
            disabled={currentQuestion === 0}
          >
            <i className="bi bi-arrow-left me-2"></i> Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button className="btn btn-warning px-5" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Re-Test'} <i className="bi bi-check-circle ms-2"></i>
            </button>
          ) : (
            <button className="btn btn-warning px-4" onClick={handleNext}>
              Next <i className="bi bi-arrow-right ms-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RetestPage;
