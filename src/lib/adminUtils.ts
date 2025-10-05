import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

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

/**
 * Check if an email is authorized for admin access
 */
export const isAuthorizedEmail = (email: string): boolean => {
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Get the current admin user if authenticated and authorized
 */
export const getCurrentAdminUser = (): User | null => {
  const currentUser = auth.currentUser;
  
  if (isDevMode) {
    // In development mode, check localStorage for mock admin
    const savedAdmin = localStorage.getItem('mockAdminUser');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        if (isAuthorizedEmail(adminData.email)) {
          return {
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
        }
      } catch (error) {
        console.error('Error parsing saved admin:', error);
        localStorage.removeItem('mockAdminUser');
      }
    }
    return null;
  }
  
  // In production, verify Firebase auth user
  if (currentUser && isAuthorizedEmail(currentUser.email || '')) {
    return currentUser;
  }
  
  return null;
};

/**
 * Verify if the current user is an authorized admin
 * Throws an error if not authorized
 */
export const verifyAdminAccess = async (): Promise<User> => {
  const adminUser = getCurrentAdminUser();
  
  if (!adminUser) {
    throw new Error('Access denied. You must be logged in as an authorized administrator to perform this action.');
  }
  
  if (!isAuthorizedEmail(adminUser.email || '')) {
    throw new Error('Access denied. You are not authorized to perform administrative actions.');
  }
  
  return adminUser;
};

/**
 * Check if the current user has admin privileges
 */
export const hasAdminAccess = (): boolean => {
  try {
    const adminUser = getCurrentAdminUser();
    return adminUser !== null && isAuthorizedEmail(adminUser.email || '');
  } catch {
    return false;
  }
};
