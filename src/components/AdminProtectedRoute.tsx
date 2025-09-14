import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { checkRateLimit } from '@/lib/validation';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { adminUser, isAdmin, loading } = useAdmin();
  const location = useLocation();

  // Rate limiting check for admin access attempts
  useEffect(() => {
    const userIdentifier = adminUser?.email || 'anonymous';
    if (!checkRateLimit(userIdentifier, 10, 300000)) { // 10 requests per 5 minutes
      console.warn('Admin access rate limit exceeded for:', userIdentifier);
    }
  }, [adminUser?.email]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Security check: Ensure user has valid admin credentials
  if (!adminUser || !isAdmin) {
    // Log security event (in production, this should go to a security monitoring system)
    console.warn('Unauthorized admin access attempt:', {
      timestamp: new Date().toISOString(),
      path: location.pathname,
      userAgent: navigator.userAgent,
      hasUser: !!adminUser,
      isAdmin: isAdmin
    });

    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Additional security validation
  if (!adminUser.email || !adminUser.uid) {
    console.error('Invalid admin user object detected');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Error</h2>
          <p className="text-gray-600 mb-4">
            Invalid authentication state detected. Please log in again.
          </p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Check for session expiry (24 hours for admin sessions)
  const sessionStart = localStorage.getItem('adminSessionStart');
  if (sessionStart) {
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxSessionAge) {
      console.warn('Admin session expired');
      localStorage.removeItem('adminSessionStart');
      return <Navigate to="/admin/login" state={{ 
        from: location, 
        message: 'Session expired. Please log in again.' 
      }} replace />;
    }
  } else {
    // Set session start time
    localStorage.setItem('adminSessionStart', Date.now().toString());
  }

  return (
    <div className="admin-area">
      {/* Security headers and context */}
      <div className="hidden" data-admin-context="true" data-user-id={adminUser.uid} />
      {children}
    </div>
  );
};

export default AdminProtectedRoute;