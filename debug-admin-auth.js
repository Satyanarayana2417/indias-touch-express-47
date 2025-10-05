// Debug Admin Authentication
// Place this in your browser console when you're logged in to debug the issue

console.log('=== Admin Authentication Debug ===');

// Check Firebase Auth
import { auth } from '@/lib/firebase';
console.log('Current user:', auth.currentUser);
console.log('User email:', auth.currentUser?.email);
console.log('User UID:', auth.currentUser?.uid);

// Check Firestore user document
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

if (auth.currentUser) {
  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  getDoc(userDocRef).then(userDocSnap => {
    console.log('User document exists:', userDocSnap.exists());
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('User data:', userData);
      console.log('User role:', userData.role);
      console.log('Is admin?', userData.role === 'admin');
    } else {
      console.log('User document not found in Firestore');
    }
  }).catch(error => {
    console.error('Error fetching user document:', error);
  });
} else {
  console.log('No user logged in');
}