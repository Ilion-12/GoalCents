import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../dataBase/supabase';
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      // Check if username or email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username, email')
        .or(`username.eq.${formData.username},email.eq.${formData.email}`);

      if (existingUser && existingUser.length > 0) {
        if (existingUser.some(user => user.username === formData.username)) {
          alert('Username already exists!');
        } else {
          alert('Email already exists!');
        }
        return;
      }

      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            username: formData.username,
            password: formData.password
          }
        ])
        .select();

      if (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
        return;
      }

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
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
              placeholder="••••••••"
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
              placeholder="••••••••"
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
