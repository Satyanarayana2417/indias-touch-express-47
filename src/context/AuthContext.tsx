import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserDocument, mockUserOperations } from '@/lib/users';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ isNewUser: boolean; user: User }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if we're in development mode with placeholder Firebase config
const isDevMode = import.meta.env.VITE_FIREBASE_API_KEY === undefined || 
                  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-api-key" ||
                  import.meta.env.VITE_FIREBASE_API_KEY === "demo" ||
                  import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo";

// Development mode utility function (for testing)
if (isDevMode && typeof window !== 'undefined') {
  (window as any).resetGoogleAuthState = () => {
    localStorage.removeItem('mockGoogleUsers');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserDocuments');
    console.log('Google auth state reset. Next Google sign-in will be treated as new user.');
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    if (isDevMode) {
      // Mock authentication for development
      const mockUser = {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({})
      } as User;
      
      setCurrentUser(mockUser);
      // Persist user in localStorage for development mode
      localStorage.setItem('mockUser', JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName
      }));
      return;
    }
    
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    if (isDevMode) {
      // Mock authentication for development
      const mockUser = {
        uid: 'mock-user-id-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({})
      } as User;
      
      setCurrentUser(mockUser);
      // Persist user in localStorage for development mode
      localStorage.setItem('mockUser', JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName
      }));
      
      // Create mock user document using the users library
      await mockUserOperations.createUserDocument(mockUser);
      return;
    }
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore 'users' collection using the users library
    try {
      await createUserDocument(user);
    } catch (firestoreError) {
      console.error('Error creating user document in Firestore:', firestoreError);
      // Note: We don't throw here to avoid breaking the auth flow if Firestore fails
      // The user is still authenticated, but their profile data won't be saved
    }
  };

  const signInWithGoogle = async (): Promise<{ isNewUser: boolean; user: User }> => {
    if (isDevMode) {
      // Mock Google authentication for development
      const mockEmail = 'demo@google.com';
      const mockUid = 'mock-google-user-fixed'; // Fixed UID for consistent user detection
      
      // Check if this mock user already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUserDocuments') || '{}');
      const existingMockUsers = JSON.parse(localStorage.getItem('mockGoogleUsers') || '[]');
      
      const isNewUser = !existingMockUsers.includes(mockEmail);
      
      const mockUser = {
        uid: mockUid,
        email: mockEmail,
        displayName: 'Demo User',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [{
          providerId: 'google.com',
          uid: 'mock-google-uid',
          displayName: 'Demo User',
          email: mockEmail,
          phoneNumber: null,
          photoURL: 'https://lh3.googleusercontent.com/a/default-user'
        }],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({})
      } as User;
      
      setCurrentUser(mockUser);
      
      // Persist user in localStorage for development mode
      localStorage.setItem('mockUser', JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: mockUser.photoURL
      }));
      
      if (isNewUser) {
        // Track this Google user as existing for future sign-ins
        const updatedGoogleUsers = [...existingMockUsers, mockEmail];
        localStorage.setItem('mockGoogleUsers', JSON.stringify(updatedGoogleUsers));
        
        // Create mock user document only for new users
        await mockUserOperations.createUserDocument(mockUser);
      }
      
      return { isNewUser, user: mockUser };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this is a new user by checking the creation time
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      
      // Create or update user document in Firestore
      try {
        await createUserDocument(user);
      } catch (firestoreError) {
        console.error('Error creating/updating user document in Firestore:', firestoreError);
        // Note: We don't throw here to avoid breaking the auth flow if Firestore fails
      }
      
      return { isNewUser, user };
    } catch (error: any) {
      // Handle specific Google sign-in errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      }
      throw error;
    }
  };

  const logout = async () => {
    if (isDevMode) {
      setCurrentUser(null);
      // Remove user from localStorage for development mode
      localStorage.removeItem('mockUser');
      // Clear local cart data on logout
      localStorage.removeItem('cartItems_v1');
      return;
    }
    
    // Clear local cart data on logout
    localStorage.removeItem('cartItems_v1');
    await signOut(auth);
  };

  useEffect(() => {
    if (isDevMode) {
      // Restore user from localStorage in dev mode
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          const mockUser = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: null,
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'mock-token',
            getIdTokenResult: async () => ({} as any),
            reload: async () => {},
            toJSON: () => ({})
          } as User;
          setCurrentUser(mockUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('mockUser');
        }
      }
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

