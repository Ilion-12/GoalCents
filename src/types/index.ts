// TypeScript interfaces for Supabase integration

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  amount: number;
  timeFrame: 'week' | 'month';
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isEssential: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceComparison {
  id: string;
  category: string;
  item: string;
  userSpending: number;
  marketPrice: number;
  date: string;
}

export interface AITip {
  id: string;
  type: 'alert' | 'savings';
  title: string;
  description: string;
  createdAt: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  weeklySpent: number;
  monthlySpent: number;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  isEssential: boolean;
}

export interface ChartData {
  labels: string[];
  values: number[];
}
