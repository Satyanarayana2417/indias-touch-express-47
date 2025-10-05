import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ProductRequestModal } from '@/components/ProductRequestModal';
import { AuthModal } from '@/components/AuthModal';

export const ProductRequestBanner: React.FC = () => {
  const { currentUser } = useAuth();
  const [isProductRequestModalOpen, setIsProductRequestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleMakeRequest = () => {
    if (currentUser) {
      // User is authenticated, open product request modal
      setIsProductRequestModalOpen(true);
    } else {
      // User is not authenticated, open auth modal
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After successful authentication, open the product request modal
    setIsProductRequestModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-lg shadow-sm border border-yellow-200/50 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Content Section */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight">
              Can't find it? Let us source it for you.
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl">
              Looking for something specific from India? Our sourcing experts can help you find authentic products and deliver them worldwide.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleMakeRequest}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Make a Request
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductRequestModal
        isOpen={isProductRequestModalOpen}
        onClose={() => setIsProductRequestModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

