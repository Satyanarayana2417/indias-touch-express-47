# 🔧 Image Upload Troubleshooting Guide

## Problem: Images not uploading or displaying in admin panel

### Quick Fixes (Try these first)

#### 1. **Check if you're logged in as admin**
- Go to http://localhost:8081/admin
- Make sure you're logged in
- If not logged in, login with admin credentials

#### 2. **Deploy Firebase Functions**
```powershell
# Run this in the project root directory
.\fix-image-upload.ps1
```

Or manually:
```powershell
cd functions
firebase deploy --only functions
cd ..
```

#### 3. **Use the Debug Tool**
- Open: http://localhost:8081/image-upload-debug.html
- Click "Check System Status"
- Follow the recommendations shown

---

## Detailed Diagnostics

### Step 1: Verify System Status
Open browser console (F12) and run:
```javascript
// Check if system is loaded
console.log('Auth:', window.firebaseAuth?.currentUser);
console.log('Services available:', !!window.firebaseStorage, !!window.firebaseFunctions);
```

### Step 2: Test Authentication
```javascript
// Check auth status
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('✅ Authenticated:', user.email);
    
    // Check admin role
    firebase.firestore().collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists()) {
          console.log('User role:', doc.data().role);
        } else {
          console.log('❌ User document not found');
        }
      });
  } else {
    console.log('❌ Not authenticated');
  }
});
```

### Step 3: Test Functions
```javascript
// Test if functions are deployed
const functions = firebase.functions();
const testFunction = functions.httpsCallable('fetchImageFromUrl');

testFunction({
  imageUrl: 'https://via.placeholder.com/100x100.jpg',
  productId: 'test'
}).then(result => {
  console.log('✅ Functions working:', result.data);
}).catch(error => {
  console.log('❌ Functions error:', error);
});
```

---

## Common Issues & Solutions

### ❌ "Permission denied" or "Unauthenticated"
**Cause:** Not logged in as admin or admin role not set

**Solution:**
1. Login to Firebase Console: https://console.firebase.google.com
2. Go to Firestore Database
3. Create/update user document:
   ```javascript
   // Collection: users
   // Document ID: {your-user-uid}
   {
     "email": "your-email@example.com",
     "role": "admin",
     "name": "Admin User",
     "createdAt": "2025-10-03T07:30:00.000Z",
     "permissions": ["products", "orders", "users", "settings"]
   }
   ```

### ❌ "Functions not found" or "Internal error"
**Cause:** Firebase Functions not deployed

**Solution:**
```powershell
cd functions
npm install
npm run build
firebase deploy --only functions
```

### ❌ "Upload failed" with Firebase Storage errors
**Cause:** Firebase Storage rules or authentication

**Solution:**
1. Check Firestore rules in Firebase Console
2. Ensure Storage rules allow authenticated users
3. Try logging out and back in

### ❌ URL uploads not working
**Cause:** Cloudinary configuration or network issues

**Solution:**
1. Check if you can access the image URL directly in browser
2. Verify Cloudinary is configured correctly
3. Check browser console for detailed error messages

### ❌ Images upload but don't display
**Cause:** Real-time sync or component refresh issues

**Solution:**
1. Hard refresh the page (Ctrl+F5)
2. Check if images are in Firebase Storage console
3. Verify image URLs are valid

---

## Emergency Fixes

### Fix 1: Reset Authentication
```javascript
// Run in browser console
firebase.auth().signOut().then(() => {
  console.log('Signed out, please login again');
  window.location.reload();
});
```

### Fix 2: Force Component Refresh
```javascript
// Run in browser console
window.dispatchEvent(new CustomEvent('forceProductRefresh'));
```

### Fix 3: Clear Local Storage
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

---

## File Upload Test

Try uploading this test image URL:
```
https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800
```

Or use a small local image file (< 1MB, PNG/JPG format).

---

## Get Help

1. **Debug Tool**: http://localhost:8081/image-upload-debug.html
2. **Browser Console**: F12 → Console tab → Check for error messages
3. **Firebase Console**: Check Functions logs and Firestore data

---

## Success Criteria

When working correctly, you should see:
- ✅ Images upload without errors
- ✅ Images appear in the product form immediately
- ✅ Images display on the main website
- ✅ Both file upload and URL upload work
- ✅ Real-time sync updates the main website instantly

If you're still having issues after trying these steps, share the exact error messages from the browser console for more specific help.