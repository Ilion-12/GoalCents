import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeDashboard from './pages/HomeDashboard';
import AddExpensePage from './pages/AddExpensePage';
import SetBudgetPage from './pages/SetBudgetPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import SpendingPage from './pages/SpendingPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import VisualAnalyticsPage from './pages/VisualAnalyticsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import './App.css';

function App() {
  // TODO: Add authentication check with Supabase
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <HomeDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-expense"
          element={isAuthenticated ? <AddExpensePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/set-budget"
          element={isAuthenticated ? <SetBudgetPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/savings-goals"
          element={isAuthenticated ? <SavingsGoalsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/spending"
          element={isAuthenticated ? <SpendingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/price-comparison"
          element={isAuthenticated ? <PriceComparisonPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <VisualAnalyticsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/ai-assistant"
          element={isAuthenticated ? <AIAssistantPage /> : <Navigate to="/login" />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
