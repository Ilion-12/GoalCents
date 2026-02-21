import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/onboardingPage.css';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Take Control of Your Finances',
      description: 'Welcome to GoalCents! Your personal financial companion. Take control of your money effortlessly and plus, our AI-powered chat is here to assist you along the way.',
      buttonText: 'Next'
    },
    {
      title: 'Smarter Budgeting Starts Here',
      description: 'Track expenses, manage budgets, and reach your savings goals with smart insights.',
      buttonText: 'Get Started'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/login');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <div className="onboarding-logo">
          <img src="/IMG/logo2.png" alt="GoalCents Logo" />
        </div>

        <h1 className="onboarding-brand">GoalCents</h1>

        <div className="onboarding-slide">
          <h2 className="onboarding-title">{slides[currentSlide].title}</h2>
          <p className="onboarding-description">{slides[currentSlide].description}</p>
        </div>

        <button className="onboarding-button" onClick={handleNext}>
          {slides[currentSlide].buttonText}
        </button>

        <button className="onboarding-skip" onClick={handleSkip}>
          Skip
        </button>

        <div className="onboarding-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
