import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/priceComparisons.css';

const PriceComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Food');
  const [item, setItem] = useState('Tomatoes');
  const [userSpending] = useState(120);
  const [marketPrice] = useState(110);

  const variance = userSpending - marketPrice;
  const variancePercent = Math.round((variance / marketPrice) * 100);
  const isOverpaying = variance > 0;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header title="Price Comparison" onBackClick={handleBack} showUserProfile={true} />

      <main className="main-content">
        {/* Selection Controls */}
        <section className="filter-row">
          <div className="filter-field">
            <label className="field-label">Category</label>
            <div className="dropdown">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Food</option>
                <option>Transportation</option>
                <option>Utilities</option>
              </select>
            </div>
          </div>
          <div className="filter-field">
            <label className="field-label">Item</label>
            <div className="dropdown">
              <select value={item} onChange={(e) => setItem(e.target.value)}>
                <option>Tomatoes</option>
                <option>Rice</option>
                <option>Chicken</option>
              </select>
            </div>
          </div>
        </section>

        {/* Comparison Card */}
        <section className="comparison-card">
          <div className="price-row">
            <div className="price-box">
              <span className="price-label">Your Spending</span>
              <span className="price-amount">₱{userSpending.toFixed(2)}</span>
            </div>
            <div className="price-box">
              <span className="price-label">Avg Market Price</span>
              <span className="price-amount">₱{marketPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className={`variance-display ${isOverpaying ? 'overpaying' : 'underpaying'}`}>
            <span>Variance</span>
            <div className="variance-info">
              <span>{isOverpaying ? '+' : '-'} ₱{Math.abs(variance).toFixed(2)}</span>
              <iconify-icon icon={isOverpaying ? 'lucide:trending-up' : 'lucide:trending-down'}></iconify-icon>
            </div>
          </div>
          <div className="alert-message">
            You are paying {Math.abs(variancePercent)}% {isOverpaying ? 'more' : 'less'} than average.
          </div>
        </section>

        {/* Trend Graph */}
        <section className="comparison-card">
          <div className="trend-title">Price Trend (Last 6 Months)</div>

          <div className="chart-wrapper">
            <svg className="chart-svg" viewBox="0 0 300 150" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="0" x2="300" y2="0" stroke="#e5e7eb" strokeWidth="1"></line>
              <line x1="0" y1="75" x2="300" y2="75" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4"></line>
              <line x1="0" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4"></line>

              {/* Market Price Line */}
              <polyline
                points="0,110 60,105 120,115 180,108 240,112 300,110"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeDasharray="4"
              ></polyline>

              {/* User Spending Line */}
              <polyline
                points="0,80 60,95 120,70 180,90 240,85 300,120"
                fill="none"
                stroke="var(--info)"
                strokeWidth="3"
                strokeLinecap="round"
              ></polyline>
            </svg>

            <div className="chart-labels">
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-line user"></div>
                <span>Your Spending</span>
              </div>
              <div className="legend-item">
                <div className="legend-line market"></div>
                <span>Market Price</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PriceComparisonPage;
