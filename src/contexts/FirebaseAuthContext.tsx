import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authService } from '../services/auth';

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const firebaseUser: FirebaseUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        
        setCurrentUser(firebaseUser);
        
        // Get ID token and verify with backend
        try {
          const idToken = await user.getIdToken();
          await authService.verifyFirebaseToken({ idToken });
          console.log('✅ Firebase user verified with backend');
        } catch (error) {
          console.error('❌ Failed to verify Firebase user with backend:', error);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Email/password sign in successful');
      return result;
    } catch (error: any) {
      console.error('❌ Email/password sign in failed:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign in successful');
      return result;
    } catch (error: any) {
      console.error('❌ Google sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: `${firstName} ${lastName}`
        });
      }
      
      console.log('✅ Email/password sign up successful');
      return result;
    } catch (error: any) {
      console.error('❌ Email/password sign up failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        console.log('✅ Profile updated successfully');
      }
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
