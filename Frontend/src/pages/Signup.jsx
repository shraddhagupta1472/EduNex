import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="fade-in d-flex justify-content-center align-items-center mt-4">
      <div className="glass-card p-5 col-12 col-md-8 col-lg-6">
        <div className="text-center mb-4">
          <i className="bi bi-rocket-takeoff text-primary fs-1"></i>
          <h2 className="mt-2 fw-bold">Create an Account</h2>
          <p className="text-muted">Start your AI-powered preparation journey</p>
        </div>

        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" placeholder="John" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" placeholder="Doe" />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" />
          </div>

          <div className="mb-3">
            <label className="form-label">Target Competitive Exam</label>
            <select className="form-select" defaultValue="">
              <option value="" disabled>Select your exam</option>
              <option value="jee">JEE Main / Advanced</option>
              <option value="neet">NEET (UG)</option>
              <option value="gate">GATE</option>
              <option value="upsc">UPSC CSE</option>
              <option value="cat">CAT</option>
              <option value="cuet">CUET</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Create a strong password" />
          </div>

          <button type="button" className="btn btn-primary w-100 py-2 mb-3">
            Create Account
          </button>
        </form>

        <div className="text-center mt-3 pt-3 border-top border-secondary border-opacity-25">
          <p className="text-muted small mb-0">
            Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
