import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI tutor. Would you like to discuss your test results or your new study plan?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { sessionId } = useAppContext();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text,
          session_id: sessionId 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error processing your message." }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Network error connecting to the AI tutor." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="btn btn-primary rounded-circle shadow-lg"
        style={{ width: '60px', height: '60px', position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1060 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-4`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget glass-card fade-in overflow-hidden shadow-lg border border-primary border-opacity-25">
          <div className="bg-primary bg-gradient p-3 d-flex align-items-center">
            <i className="bi bi-robot fs-4 me-2 text-white"></i>
            <h6 className="mb-0 text-white fw-bold">AI Tutor</h6>
          </div>
          
          <div className="p-3 overflow-auto" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai opacity-50">
                <i className="bi bi-three-dots"></i> Typing...
              </div>
            )}
          </div>
          
          <div className="p-2 border-top border-secondary border-opacity-25 bg-dark bg-opacity-50">
            <form onSubmit={handleSend} className="d-flex gap-2">
              <input 
                type="text" 
                className="form-control rounded-pill border-0 text-white" 
                placeholder={sessionId ? "Ask your tutor..." : "Complete a test first to chat!"} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                disabled={!sessionId || loading}
              />
              <button type="submit" className="btn btn-primary rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }} disabled={!sessionId || loading || !input.trim()}>
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
