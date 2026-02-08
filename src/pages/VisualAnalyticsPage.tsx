import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/Header';
import '../styles/visualAnalyticsPage.css';


const VisualAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const tabs = ['Overview', 'Spending', 'Trends', 'Budget', 'Savings', 'Alerts'];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <Header title="Visual Analytics" onBackClick={handleBack} showUserProfile={true} />

      <nav className="tab-navigation">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={isMobile ? { fontSize: '14px', padding: '10px 12px' } : {}}
          >
            {tab}
          </div>
        ))}
      </nav>

      <main className="main-content">
        {/* Spending Breakdown */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:pie-chart"></iconify-icon>
            </div>
            <span>Spending Breakdown</span>
          </div>

          <div className="filter-row">
            <div className="filter-button active">All Expenses</div>
            <div className="filter-button">Essential Only</div>
          </div>

          <div className="chart-wrapper">
            <div className="donut-chart">
              <div className="donut-inner">Total</div>
            </div>
          </div>

          <div className="chart-legend" style={isMobile ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } : {}}>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--chart-1)' }}></div>
              <span>Food (35%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--chart-2)' }}></div>
              <span>Transport (25%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--chart-3)' }}></div>
              <span>Bills (25%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--chart-4)' }}></div>
              <span>Others (15%)</span>
            </div>
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:lightbulb"></iconify-icon>
            </div>
            <div>Most of my expenses this month are from Food and Transport.</div>
          </div>
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
            <div className="filter-button">Daily</div>
            <div className="filter-button active">Weekly</div>
            <div className="filter-button">Monthly</div>
          </div>

          <div className="chart-canvas">
            <div className="grid-line top"></div>
            <div className="grid-line middle"></div>
            <div className="grid-line bottom"></div>

            <svg className="line-chart" viewBox="0 0 300 140" preserveAspectRatio="none">
              <polyline 
                points="0,100 75,90 150,40 225,60 300,30" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="0" cy="100" r="4" fill="var(--primary)" />
              <circle cx="75" cy="90" r="4" fill="var(--primary)" />
              <circle cx="150" cy="40" r="4" fill="var(--primary)" />
              <circle cx="225" cy="60" r="4" fill="var(--primary)" />
              <circle cx="300" cy="30" r="4" fill="var(--primary)" />
            </svg>
          </div>

          <div className="chart-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:trending-up"></iconify-icon>
            </div>
            <div>My spending increased by 15% compared to last month.</div>
          </div>
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
            <div className="budget-value text-muted">₱10,000</div>
          </div>

          <div className="budget-row">
            <div className="budget-label">Spent</div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: '87%', backgroundColor: 'var(--primary)' }}></div>
            </div>
            <div className="budget-value text-primary">₱8,700</div>
          </div>

          <div className="chart-labels" style={{ justifyContent: 'space-between', display: 'flex',marginTop: '16px',paddingTop: '16px',borderTop: '1px dashed var(--border)'}}>
            <span className="text-sm text-muted">Remaining</span>
            <span className="text-sm font-bold text-primary">₱1,300</span>
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:check-circle"></iconify-icon>
            </div>
            <div>I am still within my monthly budget.</div>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:piggy-bank"></iconify-icon>
            </div>
            <span>Savings Goal</span>
          </div>

          <div className="savings-header">
            <div>
              <div className="font-medium">New Phone</div>
              <div className="text-xs text-muted">₱9,000 / ₱15,000</div>
            </div>
            <div className="font-bold text-primary">60%</div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <div className="insight-box">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:calendar"></iconify-icon>
            </div>
            <div>If I stay within budget, I can reach my goal in approximately 3 months.</div>
          </div>
        </div>

        {/* Alerts */}
        <div className="insight-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:bell"></iconify-icon>
            </div>
            <span>Alerts</span>
          </div>

          <div className="alert-card warning">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:alert-triangle"></iconify-icon>
            </div>
            <div className="alert-content">
              <h4>Budget Warning</h4>
              <p>You have reached 80% of your monthly budget.</p>
            </div>
          </div>

          <div className="alert-card info">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:info"></iconify-icon>
            </div>
            <div className="alert-content">
              <h4>Spending Update</h4>
              <p>Non-essential expenses increased this week.</p>
            </div>
          </div>

          <div className="alert-card success">
            <div className="icon-wrapper">
              <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            </div>
            <div className="alert-content">
              <h4>Great Job!</h4>
              <p>Staying under budget helped increase your savings.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisualAnalyticsPage;
