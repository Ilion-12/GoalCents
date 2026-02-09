import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { Expense } from '../types';
import '../styles/addExpenesePage.css';

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
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
              value={expense.date}
              onChange={(e) => setExpense({ ...expense, date: e.target.value })}
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
