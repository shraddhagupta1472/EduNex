import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="fade-in d-flex justify-content-center align-items-center mt-5">
      <div className="glass-card p-5 col-12 col-md-8 col-lg-5">
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <h2 className="mt-2 fw-bold">Welcome Back</h2>
          <p className="text-muted">Login to access your AI study plan</p>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" />
          </div>
          <div className="mb-4">
            <label className="form-label d-flex justify-content-between">
              Password
              <Link to="/forgot-password" className="text-primary text-decoration-none small">Forgot Password?</Link>
            </label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <button type="button" className="btn btn-primary w-100 py-2 mb-3">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
          <p className="text-muted small mb-0">
            Don't have an account? <Link to="/signup" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
