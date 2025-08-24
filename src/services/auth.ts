/**
 * Authentication service
 */

import api from './api';
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
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('🔍 Raw API response:', response);
    console.log('🔍 Response data:', response.data);

    if (response && response.data) {
      // Store tokens in localStorage
      console.log('💾 Storing tokens in localStorage...');
      tokenUtils.setTokens(response.data.access_token, response.data.refresh_token);
      console.log('✅ Tokens stored. localStorage accessToken:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
      
      // Store user data in localStorage for persistence
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ User data stored in localStorage');
      }
      
      // The response should already include user data from the backend
      console.log('🔑 Login response data:', response.data);
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  // Logout user (Firebase)
  logout: async (): Promise<void> => {
    try {
      // For Firebase, we don't need to call a backend logout endpoint
      // The frontend will handle the logout by clearing the Redux state
      // and Firebase will handle the token invalidation
      console.log('🔐 Firebase logout - clearing local state');
      return Promise.resolve();
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if there's an error, we should still clear local state
      return Promise.resolve();
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access_token: string; token_type: string }> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/me', userData);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Firebase Authentication
  verifyFirebaseToken: async (tokenData: { idToken: string }): Promise<any> => {
    const response = await api.post('/firebase-auth/verify-token', tokenData);
    return response.data;
  },

  // Get current user from Firebase auth
  getCurrentFirebaseUser: async (): Promise<any> => {
    const response = await api.get('/firebase-auth/me');
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId: number, role: string): Promise<any> => {
    const response = await api.put(`/firebase-auth/users/${userId}/role`, { role });
    return response.data;
  },

  // Get Firebase role for user (admin only)
  getFirebaseUserRole: async (userId: number): Promise<any> => {
    const response = await api.get(`/firebase-auth/users/${userId}/firebase-role`);
    return response.data;
  },

  // Sync Firebase roles (admin only)
  syncFirebaseRoles: async (): Promise<any> => {
    const response = await api.post('/firebase-auth/sync-firebase-roles');
    return response.data;
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  // Get user sessions
  getUserSessions: async (): Promise<any[]> => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  // Revoke session
  revokeSession: async (sessionId: number): Promise<void> => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  // Revoke all sessions
  revokeAllSessions: async (): Promise<void> => {
    const response = await api.delete('/auth/sessions');
    return response.data;
  },
  // Switch user role
  switchRole: async (newRole: string): Promise<{ access_token: string }> => {
    const response = await api.post('/auth/switch-role', { new_role: newRole });
    return response.data;
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
    localStorage.removeItem('user');
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
