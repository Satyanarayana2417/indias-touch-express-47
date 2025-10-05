import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Checkout</CardTitle>
              <p className="text-center text-gray-600">Complete your order</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-4xl mb-4">🚧</p>
                <h3 className="text-xl font-semibold mb-2">Checkout Coming Soon!</h3>
                <p className="text-gray-600 mb-6">
                  We're working hard to bring you a seamless checkout experience. 
                  This feature will be available soon.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <p>{items.length} item{items.length !== 1 ? 's' : ''}</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(getTotalPrice())}</p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Back to Cart
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/shop-products')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
