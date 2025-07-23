// Token management utilities
const ACCESS_TOKEN_KEY = 'sapphire_access_token';
const REFRESH_TOKEN_KEY = 'sapphire_refresh_token';
const USER_DATA_KEY = 'sapphire_user_data';
const SIGNUP_PROGRESS_KEY = 'sapphire_signup_progress';
const SIGNUP_STATUS_KEY = 'sapphire_signup_status';

export interface UserData {
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  // Add other user fields as needed
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupProgress {
  currentStep: number;
  completedSteps: number[];
  isComplete: boolean;
}

export class TokenManager {
  // Store access token
  static setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  // Get access token
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // Remove access token
  static removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  // Store refresh token
  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // Remove refresh token
  static removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // Store both tokens
  static setTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  // Get both tokens
  static getTokens(): AuthTokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  }

  // Store user data
  static setUserData(userData: UserData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  // Get user data
  static getUserData(): UserData | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Remove user data
  static removeUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_DATA_KEY);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Store signup progress
  static setSignupProgress(progress: SignupProgress): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIGNUP_PROGRESS_KEY, JSON.stringify(progress));
    }
  }

  // Get signup progress
  static getSignupProgress(): SignupProgress | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(SIGNUP_PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Update signup progress
  static updateSignupProgress(step: number, isComplete: boolean = false): void {
    const currentProgress = this.getSignupProgress() || {
      currentStep: 1,
      completedSteps: [],
      isComplete: false
    };

    const updatedProgress: SignupProgress = {
      currentStep: step,
      completedSteps: [...new Set([...currentProgress.completedSteps, step - 1])],
      isComplete: isComplete
    };

    this.setSignupProgress(updatedProgress);
  }

  // Remove signup progress
  static removeSignupProgress(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SIGNUP_PROGRESS_KEY);
    }
  }

  // Check if signup is complete
  static isSignupComplete(): boolean {
    const progress = this.getSignupProgress();
    return progress?.isComplete || false;
  }

  // Get current signup step
  static getCurrentSignupStep(): number {
    const progress = this.getSignupProgress();
    return progress?.currentStep || 1;
  }

  // Store signup status from API
  static setSignupStatus(status: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIGNUP_STATUS_KEY, status);
    }
  }

  // Get signup status from API
  static getSignupStatus(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIGNUP_STATUS_KEY);
    }
    return null;
  }

  // Remove signup status
  static removeSignupStatus(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SIGNUP_STATUS_KEY);
    }
  }

  // Clear all auth data (including signup status)
  static clearAuth(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserData();
    this.removeSignupProgress();
    this.removeSignupStatus();
  }
} 