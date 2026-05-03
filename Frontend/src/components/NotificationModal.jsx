import { useState, useEffect } from 'react';

function NotificationModal() {
  const [reminderTime, setReminderTime] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Background interval to check time for notification simulator
    const interval = setInterval(() => {
      if (!reminderTime) return;
      
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      
      if (currentTimeStr === reminderTime) {
        setShowToast(true);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminderTime]);

  const handleSave = () => {
    // In a real app, save to backend/localStorage and request push permission
    document.getElementById('closeModalBtn').click();
    
    // For demonstration, if user sets time, show toast after 3 seconds
    setTimeout(() => {
        setShowToast(true);
    }, 3000);
  };

  return (
    <>
      {/* Notification Modal */}
      <div className="modal fade" id="notificationModal" tabIndex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border border-secondary border-opacity-50">
            <div className="modal-header border-secondary border-opacity-25">
              <h5 className="modal-title d-flex align-items-center" id="notificationModalLabel">
                <i className="bi bi-bell-fill text-warning me-2"></i> Daily Reminder Settings
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
            </div>
            <div className="modal-body">
              <p className="text-muted small">
                Set a daily reminder to keep your streak alive. We will send a notification to your mobile phone.
              </p>
              
              <div className="mb-3">
                <label className="form-label text-white">Reminder Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-white">Session Goal</label>
                <select className="form-select">
                  <option value="5">5 Minutes (Quick Review)</option>
                  <option value="10" defaultValue>10 Minutes (Standard)</option>
                  <option value="30">30+ Minutes (Deep Study)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-secondary border-opacity-25">
              <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Settings</button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Mobile Toast Notification */}
      {showToast && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1100, width: '100%', maxWidth: '400px' }}>
          <div className="toast show w-100 bg-dark text-white border border-primary shadow-lg rounded-4 overflow-hidden fade-in" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-primary bg-gradient text-white border-0">
              <i className="bi bi-rocket-takeoff-fill me-2"></i>
              <strong className="me-auto">Edunex</strong>
              <small>Just now</small>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowToast(false)} aria-label="Close"></button>
            </div>
            <div className="toast-body p-3">
              <h6 className="mb-1 fw-bold">Time to hit your daily goal! 🎯</h6>
              <p className="mb-2 small text-light opacity-75">You committed to studying right now. Open Edunex to complete today's task and keep your streak alive!</p>
              <button className="btn btn-sm btn-primary w-100 rounded-pill" onClick={() => setShowToast(false)}>Open App</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationModal;
