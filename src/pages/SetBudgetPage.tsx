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
  const [existingBudgetId, setExistingBudgetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());

  useEffect(() => {
    fetchUserAndBudget();
  }, []);

  const fetchUserAndBudget = async () => {
    try {
      //  Use AuthenticationManager to get current user
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
        setExistingBudgetId(data.id); // Store the existing budget ID
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error);
      } else {
        // No existing budget
        setExistingBudgetId(null);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const handleEditBudget = async () => {
    if (!existingBudgetId) {
      alert('No existing budget to edit');
      return;
    }

    // Use FormValidator to validate budget form
    const validation = formValidator.validateBudgetForm(budget.amount || 0);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setLoading(true);
    try {
      // Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Calculate new end date based on timeframe
      const { data: currentBudget } = await supabase
        .from('budgets')
        .select('start_date')
        .eq('id', existingBudgetId)
        .single();

      const startDate = currentBudget?.start_date ? new Date(currentBudget.start_date) : new Date();
      const endDate = new Date(startDate);
      
      if (budget.timeframe === 'week') {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Update existing budget
      const { data, error } = await supabase
        .from('budgets')
        .update({
          amount: budget.amount,
          timeframe: budget.timeframe,
          end_date: endDate.toISOString().split('T')[0]
        })
        .eq('id', existingBudgetId)
        .select();

      if (error) {
        console.error('Error updating budget:', error);
        alert(`Failed to update budget: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Budget updated successfully:', data);
      alert('Budget updated successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error updating budget:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        alert(`Failed to update budget: ${(error as { message: string }).message}`);
      } else {
        alert('An error occurred while updating budget. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewBudget = async () => {
    // Use FormValidator to validate budget form
    const validation = formValidator.validateBudgetForm(budget.amount || 0);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setLoading(true);
    try {
      // Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Fetch user's latest savings goal
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goal')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Savings goal found:', goalData);
      if (goalError) {
        console.warn('No savings goal found:', goalError.message);
      }

      // Calculate start and end dates
      const startDate = new Date();
      const endDate = new Date();
      
      if (budget.timeframe === 'week') {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const budgetData = {
        user_id: userId,
        amount: budget.amount,
        timeframe: budget.timeframe,
        is_active: true,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        processed: false,
        goal_id: goalData?.id || null
      };

      console.log('📊 Creating budget with data:', budgetData);

      // Deactivate all existing budgets
      await supabase
        .from('budgets')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Insert new budget with all required fields
      const { data, error } = await supabase
        .from('budgets')
        .insert([budgetData])
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
              value={budget.amount || ''}
              onChange={(e) => setBudget({ ...budget, amount: parseFloat(e.target.value) || 0 })}
              onFocus={(e) => e.target.select()}
              placeholder="0.00"
            />
          </div>
            
        <div className="button-group" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {existingBudgetId && (
            <button className="save-button" onClick={handleEditBudget} disabled={loading} style={{ flex: 1 }}>
              <div className="button-icon">
                <iconify-icon icon={loading ? "lucide:loader-2" : "lucide:pencil"}></iconify-icon>
              </div>
              <span>{loading ? 'Updating...' : 'Edit Budget'}</span>
            </button>
          )}
          
          <button 
            className="save-button" 
            onClick={handleNewBudget} 
            disabled={loading}
            style={{ flex: 1, ...(existingBudgetId ? { backgroundColor: 'var(--primary)' } : {}) }}
          >
            <div className="button-icon">
              <iconify-icon icon={loading ? "lucide:loader-2" : "lucide:plus-circle"}></iconify-icon>
            </div>
            <span>{loading ? 'Creating...' : 'New Budget'}</span>
          </button>
        </div>

        </section>
      </main>


    </div>
  );
};

export default SetBudgetPage;
