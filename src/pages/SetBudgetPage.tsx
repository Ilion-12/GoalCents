import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { FormValidator } from '../services/FormValidator';
import type { Budget } from '../types';
import '../styles/setBudgetPage.css';

const SetBudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Partial<Budget>>({
    amount: 0,
    timeframe: 'week'
  });
  const [loading, setLoading] = useState(false);
  
  // OOP: Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());

  useEffect(() => {
    fetchUserAndBudget();
  }, []);

  const fetchUserAndBudget = async () => {
    try {
      // OOP: Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }

      // Fetch existing active budget
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setBudget({
          amount: data.amount,
          timeframe: data.timeframe
        });
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const handleSave = async () => {
    // OOP: Use FormValidator to validate budget form
    const validation = formValidator.validateBudgetForm(budget.amount || 0);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setLoading(true);
    try {
      // OOP: Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Deactivate all existing budgets
      await supabase
        .from('budgets')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Insert new budget
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          user_id: userId,
          amount: budget.amount,
          timeframe: budget.timeframe,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Detailed error:', error);
        if (error.code === '23514') {
          alert('Database constraint error.');
        } else if (error.message) {
          alert(`Error: ${error.message}`);
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      console.log('Budget saved successfully:', data);
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error saving budget:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        alert(`Failed to save budget: ${(error as { message: string }).message}`);
      } else {
        alert('Data base error occurred while saving budget. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Set Budget" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        <section className="input-section">
          <div className="section-label">Time Frame</div>
          <div className="toggle-group">
            <div
              className={`toggle-option ${budget.timeframe === 'week' ? 'active' : ''}`}
              onClick={() => setBudget({ ...budget, timeframe: 'week' })}
            >
              Week
            </div>
            <div
              className={`toggle-option ${budget.timeframe === 'month' ? 'active' : ''}`}
              onClick={() => setBudget({ ...budget, timeframe: 'month' })}
            >
              Month
            </div>
          </div>
        </section>

        <section className="input-section">
          <div className="section-label">Budget Amount</div>
          <div className="amount-input">
            <span className="currency-symbol">₱</span>
            <input
              type="number"
              value={budget.amount || 0}
              onChange={(e) => setBudget({ ...budget, amount: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>
            
        <button className="save-button" onClick={handleSave} disabled={loading}>
          <div className="button-icon">
            <iconify-icon icon={loading ? "lucide:loader-2" : "lucide:wallet"}></iconify-icon>
          </div>
          <span>{loading ? 'Saving...' : 'Save Budget'}</span>
        </button>

        </section>
      </main>


    </div>
  );
};

export default SetBudgetPage;
