import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AdminContextType {
  adminUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Admin email addresses that are authorized to access the admin panel
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@venkatexpress.com',
  'satyanarayana2417@gmail.com',
  'venkatexpress@gmail.com',
  'neha@gmail.com',
  // Add more authorized admin emails here
];

// Check if we're in development mode
const isDevMode = import.meta.env.DEV || 
                  import.meta.env.VITE_FIREBASE_API_KEY === undefined || 
                  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-api-key" ||
                  import.meta.env.VITE_FIREBASE_API_KEY === "demo";

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if email is authorized for admin access
  const isAuthorizedEmail = (email: string): boolean => {
    return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
  };

  // Initialize admin state on app load
  useEffect(() => {
    const checkAdminAuth = () => {
      if (isDevMode) {
        // In development mode, check localStorage for admin session
        const savedAdmin = localStorage.getItem('mockAdminUser');
        if (savedAdmin) {
          try {
            const adminData = JSON.parse(savedAdmin);
            if (isAuthorizedEmail(adminData.email)) {
              const mockAdmin = {
                uid: adminData.uid,
                email: adminData.email,
                displayName: adminData.displayName || 'Admin',
                photoURL: null,
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: '',
                tenantId: null,
                delete: async () => {},
                getIdToken: async () => 'mock-admin-token',
                getIdTokenResult: async () => ({} as any),
                reload: async () => {},
                toJSON: () => ({})
              } as User;
              
              setAdminUser(mockAdmin);
              setIsAdmin(true);
            }
          } catch (error) {
            console.error('Error parsing saved admin:', error);
            localStorage.removeItem('mockAdminUser');
          }
        }
        setLoading(false);
        return;
      }

      // In production, listen to Firebase auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user && isAuthorizedEmail(user.email || '')) {
          setAdminUser(user);
          setIsAdmin(true);
        } else {
          setAdminUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = checkAdminAuth();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const loginAsAdmin = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Check if email is authorized
      if (!isAuthorizedEmail(email)) {
        throw new Error('Access denied. You are not authorized to access the admin panel');
      }

      if (isDevMode) {
        // Mock admin login for development
        const mockAdmin = {
          uid: 'admin-' + Date.now(),
          email: email,
          displayName: 'Admin User',
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-admin-token',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({})
        } as User;
        
        setAdminUser(mockAdmin);
        setIsAdmin(true);
        
        // Save to localStorage for development persistence
        localStorage.setItem('mockAdminUser', JSON.stringify({
          uid: mockAdmin.uid,
          email: mockAdmin.email,
          displayName: mockAdmin.displayName
        }));
        
        return;
      }

      // Production Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!isAuthorizedEmail(user.email || '')) {
        // Sign out immediately if not authorized
        await auth.signOut();
        throw new Error('Access denied. You are not authorized to access the admin panel');
      }
      
      setAdminUser(user);
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Admin login error:', error);
      setAdminUser(null);
      setIsAdmin(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async (): Promise<void> => {
    try {
      if (isDevMode) {
        localStorage.removeItem('mockAdminUser');
      } else {
        await auth.signOut();
      }
      
      setAdminUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  };

  const value: AdminContextType = {
    adminUser,
    isAdmin,
    loading,
    loginAsAdmin,
    logoutAdmin,
    setIsAdmin
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
