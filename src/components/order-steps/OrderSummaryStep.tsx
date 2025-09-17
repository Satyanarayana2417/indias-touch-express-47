import React, { useState } from 'react';
import { Package, MapPin, Truck, Calendar, Edit2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { OrderData } from '../OrderFlow';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderSummaryStepProps {
  orderData: OrderData;
  onNext: (data: { specialInstructions?: string }) => void;
  onBack: () => void;
}

const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({ orderData, onNext, onBack }) => {
  const { items, getTotalPrice } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState(orderData.specialInstructions || '');
  const isMobile = useIsMobile();
  
  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.05); // 5% tax for demo
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleContinue = () => {
    onNext({ specialInstructions });
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days from now
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`${isMobile ? 'min-h-screen flex flex-col' : 'flex flex-col h-full'}`}>
      <div className={`${isMobile ? 'flex-1 px-4 py-4' : 'flex-1 px-6 py-4'} space-y-6 ${isMobile ? '' : 'overflow-y-auto'}`}>
        {!isMobile && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Review Your Order</h3>
            <p className="text-gray-600">Please review your order details before proceeding to payment</p>
          </div>
        )}

        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
          {/* Order Items */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                  <Package className="h-5 w-5" />
                  Order Items ({items.length} {items.length === 1 ? 'item' : 'items'})
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant || ''}`} className={`flex items-center gap-4 ${isMobile ? 'p-3' : 'p-4'} border border-gray-200 rounded-lg`}>
                    <div className="flex-shrink-0">
                      <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded-lg overflow-hidden`}>
                        {item.image && item.image !== '/placeholder.svg' ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ShoppingBag className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-gray-400`} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-sm' : ''}`}>{item.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={`flex items-center justify-between ${isMobile ? 'text-base' : ''}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    {isMobile ? 'Edit' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
                {orderData.shippingAddress ? (
                  <div className="space-y-2">
                    <p className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>{orderData.shippingAddress.fullName}</p>
                    <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>{orderData.shippingAddress.address}</p>
                    <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}
                    </p>
                    <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>{orderData.shippingAddress.country}</p>
                    <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>Phone: {orderData.shippingAddress.phone}</p>
                  </div>
                ) : (
                  <p className="text-red-600">No address selected</p>
                )}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                  <Truck className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-3 ${isMobile ? 'px-3 pb-3' : ''}`}>
                <div className="flex items-center gap-2 text-green-600">
                  <Calendar className="h-4 w-4" />
                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Expected delivery: {getEstimatedDelivery()}</span>
                </div>
                <p className="text-sm text-gray-600">• Free standard delivery</p>
                <p className="text-sm text-gray-600">• Track your order in real-time</p>
                <p className="text-sm text-gray-600">• Contact-free delivery available</p>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={isMobile ? 'text-base' : ''}>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
                <div className="space-y-2">
                  <Label htmlFor="instructions" className={isMobile ? 'text-sm' : ''}>Any special delivery instructions? (Optional)</Label>
                  <Textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Leave at the front door, Call before delivery, etc."
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500">{specialInstructions.length}/200 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
            <Card className={`${isMobile ? '' : 'sticky top-4'}`}>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={isMobile ? 'text-base' : ''}>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
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
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className={`flex justify-between font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Secure checkout with SSL encryption</p>
                    <p>• 30-day return policy</p>
                    <p>• Customer support available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`${isMobile ? 'mt-4 px-4 pb-6 mb-4' : 'flex-shrink-0 border-t bg-white px-6 py-4'}`}>
        <div className={`flex ${isMobile ? 'gap-3' : 'justify-between'}`}>
          {!isMobile && (
            <Button variant="outline" onClick={onBack}>
              Back to Address
            </Button>
          )}
          <Button 
            onClick={handleContinue}
            className={`bg-primary hover:bg-primary/90 ${isMobile ? 'w-full h-10 text-sm font-medium' : ''}`}
            disabled={!orderData.shippingAddress}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryStep;