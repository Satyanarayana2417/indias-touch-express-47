import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  TrendingUp,
  DollarSign,
  Activity,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - in real app, this would come from API/Firebase
  const stats = [
    {
      title: "Total Products",
      value: "245",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Orders",
      value: "38",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Product Requests",
      value: "12",
      change: "+5%",
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Total Revenue",
      value: "₹1,24,580",
      change: "+18%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Add a new product to your catalog",
      href: "/admin/products/new",
      icon: Package,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "View Orders",
      description: "Manage and process customer orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Product Requests",
      description: "Review customer product requests",
      href: "/admin/requests",
      icon: MessageSquare,
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      href: "/admin/users",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const recentActivity = [
    {
      action: "New order received",
      details: "Order #VE-001234 - ₹2,450",
      time: "2 minutes ago"
    },
    {
      action: "Product added",
      details: "Basmati Rice 1kg added to catalog",
      time: "1 hour ago"
    },
    {
      action: "Order shipped",
      details: "Order #VE-001230 shipped to Mumbai",
      time: "3 hours ago"
    },
    {
      action: "Product request",
      details: "Customer requested Organic Turmeric",
      time: "5 hours ago"
    },
    {
      action: "Order completed",
      details: "Order #VE-001225 delivered successfully",
      time: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Venkat Express Admin</h1>
        <p className="text-blue-100">
          Manage your e-commerce platform efficiently with our comprehensive admin dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`${action.color} p-2 rounded-lg text-white mr-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your store
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/activity">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <Activity className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Key metrics for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Order Completion Rate</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">94.5%</p>
              <p className="text-sm text-gray-500 mt-1">+2.3% from last month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Average Order Value</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">₹1,875</p>
              <p className="text-sm text-gray-500 mt-1">+8.7% from last month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">4.8/5</p>
              <p className="text-sm text-gray-500 mt-1">Based on 124 reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;