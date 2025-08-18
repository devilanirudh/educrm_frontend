/**
 * Authentication service
 */

import { api } from './api';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest 
} from '../types/auth';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<User> => {
    return api.post<User>('/auth/register', userData);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access_token: string; token_type: string }> => {
    return api.post('/auth/refresh', { refresh_token: refreshToken });
  },

  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return api.put<User>('/auth/me', userData);
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return api.post('/auth/change-password', data);
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return api.post('/auth/forgot-password', data);
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return api.post('/auth/reset-password', data);
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    return api.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => {
    return api.post('/auth/resend-verification');
  },

  // Get user sessions
  getUserSessions: async (): Promise<any[]> => {
    return api.get('/auth/sessions');
  },

  // Revoke session
  revokeSession: async (sessionId: number): Promise<void> => {
    return api.delete(`/auth/sessions/${sessionId}`);
  },

  // Revoke all sessions
  revokeAllSessions: async (): Promise<void> => {
    return api.delete('/auth/sessions');
  },
};

// Token management utilities
export const tokenUtils = {
  // Get access token from localStorage
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token from localStorage
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  // Set tokens in localStorage
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Clear tokens from localStorage
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const accessToken = tokenUtils.getAccessToken();
    if (!accessToken) return false;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Decode JWT token
  decodeToken: (token: string): any => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },

  // Get user ID from token
  getUserIdFromToken: (): number | null => {
    const token = tokenUtils.getAccessToken();
    if (!token) return null;

    const payload = tokenUtils.decodeToken(token);
    return payload?.sub ? parseInt(payload.sub) : null;
  },

  // Get user role from token
  getUserRoleFromToken: (): string | null => {
    const token = tokenUtils.getAccessToken();
    if (!token) return null;

    const payload = tokenUtils.decodeToken(token);
    return payload?.role || null;
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: (): boolean => {
    const token = tokenUtils.getAccessToken();
    if (!token) return true;

    try {
      const payload = tokenUtils.decodeToken(token);
      const currentTime = Date.now() / 1000;
      const expirationTime = payload.exp;
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Return true if token expires within 5 minutes (300 seconds)
      return timeUntilExpiration < 300;
    } catch (error) {
      return true;
    }
  },
};
