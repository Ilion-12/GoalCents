import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { AITip } from '../types';
import '../styles/aiAssistantPage.css';

const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'How can I help manage today\'s spending?' }
  ]);

  const [tips] = useState<AITip[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Spending Alert',
      description: 'Your food budget is 20% higher than usual this week.',
      createdAt: ''
    },
    {
      id: '2',
      type: 'savings',
      title: 'Savings Tip',
      description: 'Try reducing dining out to save 500 before Friday.',
      createdAt: ''
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { type: 'user', text: message }]);
    
    // Simulate AI response (will be replaced with actual API call)
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        type: 'bot', 
        text: 'Thanks for your message! I\'m processing your request...' 
      }]);
    }, 1000);
    
    setMessage('');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="AI Budget Assistant" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Chat Card */}
        <section className="chat-card">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message-row">
                {msg.type === 'bot' && (
                  <div className="bot-avatar">
                    <iconify-icon icon="lucide:briefcase"></iconify-icon>
                  </div>
                )}
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="input-field"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-button" onClick={handleSend}>
              <iconify-icon icon="lucide:send"></iconify-icon>
            </button>
          </div>
        </section>

        {/* Suggested Tips */}
        <section className="tips-section">
          <div className="section-label">Suggested tips</div>

          {tips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <div className={`tip-icon ${tip.type}`}>
                <iconify-icon 
                  icon={tip.type === 'alert' ? 'lucide:alert-circle' : 'lucide:lightbulb'}
                ></iconify-icon>
              </div>
              <div className="tip-content">
                <div className="tip-title">{tip.title}</div>
                <div className="tip-description">{tip.description}</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default AIAssistantPage;
