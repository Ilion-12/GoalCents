import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import type { ExpenseItem } from '../types';
import { supabase } from '../dataBase/supabase';
import '../styles/spendingPage.css';



const SpendingPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [essentialTotal, setEssentialTotal] = useState(0);
  const [nonEssentialTotal, setNonEssentialTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [essentialExpenses, setEssentialExpenses] = useState<ExpenseItem[]>([]);
  const [nonEssentialExpenses, setNonEssentialExpenses] = useState<ExpenseItem[]>([]);

  const total = essentialTotal + nonEssentialTotal;
  const essentialPercent = total > 0 ? Math.round((essentialTotal / total) * 100) : 50;

  useEffect(() => {
    fetchSpendingData();
  }, []);

  const fetchSpendingData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      // Fetch all expenses
      const { data: expensesData, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      if (expensesData) {
        // Separate essential and non-essential expenses
        const essential: ExpenseItem[] = [];
        const nonEssential: ExpenseItem[] = [];
        let essentialSum = 0;
        let nonEssentialSum = 0;

        expensesData.forEach(expense => {
          const item: ExpenseItem = {
            id: expense.id,
            description: expense.description,
            expense_date: expense.expense_date,
            amount: expense.amount,
            category: expense.category
          };

          if (expense.is_essential) {
            essential.push(item);
            essentialSum += expense.amount;
          } else {
            nonEssential.push(item);
            nonEssentialSum += expense.amount;
          }
        });

        setEssentialExpenses(essential);
        setNonEssentialExpenses(nonEssential);
        setEssentialTotal(essentialSum);
        setNonEssentialTotal(nonEssentialSum);
      }
    } catch (error) {
      console.error('Error fetching spending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Spending Split" onBackClick={handleBack} showUserProfile={true} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
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
          {essentialExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)' }}>
              No essential expenses yet
            </div>
          ) : (
            <div className="expense-list">
              {essentialExpenses.map((expense) => (
                <div key={expense.id} className="expense-row">
                  <div className="expense-info">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-name">{expense.description}</span>
                    <span className="expense-date">{formatDate(expense.expense_date)}</span>
                  </div>
                  <span className="expense-amount">₱{expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed List: Non-Essential */}
        <div className="expenses-section">
          <div className="section-heading">Non-Essential Expenses</div>
          {nonEssentialExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)' }}>
              No non-essential expenses yet
            </div>
          ) : (
            <div className="expense-list">
              {nonEssentialExpenses.map((expense) => (
                <div key={expense.id} className="expense-row">
                  <div className="expense-info">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-name">{expense.description}</span>
                    <span className="expense-date">{formatDate(expense.expense_date)}</span>
                  </div>
                  <span className="expense-amount">₱{expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SpendingPage;
