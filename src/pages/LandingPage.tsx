import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import '../styles/landingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('App is already installed or cannot be installed on this device.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="logo-wrapper">
          <img src="/IMG/logo.png" alt="Smart Expense Tracker" className="logo-image" />
        </div>
        <h1 className="app-name">
          Smart Expense &amp;<br />Budget Tracker
        </h1>
      </header>

      <section className="hero">
        <h2 className="hero-title">Take control of your daily spending</h2>
        <p className="hero-subtitle">Budget smarter. Save faster.</p>
      </section>

      <div className="features" style={isMobile ? { gridTemplateColumns: '1fr', gap: '12px' } : isTablet ? { gridTemplateColumns: '1fr 1fr', gap: '16px' } : {}}>
        <div className="feature-card">
          <div className="feature-icon">
            <iconify-icon icon="lucide:list-todo" width={isMobile ? "24" : "28"}></iconify-icon>
          </div>
          <span className="feature-label">Track daily expenses easily</span>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <iconify-icon icon="lucide:pie-chart" width={isMobile ? "24" : "28"}></iconify-icon>
          </div>
          <span className="feature-label">Visual analytics &amp; AI insights</span>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <iconify-icon icon="lucide:arrow-left-right" width={isMobile ? "24" : "28"}></iconify-icon>
          </div>
          <span className="feature-label">Compare spending vs PH prices</span>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <iconify-icon icon="lucide:target" width={isMobile ? "24" : "28"}></iconify-icon>
          </div>
          <span className="feature-label">Goal-based savings</span>
        </div>
      </div>

      <div className="install-section">
        <div className="install-button" onClick={handleInstall}>
          Install App
        </div>
        <div className="install-button" onClick={() => handleNavigation('/login')} style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)' }}>
          Continue on Web
        </div>
      </div>

      <section className="benefits">
        <h3 className="benefits-title">Why use this app?</h3>

        <div className="benefits-list">
          <div className="benefit-item">
            <div className="check-icon">
              <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            </div>
            <span>Smart budget suggestions</span>
          </div>

          <div className="benefit-item">
            <div className="check-icon">
              <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            </div>
            <span>Grocery &amp; transport price data</span>
          </div>

          <div className="benefit-item">
            <div className="check-icon">
              <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            </div>
            <span>Essential vs non-essential view</span>
          </div>

          <div className="benefit-item">
            <div className="check-icon">
              <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            </div>
            <span>Clear charts &amp; reports</span>
          </div>
        </div>
      </section>

  <footer style={{padding: "32px 24px", display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", gap: 24, background: "var(--background)", borderTop: "1px solid var(--border)"}}>
        <span className="footer-link" onClick={() => handleNavigation('/dashboard')}>
          About
        </span>
        <span className="footer-link" onClick={() => handleNavigation('/dashboard')}>
          Privacy
        </span>
        <span className="footer-link" onClick={() => handleNavigation('/dashboard')}>
          Contact
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
