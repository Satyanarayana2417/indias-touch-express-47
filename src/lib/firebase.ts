// Firebase core imports
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// Production Firebase configuration (provided)
// NOTE: This file intentionally hardcodes the config per project requirements.
// Do NOT commit alternative/demo keys here. Environment indirection removed
// to ensure authentication works out-of-the-box for foundational feature.
const firebaseConfig = {
  apiKey: "AIzaSyDEkab3ZHAuNdGE4m51QSha_Sg0U9Ujovw",
  authDomain: "venkat-express-c95bb.firebaseapp.com",
  projectId: "venkat-express-c95bb",
  storageBucket: "venkat-express-c95bb.firebasestorage.app",
  messagingSenderId: "470308597",
  appId: "1:47030859957:web:64f32a02068cd474e2a6fc",
  measurementId: "G-9M8WCYN8NC"
};

// Singleton pattern (prevent re-init in Vite HMR / React StrictMode)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);
functions = getFunctions(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, db, storage, functions };
export default app;

