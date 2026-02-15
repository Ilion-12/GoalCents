import type { Expense } from '../types';

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  weeklySpent: number;
  monthlySpent: number;
  percentage: number;
}

export interface BudgetAlert {
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

export class BudgetCalculator {
  private static instance: BudgetCalculator;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): BudgetCalculator {
    if (!BudgetCalculator.instance) {
      BudgetCalculator.instance = new BudgetCalculator();
    }
    return BudgetCalculator.instance;
  }

  // Calculate total spent from expenses
  public calculateTotalSpent(expenses: Expense[]): number {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  // Calculate weekly spent
  public calculateWeeklySpent(expenses: Expense[]): number {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return expenses
      .filter(expense => new Date(expense.expense_date) >= oneWeekAgo)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  // Calculate monthly spent
  public calculateMonthlySpent(expenses: Expense[]): number {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    return expenses
      .filter(expense => new Date(expense.expense_date) >= oneMonthAgo)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  // Calculate budget percentage used
  public calculateBudgetPercentage(totalSpent: number, totalBudget: number): number {
    if (totalBudget <= 0) return 0;
    return Math.round((totalSpent / totalBudget) * 100);
  }

  // Calculate remaining budget
  public calculateRemaining(totalBudget: number, totalSpent: number): number {
    return totalBudget - totalSpent;
  }

  // Generate budget summary
  public generateBudgetSummary(totalBudget: number, expenses: Expense[]): BudgetSummary {
    const totalSpent = this.calculateTotalSpent(expenses);
    const weeklySpent = this.calculateWeeklySpent(expenses);
    const monthlySpent = this.calculateMonthlySpent(expenses);
    const remaining = this.calculateRemaining(totalBudget, totalSpent);
    const percentage = this.calculateBudgetPercentage(totalSpent, totalBudget);

    return {
      totalBudget,
      totalSpent,
      remaining,
      weeklySpent,
      monthlySpent,
      percentage
    };
  }

  // Check if budget alert is needed
  public shouldShowAlert(percentage: number): boolean {
    return percentage >= 80;
  }

  // Generate budget alert
  public generateBudgetAlert(percentage: number): BudgetAlert | null {
    if (percentage >= 100) {
      return {
        type: 'danger',
        title: 'Budget Exceeded!',
        message: 'You have exceeded your budget. Consider reviewing your expenses.'
      };
    } else if (percentage >= 90) {
      return {
        type: 'danger',
        title: 'Budget Alert',
        message: `You've spent ${percentage}% of your budget. Budget exceeded soon!`
      };
    } else if (percentage >= 80) {
      return {
        type: 'warning',
        title: 'Budget Alert',
        message: `You've spent ${percentage}% of your budget. Try to reduce non-essential expenses.`
      };
    }

    return null;
  }

  // Calculate daily average spending
  public calculateDailyAverage(expenses: Expense[], days: number = 30): number {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const relevantExpenses = expenses.filter(expense => 
      new Date(expense.expense_date) >= startDate
    );

    const total = this.calculateTotalSpent(relevantExpenses);
    return total / days;
  }

  // Predict when budget will be exhausted
  public predictBudgetExhaustion(totalBudget: number, expenses: Expense[]): { days: number; date: Date } | null {
    const dailyAverage = this.calculateDailyAverage(expenses, 7); // Use last 7 days
    const totalSpent = this.calculateTotalSpent(expenses);
    const remaining = totalBudget - totalSpent;

    if (remaining <= 0 || dailyAverage <= 0) {
      return null;
    }

    const daysRemaining = Math.floor(remaining / dailyAverage);
    const exhaustionDate = new Date();
    exhaustionDate.setDate(exhaustionDate.getDate() + daysRemaining);

    return {
      days: daysRemaining,
      date: exhaustionDate
    };
  }

  // Calculate spending by category
  public calculateCategorySpending(expenses: Expense[]): Map<string, number> {
    const categoryMap = new Map<string, number>();

    expenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });

    return categoryMap;
  }

  // Calculate essential vs non-essential spending
  public calculateEssentialSplit(expenses: Expense[]): { essential: number; nonEssential: number; essentialPercentage: number } {
    let essential = 0;
    let nonEssential = 0;

    expenses.forEach(expense => {
      if (expense.is_essential) {
        essential += expense.amount;
      } else {
        nonEssential += expense.amount;
      }
    });

    const total = essential + nonEssential;
    const essentialPercentage = total > 0 ? Math.round((essential / total) * 100) : 50;

    return { essential, nonEssential, essentialPercentage };
  }

  // Format currency
  public formatCurrency(amount: number): string {
    return `₱${amount.toLocaleString()}`;
  }
}
