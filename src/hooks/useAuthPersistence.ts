import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { rehydrateAuth, logout, startImpersonation } from '../store/authSlice';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../services/api';
import { tokenUtils } from '../services/auth';

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
        
        // Check if we have an impersonation token that needs verification
        const accessToken = tokenUtils.getAccessToken();
        const isImpersonationToken = accessToken && accessToken.startsWith('impersonation_');
        
        // If we're already authenticated in Redux, handle routing
        if (currentState.isAuthenticated === 'true' && currentState.token && !isImpersonationToken) {
          console.log('✅ Already authenticated, skipping verification');
          
          // Check if we're on any auth-related page and redirect to dashboard
          const authPaths = ['/login', '/auth/login', '/register', '/auth/register', '/forgot-password', '/auth/forgot-password', '/reset-password', '/auth/reset-password', '/'];
          if (authPaths.includes(window.location.pathname)) {
            console.log('🔄 Redirecting to dashboard from auth page:', window.location.pathname);
            window.location.href = '/dashboard';
          } else {
            console.log('📍 On protected page, current path:', window.location.pathname);
          }
          return;
        }
        
        // If we have an impersonation token, we need to verify it even if already authenticated
        if (isImpersonationToken) {
          console.log('🎭 Impersonation token detected, verifying session...');
        }
        
        // If Firebase user exists but not authenticated in Redux, verify with backend
        console.log('🔄 Firebase user exists but not authenticated in Redux, verifying with backend...');
        
        try {
          const idToken = await firebaseUser.getIdToken();
          
          // Check if this is an impersonation session token
          const accessToken = tokenUtils.getAccessToken();
          console.log('🔍 Checking access token:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
          
          let response;
          if (accessToken && accessToken.startsWith('impersonation_')) {
            // For impersonation tokens, use the impersonation token instead of Firebase token
            console.log('🎭 Using impersonation token for verification');
            response = await api.post('/firebase-auth/verify-token', { idToken: accessToken });
          } else {
            // For regular Firebase tokens, use the Firebase token
            response = await api.post('/firebase-auth/verify-token', { idToken });
          }
          
          if (response.status === 200) {
            const data = response.data;
            
            if (accessToken && accessToken.startsWith('impersonation_')) {
              console.log('🎭 Impersonation session detected, setting up impersonation state');
              console.log('🔍 Backend response data:', data);
              console.log('🔍 Backend user data:', data.user);
              console.log('🔍 Backend original_user data:', data.original_user);
              console.log('🔍 Firebase user:', firebaseUser);
              
              // For impersonation sessions, we use the data from the backend response
              // which contains the impersonated user's information
              const impersonatedUserData = {
                id: data.user?.id || 0,
                email: data.user?.email || firebaseUser.email || '',
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
              
              // Get original user data from localStorage (stored during impersonation)
              const storedOriginalUser = localStorage.getItem('originalUser');
              const originalUserData = storedOriginalUser ? JSON.parse(storedOriginalUser) : {
                id: 0,
                email: 'admin@example.com',
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin' as const,
                is_active: true,
                is_verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                language_preference: 'en',
                timezone: 'UTC'
              };
              
              console.log('🎭 Restored original user from localStorage:', originalUserData);
              
              const impersonationAction = {
                impersonatedUser: impersonatedUserData,
                originalUser: originalUserData,
                token: accessToken
              };
              
              console.log('🎭 Dispatching impersonation action from auth persistence:', impersonationAction);
              dispatch(startImpersonation(impersonationAction));
              
              console.log('✅ Impersonation state set up for:', impersonatedUserData.email);
            } else {
              // Regular authentication
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
            }
            
            // Redirect to dashboard after successful verification
            const authPaths = ['/login', '/auth/login', '/register', '/auth/register', '/forgot-password', '/auth/forgot-password', '/reset-password', '/auth/reset-password', '/'];
            if (authPaths.includes(window.location.pathname)) {
              console.log('🔄 Redirecting to dashboard after successful verification');
              window.location.href = '/dashboard';
            }
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
