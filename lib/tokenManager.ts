// Token management utilities
const ACCESS_TOKEN_KEY = 'sapphire_access_token';
const REFRESH_TOKEN_KEY = 'sapphire_refresh_token';
const USER_DATA_KEY = 'sapphire_user_data';
const KYC_STATUS_KEY = 'sapphire_kyc_status';

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

export type KYCStatus = 'INITIATED' | 'BANK_LINKED' | 'PROFILE_COMPLETE';

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

  // Store KYC status
  static setKYCStatus(status: KYCStatus): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KYC_STATUS_KEY, status);
    }
  }

  // Get KYC status
  static getKYCStatus(): KYCStatus | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(KYC_STATUS_KEY) as KYCStatus | null;
    }
    return null;
  }

  // Remove KYC status
  static removeKYCStatus(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KYC_STATUS_KEY);
    }
  }

  // Get the next step based on current KYC status
  static getNextStep(): number {
    const status = this.getKYCStatus();
    switch (status) {
      case 'INITIATED':
        return 2; // User completed step 1, go to step 2
      case 'BANK_LINKED':
        return 3; // User completed step 2, go to step 3
      case 'PROFILE_COMPLETE':
        return 0; // User completed all steps, can go to dashboard
      default:
        return 1; // No status or unknown status, start from step 1
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Clear all auth data (including signup status)
  static clearAuth(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserData();
    this.removeKYCStatus();
  }
} 