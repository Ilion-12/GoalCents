import { supabase } from '../dataBase/supabase';
import type { Expense } from '../types';

export interface CreateExpenseData {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  is_essential: boolean;
}

export interface ExpenseResult {
  success: boolean;
  message: string;
  data?: Expense;
}

export interface ExpensesResult {
  success: boolean;
  message: string;
  data?: Expense[];
}

export class ExpenseManager {
  private static instance: ExpenseManager;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): ExpenseManager {
    if (!ExpenseManager.instance) {
      ExpenseManager.instance = new ExpenseManager();
    }
    return ExpenseManager.instance;
  }

  // Create a new expense
  public async createExpense(expenseData: CreateExpenseData): Promise<ExpenseResult> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        if (error.message) {
          return { 
            success: false, 
            message: `Error: ${error.message}. Please check SUPABASE_FIX.sql if you see RLS errors.` 
          };
        }
        throw error;
      }

      return { success: true, message: 'Expense saved successfully!', data };
    } catch (error) {
      console.error('Error creating expense:', error);
      return { success: false, message: 'Failed to save expense. Please try again.' };
    }
  }

  // Get all expenses for a user
  public async getAllExpenses(userId: string): Promise<ExpensesResult> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return { success: false, message: 'Failed to fetch expenses' };
      }

      return { success: true, message: 'Expenses fetched successfully', data: data || [] };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, message: 'Failed to fetch expenses' };
    }
  }

  // Get expenses by date range
  public async getExpensesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ExpensesResult> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .gte('expense_date', startDate.toISOString())
        .lte('expense_date', endDate.toISOString())
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return { success: false, message: 'Failed to fetch expenses' };
      }

      return { success: true, message: 'Expenses fetched successfully', data: data || [] };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, message: 'Failed to fetch expenses' };
    }
  }

  // Get expenses by category
  public async getExpensesByCategory(userId: string, category: string): Promise<ExpensesResult> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return { success: false, message: 'Failed to fetch expenses' };
      }

      return { success: true, message: 'Expenses fetched successfully', data: data || [] };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, message: 'Failed to fetch expenses' };
    }
  }

  // Update an expense
  public async updateExpense(expenseId: string, updates: Partial<CreateExpenseData>): Promise<ExpenseResult> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', expenseId)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        return { success: false, message: 'Failed to update expense' };
      }

      return { success: true, message: 'Expense updated successfully!', data };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, message: 'Failed to update expense' };
    }
  }

  // Delete an expense
  public async deleteExpense(expenseId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) {
        console.error('Error deleting expense:', error);
        return { success: false, message: 'Failed to delete expense' };
      }

      return { success: true, message: 'Expense deleted successfully!' };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, message: 'Failed to delete expense' };
    }
  }

  // Filter expenses by type (essential/non-essential)
  public filterExpensesByType(expenses: Expense[], isEssential: boolean): Expense[] {
    return expenses.filter(expense => expense.is_essential === isEssential);
  }

  // Get expense categories
  public getExpenseCategories(): string[] {
    return [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Personal Care',
      'Gifts & Donations',
      'Other'
    ];
  }

  // Format date for display
  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Get current date in YYYY-MM-DD format
  public getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
