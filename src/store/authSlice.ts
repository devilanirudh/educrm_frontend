import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token,
      };
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    rehydrateAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { loginSuccess, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;