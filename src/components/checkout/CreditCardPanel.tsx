import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, ChevronDown, Info } from 'lucide-react';

interface CreditCardPanelProps {
  total: number;
  onPayment: () => void;
  isProcessing: boolean;
  isMobile: boolean;
}

const CreditCardPanel: React.FC<CreditCardPanelProps> = ({
  total,
  onPayment,
  isProcessing,
  isMobile
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const isFormValid = () => {
    return cardNumber.replace(/\s/g, '').length === 16 && 
           expiryDate.length === 5 && 
           cvv.length >= 3;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            <CreditCard className="h-5 w-5" />
            Credit / Debit / ATM Card
          </CardTitle>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Note */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className={`text-blue-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <strong>Note:</strong> Please ensure your card can be used for online transactions.{' '}
                <span className="text-blue-600 underline cursor-pointer">Learn More</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className={isMobile ? 'text-sm' : 'text-base'}>
            Card Number
          </Label>
          <Input
            id="cardNumber"
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`${isMobile ? 'h-10 text-sm' : 'h-12'} bg-gray-50`}
            maxLength={19}
          />
        </div>

        {/* Expiry and CVV Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry" className={isMobile ? 'text-sm' : 'text-base'}>
              Valid Thru
            </Label>
            <Input
              id="expiry"
              placeholder="MM / YY"
              value={expiryDate}
              onChange={handleExpiryChange}
              className={`${isMobile ? 'h-10 text-sm' : 'h-12'} bg-gray-50`}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="cvv" className={isMobile ? 'text-sm' : 'text-base'}>
                CVV
              </Label>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
            <Input
              id="cvv"
              placeholder="CVV"
              value={cvv}
              onChange={handleCvvChange}
              className={`${isMobile ? 'h-10 text-sm' : 'h-12'} bg-gray-50`}
              maxLength={4}
              type="password"
            />
          </div>
        </div>

        {/* Pay Button */}
        <div className="pt-4">
          <Button
            onClick={onPayment}
            disabled={!isFormValid() || isProcessing}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold ${
              isMobile ? 'h-10 text-sm' : 'h-12 text-base'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay ${formatPrice(total)}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCardPanel;