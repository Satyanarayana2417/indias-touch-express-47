import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AccountOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/account')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Button>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Button 
              onClick={() => navigate('/shop-products')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Start Shopping
            </Button>
          </div>
        </div>

        {/* Sample Order Card (commented out for empty state) */}
        {/* 
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #VE2024001</h3>
                <p className="text-sm text-gray-500">Placed on March 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">Delivered</p>
                <p className="text-sm text-gray-500">March 18, 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                3 items
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                Standard Delivery
              </div>
              <div className="font-semibold">₹1,299</div>
            </div>
          </div>
        </div>
        */}
      </div>
      <Footer />
    </div>
  );
};

export default AccountOrders;