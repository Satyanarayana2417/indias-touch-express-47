import React from 'react';
import { withAdminAuth } from '@/components/withAdminAuth';
import AdminDashboard from '@/pages/AdminDashboard';

/**
 * Protected Admin Dashboard Component
 * This component is wrapped with the withAdminAuth HOC to ensure
 * only authenticated users with 'admin' role can access it
 */
const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);

export default ProtectedAdminDashboard;
