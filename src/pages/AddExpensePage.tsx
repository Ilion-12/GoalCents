import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import type { Expense } from '../types';
import '../styles/addExpenesePage.css';

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Partial<Expense>>({
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    description: '',
    is_essential: true
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Get user data from localStorage
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
      
      setUserId(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login');
    }
  };

  const handleSave = async () => {
    if (!expense.amount || expense.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!expense.description || expense.description.trim() === '') {
      alert('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const currentUserId = userId || localStorage.getItem('userId');
      
      if (!currentUserId) {
        alert('Please login first');
        navigate('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: currentUserId,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          expense_date: expense.expense_date,
          is_essential: expense.is_essential
        }])
        .select();

      if (error) {
        console.error('Detailed error:', error);
        if (error.message) {
          alert(`Error: ${error.message}. Please check SUPABASE_FIX.sql if you see RLS errors.`);
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      console.log('Expense saved successfully:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Add Expense" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Amount */}
        <div className="amount-display">
          <label className="field-label">AMOUNT</label>
          <div className="amount-wrapper">
            <input
              type="number"
              className="amount-text"
              value={expense.amount || 0}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
              placeholder="₱0.00"
            />
          </div>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' }}>
          <label className="field-label normal">Date</label>
          <div className="input-container">
            <iconify-icon icon="lucide:calendar"></iconify-icon>
            <input
              type="date"
              className="input-value"
              value={expense.expense_date}
              onChange={(e) => setExpense({ ...expense, expense_date: e.target.value })}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' }}>
          <label className="field-label normal">Category</label>
          <div className="input-container">
            <iconify-icon icon="lucide:tag"></iconify-icon>
            <select
              className="input-value"
              value={expense.category}
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
            >
              <option>Food & Dining</option>
              <option>Transportation</option>
              <option>Utilities</option>
              <option>Entertainment</option>
              <option>Healthcare</option>
              <option>Shopping</option>
            </select>
          </div>
        </div>

        {/* Suggestions */}
        <div className="suggestions">
          <span className="suggestion-text">Did you mean:</span>
          <button className="suggestion-chip" onClick={() => setExpense({ ...expense, category: 'Groceries' })}>
            <iconify-icon icon="lucide:shopping-cart"></iconify-icon>
            Groceries
          </button>
          <button className="suggestion-chip" onClick={() => setExpense({ ...expense, category: 'Eating Out' })}>
            <iconify-icon icon="lucide:utensils"></iconify-icon>
            Eating Out
          </button>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' }}>
          <label className="field-label normal">Description</label>
          <div className="input-container large">
            <input
              type="text"
              className="input-value"
              placeholder="Lunch at Joe's"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            />
          </div>
        </div>

        <div className="divider"></div>

        {/* Essential Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' }}>
          <label className="field-label normal">Is this essential?</label>
          <div className="toggle-buttons">
            <div
              className={`toggle-option ${expense.is_essential ? 'active' : ''}`}
              onClick={() => setExpense({ ...expense, is_essential: true })}
            >
              Yes
            </div>
            <div
              className={`toggle-option ${!expense.is_essential ? 'active' : ''}`}
              onClick={() => setExpense({ ...expense, is_essential: false })}
            >
              No
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-button" onClick={handleSave} disabled={loading}>
          <iconify-icon icon={loading ? "lucide:loader-2" : "lucide:save"}></iconify-icon>
          {loading ? 'Saving...' : 'Save Expense'}
        </button>
      </main>
    </div>
  );
};

export default AddExpensePage;
