/**
 * Authentication related TypeScript types
 */

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'staff' | 'guest';

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  profile_picture?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  language_preference: string;
  timezone: string;
}

export interface LoginRequest {
  username: string; // Can be email or username
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: UserRole;
  terms_accepted: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface TokenData {
  user_id: number;
  role: UserRole;
  exp: number;
  iat: number;
  type: 'access' | 'refresh';
}

export interface SessionInfo {
  id: number;
  user_id: number;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  last_activity: string;
}

export interface UserPreference {
  id: number;
  user_id: number;
  preference_key: string;
  preference_value?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  users_by_role: Record<UserRole, number>;
  recent_registrations: number;
  recent_logins: number;
}
