import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-auto py-5 border-top border-secondary border-opacity-25" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <Link className="text-gradient fw-bold fs-4 text-decoration-none d-flex align-items-center mb-3" to="/">
              <i className="bi bi-rocket-takeoff-fill me-2"></i>
              EDUNEX
            </Link>
            <p className="text-light opacity-75 small">
              Master your competitive exams with AI-powered diagnostics, personalized study plans, and 24/7 intelligent tutoring.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light opacity-75 text-decoration-none fs-5 hover-primary transition-all"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-light opacity-75 text-decoration-none fs-5 hover-primary transition-all"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-light opacity-75 text-decoration-none fs-5 hover-primary transition-all"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 col-6 offset-lg-1">
            <h6 className="text-white fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/test" className="text-light opacity-75 text-decoration-none small hover-text-white">Diagnostic Test</Link></li>
              <li className="mb-2"><Link to="/plan" className="text-light opacity-75 text-decoration-none small hover-text-white">Study Plans</Link></li>
              <li className="mb-2"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">Pricing</Link></li>
              <li className="mb-0"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">Success Stories</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Company</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">About Us</Link></li>
              <li className="mb-2"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">Careers</Link></li>
              <li className="mb-2"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">Privacy Policy</Link></li>
              <li className="mb-0"><Link to="#" className="text-light opacity-75 text-decoration-none small hover-text-white">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Stay Updated</h6>
            <p className="text-light opacity-75 small mb-3">Subscribe to our newsletter for the latest exam tips.</p>
            <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" className="form-control form-control-sm me-2 text-white" placeholder="Email address" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button className="btn btn-primary btn-sm px-3" type="submit">Join</button>
            </form>
          </div>
        </div>
        
        <div className="row mt-5 pt-4 border-top border-secondary border-opacity-25 text-center">
          <div className="col-12">
            <p className="text-light opacity-75 small mb-0">&copy; {new Date().getFullYear()} EDUNEX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
