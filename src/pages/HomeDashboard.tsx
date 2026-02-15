import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { BudgetCalculator } from '../services/BudgetCalculator';
import { ExpenseManager } from '../services/ExpenseManager';
import { SavingsGoalManager } from '../services/SavingsGoalManager';
import type { BudgetSummary, SavingsGoal, Expense } from '../types';
import '../styles/homeDashboard.css';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [summary, setSummary] = useState<BudgetSummary>({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    weeklySpent: 0,
    monthlySpent: 0
  });
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  
  // OOP: Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [budgetCalculator] = useState(() => BudgetCalculator.getInstance());
  const [expenseManager] = useState(() => ExpenseManager.getInstance());
  const [savingsGoalManager] = useState(() => SavingsGoalManager.getInstance());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // OOP: Use AuthenticationManager to get current user
      const user = authManager.getCurrentUser();
      
      if (!user) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
      
      // Set user name
      setUserName(user.fullName || user.username || 'User');

      // Fetch active budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (budgetError && budgetError.code !== 'PGRST116') {
        console.error('Error fetching budget:', budgetError);
      }

      // OOP: Use ExpenseManager to fetch all expenses
      const expensesResult = await expenseManager.getAllExpenses(user.id);
      const expenses: Expense[] = expensesResult.data || [];

      // OOP: Use SavingsGoalManager to fetch savings goal
      const goalResult = await savingsGoalManager.getLatestGoal(user.id);
      if (goalResult.success && goalResult.data) {
        setSavingsGoal(goalResult.data);
      }

      // OOP: Use BudgetCalculator to generate budget summary
      const totalBudget = budgetData?.amount || 0;
      const budgetSummary = budgetCalculator.generateBudgetSummary(totalBudget, expenses);
      setSummary(budgetSummary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // OOP: Use BudgetCalculator to calculate budget percentage
  const budgetPercentage = budgetCalculator.calculateBudgetPercentage(summary.totalSpent, summary.totalBudget);
  
  // OOP: Use SavingsGoalManager to calculate savings progress
  const savingsProgress = savingsGoal ? savingsGoalManager.calculateProgress(savingsGoal).percentage : 0;
  
  // OOP: Use BudgetCalculator to generate budget alert
  const budgetAlert = budgetCalculator.generateBudgetAlert(budgetPercentage);

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
    <div className="">
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
        {budgetAlert && (
          <div className="warning-box">
            <div className="warning-icon">
              <iconify-icon icon="lucide:triangle-alert"></iconify-icon>
            </div>
            <div className="warning-text">
              <h3 className="warning-title">{budgetAlert.title}</h3>
              <p className="warning-message">
                {budgetAlert.message}
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
          <div className="action-button secondary" onClick={() => handleNavigation('/add-expense')}>
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

        <div className="quick-actions">
          <div className="action-button secondary" onClick={() => handleNavigation('/analytics')}>
            <iconify-icon icon="lucide:bar-chart-3" className="reports-icon"></iconify-icon>
            <span className="button-label">Reports</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/spending')}>
            <iconify-icon  icon="lucide:pie-chart" className="spending-icon"></iconify-icon>
            <span className="button-label">Spending</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/price-comparison')}>
            <iconify-icon icon="lucide:shopping-cart" className="compare-icon"></iconify-icon>
            <span className="button-label">Prices</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
