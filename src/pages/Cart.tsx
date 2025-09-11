import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { currentUser } = useAuth();

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping or calculated at checkout
  const total = subtotal + shipping;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (currentUser) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const parsePrice = (priceString: string) => {
    // Handle both $ and ₹ symbols, remove commas and parse
    const cleanPrice = priceString.replace(/[$₹,]/g, '');
    const parsedPrice = parseFloat(cleanPrice);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h1>
              <p className="text-gray-600">
                Looks like you haven't added any items to your cart yet. Start browsing our amazing products!
              </p>
            </div>
            <Button 
              onClick={() => navigate('/shop-products')} 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <p className="text-gray-600">
              {items.length} unique item{items.length !== 1 ? 's' : ''} in your cart
            </p>
            <span className="hidden sm:inline text-gray-400">•</span>
            <p className="text-gray-600">
              Total quantity: {items.reduce((total, item) => total + item.quantity, 0)} items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-0">
                {/* Scrollable container for large item lists */}
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 break-words">
                                {item.name}
                              </h3>
                              <p className="text-lg font-bold text-primary mt-1">
                                {item.price}
                              </p>
                            </div>

                            {/* Quantity and Remove Controls */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-gray-100"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-gray-100"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right min-w-[80px]">
                                <p className="text-lg font-bold text-gray-900">
                                  {formatPrice(parsePrice(item.price) * item.quantity)}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/shop-products')}
                    className="w-full mt-3"
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
                  <p>• Free shipping on orders over ₹999</p>
                  <p>• Secure checkout with SSL encryption</p>
                  <p>• 30-day return policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
