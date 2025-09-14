import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MessageCircle, FileText, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Help = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our customer support team',
      contact: '+91 9876543210',
      action: 'tel:+919876543210',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@venkatexpress.com',
      action: 'mailto:support@venkatexpress.com',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9 AM - 6 PM',
      action: '#',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const helpTopics = [
    {
      icon: ShoppingCart,
      title: 'Orders & Shipping',
      description: 'Track orders, shipping info, delivery issues'
    },
    {
      icon: Users,
      title: 'Account & Profile',
      description: 'Account settings, profile updates, login issues'
    },
    {
      icon: FileText,
      title: 'Returns & Refunds',
      description: 'Return policy, refund process, exchange guidelines'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">Get support and find answers to your questions</p>
        </div>

        {/* Contact Methods */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <p className="text-sm font-medium text-gray-800 mb-4">{method.contact}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (method.action.startsWith('tel:') || method.action.startsWith('mailto:')) {
                        window.location.href = method.action;
                      }
                    }}
                    className="w-full"
                  >
                    Contact
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Topics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Help Topics</h2>
          <div className="space-y-4">
            {helpTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-sm text-gray-600">
                Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days delivery.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">What is your return policy?</h3>
              <p className="text-sm text-gray-600">
                We accept returns within 30 days of delivery. Items must be in original condition and packaging.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Do you ship internationally?</h3>
              <p className="text-sm text-gray-600">
                Currently, we only ship within India. International shipping is coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;