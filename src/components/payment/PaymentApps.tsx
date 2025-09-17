import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Smartphone } from 'lucide-react';

interface PaymentApp {
  id: string;
  name: string;
  icon: string;
  scheme: string;
  fallbackUrl: string;
}

interface PaymentAppsProps {
  amount: number;
  orderNotes?: string;
  onAppSelect?: (appName: string) => void;
  className?: string;
}

const PaymentApps: React.FC<PaymentAppsProps> = ({
  amount,
  orderNotes = '',
  onAppSelect,
  className = ''
}) => {
  // UPI payment details
  const upiConfig = {
    pa: '9121055512@ybl',
    pn: 'Satyanarayana',
    cu: 'INR'
  };

  // Popular payment apps configuration
  const paymentApps: PaymentApp[] = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '🟣',
      scheme: 'phonepe',
      fallbackUrl: 'https://www.phonepe.com/'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: '🔵',
      scheme: 'gpay',
      fallbackUrl: 'https://pay.google.com/'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: '🔷',
      scheme: 'paytm',
      fallbackUrl: 'https://paytm.com/'
    }
  ];

  // Generate UPI payment URL
  const generateUPIUrl = () => {
    const params = new URLSearchParams({
      pa: upiConfig.pa,
      pn: upiConfig.pn,
      am: amount.toString(),
      cu: upiConfig.cu,
      tn: orderNotes || 'Order Payment'
    });
    
    return `upi://pay?${params.toString()}`;
  };

  // Generate app-specific URL
  const generateAppUrl = (app: PaymentApp): string => {
    const baseUpiUrl = generateUPIUrl();
    
    switch (app.id) {
      case 'phonepe':
        // PhonePe supports direct UPI links
        return baseUpiUrl;
      
      case 'googlepay':
        // Google Pay supports UPI links
        return baseUpiUrl;
      
      case 'paytm':
        // Paytm supports UPI links
        return baseUpiUrl;
      
      default:
        return baseUpiUrl;
    }
  };

  // Handle app selection and redirect
  const handleAppSelect = (app: PaymentApp) => {
    const appUrl = generateAppUrl(app);
    
    // Notify parent component
    if (onAppSelect) {
      onAppSelect(app.name);
    }

    // Try to open the app
    try {
      // For mobile devices, try app scheme first
      if (isMobileDevice()) {
        window.location.href = appUrl;
        
        // Fallback to web version after a delay
        setTimeout(() => {
          const userConfirmed = confirm(
            `Unable to open ${app.name} app. Would you like to visit ${app.name} website instead?`
          );
          if (userConfirmed) {
            window.open(app.fallbackUrl, '_blank');
          }
        }, 3000);
      } else {
        // For desktop, show UPI URL or open fallback
        const userChoice = confirm(
          `This will attempt to open ${app.name}. If you have the app installed, it will open automatically. Continue?`
        );
        
        if (userChoice) {
          // Try app URL first
          window.location.href = appUrl;
          
          // Show fallback option
          setTimeout(() => {
            const openWeb = confirm(
              `If ${app.name} didn't open, would you like to visit the website?`
            );
            if (openWeb) {
              window.open(app.fallbackUrl, '_blank');
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error(`Error opening ${app.name}:`, error);
      // Fallback to web version
      window.open(app.fallbackUrl, '_blank');
    }
  };

  // Check if device is mobile
  const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5" />
          Pay with Your Favorite App
        </CardTitle>
        <div className="text-center">
          <div className="text-xl font-bold text-primary">{formatPrice(amount)}</div>
          <p className="text-sm text-gray-600">Choose your preferred payment app</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Apps Grid */}
        <div className="grid grid-cols-1 gap-3">
          {paymentApps.map((app) => (
            <Button
              key={app.id}
              variant="outline"
              className="h-16 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => handleAppSelect(app)}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{app.icon}</div>
                <div className="text-left">
                  <div className="font-semibold">{app.name}</div>
                  <div className="text-sm text-gray-500">Instant payment</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  UPI
                </Badge>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          ))}
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-bold text-primary">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI ID:</span>
            <span className="font-medium">{upiConfig.pa}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payee:</span>
            <span className="font-medium">{upiConfig.pn}</span>
          </div>
          {orderNotes && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Note:</span>
              <span className="font-medium text-right max-w-[60%] text-sm">{orderNotes}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click on your preferred payment app above</p>
          <p>• The app will open with pre-filled payment details</p>
          <p>• Verify the amount and complete payment</p>
          <p>• Do not modify the payment amount</p>
          <p>• Return to this page after payment completion</p>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-2 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Secure UPI Payment</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentApps;