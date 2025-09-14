import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Mail, Shield, Globe, Bell } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure admin panel and system settings</p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Settings Coming Soon</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Comprehensive settings panel for configuring your e-commerce platform, 
            integrations, and admin preferences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="p-4 border rounded-lg">
              <Database className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">System Configuration</h4>
              <p className="text-sm text-gray-500">Database, caching, and performance settings</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-green-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Email Settings</h4>
              <p className="text-sm text-gray-500">Configure SMTP, templates, and notifications</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-red-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Security</h4>
              <p className="text-sm text-gray-500">Authentication, permissions, and access control</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Globe className="h-8 w-8 text-purple-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Integrations</h4>
              <p className="text-sm text-gray-500">Payment gateways, shipping, and third-party services</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Bell className="h-8 w-8 text-yellow-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">Notifications</h4>
              <p className="text-sm text-gray-500">Alert preferences and communication settings</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Settings className="h-8 w-8 text-gray-600 mb-2 mx-auto" />
              <h4 className="font-medium mb-1">General</h4>
              <p className="text-sm text-gray-500">Site information, branding, and preferences</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;