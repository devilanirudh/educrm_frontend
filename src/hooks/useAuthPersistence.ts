import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { rehydrateAuth } from '../store/authSlice';
import { tokenUtils } from '../services/auth';

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is authenticated on app startup
    const checkAuthOnStartup = () => {
      const token = tokenUtils.getAccessToken();
      const userStr = localStorage.getItem('user');
      
      if (token && userStr && tokenUtils.isAuthenticated()) {
        try {
          const user = JSON.parse(userStr);
          dispatch(rehydrateAuth({ user, token }));
          console.log('✅ Auth state rehydrated from localStorage');
        } catch (error) {
          console.error('Error rehydrating auth state:', error);
          // Clear invalid data
          tokenUtils.clearTokens();
        }
      } else if (token && !tokenUtils.isAuthenticated()) {
        // Token exists but is expired, clear it
        console.log('❌ Token expired, clearing auth data');
        tokenUtils.clearTokens();
      }
    };

    checkAuthOnStartup();
  }, [dispatch]);
};
