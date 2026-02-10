import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import type { SavingsGoal } from '../types';
import '../styles/savingGoalsPage.css';

const SavingsGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    goal_name: '',
    target_amount: 0,
    current_amount: 0
  });

  useEffect(() => {
    fetchSavingsGoal();
  }, []);

  const fetchSavingsGoal = async () => {
    try {
      // Get user data from localStorage
      const currentUserId = localStorage.getItem('userId');
      
      if (!currentUserId) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
      
      setUserId(currentUserId);

      const { data, error } = await supabase
        .from('savings_goal')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setGoal(data);
        setEditValues({
          goal_name: data.goal_name,
          target_amount: data.target_amount,
          current_amount: data.current_amount
        });
      } else {
        // Create a default goal if none exists
        const { data: newGoal, error: insertError } = await supabase
          .from('savings_goal')
          .insert([{
            user_id: currentUserId,
            goal_name: 'New Phone',
            target_amount: 15000,
            current_amount: 9000
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setGoal(newGoal);
        setEditValues({
          goal_name: newGoal.goal_name,
          target_amount: newGoal.target_amount,
          current_amount: newGoal.current_amount
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

    try {
      const { data, error } = await supabase
        .from('savings_goal')
        .update({
          goal_name: editValues.goal_name,
          target_amount: editValues.target_amount,
          current_amount: editValues.current_amount
        })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) throw error;

      setGoal(data);
      setIsEditing(false);
      alert('Goal updated successfully!');
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
      const { data, error } = await supabase
        .from('savings_goal')
        .update({ current_amount: 0 })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) throw error;

      setGoal(data);
      setEditValues({ ...editValues, current_amount: 0 });
      alert('Goal reset successfully!');
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

  const progressPercent = Math.round((goal.current_amount / goal.target_amount) * 100);
  const remaining = goal.target_amount - goal.current_amount;

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
                  onChange={(e) => setEditValues({ ...editValues, target_amount: parseFloat(e.target.value) })}
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
                  onChange={(e) => setEditValues({ ...editValues, current_amount: parseFloat(e.target.value) })}
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
