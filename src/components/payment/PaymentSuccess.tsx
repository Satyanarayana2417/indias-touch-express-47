import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Package, ArrowRight, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEstimatedDeliveryTime } from '@/lib/paymentValidation';

interface PaymentSuccessProps {
  orderId: string;
  amount: number;
  paymentMethod: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  onContinue?: () => void;
  onGoHome?: () => void;
  className?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  orderId,
  amount,
  paymentMethod,
  orderItems,
  onContinue,
  onGoHome,
  className = ''
}) => {
  const [deliveryInfo, setDeliveryInfo] = useState<{ time: string; timeRange: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get estimated delivery time when component mounts
    const estimatedDelivery = getEstimatedDeliveryTime();
    setDeliveryInfo(estimatedDelivery);
  }, []);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Copy order ID to clipboard
  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      toast({
        title: 'Order ID Copied',
        description: 'Order ID has been copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to Copy',
        description: 'Could not copy Order ID to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-green-600">
          Order Placed Successfully!
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Thank you for your order. Your payment has been received and your order is being processed.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">Order ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-800">{orderId}</span>
              <Button variant="ghost" size="sm" onClick={copyOrderId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700">Payment Amount:</span>
            <span className="font-bold text-green-800">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700">Payment Method:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {paymentMethod}
            </Badge>
          </div>
        </div>

        {/* Delivery Information */}
        {deliveryInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Estimated Delivery</span>
            </div>
            <p className="text-gray-700 font-medium">
              Within 40-50 minutes
            </p>
            <p className="text-sm text-gray-600">
              Expected between {deliveryInfo.timeRange}
            </p>
          </div>
        )}

        {/* Order Items Summary */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({orderItems.length} item{orderItems.length !== 1 ? 's' : ''})
          </h3>
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Next Steps */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Order confirmation email sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Your order is being prepared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Out for delivery within 40-50 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Order delivered to your address</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onContinue && (
            <Button onClick={onContinue} className="w-full">
              Track Your Order
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {onGoHome && (
            <Button variant="outline" onClick={onGoHome} className="w-full">
              Continue Shopping
            </Button>
          )}
        </div>

        {/* Support Information */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Need help with your order?</p>
          <p>Contact us at support@yourstore.com or call +91-XXXXXXXXXX</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSuccess;