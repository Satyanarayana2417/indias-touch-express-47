import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Smartphone, CreditCard, Building, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentData {
  method: string;
  upiId?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
  selectedBank?: string;
}

interface MobilePaymentMethodsProps {
  selectedPayment: string;
  onPaymentSelect: (method: string) => void;
  onPaymentComplete?: (paymentData: PaymentData) => void;
}

const MobilePaymentMethods: React.FC<MobilePaymentMethodsProps> = ({
  selectedPayment,
  onPaymentSelect,
  onPaymentComplete
}) => {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(selectedPayment);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay by any UPI app',
      icon: <Smartphone className="h-5 w-5" />,
      offer: 'Save upto ₹50 • 4 offers available',
      available: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit / ATM Card',
      description: 'Add and secure cards as per RBI guidelines',
      icon: <CreditCard className="h-5 w-5" />,
      offer: 'Get upto 5% cashback* • 2 offers available',
      available: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <Building className="h-5 w-5" />,
      offer: '',
      available: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: <Wallet className="h-5 w-5" />,
      offer: '',
      available: true,
    },
  ];

  const toggleExpanded = (methodId: string) => {
    if (expandedMethod === methodId) {
      setExpandedMethod(null);
    } else {
      setExpandedMethod(methodId);
      onPaymentSelect(methodId);
    }
  };

  const handlePaymentSubmit = (methodId: string) => {
    let paymentData: PaymentData = { method: methodId };
    
    switch (methodId) {
      case 'upi':
        paymentData = { method: methodId, upiId };
        break;
      case 'card':
        paymentData = { method: methodId, cardNumber, expiryDate, cvv, cardHolderName };
        break;
      case 'netbanking':
        paymentData = { method: methodId, selectedBank };
        break;
      case 'cod':
        // No additional data needed for COD
        break;
    }
    
    onPaymentComplete?.(paymentData);
  };

  const popularBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India'
  ];

  const renderPaymentForm = (method: any) => {
    switch (method.id) {
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter UPI ID
              </label>
              <Input
                type="text"
                placeholder="example@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              className="w-full" 
              disabled={!upiId}
              onClick={() => handlePaymentSubmit('upi')}
            >
              Pay with UPI
            </Button>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <Input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              disabled={!cardNumber || !expiryDate || !cvv || !cardHolderName}
              onClick={() => handlePaymentSubmit('card')}
            >
              Pay with Card
            </Button>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Bank
              </label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {popularBanks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              disabled={!selectedBank}
              onClick={() => handlePaymentSubmit('netbanking')}
            >
              Continue to Bank
            </Button>
          </div>
        );

      case 'cod':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-800 mb-1">Cash on Delivery</h4>
              <p className="text-sm text-amber-700">
                Pay ₹50 extra as Cash on Delivery charges. You can pay cash when the order is delivered to your doorstep.
              </p>
            </div>
            <Button 
              className="w-full"
              onClick={() => handlePaymentSubmit('cod')}
            >
              Continue with COD
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <div
            className={`
              cursor-pointer transition-colors duration-200
              ${expandedMethod === method.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
              ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => method.available && toggleExpanded(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-gray-600">
                    {method.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {method.name}
                      </h3>
                      {!method.available && (
                        <Badge variant="secondary" className="text-xs">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                    
                    {method.description && (
                      <p className="text-xs text-gray-600 mb-1">
                        {method.description}
                      </p>
                    )}
                    
                    {method.offer && (
                      <p className="text-xs text-green-600 font-medium">
                        {method.offer}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0 ml-2">
                  {expandedMethod === method.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedMethod === method.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {renderPaymentForm(method)}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MobilePaymentMethods;