import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { Budget } from '../types';
import '../styles/setBudgetPage.css';

const SetBudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Partial<Budget>>({
    amount: 0,
    timeFrame: 'week'
  });

  const handleSave = async () => {
    // Supabase save logic will be implemented here
    console.log('Save budget:', budget);
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Set Budget" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        <section className="input-section">
          <div className="section-label">Time Frame</div>
          <div className="toggle-group">
            <div
              className={`toggle-option ${budget.timeFrame === 'week' ? 'active' : ''}`}
              onClick={() => setBudget({ ...budget, timeFrame: 'week' })}
            >
              Week
            </div>
            <div
              className={`toggle-option ${budget.timeFrame === 'month' ? 'active' : ''}`}
              onClick={() => setBudget({ ...budget, timeFrame: 'month' })}
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
        </section>
      </main>

      <div className="page-footer">
        <button className="save-button" onClick={handleSave}>
          <div className="button-icon">
            <iconify-icon icon="lucide:wallet"></iconify-icon>
          </div>
          <span>Save Budget</span>
        </button>
      </div>
    </div>
  );
};

export default SetBudgetPage;
