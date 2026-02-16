// TypeScript interfaces for Supabase integration



export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  user_id: string;
  amount: number;
  timeframe: 'week' | 'month';
  is_active: boolean;
  created_at: string;
  start_date: string;
  end_date: string;
  processed: boolean;
  goal_id: string | null;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  is_essential: boolean;
  ai_category?: string;
  ai_note?: string;
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  created_at: string;
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


export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  isEssential: boolean;
}

export interface TrendData {
  period: string;
  amount: number;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  is_essential: boolean;
  ai_category?: string;
  ai_note?: string;
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  created_at: string;
}

export interface Alert {
  type: 'warning' | 'info' | 'success';
  icon: string;
  title: string;
  message: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  expense_date: string;
  amount: number;
  category: string;
}