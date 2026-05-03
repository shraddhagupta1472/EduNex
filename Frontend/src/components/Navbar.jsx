import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg glass-nav py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand text-gradient fw-bold fs-4" to="/">
          <i className="bi bi-rocket-takeoff-fill me-2"></i>
          EDUNEX
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="bi bi-list text-white fs-3"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/test">Diagnostic Test</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">Progress Dashboard</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center bg-dark bg-opacity-50 rounded-pill px-3 py-1 border border-warning border-opacity-25" title="Current Streak">
              <span className="fs-5 me-1">🔥</span>
              <span className="text-warning fw-bold">3 Days</span>
            </div>
            
            <button 
              className="btn btn-link text-white text-decoration-none p-0 position-relative me-2" 
              data-bs-toggle="modal" 
              data-bs-target="#notificationModal"
              title="Reminder Settings"
            >
              <i className="bi bi-bell-fill fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>

            <Link to="/login" className="btn btn-outline-light px-4 rounded-pill">Login</Link>
            <Link to="/signup" className="btn btn-primary px-4 rounded-pill">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
