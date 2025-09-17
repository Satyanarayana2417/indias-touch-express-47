import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Building, Wallet, Calculator, Smartphone, ChevronDown } from 'lucide-react';
import MobilePaymentMethods from './MobilePaymentMethods';

interface PaymentMethodsPanelProps {
  selectedPayment: string;
  onPaymentSelect: (method: string) => void;
  isMobile: boolean;
  onPaymentComplete?: (paymentData: any) => void;
}

const PaymentMethodsPanel: React.FC<PaymentMethodsPanelProps> = ({
  selectedPayment,
  onPaymentSelect,
  isMobile,
  onPaymentComplete
}) => {
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay by any UPI app',
      icon: <Smartphone className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit / ATM Card',
      description: 'Add and secure cards as per RBI guidelines',
      icon: <CreditCard className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <Building className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: '',
      icon: <Wallet className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'emi',
      name: 'EMI',
      description: '',
      icon: <Calculator className="h-5 w-5" />,
      available: false,
    },
  ];

  // Mobile dropdown layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 px-1">Choose Payment Method</h3>
        <MobilePaymentMethods
          selectedPayment={selectedPayment}
          onPaymentSelect={onPaymentSelect}
          onPaymentComplete={onPaymentComplete}
        />
      </div>
    );
  }

  // Desktop radio button layout
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="space-y-0">
          {paymentMethods.map((method, index) => (
            <div
              key={method.id}
              className={`
                relative cursor-pointer border-b border-gray-100 last:border-b-0
                ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
                ${selectedPayment === method.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}
              `}
              onClick={() => method.available && onPaymentSelect(method.id)}
            >
              <div className={`flex items-center gap-3 p-4 ${isMobile ? 'p-3' : ''}`}>
                {/* Radio button */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedPayment === method.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedPayment === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon */}
                <div className={`
                  flex-shrink-0 text-gray-600
                  ${!method.available ? 'text-gray-400' : ''}
                `}>
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`
                      font-medium text-gray-900 
                      ${isMobile ? 'text-sm' : 'text-base'}
                      ${!method.available ? 'text-gray-500' : ''}
                    `}>
                      {method.name}
                    </h3>
                    {!method.available && (
                      <Badge variant="secondary" className="text-xs">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  
                  {method.description && (
                    <p className={`
                      text-gray-600 mt-1
                      ${isMobile ? 'text-xs' : 'text-sm'}
                      ${!method.available ? 'text-gray-400' : ''}
                    `}>
                      {method.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsPanel;