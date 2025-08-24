import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { rehydrateAuth, logout } from '../store/authSlice';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../services/api';


export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Firebase auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        // Check if we're already authenticated to avoid duplicate API calls
        const currentState = JSON.parse(localStorage.getItem('persist:auth') || '{}');
        console.log('🔍 Current localStorage state:', currentState);
        console.log('🔍 Current pathname:', window.location.pathname);
        
        if (currentState.isAuthenticated === 'true' && currentState.token) {
          console.log('✅ Already authenticated, skipping verification');
          
          // If we're on login page or root page, redirect to dashboard
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            console.log('🔄 Redirecting to dashboard from:', window.location.pathname);
            window.location.href = '/dashboard';
          } else {
            console.log('📍 On protected page, current path:', window.location.pathname);
          }
          return;
        }
        
        // Check if we're on login page (let login component handle it)
        if (window.location.pathname === '/login') {
          console.log('🔍 On login page - skipping useAuthPersistence');
          return;
        }
        
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await api.post('/firebase-auth/verify-token', { idToken });
          
          if (response.status === 200) {
            const data = response.data;
            const userData = {
              id: data.user?.id || 0,
              email: firebaseUser.email || '',
              first_name: data.user?.first_name || '',
              last_name: data.user?.last_name || '',
              role: data.user?.role || 'student',
              is_active: data.user?.is_active || true,
              is_verified: data.user?.is_verified || firebaseUser.emailVerified,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              language_preference: 'en',
              timezone: 'UTC'
            };
            
            dispatch(rehydrateAuth({ user: userData, token: idToken }));
            console.log('✅ Auth state rehydrated for:', userData.email);
          } else {
            console.error('❌ Backend verification failed');
            await signOut(auth);
            dispatch(logout());
          }
        } catch (error: any) {
          console.error('❌ Auth persistence error:', error);
          if (error.response?.status === 403) {
            await signOut(auth);
          }
          dispatch(logout());
        }
      } else {
        console.log('👤 User signed out');
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
};
