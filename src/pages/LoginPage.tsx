import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { FormValidator } from '../services/FormValidator';
import '../styles/loginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OOP: Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());

  const handleLogin = async () => {
    // OOP: Use FormValidator to validate login form
    const validation = formValidator.validateLoginForm(username, password);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // OOP: Use AuthenticationManager to handle login
    const result = await authManager.login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
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
              placeholder=""
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
