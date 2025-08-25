import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isImpersonating: boolean;
  originalUser: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isImpersonating: false,
  originalUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isImpersonating = false;
      state.originalUser = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isImpersonating = false;
      state.originalUser = null;
      
      // Clear impersonation data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('originalUser');
        localStorage.removeItem('isImpersonating');
      }
    },
    rehydrateAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isImpersonating = false;
      state.originalUser = null;
    },
    startImpersonation(state, action: PayloadAction<{ impersonatedUser: User; originalUser: User; token: string }>) {
      console.log('🎭 Redux: startImpersonation action received:', action.payload);
      console.log('🎭 Redux: Impersonated user data:', action.payload.impersonatedUser);
      console.log('🎭 Redux: Original user data:', action.payload.originalUser);
      console.log('🎭 Redux: Token:', action.payload.token);
      
      state.isAuthenticated = true;
      state.user = action.payload.impersonatedUser;
      state.token = action.payload.token;
      state.isImpersonating = true;
      state.originalUser = action.payload.originalUser;
      
      console.log('🎭 Redux: State updated - user:', state.user, 'isImpersonating:', state.isImpersonating);
      console.log('🎭 Redux: Final state:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isImpersonating: state.isImpersonating,
        originalUser: state.originalUser
      });
    },
    stopImpersonation(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isImpersonating = false;
      state.originalUser = null;
    },
  },
});

export const { loginSuccess, logout, rehydrateAuth, startImpersonation, stopImpersonation } = authSlice.actions;
export default authSlice.reducer;