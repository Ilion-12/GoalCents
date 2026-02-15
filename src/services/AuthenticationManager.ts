import { supabase } from '../dataBase/supabase';

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export class AuthenticationManager {
  private static instance: AuthenticationManager;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): AuthenticationManager {
    if (!AuthenticationManager.instance) {
      AuthenticationManager.instance = new AuthenticationManager();
    }
    return AuthenticationManager.instance;
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('userId');
  }

  // Get current user data from localStorage
  public getCurrentUser(): UserData | null {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    return {
      id: userId,
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || '',
      fullName: localStorage.getItem('fullName') || ''
    };
  }

  // Get current user ID
  public getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Login user
  public async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: UserData }> {
    if (!username || !password) {
      return { success: false, message: 'Please enter username and password!' };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        return { success: false, message: 'Invalid username or password!' };
      }

      if (data.password !== password) {
        return { success: false, message: 'Invalid username or password!' };
      }

      const userData: UserData = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.full_name
      };

      this.setUserSession(userData);

      return { success: true, message: 'Login successful!', user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  }

  // Register new user
  public async register(fullName: string, email: string, username: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!fullName || !email || !username || !password) {
      return { success: false, message: 'Please fill in all fields!' };
    }

    try {
      // Check if username or email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`);

      if (existingUser && existingUser.length > 0) {
        if (existingUser.some(user => user.username === username)) {
          return { success: false, message: 'Username already exists!' };
        } else {
          return { success: false, message: 'Email already exists!' };
        }
      }

      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert([
          {
            full_name: fullName,
            email: email,
            username: username,
            password: password
          }
        ])
        .select();

      if (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Registration failed: ' + error.message };
      }

      return { success: true, message: 'Registration successful! Please login.' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'An error occurred during registration.' };
    }
  }

  // Set user session in localStorage
  private setUserSession(user: UserData): void {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('fullName', user.fullName);
    localStorage.setItem('email', user.email);
  }

  // Logout user
  public logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  // Verify user is logged in, redirect if not
  public requireAuth(navigate: (path: string) => void): boolean {
    if (!this.isAuthenticated()) {
      console.error('No user logged in');
      navigate('/login');
      return false;
    }
    return true;
  }
}
