import React from 'react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminLayout from '@/components/AdminLayout';

/**
 * Protected Admin Layout Component
 * This applies the new withAdminAuth protection to the existing AdminLayout
 * 
 * Usage: Use this in your routes instead of the regular AdminLayout
 * The AdminLayout already includes <Outlet /> internally, so nested routes work automatically
 */
const BaseAdminLayoutWithProtection: React.FC = () => {
  return <AdminLayout />;
};

// Apply the admin protection to the layout itself
export const ProtectedAdminLayout = withAdminAuth(BaseAdminLayoutWithProtection);

/**
 * Alternative approach: If you want to keep using nested routes with layout
 * You can use this in your App.tsx like this:
 * 
 * <Route path="/admin" element={<ProtectedAdminLayout />}>
 *   <Route index element={<AdminDashboard />} />
 *   <Route path="products" element={<AdminProducts />} />
 *   // ... other nested routes
 * </Route>
 * 
 * This approach protects the entire admin section at the layout level,
 * so you don't need to protect individual components
 */
