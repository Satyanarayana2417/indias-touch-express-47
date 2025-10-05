import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AccountAddresses = () => {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved addresses</h2>
            <p className="text-gray-500 mb-6">
              Add your delivery addresses to make checkout faster and easier.
            </p>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        </div>

        {/* Sample Address Cards (commented out for empty state) */}
        {/* 
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Home</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                  </div>
                  <p className="text-gray-600">
                    123 Main Street, Apartment 4B<br />
                    Hyderabad, Telangana 500001<br />
                    India
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Phone: +91 9876543210</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Office</h3>
                  <p className="text-gray-600">
                    456 Business Park, Floor 3<br />
                    Gachibowli, Hyderabad 500032<br />
                    India
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Phone: +91 9876543210</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
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

export default AccountAddresses;