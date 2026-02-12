import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import { supabase } from '../dataBase/supabase';
import type { CategoryData, TrendData, Expense, SavingsGoal, Alert } from '../types';
import '../styles/visualAnalyticsPage.css';



const VisualAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [showEssentialOnly, setShowEssentialOnly] = useState(false);
  const [budget, setBudget] = useState({ total: 0, spent: 0, remaining: 0, percentage: 0 });
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const tabs = ['Overview', 'Spending', 'Trends', 'Budget', 'Savings', 'Alerts'];
  
  // Refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const spendingRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const savingsRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  const calculateTrends = useCallback(() => {
    const now = new Date();
    const trendsArray: TrendData[] = [];

    if (trendPeriod === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0);
        const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59);
        
        const dayExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.expense_date);
          return expenseDate >= dayStart && expenseDate <= dayEnd;
        });

        const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : dayStart.toLocaleDateString('en-US', { weekday: 'short' });
        trendsArray.push({
          period: dayName,
          amount: dayTotal
        });
      }
    } else if (trendPeriod === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        const weekExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.expense_date);
          return expenseDate >= weekStart && expenseDate < weekEnd;
        });

        const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        trendsArray.push({
          period: `Week ${4 - i}`,
          amount: weekTotal
        });
      }
    } else if (trendPeriod === 'monthly') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
        
        const monthExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.expense_date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        });

        const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        trendsArray.push({
          period: monthName,
          amount: monthTotal
        });
      }
    }

    setTrends(trendsArray);
  }, [allExpenses, trendPeriod]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      // Fetch budget
      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (expensesData) {
        setAllExpenses(expensesData);
      }

      // Fetch savings goal
      const { data: goalData } = await supabase
        .from('savings_goal')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Process data
      if (expensesData) {
        // Calculate spending by category
        const categoryMap = new Map<string, { amount: number; isEssential: boolean }>();
        let totalSpent = 0;

        expensesData.forEach(expense => {
          const category = expense.category || 'Others';
          const current = categoryMap.get(category) || { amount: 0, isEssential: expense.is_essential };
          current.amount += expense.amount;
          categoryMap.set(category, current);
          totalSpent += expense.amount;
        });

        const categoriesArray: CategoryData[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          amount: data.amount,
          percentage: totalSpent > 0 ? Math.round((data.amount / totalSpent) * 100) : 0,
          isEssential: data.isEssential
        })).sort((a, b) => b.amount - a.amount);

        setCategories(categoriesArray);

        // Calculate budget data
        const totalBudget = budgetData?.amount || 0;
        const remaining = totalBudget - totalSpent;
        const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
        setBudget({
          total: totalBudget,
          spent: totalSpent,
          remaining: remaining,
          percentage: percentage
        });

        // Generate alerts
        const newAlerts: Alert[] = [];
        if (percentage >= 80) {
          newAlerts.push({
            type: 'warning' as const,
            icon: 'lucide:alert-triangle',
            title: 'Budget Warning',
            message: `You have reached ${percentage}% of your ${budgetData?.timeframe || 'monthly'} budget.`
          });
        }

        const essentialSpent = expensesData
          .filter(e => !e.is_essential)
          .reduce((sum, e) => sum + e.amount, 0);
        
        if (essentialSpent > totalSpent * 0.3) {
          newAlerts.push({
            type: 'info' as const,
            icon: 'lucide:info',
            title: 'Spending Update',
            message: 'Non-essential expenses are higher than recommended.'
          });
        }

        if (percentage < 80 && totalBudget > 0) {
          newAlerts.push({
            type: 'success' as const,
            icon: 'lucide:check-circle-2',
            title: 'Great Job!',
            message: 'Staying under budget helps increase your savings.'
          });
        }

        setAlerts(newAlerts);
      }

      if (goalData) {
        setSavingsGoal(goalData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  useEffect(() => {
    if (allExpenses.length > 0) {
      calculateTrends();
    }
  }, [calculateTrends, allExpenses]);

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    
    let targetRef;
    switch(tab) {
      case 'Overview':
        targetRef = overviewRef;
        break;
      case 'Spending':
        targetRef = spendingRef;
        break;
      case 'Trends':
        targetRef = trendsRef;
        break;
      case 'Budget':
        targetRef = budgetRef;
        break;
      case 'Savings':
        targetRef = savingsRef;
        break;
      case 'Alerts':
        targetRef = alertsRef;
        break;
      default:
        targetRef = overviewRef;
    }
    
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getTopCategory = () => {
    if (categories.length === 0) return 'No expenses yet';
    return categories[0].category;
  };

  const getSecondCategory = () => {
    if (categories.length < 2) return '';
    return categories[1].category;
  };

  const getTrendComparison = () => {
    if (trends.length < 2) return 'Not enough data to show trends yet.';
    
    const lastPeriod = trends[trends.length - 1].amount;
    const prevPeriod = trends[trends.length - 2].amount;
    
    if (lastPeriod === 0 && prevPeriod === 0) {
      return 'No spending in recent periods.';
    }
    
    if (prevPeriod === 0) {
      return `Spending started in the current period.`;
    }
    
    const change = Math.round(((lastPeriod - prevPeriod) / prevPeriod) * 100);
    const periodName = trendPeriod === 'daily' ? 'yesterday' : trendPeriod === 'weekly' ? 'last week' : 'last month';
    
    if (change > 0) {
      return `Your spending increased by ${change}% compared to ${periodName}.`;
    } else if (change < 0) {
      return `Your spending decreased by ${Math.abs(change)}% compared to ${periodName}.`;
    } else {
      return `Your spending is stable compared to ${periodName}.`;
    }
  };

  const filteredCategories = showEssentialOnly 
    ? categories.filter(c => c.isEssential) 
    : categories;

  const savingsProgress = savingsGoal 
    ? Math.round((savingsGoal.current_amount / savingsGoal.target_amount) * 100) 
    : 0;

const calculateMonthsToGoal = () => {
  if (!savingsGoal) return 'N/A';

  const remainingGoal =
    savingsGoal.target_amount - savingsGoal.current_amount;

  if (remainingGoal <= 0) return 'Goal Achieved 🎉';

  if (budget.remaining <= 0) return 'No savings possible';

  const months = Math.ceil(remainingGoal / budget.remaining);

  return months;
};

  const getTotalSpending = () => {
    return filteredCategories.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const generateDonutGradient = () => {
    if (filteredCategories.length === 0) {
      return 'conic-gradient(var(--chart-4) 0% 100%)';
    }

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let currentPercent = 0;
    const gradientParts: string[] = [];

    filteredCategories.slice(0, 6).forEach((cat, index) => {
      const startPercent = currentPercent;
      currentPercent += cat.percentage;
      const color = colors[index % colors.length];
      gradientParts.push(`${color} ${startPercent}% ${currentPercent}%`);
    });

    // If there are remaining percentages (due to rounding), fill with last color
    if (currentPercent < 100) {
      const lastColor = colors[(filteredCategories.length - 1) % colors.length];
      gradientParts.push(`${lastColor} ${currentPercent}% 100%`);
    }

    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Visual Analytics" onBackClick={handleBack} showUserProfile={true} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading analytics...</div>
        </main>
      </div>
    );
  }

  return (
    <div >
      <Header title="Visual Analytics" onBackClick={handleBack} showUserProfile={true} />

      <nav className="tab-navigation" style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' } : {}}>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => scrollToSection(tab)}
            style={isMobile ? { fontSize: '14px', padding: '10px 12px', flexShrink: 0 } : {}}
          >
            {tab}
          </div>
        ))}
      </nav>

      <main className="main-content">
        {/* Overview Section */}
        <div ref={overviewRef} className="section-container">
          <h2 className="section-title">Overview</h2>
        </div>

        {/* Spending Section */}
        <div ref={spendingRef} className="section-container">
          <h2 className="section-title">Spending Breakdown</h2>
        </div>
        
        {/* Spending Breakdown */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:pie-chart"></iconify-icon>
            </div>
            <span>Spending Breakdown</span>
          </div>

          <div className="filter-row">
            <div 
              className={`filter-button ${!showEssentialOnly ? 'active' : ''}`}
              onClick={() => setShowEssentialOnly(false)}
            >
              All Expenses
            </div>
            <div 
              className={`filter-button ${showEssentialOnly ? 'active' : ''}`}
              onClick={() => setShowEssentialOnly(true)}
            >
              Essential Only
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="donut-chart" style={{ background: generateDonutGradient() }}>
              <div className="donut-inner">
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Total</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--foreground)' }}>
                  ₱{getTotalSpending().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="chart-legend" style={isMobile ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } : {}}>
            {filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)', gridColumn: '1 / -1' }}>
                No expenses to display
              </div>
            ) : (
              <>
                {filteredCategories.slice(0, 6).map((cat, index) => {
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#e8eb25'];
                  return (
                    <div key={cat.category} className="legend-item">
                      <div className="legend-dot" style={{ background: colors[index % colors.length] }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{cat.category}</span>
                        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
                          ₱{cat.amount.toLocaleString()} ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
                {filteredCategories.length > 6 && (
                  <div className="legend-item" style={{ gridColumn: '1 / -1', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: '12px' }}>
                    +{filteredCategories.length - 6} more categories
                  </div>
                )}
              </>
            )}
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:lightbulb"></iconify-icon>
            </div>
            <div>
              {categories.length === 0 
                ? 'No expenses recorded yet.'
                : `Most of your expenses are from ${getTopCategory()}${getSecondCategory() ? ` and ${getSecondCategory()}` : ''}.`
              }
            </div>
          </div>
        </div>

        {/* Trends Section */}
        <div ref={trendsRef} className="section-container">
          <h2 className="section-title">Trends</h2>
        </div>

        {/* Spending Trends */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:trending-up"></iconify-icon>
            </div>
            <span>Spending Trends</span>
          </div>

          <div className="chart-controls">
            <div 
              className={`filter-button ${trendPeriod === 'daily' ? 'active' : ''}`}
              onClick={() => setTrendPeriod('daily')}
            >
              Daily
            </div>
            <div 
              className={`filter-button ${trendPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setTrendPeriod('weekly')}
            >
              Weekly
            </div>
            <div 
              className={`filter-button ${trendPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setTrendPeriod('monthly')}
            >
              Monthly
            </div>
          </div>

          <div className="chart-canvas">
            <div className="grid-line top"></div>
            <div className="grid-line middle"></div>
            <div className="grid-line bottom"></div>

            {trends.length > 0 ? (
              <svg className="line-chart" viewBox="0 0 300 140" preserveAspectRatio="none">
                {(() => {
                  const maxAmount = Math.max(...trends.map(w => w.amount), 1);
                  const points = trends.map((week, index) => {
                    const x = trends.length > 1 ? (index / (trends.length - 1)) * 300 : 150;
                    const y = 140 - ((week.amount / maxAmount) * 110) - 10;
                    return { x, y, amount: week.amount };
                  });
                  
                  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                  
                  return (
                    <>
                      <polyline 
                        points={polylinePoints}
                        fill="none" 
                        stroke="var(--primary)" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      {points.map((point, index) => (
                        <circle 
                          key={index}
                          cx={point.x} 
                          cy={point.y} 
                          r="4" 
                          fill="var(--primary)" 
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted-foreground)', fontSize: '14px' }}>
                No spending data available
              </div>
            )}
          </div>

          <div className="chart-labels">
            {trends.map((item, index) => (
              <span key={index}>{item.period}</span>
            ))}
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:trending-up"></iconify-icon>
            </div>
            <div>{getTrendComparison()}</div>
          </div>
        </div>

        {/* Budget Section */}
        <div ref={budgetRef} className="section-container">
          <h2 className="section-title">Budget</h2>
        </div>

        {/* Budget vs Actual */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:scale"></iconify-icon>
            </div>
            <span>Budget vs Actual</span>
          </div>

          <div className="budget-row">
            <div className="budget-label">Budget</div>
            <div className="budget-track" style={{ backgroundColor: '#e5e7eb' }}>
              <div className="budget-fill" style={{ width: '100%', color: 'transparent' }}></div>
            </div>
            <div className="budget-value text-muted">₱{budget.total.toLocaleString()}</div>
          </div>

          <div className="budget-row">
            <div className="budget-label">Spent</div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: `${Math.min(budget.percentage, 100)}%`, backgroundColor: budget.percentage >= 100 ? 'var(--destructive)' : 'var(--primary)' }}></div>
            </div>
            <div className="budget-value" style={{ color: budget.percentage >= 100 ? 'var(--destructive)' : 'var(--primary)' }}>₱{budget.spent.toLocaleString()}</div>
          </div>

          <div className="chart-labels" style={{ justifyContent: 'space-between', display: 'flex',marginTop: '16px',paddingTop: '16px',borderTop: '1px dashed var(--border)'}}>
            <span className="text-sm text-muted">Remaining</span>
            <span className="text-sm font-bold" style={{ color: budget.remaining < 0 ? 'var(--destructive)' : 'var(--primary)' }}>₱{budget.remaining.toLocaleString()}</span>
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon={budget.percentage < 100 ? "lucide:check-circle" : "lucide:alert-circle"}></iconify-icon>
            </div>
            <div>
              {budget.total === 0 
                ? 'No budget set yet. Set a budget to track your spending!'
                : budget.percentage < 100 
                ? `You are still within your budget. Keep it up!`
                : `You have exceeded your budget by ₱${Math.abs(budget.remaining).toLocaleString()}.`
              }
            </div>
          </div>
        </div>

        {/* Savings Section */}
        <div ref={savingsRef} className="section-container">
          <h2 className="section-title">Savings</h2>
        </div>

        {/* Savings Goal */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:piggy-bank"></iconify-icon>
            </div>
            <span>Savings Goal</span>
          </div>

          {savingsGoal ? (
            <>
              <div className="savings-header">
                <div>
                  <div className="font-medium">{savingsGoal.goal_name}</div>
                  <div className="text-xs text-muted">₱{savingsGoal.current_amount.toLocaleString()} / ₱{savingsGoal.target_amount.toLocaleString()}</div>
                </div>
                <div className="font-bold text-primary">{savingsProgress}%</div>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${savingsProgress}%` }}></div>
              </div>

              <div className="insight-box">
                <div className="icon-wrapper">
                  <iconify-icon icon="lucide:calendar"></iconify-icon>
                </div>
                <div>
                  {savingsProgress >= 100 
                    ? 'Congratulations! You have reached your savings goal!'
                    : budget.remaining > 0
                    ? `If you stay within budget, you can reach your goal in approximately ${calculateMonthsToGoal()} months.`
                    : 'Set a budget and control spending to reach your goal faster.'
                  }
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)' }}>
              No savings goal set yet. Create one to start tracking!
            </div>
          )}
        </div>

        {/* Alerts Section */}
        <div ref={alertsRef} className="section-container">
          <h2 className="section-title">Alerts</h2>
        </div>

        {/* Alerts */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:bell"></iconify-icon>
            </div>
            <span>Alerts</span>
          </div>

          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)' }}>
              No alerts at this time. Keep tracking your expenses!
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div key={index} className={`alert-card ${alert.type}`}>
                <div className="icon-wrapper">
                  <iconify-icon icon={alert.icon}></iconify-icon>
                </div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default VisualAnalyticsPage;
