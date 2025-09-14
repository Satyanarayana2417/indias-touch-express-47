import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Heart, Truck, Tag, Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, isLoading, syncStatus, isAuthenticated } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping or calculated at checkout
  const total = subtotal + shipping;

  // Sync status indicator component
  const SyncStatusIndicator = () => {
    if (!isAuthenticated) return null;
    
    switch (syncStatus) {
      case 'syncing':
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Syncing cart...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Sync error - using offline mode</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <WifiOff className="h-4 w-4" />
            <span>Offline mode</span>
          </div>
        );
      case 'synced':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <Wifi className="h-4 w-4" />
            <span>Synced across devices</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number, variant?: string) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity, variant);
    }
  };

  const handleRemoveItem = (id: string, variant?: string) => {
    removeItem(id, variant);
  };

  const handleSaveForLater = async (id: string, variant?: string) => {
    try {
      const cartItem = items.find(i => i.id === id && (i.variant || '') === (variant || ''));
      if (!cartItem) {
        console.warn('Cart item not found for wishlist save');
        return;
      }
      // Build wishlist product shape
      addToWishlist({
        id: cartItem.id + (cartItem.variant ? `:${cartItem.variant}` : ''),
        name: cartItem.name,
        price: cartItem.displayPrice || `₹${cartItem.price}`,
        image: cartItem.image,
        originalPrice: cartItem.originalPrice ? `₹${cartItem.originalPrice}` : undefined,
        inStock: true
      });
      removeItem(id, variant);
    } catch (error) {
      console.error('Error saving item for later:', error);
    }
  };

  const handleCheckout = () => {
    // Allow anonymous checkout path (could later open guest checkout flow)
    navigate('/checkout');
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Loading Your Cart</h1>
              <p className="text-gray-600">
                {isAuthenticated ? 'Syncing your cart data...' : 'Loading cart items...'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {isAuthenticated && <SyncStatusIndicator />}
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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Cart Header - Hidden on Mobile */}
        <div className="mb-8 hidden md:block">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
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
            <SyncStatusIndicator />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items - Full width on mobile, left column on desktop */}
          <div className="lg:col-span-8">
            {/* Mobile Cart Items */}
            <div className="md:hidden space-y-4">
              {items.map((item, index) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
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
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base font-semibold text-gray-900 leading-tight">
                              {item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 ml-2"
                              onClick={() => handleRemoveItem(item.id, item.variant)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price and Discount */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {item.price}
                            </span>
                            {/* Mock discount badge - can be made dynamic */}
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <Tag className="w-3 h-3 mr-1" />
                              10% OFF
                            </Badge>
                          </div>

                          {/* Delivery Info */}
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <Truck className="w-4 h-4" />
                            <span>Free delivery by tomorrow</span>
                          </div>

                          {/* Quantity and Actions */}
                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Qty:</span>
                              <Select 
                                value={item.quantity.toString()} 
                                onValueChange={(value) => handleQuantityChange(item.id, parseInt(value), item.variant)}
                              >
                                <SelectTrigger className="w-16 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-sm"
                              onClick={() => handleSaveForLater(item.id, item.variant)}
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Cart Items */}
            <Card className="hidden md:block">
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
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant)}
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
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right min-w-[80px]">
                                <p className="text-lg font-bold text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                onClick={() => handleRemoveItem(item.id, item.variant)}
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

          {/* Order Summary - Right Column (Desktop Only) */}
          <div className="lg:col-span-4 hidden md:block">
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

        {/* Mobile Sticky Footer */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 line-through">
                ₹{Math.round(total * 1.2).toLocaleString('en-IN')}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{Math.round(total).toLocaleString('en-IN')}
              </span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-8 text-lg font-semibold rounded-lg"
              size="lg"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
