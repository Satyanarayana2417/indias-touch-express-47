# Admin Dashboard Integration Guide

## Quick Setup Steps

### 1. Add Admin Routes to Your App

Update your main `App.tsx` to include the admin routes:

```typescript
// Add these imports at the top of App.tsx
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminOrders from './pages/AdminOrders';
import AdminProductRequests from './pages/AdminProductRequests';
import AdminLayout from './components/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AdminProvider } from './context/AdminContext';

// Add these routes in your routing configuration
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/*" element={
  <AdminProtectedRoute>
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="requests" element={<AdminProductRequests />} />
      </Routes>
    </AdminLayout>
  </AdminProtectedRoute>
} />
```

### 2. Wrap Your App with AdminProvider

```typescript
// In your main App component or main.tsx
<AuthProvider>
  <AdminProvider>
    <LocationProvider>
      <CartProvider>
        <WishlistProvider>
          {/* Your existing app content */}
        </WishlistProvider>
      </CartProvider>
    </LocationProvider>
  </AdminProvider>
</AuthProvider>
```

### 3. Add Admin Access Link

Add a link to access the admin dashboard (typically in header or footer):

```typescript
// For development/testing, add this to your header or create admin access
<Link to="/admin/login" className="text-sm text-gray-600 hover:text-gray-900">
  Admin Dashboard
</Link>
```

### 4. Firebase Configuration (Production)

If using Firebase in production, ensure your Firestore has admin users:

```javascript
// Add admin user document in Firestore
// Collection: users
// Document ID: {admin_user_uid}
{
  email: "admin@venkatexpress.com",
  role: "admin",
  name: "Admin User",
  createdAt: new Date(),
  permissions: ["products", "orders", "users", "settings"]
}
```

### 5. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to admin login**:
   ```
   http://localhost:5173/admin/login
   ```

3. **Login with dev credentials**:
   - Email: `admin@venkatexpress.com`
   - Password: Any password (in dev mode)

4. **Verify dashboard access**:
   - Should redirect to `/admin/dashboard`
   - Sidebar navigation should work
   - All admin features should be accessible

## Development vs Production

### Development Mode
- Works without Firebase configuration
- Uses mock data for all operations
- Admin login accepts any password
- Perfect for testing and development

### Production Mode
- Requires Firebase configuration
- Uses real Firestore data
- Proper authentication required
- Admin users must exist in Firestore with role: 'admin'

## Security Notes

- Admin routes are protected by `AdminProtectedRoute`
- Authentication state is managed by `AdminContext`
- All forms include comprehensive validation
- Rate limiting and session management included
- Development mode is clearly identified in console logs

## Troubleshooting

### Route Not Found
- Ensure all admin components are imported
- Check routing configuration in `App.tsx`
- Verify `AdminProvider` wraps the app

### Authentication Issues
- Check browser console for auth errors
- Verify Firebase configuration (production)
- Clear localStorage and try again

### Component Errors
- Ensure all required dependencies are installed
- Check import paths for admin components
- Verify shadcn/ui components are available

---

Your admin dashboard is now ready to use! 🎉