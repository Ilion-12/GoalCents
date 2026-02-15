import { supabase } from '../dataBase/supabase';
import type { SavingsGoal } from '../types';

export interface CreateGoalData {
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
}

export interface GoalResult {
  success: boolean;
  message: string;
  data?: SavingsGoal;
}

export interface GoalProgress {
  percentage: number;
  remaining: number;
  achieved: boolean;
}

export class SavingsGoalManager {
  private static instance: SavingsGoalManager;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): SavingsGoalManager {
    if (!SavingsGoalManager.instance) {
      SavingsGoalManager.instance = new SavingsGoalManager();
    }
    return SavingsGoalManager.instance;
  }

  // Create a new savings goal
  public async createGoal(goalData: CreateGoalData): Promise<GoalResult> {
    try {
      const { data, error } = await supabase
        .from('savings_goal')
        .insert([goalData])
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        return { success: false, message: 'Failed to create savings goal' };
      }

      return { success: true, message: 'Savings goal created successfully!', data };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, message: 'Failed to create savings goal' };
    }
  }

  // Get the latest savings goal for a user
  public async getLatestGoal(userId: string): Promise<GoalResult> {
    try {
      const { data, error } = await supabase
        .from('savings_goal')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching goal:', error);
        return { success: false, message: 'Failed to fetch savings goal' };
      }

      if (!data) {
        return { success: false, message: 'No savings goal found' };
      }

      return { success: true, message: 'Goal fetched successfully', data };
    } catch (error) {
      console.error('Error fetching goal:', error);
      return { success: false, message: 'Failed to fetch savings goal' };
    }
  }

  // Update a savings goal
  public async updateGoal(goalId: string, updates: Partial<CreateGoalData>): Promise<GoalResult> {
    try {
      const { data, error } = await supabase
        .from('savings_goal')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        return { success: false, message: 'Failed to update goal' };
      }

      return { success: true, message: 'Goal updated successfully!', data };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, message: 'Failed to update goal' };
    }
  }

  // Reset goal progress (set current_amount to 0)
  public async resetGoal(goalId: string): Promise<GoalResult> {
    return this.updateGoal(goalId, { current_amount: 0 });
  }

  // Add to savings goal
  public async addToGoal(goalId: string, amount: number): Promise<GoalResult> {
    try {
      // First, get the current goal
      const { data: currentGoal, error: fetchError } = await supabase
        .from('savings_goal')
        .select('*')
        .eq('id', goalId)
        .single();

      if (fetchError || !currentGoal) {
        return { success: false, message: 'Failed to fetch goal' };
      }

      const newAmount = currentGoal.current_amount + amount;

      // Update the goal
      const { data, error } = await supabase
        .from('savings_goal')
        .update({ current_amount: newAmount })
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        return { success: false, message: 'Failed to add to goal' };
      }

      return { success: true, message: `Added ₱${amount.toLocaleString()} to savings goal!`, data };
    } catch (error) {
      console.error('Error adding to goal:', error);
      return { success: false, message: 'Failed to add to goal' };
    }
  }

  // Calculate goal progress
  public calculateProgress(goal: SavingsGoal): GoalProgress {
    const percentage = Math.round((goal.current_amount / goal.target_amount) * 100);
    const remaining = goal.target_amount - goal.current_amount;
    const achieved = goal.current_amount >= goal.target_amount;

    return { percentage, remaining, achieved };
  }

  // Check if goal is achieved
  public isGoalAchieved(goal: SavingsGoal): boolean {
    return goal.current_amount >= goal.target_amount;
  }

  // Calculate how much to save per day/week/month to reach goal
  public calculateSavingsRate(goal: SavingsGoal, timeframe: 'daily' | 'weekly' | 'monthly'): number {
    const remaining = goal.target_amount - goal.current_amount;
    
    if (remaining <= 0) return 0;

    // Default to 30 days if no timeframe
    let days = 30;

    switch (timeframe) {
      case 'daily':
        days = 1;
        break;
      case 'weekly':
        days = 7;
        break;
      case 'monthly':
        days = 30;
        break;
    }

    return remaining / days;
  }

  // Estimate time to reach goal based on current savings rate
  public estimateTimeToGoal(goal: SavingsGoal, monthlySavings: number): { months: number; days: number } | null {
    const remaining = goal.target_amount - goal.current_amount;
    
    if (remaining <= 0 || monthlySavings <= 0) return null;

    const months = Math.ceil(remaining / monthlySavings);
    const days = Math.ceil((remaining / monthlySavings) * 30);

    return { months, days };
  }

  // Get or create default goal
  public async getOrCreateDefaultGoal(userId: string): Promise<GoalResult> {
    const existingGoal = await this.getLatestGoal(userId);
    
    if (existingGoal.success && existingGoal.data) {
      return existingGoal;
    }

    // Create default goal
    const defaultGoalData: CreateGoalData = {
      user_id: userId,
      goal_name: 'New Phone',
      target_amount: 15000,
      current_amount: 9000
    };

    return this.createGoal(defaultGoalData);
  }

  // Format currency
  public formatCurrency(amount: number): string {
    return `₱${amount.toLocaleString()}`;
  }

  // Format percentage
  public formatPercentage(percentage: number): string {
    return `${percentage}%`;
  }
}
