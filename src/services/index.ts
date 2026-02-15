// Export all service classes for easy importing
export { AuthenticationManager } from './AuthenticationManager';
export type { UserData } from './AuthenticationManager';

export { FormValidator } from './FormValidator';
export type { ValidationResult } from './FormValidator';

export { BudgetCalculator } from './BudgetCalculator';
export type { BudgetSummary, BudgetAlert } from './BudgetCalculator';

export { ExpenseManager } from './ExpenseManager';
export type { CreateExpenseData, ExpenseResult, ExpensesResult } from './ExpenseManager';

export { SavingsGoalManager } from './SavingsGoalManager';
export type { CreateGoalData, GoalResult, GoalProgress } from './SavingsGoalManager';
