import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import type { Expense } from '../types';
import '../styles/addExpenesePage.css';

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [expense, setExpense] = useState<Partial<Expense>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    description: '',
    isEssential: true
  });

  const handleSave = async () => {
    // Supabase save logic will be implemented here
    console.log('Save expense:', expense);
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Add Expense" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Amount */}
        <div className="amount-display" style={isMobile ? { padding: '24px 16px' } : {}}>
          <label className="field-label">AMOUNT</label>
          <div className="amount-wrapper">
            <input
              type="number"
              className="amount-text"
              value={expense.amount || 0}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
              placeholder="₱0.00"
              style={isMobile ? { fontSize: '36px' } : {}}
            />
          </div>
        </div>

        {/* Date */}
        <div className="input-field">
          <label className="field-label normal">Date</label>
          <div className="input-container">
            <iconify-icon icon="lucide:calendar"></iconify-icon>
            <input
              type="date"
              className="input-value"
              value={expense.date}
              onChange={(e) => setExpense({ ...expense, date: e.target.value })}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
            />
          </div>
        </div>

        {/* Category */}
        <div className="input-field">
          <label className="field-label normal">Category</label>
          <div className="input-container">
            <iconify-icon icon="lucide:tag"></iconify-icon>
            <select
              className="input-value"
              value={expense.category}
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
            >
              <option>Food & Dining</option>
              <option>Transportation</option>
              <option>Utilities</option>
              <option>Entertainment</option>
              <option>Healthcare</option>
              <option>Shopping</option>
            </select>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
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
        <div className="input-field">
          <label className="field-label normal">Description</label>
          <div className="input-container large">
            <input
              type="text"
              className="input-value"
              placeholder="Lunch at Joe's"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
            />
          </div>
        </div>

        <div className="divider"></div>

        {/* Essential Toggle */}
        <div className="input-field">
          <label className="field-label normal">Is this essential?</label>
          <div className="toggle-buttons">
            <div
              className={`toggle-option ${expense.isEssential ? 'active' : ''}`}
              onClick={() => setExpense({ ...expense, isEssential: true })}
            >
              Yes
            </div>
            <div
              className={`toggle-option ${!expense.isEssential ? 'active' : ''}`}
              onClick={() => setExpense({ ...expense, isEssential: false })}
            >
              No
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-button" onClick={handleSave}>
          <iconify-icon icon="lucide:save"></iconify-icon>
          Save Expense
        </button>
      </main>
    </div>
  );
};

export default AddExpensePage;
