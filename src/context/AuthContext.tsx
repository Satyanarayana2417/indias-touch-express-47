import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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
      return;
    }
    
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isDevMode) {
      setCurrentUser(null);
      // Remove user from localStorage for development mode
      localStorage.removeItem('mockUser');
      return;
    }
    
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
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
