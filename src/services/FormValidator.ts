export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export class FormValidator {
  private static instance: FormValidator;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): FormValidator {
    if (!FormValidator.instance) {
      FormValidator.instance = new FormValidator();
    }
    return FormValidator.instance;
  }

  // Validate email format
  public validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }

    return { isValid: true, message: '' };
  }

  // Validate username
  public validateUsername(username: string): ValidationResult {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }

    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
      return { isValid: false, message: 'Username must be less than 20 characters' };
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }

    return { isValid: true, message: '' };
  }

  // Validate password
  public validatePassword(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters' };
    }

    return { isValid: true, message: '' };
  }

  // Validate password match
  public validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match!' };
    }

    return { isValid: true, message: '' };
  }

  // Validate required field
  public validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true, message: '' };
  }

  // Validate amount
  public validateAmount(amount: number, fieldName: string = 'Amount'): ValidationResult {
    if (!amount || amount <= 0) {
      return { isValid: false, message: `${fieldName} must be greater than 0` };
    }

    if (isNaN(amount)) {
      return { isValid: false, message: `${fieldName} must be a valid number` };
    }

    return { isValid: true, message: '' };
  }

  // Validate date
  public validateDate(date: string): ValidationResult {
    if (!date) {
      return { isValid: false, message: 'Date is required' };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, message: 'Invalid date format' };
    }

    return { isValid: true, message: '' };
  }

  // Validate expense form
  public validateExpenseForm(amount: number, description: string, date: string): ValidationResult {
    const amountValidation = this.validateAmount(amount);
    if (!amountValidation.isValid) {
      return amountValidation;
    }

    const descriptionValidation = this.validateRequired(description, 'Description');
    if (!descriptionValidation.isValid) {
      return descriptionValidation;
    }

    const dateValidation = this.validateDate(date);
    if (!dateValidation.isValid) {
      return dateValidation;
    }

    return { isValid: true, message: '' };
  }

  // Validate budget form
  public validateBudgetForm(amount: number): ValidationResult {
    return this.validateAmount(amount, 'Budget amount');
  }

  // Validate savings goal form
  public validateSavingsGoalForm(goalName: string, targetAmount: number, currentAmount: number): ValidationResult {
    const nameValidation = this.validateRequired(goalName, 'Goal name');
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    const targetValidation = this.validateAmount(targetAmount, 'Target amount');
    if (!targetValidation.isValid) {
      return targetValidation;
    }

    if (currentAmount < 0) {
      return { isValid: false, message: 'Current amount cannot be negative' };
    }

    if (currentAmount > targetAmount) {
      return { isValid: false, message: 'Current amount cannot exceed target amount' };
    }

    return { isValid: true, message: '' };
  }

  // Validate registration form
  public validateRegistrationForm(fullName: string, email: string, username: string, password: string, confirmPassword: string): ValidationResult {
    const nameValidation = this.validateRequired(fullName, 'Full name');
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }

    const usernameValidation = this.validateUsername(username);
    if (!usernameValidation.isValid) {
      return usernameValidation;
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    const passwordMatchValidation = this.validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      return passwordMatchValidation;
    }

    return { isValid: true, message: '' };
  }

  // Validate login form
  public validateLoginForm(username: string, password: string): ValidationResult {
    if (!username || !password) {
      return { isValid: false, message: 'Please enter username and password!' };
    }

    return { isValid: true, message: '' };
  }
}
