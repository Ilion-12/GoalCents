import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { FormValidator } from '../services/FormValidator';
import { SavingsGoalManager } from '../services/SavingsGoalManager';
import type { SavingsGoal } from '../types';
import '../styles/savingGoalsPage.css';

const SavingsGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    goal_name: '',
    target_amount: 0,
    current_amount: 0
  });
  
  // OOP: Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());
  const [savingsGoalManager] = useState(() => SavingsGoalManager.getInstance());

  useEffect(() => {
    fetchSavingsGoal();
  }, []);

  const fetchSavingsGoal = async () => {
    try {
      // OOP: Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }

      // OOP: Use SavingsGoalManager to get or create default goal
      const result = await savingsGoalManager.getOrCreateDefaultGoal(userId);

      if (result.success && result.data) {
        setGoal(result.data);
        setEditValues({
          goal_name: result.data.goal_name,
          target_amount: result.data.target_amount,
          current_amount: result.data.current_amount
        });
      }
    } catch (error) {
      console.error('Error fetching savings goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!goal) return;

    // OOP: Use FormValidator to validate savings goal form
    const validation = formValidator.validateSavingsGoalForm(
      editValues.goal_name,
      editValues.target_amount,
      editValues.current_amount
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    try {
      // OOP: Use SavingsGoalManager to update goal
      const result = await savingsGoalManager.updateGoal(goal.id, {
        goal_name: editValues.goal_name,
        target_amount: editValues.target_amount,
        current_amount: editValues.current_amount,
        user_id: goal.user_id
      });

      if (result.success && result.data) {
        setGoal(result.data);
        setIsEditing(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Failed to update goal. Please try again.');
    }
  };

  const handleReset = async () => {
    if (!goal) return;

    const confirmed = window.confirm('Are you sure you want to reset your savings goal? This will set your current amount to 0.');
    if (!confirmed) return;

    try {
      // OOP: Use SavingsGoalManager to reset goal
      const result = await savingsGoalManager.resetGoal(goal.id);

      if (result.success && result.data) {
        setGoal(result.data);
        setEditValues({ ...editValues, current_amount: 0 });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error resetting goal:', error);
      alert('Failed to reset goal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Savings Goal" onBackClick={() => navigate(-1)} showUserProfile={true} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </main>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="page-container">
        <Header title="Savings Goal" onBackClick={() => navigate(-1)} showUserProfile={true} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>No savings goal found.</div>
        </main>
      </div>
    );
  }

  // OOP: Use SavingsGoalManager to calculate progress
  const goalProgress = savingsGoalManager.calculateProgress(goal);
  const progressPercent = goalProgress.percentage;
  const remaining = goalProgress.remaining;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%'}}>
      <Header title="Savings Goal" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        <div className="goal-card">
          {/* Title Row */}
          <div className="card-header">
            {isEditing ? (
              <input
                type="text"
                value={editValues.goal_name}
                onChange={(e) => setEditValues({ ...editValues, goal_name: e.target.value })}
                className="goal-title"
                style={{ border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px' }}
              />
            ) : (
              <div className="goal-title">{goal.goal_name}</div>
            )}
            <div className="goal-icon">
              <iconify-icon icon="lucide:flag"></iconify-icon>
            </div>
          </div>

          <div className="separator"></div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">Target Amount</div>
              {isEditing ? (
                <input
                  type="number"
                  value={editValues.target_amount}
                  onChange={(e) => setEditValues({ ...editValues, target_amount: parseFloat(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="stat-value"
                  style={{ border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', width: '100%' }}
                />
              ) : (
                <div className="stat-value">₱{goal.target_amount.toLocaleString()}</div>
              )}
            </div>
            <div className="stat-box">
              <div className="stat-label">Saved Amount</div>
              {isEditing ? (
                <input
                  type="number"
                  value={editValues.current_amount}
                  onChange={(e) => setEditValues({ ...editValues, current_amount: parseFloat(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="stat-value saved"
                  style={{ border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', width: '100%' }}
                />
              ) : (
                <div className="stat-value saved">₱{goal.current_amount.toLocaleString()}</div>
              )}
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
            {isEditing ? (
              <>
                <button className="action-button" onClick={handleSaveEdit}>
                  <iconify-icon icon="lucide:check"></iconify-icon>
                  <span>Save Changes</span>
                </button>
                <button className="action-button" onClick={() => setIsEditing(false)}>
                  <iconify-icon icon="lucide:x"></iconify-icon>
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button className="action-button" onClick={handleEdit}>
                  <iconify-icon icon="lucide:pencil"></iconify-icon>
                  <span>Edit Goal</span>
                </button>
                <button className="action-button" onClick={handleReset}>
                  <iconify-icon icon="lucide:rotate-ccw"></iconify-icon>
                  <span>Reset Goal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavingsGoalsPage;
