import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { auth, googleProvider } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { useAppDispatch } from '../../store';
import { rehydrateAuth } from '../../store/authSlice';
import api from '../../services/api';


interface FirebaseLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const FirebaseLogin: React.FC<FirebaseLoginProps> = ({ onSuccess, onError }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Email login successful');
      
      // Wait for backend verification to complete
      console.log('🔄 Waiting for backend verification...');
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Verify with backend
      try {
        const response = await api.post('/firebase-auth/verify-token', { idToken });
        
        if (response.status === 200) {
          console.log('✅ Backend verification successful');
          const data = response.data;
          
          // Update Redux state
          const userData = {
            id: data.user?.id || 0,
            email: result.user.email || '',
            first_name: data.user?.first_name || '',
            last_name: data.user?.last_name || '',
            role: data.user?.role || 'student',
            is_active: data.user?.is_active || true,
            is_verified: data.user?.is_verified || result.user.emailVerified,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            language_preference: 'en',
            timezone: 'UTC'
          };
          
          dispatch(rehydrateAuth({ user: userData, token: idToken }));
          console.log('✅ Redux state updated');
          
          onSuccess?.();
        } else if (response.status === 403) {
          const errorData = response.data;
          const errorMessage = errorData.detail || 'Access denied. Your email is not authorized to access this system.';
          console.log('🚫 Access denied:', errorMessage);
          // Sign out from Firebase
          await signOut(auth);
          setError(errorMessage);
        } else {
          console.error('❌ Backend verification failed:', response.status);
          setError('Login failed. Please try again.');
          await signOut(auth);
        }
      } catch (backendError) {
        console.error('❌ Backend verification error:', backendError);
        setError('Login failed. Please try again.');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error('❌ Email login failed:', error);
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email address'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Login failed. Please try again.';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google login successful');
      
      // Wait for backend verification to complete
      console.log('🔄 Waiting for backend verification...');
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Verify with backend
      try {
        const response = await api.post('/firebase-auth/verify-token', { idToken });
        
        if (response.status === 200) {
          console.log('✅ Backend verification successful');
          const data = response.data;
          
          // Update Redux state
          const userData = {
            id: data.user?.id || 0,
            email: result.user.email || '',
            first_name: data.user?.first_name || '',
            last_name: data.user?.last_name || '',
            role: data.user?.role || 'student',
            is_active: data.user?.is_active || true,
            is_verified: data.user?.is_verified || result.user.emailVerified,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            language_preference: 'en',
            timezone: 'UTC'
          };
          
          dispatch(rehydrateAuth({ user: userData, token: idToken }));
          console.log('✅ Redux state updated');
          
          onSuccess?.();
        } else if (response.status === 403) {
          const errorData = response.data;
          const errorMessage = errorData.detail || 'Access denied. Your email is not authorized to access this system.';
          console.log('🚫 Access denied:', errorMessage);
          // Sign out from Firebase
          await signOut(auth);
          setError(errorMessage);
        } else {
          console.error('❌ Backend verification failed:', response.status);
          setError('Login failed. Please try again.');
          await signOut(auth);
        }
      } catch (backendError) {
        console.error('❌ Backend verification error:', backendError);
        setError('Login failed. Please try again.');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error('❌ Google login failed:', error);
      const errorMessage = error.code === 'auth/popup-closed-by-user'
        ? 'Login cancelled'
        : 'Google login failed. Please try again.';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="space-y-6">
        {/* Google Sign In Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-6" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirebaseLogin;
