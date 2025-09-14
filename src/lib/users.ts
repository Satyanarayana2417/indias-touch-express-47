import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';
import { initializeUserCart } from './cart';

export interface UserDocument {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL: string | null;
  createdAt: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

/**
 * Create a new user document in the 'users' collection
 */
export const createUserDocument = async (user: User): Promise<void> => {
  try {
    const userDoc: Partial<UserDocument> = {
      uid: user.uid,
      email: user.email || '',
      username: user.email?.split('@')[0] || 'User',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      preferences: {
        notifications: true,
        newsletter: false,
      },
      profile: {
        firstName: '',
        lastName: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      },
    };

    // Create user document and initialize cart in parallel
    await Promise.all([
      setDoc(doc(db, 'users', user.uid), userDoc),
      initializeUserCart(user.uid)
    ]);
    
    console.log('User document and cart created successfully in Firestore');
  } catch (error) {
    console.error('Error creating user document and cart:', error);
    throw error;
  }
};

/**
 * Get a user document from the 'users' collection
 */
export const getUserDocument = async (uid: string): Promise<UserDocument | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserDocument;
    } else {
      console.log('No user document found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
};

/**
 * Update a user document in the 'users' collection
 */
export const updateUserDocument = async (uid: string, updates: Partial<UserDocument>): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('User document updated successfully');
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

/**
 * Check if a user document exists
 */
export const userDocumentExists = async (uid: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists();
  } catch (error) {
    console.error('Error checking user document existence:', error);
    return false;
  }
};

/**
 * Mock functions for development mode
 */
export const mockUserOperations = {
  createUserDocument: (user: User) => {
    const userDoc = {
      uid: user.uid,
      email: user.email || '',
      username: user.email?.split('@')[0] || 'User',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: false,
      },
      profile: {
        firstName: '',
        lastName: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      },
    };

    // Store in localStorage for development
    const existingUsers = JSON.parse(localStorage.getItem('mockUserDocuments') || '{}');
    existingUsers[user.uid] = userDoc;
    localStorage.setItem('mockUserDocuments', JSON.stringify(existingUsers));
    
    console.log('Mock user document created:', userDoc);
    return Promise.resolve();
  },

  getUserDocument: (uid: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('mockUserDocuments') || '{}');
    const userDoc = existingUsers[uid] || null;
    console.log('Mock user document retrieved:', userDoc);
    return Promise.resolve(userDoc);
  },

  updateUserDocument: (uid: string, updates: Partial<UserDocument>) => {
    const existingUsers = JSON.parse(localStorage.getItem('mockUserDocuments') || '{}');
    if (existingUsers[uid]) {
      existingUsers[uid] = {
        ...existingUsers[uid],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('mockUserDocuments', JSON.stringify(existingUsers));
      console.log('Mock user document updated:', existingUsers[uid]);
    }
    return Promise.resolve();
  },

  userDocumentExists: (uid: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('mockUserDocuments') || '{}');
    const exists = !!existingUsers[uid];
    console.log('Mock user document exists check:', { uid, exists });
    return Promise.resolve(exists);
  },
};