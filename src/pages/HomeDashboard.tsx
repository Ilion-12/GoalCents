import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import type { BudgetSummary } from '../types';
import '../styles/homeDashboard.css';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const [summary, setSummary] = useState<BudgetSummary>({
    totalBudget: 25000,
    totalSpent: 18450,
    remaining: 6550,
    weeklySpent: 4250,
    monthlySpent: 18450
  });

  // This will be replaced with Supabase data fetching
  useEffect(() => {
    // Fetch budget summary from Supabase
    console.log('Fetch budget summary');
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="page-container">
      <Header title="Home" showMenu={true} showUserProfile={true} />

      <main className="main-content">
        <h2 className="greeting" style={isMobile ? { fontSize: '24px' } : {}}>Hello, Troy! 👋</h2>

        {/* Main Budget Card */}
        <div className="budget-summary">
          <div className="total-balance">
            <div className="balance-label">Total Budget</div>
            <div className="balance-amount">₱{summary.totalBudget.toLocaleString()}</div>
          </div>

          <div className="stats-row">
            <div className="stat-group">
              <span className="stat-title">Total Spent</span>
              <span className="stat-number">₱{summary.totalSpent.toLocaleString()}</span>
            </div>
            <div className="stat-group">
              <span className="stat-title">Remaining</span>
              <span className="stat-number">₱{summary.remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Period Stats */}
        <div className="time-periods" style={isMobile ? { flexDirection: 'column', gap: '12px' } : {}}>
          <div className="time-card" style={isMobile ? { width: '100%' } : {}}>
            <span className="time-label">Weekly</span>
            <span className="time-amount">₱{summary.weeklySpent.toLocaleString()}</span>
            <span className="time-description">Spent this week</span>
          </div>
          <div className="time-card" style={isMobile ? { width: '100%' } : {}}>
            <span className="time-label">Monthly</span>
            <span className="time-amount">₱{summary.monthlySpent.toLocaleString()}</span>
            <span className="time-description">Spent this month</span>
          </div>
        </div>

        {/* Alert */}
        <div className="warning-box">
          <div className="warning-icon">
            <iconify-icon icon="lucide:triangle-alert"></iconify-icon>
          </div>
          <div className="warning-text">
            <h3 className="warning-title">Budget Alert</h3>
            <p className="warning-message">
              You've spent 73% of your budget. Try to reduce non-essential expenses.
            </p>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="savings-goal">
          <div className="goal-top">
            <span className="goal-name">Goal Progress</span>
            <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); handleNavigation('/savings-goals'); }}>
              View All
            </a>
          </div>
          <div className="goal-details">
            <span>New Phone</span>
            <span className="progress-percent">60%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="quick-actions">
          <div className="action-button primary" onClick={() => handleNavigation('/add-expense')}>
            <iconify-icon icon="lucide:plus"></iconify-icon>
            <span className="button-label">Expense</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/set-budget')}>
            <iconify-icon icon="lucide:banknote" className="budget-icon"></iconify-icon>
            <span className="button-label">Budget</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/savings-goals')}>
            <iconify-icon icon="lucide:target" className="goal-icon"></iconify-icon>
            <span className="button-label">Goal</span>
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div className="bottom-buttons">
          <div className="action-card" onClick={() => handleNavigation('/analytics')}>
            <iconify-icon icon="lucide:bar-chart-3" className="reports-icon"></iconify-icon>
            <span>View Reports</span>
          </div>
          <div className="action-card" onClick={() => handleNavigation('/price-comparison')}>
            <iconify-icon icon="lucide:shopping-cart" className="compare-icon"></iconify-icon>
            <span>Compare Prices</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
