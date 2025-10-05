import React from 'react';
import { withAdminAuth } from '@/components/withAdminAuth';

// Import your existing admin components
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminProductForm from '@/pages/AdminProductForm';
import AdminOrders from '@/pages/AdminOrders';
import AdminProductRequests from '@/pages/AdminProductRequests';
import AdminUsers from '@/pages/AdminUsers';
import AdminSettings from '@/pages/AdminSettings';

/**
 * Protected Admin Components
 * Each admin component is wrapped with the withAdminAuth HOC to ensure
 * only authenticated users with 'admin' role in Firestore can access them
 */

// Main Admin Dashboard - protected
export const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);

// Products Management - protected
export const ProtectedAdminProducts = withAdminAuth(AdminProducts);
export const ProtectedAdminProductForm = withAdminAuth(AdminProductForm);

// Orders Management - protected
export const ProtectedAdminOrders = withAdminAuth(AdminOrders);

// Product Requests Management - protected
export const ProtectedAdminProductRequests = withAdminAuth(AdminProductRequests);

// Users Management - protected
export const ProtectedAdminUsers = withAdminAuth(AdminUsers);

// Settings - protected
export const ProtectedAdminSettings = withAdminAuth(AdminSettings);

/**
 * Example of creating a custom protected admin component
 * You can use this pattern for any new admin components you create
 */
const CustomAdminComponent: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Admin Component</h1>
      <p>This component is only accessible to authenticated users with admin role.</p>
    </div>
  );
};

export const ProtectedCustomAdminComponent = withAdminAuth(CustomAdminComponent);
