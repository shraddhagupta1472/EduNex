import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="fade-in d-flex justify-content-center align-items-center mt-5">
      <div className="glass-card p-5 col-12 col-md-8 col-lg-5">
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock fs-1 text-primary"></i>
          <h2 className="mt-2 fw-bold">Reset Password</h2>
          <p className="text-muted">Enter your email to receive reset instructions</p>
        </div>

        <form>
          <div className="mb-4">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" />
          </div>
          
          <button type="button" className="btn btn-primary w-100 py-2 mb-3">
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
          <Link to="/login" className="text-muted text-decoration-none small">
            <i className="bi bi-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
