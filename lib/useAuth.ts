import { useState, useEffect } from 'react';
import { TokenManager, UserData, AuthTokens } from './tokenManager';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const tokens = TokenManager.getTokens();
      const user = TokenManager.getUserData();
      
      setAuthState({
        isAuthenticated: !!tokens?.accessToken,
        user: user,
        loading: false,
      });
    };

    checkAuth();
  }, []);

  const login = (tokens: AuthTokens, user?: UserData) => {
    TokenManager.setTokens(tokens);
    if (user) {
      TokenManager.setUserData(user);
    }
    setAuthState({
      isAuthenticated: true,
      user: user || null,
      loading: false,
    });
  };

  const logout = () => {
    TokenManager.clearAuth();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  const updateUser = (user: UserData) => {
    TokenManager.setUserData(user);
    setAuthState(prev => ({
      ...prev,
      user: user,
    }));
  };

  const updateTokens = (tokens: AuthTokens) => {
    TokenManager.setTokens(tokens);
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    updateTokens,
  };
} 