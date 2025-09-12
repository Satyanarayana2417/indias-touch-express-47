import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const accountMenuItems = [
    {
      icon: Package,
      label: 'My Orders',
      description: 'View your order history',
      path: '/orders'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      description: 'Your saved items',
      path: '/wishlist'
    },
    {
      icon: MapPin,
      label: 'Addresses',
      description: 'Manage delivery addresses',
      path: '/addresses'
    },
    {
      icon: Settings,
      label: 'Account Settings',
      description: 'Update your profile',
      path: '/settings'
    }
  ];

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Welcome, {currentUser.email.split('@')[0]}!
                  </CardTitle>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Menu */}
          <div className="grid gap-4 md:grid-cols-2">
            {accountMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card 
                  key={item.path}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.label}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/track-order')}
              >
                <Package className="w-4 h-4 mr-2" />
                Track an Order
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/shop-products')}
              >
                Continue Shopping
              </Button>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;