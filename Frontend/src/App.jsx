import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import TestPage from './pages/TestPage';
import RetestPage from './pages/RetestPage';
import Results from './pages/Results';
import StudyPlan from './pages/StudyPlan';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <NotificationModal />
      <div className="container mt-4 mb-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/retest" element={<RetestPage />} />
          <Route path="/results" element={<Results />} />
          <Route path="/plan" element={<StudyPlan />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
