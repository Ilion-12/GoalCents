import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { FormValidator } from '../services/FormValidator';
import { ExpenseManager } from '../services/ExpenseManager';
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
  
  //Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [formValidator] = useState(() => FormValidator.getInstance());
  const [expenseManager] = useState(() => ExpenseManager.getInstance());

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    //  Use AuthenticationManager to check if user is authenticated
    authManager.requireAuth(navigate);
  };

  const handleSave = async () => {
    // Use FormValidator to validate expense form
    const validation = formValidator.validateExpenseForm(
      expense.amount || 0,
      expense.description || '',
      expense.expense_date || ''
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setLoading(true);
    try {
      //Use AuthenticationManager to get current user
      const userId = authManager.getCurrentUserId();
      
      if (!userId) {
        alert('Please login first');
        navigate('/login');
        return;
      }
      
      // Use ExpenseManager to create expense
      const result = await expenseManager.createExpense({
        user_id: userId,
        amount: expense.amount || 0,
        category: expense.category || 'Other',
        description: expense.description || '',
        expense_date: expense.expense_date || expenseManager.getCurrentDateString(),
        is_essential: expense.is_essential || false
      });

      if (result.success) {
        console.log('Expense saved successfully:', result.data);
        navigate('/dashboard');
      } else {
        alert(result.message);
      }
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
    <div className="">
      <Header title="Add Expense" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Amount */}
        <div className="amount-display">
          <label className="field-label">AMOUNT</label>
          <div className="amount-wrapper">
            <input
              type="number"
              className="amount-text"
              value={expense.amount || ''}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) || 0 })}
              onFocus={(e) => e.target.select()}
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
              <option>Bills</option>
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
