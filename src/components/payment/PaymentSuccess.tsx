import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Package, ArrowRight, Copy, Download, Shield, Phone, Mail, HelpCircle, Home, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEstimatedDeliveryTime } from '@/lib/paymentValidation';
import { useIsMobile } from '@/hooks/use-mobile';

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
  onViewOrderDetails?: () => void;
  onDownloadInvoice?: () => void;
  className?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  orderId,
  amount,
  paymentMethod,
  orderItems,
  onContinue,
  onGoHome,
  onViewOrderDetails,
  onDownloadInvoice,
  className = ''
}) => {
  const [deliveryInfo, setDeliveryInfo] = useState<{ time: string; timeRange: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Get estimated delivery time when component mounts
    const estimatedDelivery = getEstimatedDeliveryTime();
    setDeliveryInfo(estimatedDelivery);
    
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
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

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { date, time };
  };

  const { date: transactionDate, time: transactionTime } = getCurrentDateTime();

  // Handle download invoice
  const handleDownloadInvoice = () => {
    if (onDownloadInvoice) {
      onDownloadInvoice();
    } else {
      // Generate a simple invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .items { border-collapse: collapse; width: 100%; }
            .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Invoice</h1>
            <p>Order ID: ${orderId}</p>
          </div>
          <div class="details">
            <p><strong>Date:</strong> ${transactionDate}</p>
            <p><strong>Time:</strong> ${transactionTime}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Amount:</strong> ${formatPrice(amount)}</p>
          </div>
          <table class="items">
            <tr><th>Item</th><th>Quantity</th><th>Price</th></tr>
            ${orderItems.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td></tr>`).join('')}
          </table>
        </body>
        </html>
      `;
      
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Invoice Downloaded',
        description: 'Invoice has been downloaded successfully',
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 ${isMobile ? 'p-4' : 'p-8'} ${className}`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="animate-pulse absolute top-10 left-10 text-2xl">🎉</div>
          <div className="animate-bounce absolute top-20 right-10 text-2xl">✨</div>
          <div className="animate-ping absolute top-16 left-1/2 text-2xl">🎊</div>
          <div className="animate-pulse absolute top-24 right-1/4 text-2xl">🎉</div>
          <div className="animate-bounce absolute top-12 left-1/4 text-2xl">✨</div>
        </div>
      )}

      <div className={`max-w-2xl mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Main Success Card */}
        <Card className="shadow-xl border-0 animate-in fade-in-50 duration-700">
          <CardHeader className={`text-center ${isMobile ? 'pb-4 pt-6' : 'pb-6 pt-8'}`}>
            {/* Success Animation */}
            <div className="flex justify-center mb-6">
              <div className={`bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-95 duration-500 ${isMobile ? 'w-20 h-20' : 'w-24 h-24'}`}>
                <CheckCircle className={`text-green-600 animate-pulse ${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`} />
              </div>
            </div>
            
            <CardTitle className={`font-bold text-green-600 animate-in slide-in-from-bottom-5 duration-700 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Payment Successful! ✅
            </CardTitle>
            <p className={`text-gray-600 mt-3 animate-in slide-in-from-bottom-5 duration-700 delay-100 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Thank you! Your order has been placed successfully.
            </p>
            
            {/* 100% Secure Badge */}
            <div className="flex justify-center mt-4">
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                100% Secure Payment
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className={`space-y-6 ${isMobile ? 'px-4 pb-6' : 'px-6 pb-8'}`}>
            {/* Transaction Details */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 animate-in slide-in-from-left-5 duration-700 delay-200">
              <h3 className={`font-semibold text-green-800 mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Transaction Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Order ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-green-800 font-bold">{orderId}</span>
                    <Button variant="ghost" size="sm" onClick={copyOrderId} className="h-8 w-8 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Payment Amount:</span>
                  <span className="font-bold text-green-800 text-lg">{formatPrice(amount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Payment Method:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {paymentMethod}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Transaction Date:</span>
                  <div className="text-right">
                    <div className="font-medium text-green-800">{transactionDate}</div>
                    <div className="text-sm text-green-600">{transactionTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {deliveryInfo && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-300">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className={`font-semibold text-blue-800 ${isMobile ? 'text-base' : 'text-lg'}`}>Estimated Delivery</span>
                </div>
                <p className="text-blue-700 font-medium text-lg">
                  Within 40-50 minutes
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Expected between {deliveryInfo.timeRange}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>Estimated delivery date: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`space-y-3 animate-in slide-in-from-bottom-5 duration-700 delay-400 ${isMobile ? '' : 'pt-2'}`}>
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {onViewOrderDetails && (
                  <Button 
                    onClick={onViewOrderDetails}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Order Details
                  </Button>
                )}
                
                <Button 
                  onClick={handleDownloadInvoice}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 font-semibold h-12"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
              
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {onContinue && (
                  <Button 
                    onClick={onContinue} 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Track Your Order
                  </Button>
                )}
                
                {onGoHome && (
                  <Button 
                    onClick={onGoHome} 
                    variant="outline"
                    className="border-gray-600 text-gray-600 hover:bg-gray-50 h-12"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items Summary */}
        <Card className="shadow-lg animate-in slide-in-from-bottom-5 duration-700 delay-500">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <Package className="h-5 w-5 text-gray-700" />
              Order Items ({orderItems.length} item{orderItems.length !== 1 ? 's' : ''})
            </h3>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <span className={`font-medium text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>{item.name}</span>
                    <span className="text-gray-500 ml-2">× {item.quantity}</span>
                  </div>
                  <span className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="shadow-lg animate-in slide-in-from-bottom-5 duration-700 delay-600">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <h4 className={`font-semibold mb-4 text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>What happens next?</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Order confirmation email sent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Your order is being prepared</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Out for delivery within 40-50 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Order delivered to your address</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <Card className="shadow-lg animate-in slide-in-from-bottom-5 duration-700 delay-700">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <h4 className={`font-semibold mb-4 text-gray-800 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <HelpCircle className="h-5 w-5" />
              Need Help?
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className={`font-medium text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>Email Support</p>
                  <p className={`text-blue-600 ${isMobile ? 'text-sm' : 'text-base'}`}>support@indiastouch.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className={`font-medium text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>Call Us</p>
                  <p className={`text-green-600 ${isMobile ? 'text-sm' : 'text-base'}`}>+91-9876543210 (24/7 Support)</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Common Payment FAQs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;