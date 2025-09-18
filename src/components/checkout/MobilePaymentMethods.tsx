import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Smartphone, CreditCard, Building, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  // Function to get bank logo with multiple format support
  const getBankLogo = (bankName: string) => {
    // Support multiple formats: try different extensions
    const bankLogos: { [key: string]: string[] } = {
      'State Bank of India': [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwx-VfRhZL8SWCoDgyW1UXcrjJUNDDaZz_4MT6Dj-K-jXf7WdL8Md0Rt4UcLNFSPAOUU4&usqp=CAU',
        '/bank-logos/sbi-logo.png',
        '/bank-logos/sbi-logo.jpg',
        '/bank-logos/sbi-logo.jpeg',
        '/bank-logos/sbi-logo.svg',
        '/bank-logos/sbi-logo.webp'
      ],
      'HDFC Bank': [
        'https://w7.pngwing.com/pngs/636/81/png-transparent-hdfc-thumbnail-bank-logos-thumbnail.png',
        '/bank-logos/hdfc-logo.png',
        '/bank-logos/hdfc-logo.jpg',
        '/bank-logos/hdfc-logo.jpeg',
        '/bank-logos/hdfc-logo.svg',
        '/bank-logos/hdfc-logo.webp'
      ],
      'ICICI Bank': [
        'https://companieslogo.com/img/orig/IBN-af38b5c0.png?t=1720244492',
        '/bank-logos/icici-logo.png',
        '/bank-logos/icici-logo.jpg',
        '/bank-logos/icici-logo.jpeg',
        '/bank-logos/icici-logo.svg',
        '/bank-logos/icici-logo.webp'
      ],
      'Axis Bank': [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWxzSXOpPGpzylGQztjzV4pqXqNvHaUEs7_uEW5TAK03PC8emEjOuAS9O-FSa9hcyux_Q&usqp=CAU',
        '/bank-logos/axis-logo.png',
        '/bank-logos/axis-logo.jpg',
        '/bank-logos/axis-logo.jpeg',
        '/bank-logos/axis-logo.svg',
        '/bank-logos/axis-logo.webp'
      ],
      'Punjab National Bank': [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkEVvhCbReaVLyNPYE-cVo_JVYQloPCzLAMw&s',
        '/bank-logos/pnb-logo.png',
        '/bank-logos/pnb-logo.jpg',
        '/bank-logos/pnb-logo.jpeg',
        '/bank-logos/pnb-logo.svg',
        '/bank-logos/pnb-logo.webp'
      ],
      'Bank of Baroda': [
        'https://www.vhv.rs/dpng/d/109-1097307_bank-of-baroda-png-logo-of-bank-of.png',
        '/bank-logos/bob-logo.png',
        '/bank-logos/bob-logo.jpg',
        '/bank-logos/bob-logo.jpeg',
        '/bank-logos/bob-logo.svg',
        '/bank-logos/bob-logo.webp'
      ],
      'Canara Bank': [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThO2fDfGbNevq1Z8U2Zj3XJbOh_1_W4hQo-Q&s',
        '/bank-logos/canara-logo.png',
        '/bank-logos/canara-logo.jpg',
        '/bank-logos/canara-logo.jpeg',
        '/bank-logos/canara-logo.svg',
        '/bank-logos/canara-logo.webp'
      ],
      'Union Bank of India': [
        'https://companieslogo.com/img/orig/UNIONBANK.NS-5bba728d.png?t=1720244494',
        '/bank-logos/union-logo.png',
        '/bank-logos/union-logo.jpg',
        '/bank-logos/union-logo.jpeg',
        '/bank-logos/union-logo.svg',
        '/bank-logos/union-logo.webp'
      ]
    };
    
    // Return the first available format (PNG by default)
    return bankLogos[bankName]?.[0] || null;
  };

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
          <div className="space-y-3">
            <div className="space-y-2">
              {popularBanks.map((bank) => {
                const logoSrc = getBankLogo(bank);
                return (
                  <Button
                    key={bank}
                    variant={selectedBank === bank ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-3 px-4 ${
                      selectedBank === bank ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedBank(bank)}
                  >
                    <div className="flex items-center gap-3">
                      {logoSrc ? (
                        <img 
                          src={logoSrc} 
                          alt={`${bank} logo`}
                          className="w-6 h-6 object-contain rounded"
                          onError={(e) => {
                            // Fallback to initial letter if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback to bank initial if logo not available or fails to load */}
                      <div 
                        className={`w-6 h-6 rounded-full ${logoSrc ? 'hidden' : 'flex'} items-center justify-center text-xs font-bold bg-gray-200 text-gray-600`}
                        style={{ display: logoSrc ? 'none' : 'flex' }}
                      >
                        {bank.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{bank}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
            <Button 
              className="w-full mt-4"
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
              ${expandedMethod === method.id ? 'bg-gray-50' : 'hover:bg-gray-50'}
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