import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Heart, 
  Gift, 
  Headphones, 
  User, 
  MapPin, 
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}!
          </p>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Orders Button */}
          <Button
            variant="outline"
            className="h-20 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
            onClick={() => navigate('/account/orders')}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500">Track your orders</p>
              </div>
            </div>
          </Button>

          {/* Wishlist Button */}
          <Button
            variant="outline"
            className="h-20 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
            onClick={() => navigate('/wishlist')}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-500">Your saved items</p>
              </div>
            </div>
          </Button>

          {/* Product Requests Button */}
          <Button
            variant="outline"
            className="h-20 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
            onClick={() => navigate('/account/requests')}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="bg-green-100 p-3 rounded-lg">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Product Requests</h3>
                <p className="text-sm text-gray-500">Request new items</p>
              </div>
            </div>
          </Button>

          {/* Help Center Button */}
          <Button
            variant="outline"
            className="h-20 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
            onClick={() => navigate('/help')}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Headphones className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Help Center</h3>
                <p className="text-sm text-gray-500">Get support</p>
              </div>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Settings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-2">
              {/* Edit Profile */}
              <button
                onClick={() => navigate('/account/profile')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 group-hover:text-gray-900">Edit Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </button>

              {/* Saved Addresses */}
              <button
                onClick={() => navigate('/account/addresses')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 group-hover:text-gray-900">Saved Addresses</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* My Activity Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Activity</h2>
            <div className="space-y-2">
              {/* My Product Requests */}
              <button
                onClick={() => navigate('/account/requests')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 group-hover:text-gray-900">My Product Requests</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-white hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
          >
            Sign Out
          </Button>
        </div>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Account;