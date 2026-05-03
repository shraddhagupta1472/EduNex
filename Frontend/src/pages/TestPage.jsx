import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setSessionId, setInitialTestResults } = useAppContext();

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
      [questions[currentQuestion].id - 1]: optionIndex // backend evaluate expects index
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
    setSubmitting(true);
    try {
      const formattedAnswers = {};
      Object.keys(answers).forEach((k) => {
        formattedAnswers[k] = answers[k];
      });

      const response = await fetch('http://localhost:8000/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSessionId(result.session_id);
        setInitialTestResults({
          score: result.score,
          level: result.level,
          message: result.message,
          total_questions: result.total_questions,
          topic_scores: result.topic_scores
        });
        navigate('/results');
      } else {
        alert("Error submitting test: " + result.error);
      }
    } catch (error) {
      console.error("Submit error", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!questions.length) return <div className="text-center mt-5 text-white">No questions available. Is backend running?</div>;

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fade-in d-flex justify-content-center mt-4">
      <div className="col-12 col-md-10 col-lg-8">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0 fw-bold">Diagnostic Test</h3>
          <span className="badge bg-secondary">Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        <div className="progress mb-4" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="glass-card p-4 p-md-5 mb-4">
          <div className="d-flex justify-content-between mb-3">
             <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">{question.topic}</span>
          </div>
          <h4 className="mb-4">{question.question}</h4>
          
          <div className="d-flex flex-column gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`btn text-start p-3 rounded-3 ${answers[currentQuestion] === idx ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => handleSelectOption(idx)}
              >
                <div className="d-flex align-items-center">
                  <span className={`me-3 fw-bold ${answers[currentQuestion] === idx ? 'text-white' : 'text-muted'}`}>
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
            <button className="btn btn-success px-5" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Test'} <i className="bi bi-check-circle ms-2"></i>
            </button>
          ) : (
            <button className="btn btn-primary px-4" onClick={handleNext}>
              Next <i className="bi bi-arrow-right ms-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestPage;
