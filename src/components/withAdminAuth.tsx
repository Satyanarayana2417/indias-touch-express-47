import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface UserDocument {
  role?: string;
  email?: string;
  uid?: string;
  [key: string]: any;
}

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Higher-Order Component that provides admin route protection
 * Ensures only authenticated users with 'admin' role can access wrapped components
 */
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const AdminProtectedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState<AdminAuthState>({
      user: null,
      isAdmin: false,
      loading: true,
      error: null
    });

    useEffect(() => {
      // Listen to Firebase Auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (!user) {
            // No user logged in - redirect to login
            console.log('Admin access denied: No authenticated user');
            setAuthState({
              user: null,
              isAdmin: false,
              loading: false,
              error: null
            });
            navigate('/login', { replace: true });
            return;
          }

          console.log('Checking admin status for user:', user.email);
          
          // User is authenticated, now check their role in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // User document doesn't exist in Firestore
            console.warn('Admin access denied: User document not found in Firestore');
            setAuthState({
              user,
              isAdmin: false,
              loading: false,
              error: 'User profile not found'
            });
            navigate('/', { replace: true });
            return;
          }

          const userData = userDocSnap.data() as UserDocument;
          const isAdmin = userData.role === 'admin';

          if (!isAdmin) {
            // User is authenticated but not an admin
            console.warn('Admin access denied: User does not have admin role', {
              email: user.email,
              uid: user.uid,
              role: userData.role
            });
            setAuthState({
              user,
              isAdmin: false,
              loading: false,
              error: null
            });
            navigate('/', { replace: true });
            return;
          }

          // User is authenticated and has admin role - grant access
          console.log('Admin access granted to:', user.email);
          setAuthState({
            user,
            isAdmin: true,
            loading: false,
            error: null
          });

        } catch (error) {
          console.error('Error checking admin status:', error);
          setAuthState({
            user: null,
            isAdmin: false,
            loading: false,
            error: 'Failed to verify admin status'
          });
          navigate('/', { replace: true });
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [navigate]);

    // Show loading state while checking authentication and authorization
    if (authState.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Admin Access
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your credentials...
            </p>
          </div>
        </div>
      );
    }

    // Show error state if there was a problem verifying admin status
    if (authState.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {authState.error}. Please try logging in again.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    // If we reach here, user is authenticated and has admin role
    // Render the protected component
    return <Component {...props} />;
  };

  // Set display name for better debugging
  AdminProtectedComponent.displayName = `withAdminAuth(${Component.displayName || Component.name})`;

  return AdminProtectedComponent;
}

/**
 * Custom hook to get current admin auth state
 * Can be used within components wrapped by withAdminAuth
 */
export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    isAdmin: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setAuthState({
            user: null,
            isAdmin: false,
            loading: false,
            error: null
          });
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setAuthState({
            user,
            isAdmin: false,
            loading: false,
            error: 'User profile not found'
          });
          return;
        }

        const userData = userDocSnap.data() as UserDocument;
        const isAdmin = userData.role === 'admin';

        setAuthState({
          user,
          isAdmin,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error in useAdminAuth:', error);
        setAuthState({
          user: null,
          isAdmin: false,
          loading: false,
          error: 'Failed to verify admin status'
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};
