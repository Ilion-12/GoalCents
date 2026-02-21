import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AddExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/set-budget"
          element={
            <ProtectedRoute>
              <SetBudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/savings-goals"
          element={
            <ProtectedRoute>
              <SavingsGoalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spending"
          element={
            <ProtectedRoute>
              <SpendingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-comparison"
          element={
            <ProtectedRoute>
              <PriceComparisonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <VisualAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
