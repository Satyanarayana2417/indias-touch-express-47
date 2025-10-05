# Admin Authentication Troubleshooting Guide

## Current Issue
You're getting "access denied" when trying to log into the admin page with `neha@gmail.com` even though the user has `role: 'admin'` in Firestore.

## Root Cause Analysis

### Issue 1: Using Old Email-Based System
Your current system uses hardcoded emails in `AdminContext.tsx`. I've already added `neha@gmail.com` to the authorized list as a quick fix.

### Issue 2: User Document Structure Mismatch
Your Firestore user document shows:
- `email: 'neha@gmail.com'`  
- `role: 'admin'`

But the Firebase Auth UID might not match the document ID.

## Solutions

### Solution 1: Quick Fix (Already Applied)
✅ Added `neha@gmail.com` to AUTHORIZED_ADMIN_EMAILS in AdminContext.tsx

### Solution 2: Implement New Firestore-Based System (Recommended)
✅ Created new components that check Firestore user documents instead of hardcoded emails

## Debugging Steps

### Step 1: Verify Current User
1. Open browser console
2. Go to your login page
3. Log in with `neha@gmail.com`
4. Run this in console:
```javascript
// Check current user
console.log('Current user:', firebase.auth().currentUser);
```

### Step 2: Check Firestore Document
```javascript
// Check if user document exists and has correct structure
const userId = firebase.auth().currentUser.uid;
firebase.firestore().collection('users').doc(userId).get().then(doc => {
  if (doc.exists) {
    console.log('User data:', doc.data());
  } else {
    console.log('No user document found');
  }
});
```

### Step 3: Verify Document ID Matches UID
The most common issue is that your Firestore document ID doesn't match the Firebase Auth UID.

In your screenshot, the document ID is `YBBcatBSzoU0rM8SnSUqx5jGjt2` - this should match `firebase.auth().currentUser.uid`.

## Immediate Fix Instructions

### Option A: Update Document ID (Recommended)
1. In Firebase Console, note the current user's UID when they log in
2. Create a new document in `users` collection with the correct UID as the document ID
3. Copy the data from the current document
4. Delete the old document

### Option B: Use the Quick Fix
The quick fix I applied should work immediately. Try logging in now with `neha@gmail.com`.

## Testing the Fix

1. Clear browser cache and cookies
2. Go to `/admin/login`
3. Log in with `neha@gmail.com`
4. You should now have access to the admin panel

## Long-term Solution

For better security and flexibility, implement the new Firestore-based system:

1. The new system reads the `role` field from Firestore user documents
2. It's more secure and flexible than hardcoded emails
3. Easy to manage admin users through Firestore Console

## Common Issues

### Issue: "Cannot find name 'ProtectedAdminLayout'"
**Solution**: The new components are created but not yet used. Stick with the quick fix for now.

### Issue: Infinite redirect loops
**Solution**: Ensure the user document exists and has the correct role field.

### Issue: User document not found
**Solution**: Make sure the Firestore document ID matches the Firebase Auth UID exactly.

## Next Steps

1. Try logging in now with the quick fix
2. If it works, you can later implement the new Firestore-based system
3. If it doesn't work, we'll need to check the Firebase Auth UID and Firestore document ID alignment