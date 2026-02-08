import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { SavingsGoal } from '../types';
import '../styles/savingGoalsPage.css';

const SavingsGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState<SavingsGoal>({
    id: '1',
    userId: '',
    name: 'New Phone',
    targetAmount: 15000,
    savedAmount: 9000,
    createdAt: '',
    updatedAt: ''
  });

  const progressPercent = Math.round((goal.savedAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.savedAmount;

  useEffect(() => {
    // Fetch savings goal from Supabase
    console.log('Fetch savings goal');
  }, []);

  const handleEdit = () => {
    // Navigate to edit page or show modal
    console.log('Edit goal');
  };

  const handleReset = () => {
    // Reset goal logic
    console.log('Reset goal');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Savings Goal" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        <div className="goal-card">
          {/* Title Row */}
          <div className="card-header">
            <div className="goal-title">{goal.name}</div>
            <div className="goal-icon">
              <iconify-icon icon="lucide:flag"></iconify-icon>
            </div>
          </div>

          <div className="separator"></div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">Target Amount</div>
              <div className="stat-value">₱{goal.targetAmount.toLocaleString()}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Saved Amount</div>
              <div className="stat-value saved">₱{goal.savedAmount.toLocaleString()}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Remaining</div>
              <div className="stat-value">₱{remaining.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="progress-wrapper">
            <div className="progress-top">
              <span className="progress-label">Progress</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button className="action-button" onClick={handleEdit}>
              <iconify-icon icon="lucide:pencil"></iconify-icon>
              <span>Edit Goal</span>
            </button>
            <button className="action-button" onClick={handleReset}>
              <iconify-icon icon="lucide:rotate-ccw"></iconify-icon>
              <span>Reset Goal</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavingsGoalsPage;
