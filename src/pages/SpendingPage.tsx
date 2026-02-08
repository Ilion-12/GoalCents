import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import type { SpendingCategory } from '../types';
import '../styles/spendingPage.css';

const SpendingPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [essentialTotal, setEssentialTotal] = useState(15400);
  const [nonEssentialTotal, setNonEssentialTotal] = useState(4200);
  
  const [essentialExpenses] = useState([
    { name: 'Rent', date: 'Jan 15', amount: 10000 },
    { name: 'Groceries', date: 'Jan 20', amount: 4500 },
    { name: 'Utilities', date: 'Jan 25', amount: 900 }
  ]);

  const [nonEssentialExpenses] = useState([
    { name: 'Coffee Shop', date: 'Jan 22', amount: 350 },
    { name: 'Movie Tickets', date: 'Jan 23', amount: 600 },
    { name: 'Shopping', date: 'Jan 28', amount: 3250 }
  ]);

  const total = essentialTotal + nonEssentialTotal;
  const essentialPercent = Math.round((essentialTotal / total) * 100);

  useEffect(() => {
    // Fetch spending data from Supabase
    console.log('Fetch spending data');
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Spending Split" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Summary Grid */}
        <div className="summary-row" style={isMobile ? { flexDirection: 'column', gap: '12px' } : {}}>
          <div className="summary-box" style={isMobile ? { width: '100%' } : {}}>
            <span className="summary-label">Essential</span>
            <span className="summary-value essential">₱{essentialTotal.toLocaleString()}</span>
          </div>
          <div className="summary-box" style={isMobile ? { width: '100%' } : {}}>
            <span className="summary-label">Non-Essential</span>
            <span className="summary-value non-essential">₱{nonEssentialTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="chart-card">
          <div className="chart-wrapper">
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              {/* Non-Essential */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--warning)"
                strokeWidth="20"
                strokeDasharray={`${(100 - essentialPercent) * 2.51} 251`}
              ></circle>
              {/* Essential */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="20"
                strokeDasharray={`${essentialPercent * 2.51} 251`}
                strokeDashoffset={`-${(100 - essentialPercent) * 2.51}`}
              ></circle>
            </svg>
            <div className="chart-center">
              <div className="chart-percentage">{essentialPercent}%</div>
              <div className="chart-label">Essential</div>
            </div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot essential"></div>
              <span>Essential</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot non-essential"></div>
              <span>Non-Essential</span>
            </div>
          </div>
        </div>

        {/* Detailed List: Essential */}
        <div className="expenses-section">
          <div className="section-heading">Essential Expenses</div>
          <div className="expense-list">
            {essentialExpenses.map((expense, index) => (
              <div key={index} className="expense-row">
                <div className="expense-info">
                  <span className="expense-name">{expense.name}</span>
                  <span className="expense-date">{expense.date}</span>
                </div>
                <span className="expense-amount">₱{expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed List: Non-Essential */}
        <div className="expenses-section">
          <div className="section-heading">Non-Essential Expenses</div>
          <div className="expense-list">
            {nonEssentialExpenses.map((expense, index) => (
              <div key={index} className="expense-row">
                <div className="expense-info">
                  <span className="expense-name">{expense.name}</span>
                  <span className="expense-date">{expense.date}</span>
                </div>
                <span className="expense-amount">₱{expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpendingPage;
