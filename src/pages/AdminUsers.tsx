import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, ShieldCheck, Settings } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500">Manage customer accounts and admin users</p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management Coming Soon</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We're working on comprehensive user management features including customer accounts, 
            admin role management, and user analytics.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="p-4 border rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Customer Accounts</h4>
              <p className="text-sm text-gray-500">View and manage customer profiles</p>
            </div>
            <div className="p-4 border rounded-lg">
              <ShieldCheck className="h-8 w-8 text-green-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Admin Roles</h4>
              <p className="text-sm text-gray-500">Manage admin permissions and access</p>
            </div>
            <div className="p-4 border rounded-lg">
              <UserPlus className="h-8 w-8 text-purple-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">User Analytics</h4>
              <p className="text-sm text-gray-500">Track user activity and engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
