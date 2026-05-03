import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="fade-in d-flex flex-column align-items-center justify-content-center text-center mt-5">
      <div className="glass-card p-5 mt-5 col-lg-8 col-md-10">
        <div className="mb-4">
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-2 rounded-pill mb-3">
            Next-Gen AI Learning
          </span>
          <h1 className="display-4 fw-bold mb-3">
            Master Your Exams with <br/>
            <span className="text-gradient">AI-Powered Planning</span>
          </h1>
          <p className="lead text-muted mb-5 px-md-5">
            Take our diagnostic test to discover your strengths and weaknesses. 
            Get a personalized study plan and chat with our AI tutor to level up your preparation.
          </p>
        </div>
        
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to="/test" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow">
            Take Diagnostic Test <i className="bi bi-arrow-right ms-2"></i>
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
            View My Dashboard
          </Link>
        </div>
        
        <div className="row mt-5 pt-4 border-top border-secondary border-opacity-25 text-start">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-graph-up-arrow fs-4 text-primary me-2"></i>
              <h5 className="mb-0">Smart Analysis</h5>
            </div>
            <p className="text-muted small">Pinpoint exactly where you need to improve.</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-calendar-check fs-4 text-secondary me-2"></i>
              <h5 className="mb-0">Adaptive Plans</h5>
            </div>
            <p className="text-muted small">Dynamic study schedules that evolve with you.</p>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-robot fs-4 text-success me-2"></i>
              <h5 className="mb-0">AI Tutor Chat</h5>
            </div>
            <p className="text-muted small">24/7 instant doubt resolution and guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
