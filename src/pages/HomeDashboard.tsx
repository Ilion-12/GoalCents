import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import { AuthenticationManager } from '../services/AuthenticationManager';
import { BudgetCalculator } from '../services/BudgetCalculator';
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
  
  // Initialize service classes
  const [authManager] = useState(() => AuthenticationManager.getInstance());
  const [budgetCalculator] = useState(() => BudgetCalculator.getInstance());
  const [savingsGoalManager] = useState(() => SavingsGoalManager.getInstance());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use AuthenticationManager to get current user
      const user = authManager.getCurrentUser();
      
      if (!user) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
      
      // Set user name
      setUserName(user.fullName || user.username || 'User');

      // Process finished budgets and transfer leftover to savings
      try {
        console.log('Checking for finished budgets to process...');
        
        // First, let's see what budgets exist
        const { data: allBudgets } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        console.log('All budgets:', allBudgets);
        
        // Check for finished budgets
        const finishedBudgets = allBudgets?.filter(b => 
          b.end_date && new Date(b.end_date) < new Date() && !b.processed
        );
        console.log('Finished unprocessed budgets:', finishedBudgets);
        
        // Debug: Check expenses for each finished budget
        if (finishedBudgets && finishedBudgets.length > 0) {
          for (const budget of finishedBudgets) {
            const { data: budgetExpenses } = await supabase
              .from('expenses')
              .select('*')
              .eq('budget_id', budget.id);
            
            const totalExpenses = budgetExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
            const remaining = budget.amount - totalExpenses;
            
            console.log(`Budget ${budget.id}:`, {
              budgetAmount: budget.amount,
              totalExpenses,
              remaining,
              goalId: budget.goal_id,
              expensesCount: budgetExpenses?.length || 0,
              expenses: budgetExpenses
            });
          }
        }
        
        // Calling the function in supabased
        const { data, error } = await supabase.rpc('process_finished_budgets', {
          p_user_id: user.id
        });
        
        if (error) {
          console.error('RPC Error:', error);
        } else {
          console.log('✅ Process finished budgets completed:', data);
        }
      } catch (rpcError) {
        console.error('Error processing finished budgets:', rpcError);
        // Don't block dashboard load if this fails
      }

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

      // Fetch expenses ONLY for the active budget
      let expenses: Expense[] = [];
      if (budgetData) {
        const { data: budgetExpenses } = await supabase
          .from('expenses')
          .select('*')
          .eq('budget_id', budgetData.id)
          .order('expense_date', { ascending: false });
        
        expenses = budgetExpenses || [];
        console.log(`💸 Found ${expenses.length} expenses for active budget`);
      } else {
        console.log('📭 No active budget - showing zero expenses');
      }

      // Use SavingsGoalManager to fetch savings goal
      const goalResult = await savingsGoalManager.getLatestGoal(user.id);
      if (goalResult.success && goalResult.data) {
        setSavingsGoal(goalResult.data);
      }

      // Use BudgetCalculator to generate budget summary
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

  // Use BudgetCalculator to calculate budget percentage
  const budgetPercentage = budgetCalculator.calculateBudgetPercentage(summary.totalSpent, summary.totalBudget);
  
  // Use SavingsGoalManager to calculate savings progress
  const savingsProgress = savingsGoal ? savingsGoalManager.calculateProgress(savingsGoal).percentage : 0;
  
  // Use BudgetCalculator to generate budget alert
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

      <main className="main-content" style={isMobile ? { padding: '16px' } : {}}>
        <h2 className="greeting" style={isMobile ? { fontSize: '22px', marginBottom: '20px' } : {}}>Hello, {userName}! 👋</h2>

        {/* Main Budget Card */}
        <div className="budget-summary" style={isMobile ? { padding: '20px', marginBottom: '16px' } : {}}>
          <div className="total-balance">
            <div className="balance-label" style={isMobile ? { fontSize: '13px' } : {}}>Total Budget</div>
            <div className="balance-amount" style={isMobile ? { fontSize: '28px' } : {}}>₱{summary.totalBudget.toLocaleString()}</div>
          </div>

          <div className="stats-row" style={isMobile ? { gap: '12px' } : {}}>
            <div className="stat-group" style={isMobile ? { padding: '12px' } : {}}>
              <span className="stat-title" style={isMobile ? { fontSize: '12px' } : {}}>Total Spent</span>
              <span className="stat-number" style={isMobile ? { fontSize: '16px' } : {}}>₱{summary.totalSpent.toLocaleString()}</span>
            </div>
            <div className="stat-group" style={isMobile ? { padding: '12px' } : {}}>
              <span className="stat-title" style={isMobile ? { fontSize: '12px' } : {}}>Remaining</span>
              <span className="stat-number" style={isMobile ? { fontSize: '16px' } : {}}>₱{summary.remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Period Stats */}
        <div className="time-periods" style={isMobile ? { flexDirection: 'column', gap: '12px', marginBottom: '16px' } : {}}>
          <div className="time-card" style={isMobile ? { width: '100%', padding: '16px' } : {}}>
            <span className="time-label" style={isMobile ? { fontSize: '12px' } : {}}>Weekly</span>
            <span className="time-amount" style={isMobile ? { fontSize: '20px' } : {}}>₱{summary.weeklySpent.toLocaleString()}</span>
            <span className="time-description" style={isMobile ? { fontSize: '11px' } : {}}>Spent this week</span>
          </div>
          <div className="time-card" style={isMobile ? { width: '100%', padding: '16px' } : {}}>
            <span className="time-label" style={isMobile ? { fontSize: '12px' } : {}}>Monthly</span>
            <span className="time-amount" style={isMobile ? { fontSize: '20px' } : {}}>₱{summary.monthlySpent.toLocaleString()}</span>
            <span className="time-description" style={isMobile ? { fontSize: '11px' } : {}}>Spent this month</span>
          </div>
        </div>

        {/* Alert */}
        {budgetAlert && (
          <div className="warning-box" style={isMobile ? { padding: '14px', marginBottom: '16px' } : {}}>
            <div className="warning-icon" style={isMobile ? { fontSize: '20px' } : {}}>
              <iconify-icon icon="lucide:triangle-alert"></iconify-icon>
            </div>
            <div className="warning-text">
              <h3 className="warning-title" style={isMobile ? { fontSize: '14px' } : {}}>{budgetAlert.title}</h3>
              <p className="warning-message" style={isMobile ? { fontSize: '12px' } : {}}>
                {budgetAlert.message}
              </p>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        {savingsGoal && (
          <div className="savings-goal" style={isMobile ? { padding: '16px', marginBottom: '16px' } : {}}>
            <div className="goal-top">
              <span className="goal-name" style={isMobile ? { fontSize: '14px' } : {}}>Goal Progress</span>
              <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); handleNavigation('/savings-goals'); }} style={isMobile ? { fontSize: '12px' } : {}}>
                View All
              </a>
            </div>
            <div className="goal-details" style={isMobile ? { marginTop: '10px', marginBottom: '8px' } : {}}>
              <span style={isMobile ? { fontSize: '13px' } : {}}>{savingsGoal.goal_name}</span>
              <span className="progress-percent" style={isMobile ? { fontSize: '13px' } : {}}>{savingsProgress}%</span>
            </div>
            <div className="progress-bar" style={isMobile ? { height: '8px' } : {}}>
              <div className="progress-bar-fill" style={{ width: `${savingsProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="quick-actions" style={isMobile ? { gap: '10px', marginBottom: '12px' } : {}}>
          <div className="action-button secondary" onClick={() => handleNavigation('/add-expense')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon icon="lucide:plus" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Expense</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/set-budget')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon icon="lucide:banknote" className="budget-icon" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Budget</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/savings-goals')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon icon="lucide:target" className="goal-icon" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Goal</span>
          </div>
        </div>

        <div className="quick-actions" style={isMobile ? { gap: '10px', marginBottom: '20px' } : {}}>
          <div className="action-button secondary" onClick={() => handleNavigation('/analytics')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon icon="lucide:bar-chart-3" className="reports-icon" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Reports</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('/spending')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon  icon="lucide:pie-chart" className="spending-icon" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Spending</span>
          </div>
          <div className="action-button secondary" onClick={() => handleNavigation('')} style={isMobile ? { padding: '14px 10px' } : {}}>
            <iconify-icon icon="lucide:shopping-cart" className="compare-icon" style={isMobile ? { fontSize: '20px' } : {}}></iconify-icon>
            <span className="button-label" style={isMobile ? { fontSize: '12px' } : {}}>Prices</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
