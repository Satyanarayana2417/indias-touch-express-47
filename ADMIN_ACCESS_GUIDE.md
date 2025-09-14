# Admin Access Setup Guide

## 🔐 Admin Login Credentials

### Development Mode (Current)
You can access the admin panel using any of these authorized email addresses with **any password**:

1. **admin@venkatexpress.com** (with any password)
2. **satyanarayana2417@gmail.com** (with any password)  
3. **venkatexpress@gmail.com** (with any password)

### How to Access Admin Panel

1. **Navigate to Admin Login**
   - Go to: `http://localhost:8081/admin/login`
   - Or click on admin link in the app (if available)

2. **Login Steps**
   - Enter one of the authorized email addresses above
   - Enter any password (development mode)
   - Click "Sign In"

3. **Access Admin Dashboard**
   - After successful login, you'll be redirected to `/admin/dashboard`
   - You'll have access to all admin features

## 🛡️ Security Features

### Authorized Emails Only
The system only allows these specific email addresses to access admin features:
- `admin@venkatexpress.com`
- `satyanarayana2417@gmail.com`
- `venkatexpress@gmail.com`

### Session Management
- Admin sessions are automatically managed
- Development mode persists login state in localStorage
- Production mode uses Firebase Authentication

### Route Protection
- All admin routes are protected by `AdminProtectedRoute`
- Unauthorized users are redirected to login page
- Session validation on every admin page access

## 🔧 Adding New Admin Users

To add new admin email addresses, edit the `AUTHORIZED_ADMIN_EMAILS` array in:
`src/context/AdminContext.tsx`

```typescript
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@venkatexpress.com',
  'satyanarayana2417@gmail.com', 
  'venkatexpress@gmail.com',
  'newadmin@example.com', // Add new admin emails here
];
```

## 🚀 Production Setup

For production deployment:

1. **Firebase Authentication**
   - Create admin accounts in Firebase Auth
   - Use the authorized email addresses
   - Set strong passwords

2. **Security Rules**
   - Admin access is enforced at the application level
   - Only authorized emails can access admin routes
   - Firebase security rules provide additional protection

3. **Environment Variables**
   - Ensure proper Firebase configuration
   - Set production environment variables
   - Remove development mode overrides

## 🐛 Troubleshooting

### "Access denied" Error
1. **Check Email Address**
   - Ensure you're using one of the authorized emails
   - Check for typos in the email address

2. **Development Mode**
   - Verify you're in development mode
   - Check browser console for error messages

3. **Clear Browser Data**
   - Clear localStorage if experiencing issues
   - Refresh the page and try again

### Admin Routes Not Working
1. **Check URL**
   - Admin login: `/admin/login`
   - Admin dashboard: `/admin/dashboard`

2. **Check Authentication State**
   - Open browser developer tools
   - Check localStorage for `mockAdminUser`
   - Verify admin context state

## 📋 Admin Features Available

Once logged in as admin, you can access:

- **Dashboard** - Overview and analytics
- **Products** - Product management
- **Orders** - Order management and tracking
- **Users** - User account management
- **Product Requests** - Handle customer product requests
- **Settings** - System configuration

## 🔄 Logout

To logout from admin panel:
- Click logout button in admin interface
- Or navigate away and clear browser data
- Admin session will be cleared automatically