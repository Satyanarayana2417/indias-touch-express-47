// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Check if we have valid Firebase configuration
const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                       import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                       !import.meta.env.VITE_FIREBASE_API_KEY.includes('demo') &&
                       !import.meta.env.VITE_FIREBASE_API_KEY.includes('placeholder');

console.log('Firebase Config Status:', {
  hasValidConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing'
});

// Minimal Firebase configuration for development
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

// Only initialize Firebase with real config if available
let app;
let auth;
let db;

if (hasValidConfig) {
  // Use real Firebase configuration
  const realConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  console.log('Initializing Firebase with production config...');
  app = initializeApp(realConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.log('No valid Firebase config found. Running in offline mode with mock data...');
  // Initialize with demo config but won't be used for actual operations
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;
export { hasValidConfig };
