import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Supabase login logic will be implemented here
    console.log('Login:', { username, password });
    // For now, navigate to dashboard
    navigate('/dashboard');
  };

  const handleSignup = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <div className="logo-section">
        <div className="logo-wrapper">
          <img src="/IMG/logo.png" alt="Smart Expense Tracker" className="logo-image" />
        </div>
        <div className="app-title">Smart Expense Tracker</div>
      </div>

      <div className="page-heading">Login to Your Account</div>

      <div className="login-form">
        <div className="form-field">
          <div className="field-label">Username</div>
          <input
            type="text"
            className="text-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-field">
          <div className="field-label">Password</div>
          <div className="text-input password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
            />
            <iconify-icon
              icon={showPassword ? 'lucide:eye' : 'lucide:eye-off'}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            ></iconify-icon>
          </div>
        </div>

        <div className="login-button" onClick={handleLogin}>
          Login
        </div>
      </div>

      <div className="page-footer">
        <span className="signup-prompt">Don't have an account?</span>
        <div className="signup-button" onClick={handleSignup}>
          Click here to Register
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
