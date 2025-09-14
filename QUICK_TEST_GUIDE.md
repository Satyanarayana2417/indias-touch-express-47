# Quick Test Guide - Users Collection & Authentication

## 🚀 Quick Start Testing

### 1. Development Mode Test (No Firebase Setup Required)

```bash
# Start the development server
npm run dev

# Navigate to http://localhost:5173
```

### 2. Test User Signup

1. **Go to Login Page**: Navigate to `/login` or click login in header
2. **Switch to Signup**: Click "Sign Up" tab
3. **Fill Form**:
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
4. **Submit**: Click "Create Account"

### 3. Expected Results

#### ✅ Console Output
You should see in browser console:
```
Mock user document created: {
  uid: "mock-user-id-1726329600000",
  email: "test@example.com", 
  username: "test",
  displayName: "test",
  createdAt: "2024-09-14T18:00:00.000Z",
  preferences: { notifications: true, newsletter: false },
  profile: { ... }
}
```

#### ✅ Page Redirect
- Automatically redirected to main dashboard (`/`)
- User shown as logged in
- Toast notification: "Account created!"

#### ✅ LocalStorage Data
Check browser DevTools → Application → Local Storage:
- `mockUser`: Contains basic auth user data
- `mockUserDocuments`: Contains complete user document

### 4. Test User Login

1. **Go to Login Page** again: `/login`
2. **Use Same Credentials**:
   - Email: `test@example.com`
   - Password: `password123`
3. **Submit**: Click "Sign In"

#### ✅ Expected Results
- Redirected to main dashboard (`/`)
- Toast notification: "Welcome back!"
- User remains logged in

### 5. Verify User Document Structure

Check the `mockUserDocuments` in localStorage:

```json
{
  "mock-user-id-1726329600000": {
    "uid": "mock-user-id-1726329600000",
    "email": "test@example.com",
    "username": "test", 
    "displayName": "test",
    "photoURL": null,
    "createdAt": "2024-09-14T18:00:00.000Z",
    "preferences": {
      "notifications": true,
      "newsletter": false
    },
    "profile": {
      "firstName": "",
      "lastName": "",
      "phone": "",
      "address": {
        "street": "",
        "city": "",
        "state": "",
        "zipCode": "",
        "country": ""
      }
    }
  }
}
```

## 🔧 Production Testing (With Firebase)

### 1. Firebase Setup Required
- Valid Firebase configuration in environment variables
- Firestore Database enabled
- Authentication enabled with Email/Password provider

### 2. Test Process
Same as development mode, but:
- Real user accounts created in Firebase Auth
- Real documents created in Firestore `users` collection
- Check Firebase Console to verify data

### 3. Firestore Verification
1. Go to Firebase Console → Firestore Database
2. Look for `users` collection
3. Verify document exists with user's UID
4. Check all fields are properly populated

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find name 'createUserDocument'" Error**
   - **Fix**: Ensure `src/lib/users.ts` exists and exports are correct

2. **Redirect Not Working**
   - **Fix**: Check browser console for navigation errors
   - **Verify**: React Router is properly configured

3. **User Document Not Created**
   - **Development**: Check `mockUserDocuments` in localStorage
   - **Production**: Check Firebase Console for Firestore errors

4. **Authentication Fails**
   - **Development**: Should work with any valid email/password
   - **Production**: Check Firebase Auth configuration

### Success Indicators
- ✅ No console errors
- ✅ Successful redirect to `/`
- ✅ User document created (localStorage or Firestore)
- ✅ Toast notifications appear
- ✅ User remains logged in after page refresh

---

**Status**: 🎉 READY FOR TESTING

All authentication features implemented and ready for validation!