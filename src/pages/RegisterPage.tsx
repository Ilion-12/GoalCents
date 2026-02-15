import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { FormValidator } from '../services/FormValidator';
import '../styles/signinPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OOP: Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // OOP: Use FormValidator to validate registration form
    const validation = formValidator.validateRegistrationForm(
      formData.fullName,
      formData.email,
      formData.username,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // OOP: Use AuthenticationManager to handle registration
    const result = await authManager.register(
      formData.fullName,
      formData.email,
      formData.username,
      formData.password
    );

    if (result.success) {
      alert(result.message);
      navigate('/login');
    } else {
      alert(result.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="logo-section">
        <div className="logo-wrapper">
          <img src="/IMG/logo.png" alt="Smart Expense Tracker" className="logo-image" />
        </div>
        <div className="app-title">Smart Expense Tracker</div>
      </div>

      <div className="page-heading">Create Your Account</div>

      <div className="form">
        <div className="form-group">
          <div className="form-label">Full Name</div>
          <input
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="form-label">Email</div>
          <input
            type="email"
            className="form-input"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="form-label">Username</div>
          <input
            type="text"
            className="form-input"
            placeholder="johndoe123"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="form-label">Password</div>
          <div className="form-input password">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder=""
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
            />
            <iconify-icon
              icon={showPassword ? 'lucide:eye' : 'lucide:eye-off'}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            ></iconify-icon>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">Confirm Password</div>
          <div className="form-input password">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder=""
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
            />
            <iconify-icon
              icon={showConfirmPassword ? 'lucide:eye' : 'lucide:eye-off'}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: 'pointer' }}
            ></iconify-icon>
          </div>
        </div>

        <div className="submit-button" onClick={handleRegister}>
          Register
        </div>
      </div>

      <div className="footer-text">
        <span className="info-text">Already have an account?</span>
        <div className="link-button" onClick={handleLoginRedirect}>
          Login here
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
