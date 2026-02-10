import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import type { BudgetSummary } from '../types';
import '../styles/homeDashboard.css';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const [summary, setSummary] = useState<BudgetSummary>({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    weeklySpent: 0,
    monthlySpent: 0
  });
  const [savingsGoal, setSavingsGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user data from localStorage
      const userId = localStorage.getItem('userId');
      const fullName = localStorage.getItem('fullName');
      const username = localStorage.getItem('username');
      
      if (!userId) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
      
      // Set user name
      if (fullName) {
        setUserName(fullName);
      } else if (username) {
        setUserName(username);
      }

      // Fetch active budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (budgetError && budgetError.code !== 'PGRST116') {
        console.error('Error fetching budget:', budgetError);
      }

      // Fetch all expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
      }

      // Fetch savings goal
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goal')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (goalError && goalError.code !== 'PGRST116') {
        console.error('Error fetching goal:', goalError);
      }

      // Calculate totals
      let totalSpent = 0;
      let weeklySpent = 0;
      let monthlySpent = 0;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      if (expensesData) {
        expensesData.forEach(expense => {
          const expenseDate = new Date(expense.expense_date);
          totalSpent += expense.amount;
          
          if (expenseDate >= oneWeekAgo) {
            weeklySpent += expense.amount;
          }
          
          if (expenseDate >= oneMonthAgo) {
            monthlySpent += expense.amount;
          }
        });
      }

      const totalBudget = budgetData?.amount || 0;
      const remaining = totalBudget - totalSpent;

      setSummary({
        totalBudget,
        totalSpent,
        remaining,
        weeklySpent,
        monthlySpent
      });

      if (goalData) {
        setSavingsGoal(goalData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const budgetPercentage = summary.totalBudget > 0 ? (summary.totalSpent / summary.totalBudget) * 100 : 0;
  const savingsProgress = savingsGoal ? Math.round((savingsGoal.current_amount / savingsGoal.target_amount) * 100) : 0;

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Home" showMenu={true} showUserProfile={true} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Home" showMenu={true} showUserProfile={true} />

      <main className="main-content">
        <h2 className="greeting" style={isMobile ? { fontSize: '24px' } : {}}>Hello, {userName}! 👋</h2>

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
        {budgetPercentage >= 80 && (
          <div className="warning-box">
            <div className="warning-icon">
              <iconify-icon icon="lucide:triangle-alert"></iconify-icon>
            </div>
            <div className="warning-text">
              <h3 className="warning-title">Budget Alert</h3>
              <p className="warning-message">
                You've spent {Math.round(budgetPercentage)}% of your budget. {budgetPercentage >= 100 ? 'Budget exceeded!' : 'Try to reduce non-essential expenses.'}
              </p>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        {savingsGoal && (
          <div className="savings-goal">
            <div className="goal-top">
              <span className="goal-name">Goal Progress</span>
              <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); handleNavigation('/savings-goals'); }}>
                View All
              </a>
            </div>
            <div className="goal-details">
              <span>{savingsGoal.goal_name}</span>
              <span className="progress-percent">{savingsProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${savingsProgress}%` }}></div>
            </div>
          </div>
        )}

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
