import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Gift, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AccountRequests = () => {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Requests</h1>
              <p className="text-gray-600">Request products you'd like to see in our store</p>
            </div>
            <Button 
              onClick={() => navigate('/product-request')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Gift className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No product requests yet</h2>
            <p className="text-gray-500 mb-6">
              Can't find what you're looking for? Let us know what products you'd like to see and we'll do our best to add them to our catalog.
            </p>
            <Button 
              onClick={() => navigate('/product-request')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Make Your First Request
            </Button>
          </div>
        </div>

        {/* Sample Request Card (commented out for empty state) */}
        {/* 
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Organic Quinoa Seeds</h3>
                <p className="text-sm text-gray-500">Requested on March 10, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">Under Review</p>
              </div>
            </div>
            <p className="text-gray-600 mb-3">
              High-quality organic quinoa seeds for healthy cooking. Looking for 1kg packaging.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                2 responses
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
      <Footer />
    </div>
  );
};

export default AccountRequests;