import React, { useState } from 'react';
import { CreditCard, Wallet, Building, Smartphone, Lock, CheckCircle, Loader2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/orders';
import { OrderData } from '../OrderFlow';
import { useIsMobile } from '@/hooks/use-mobile';
import QRCodePayment from '../payment/QRCodePayment';
import PaymentApps from '../payment/PaymentApps';
import PaymentSuccess from '../payment/PaymentSuccess';
import { validateUPIId, validatePaymentAmount } from '@/lib/paymentValidation';

// Custom payment app icons as SVG components
const GooglePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
    <path fill="#34A853" d="M12 6c1.64 0 3.09.69 4.14 1.86l3.09-3.09C17.47 2.84 15.11 2 12 2c-3.31 0-6.34 1.64-8.18 4.39l3.6 2.78C8.18 7.09 9.97 6 12 6z"/>
    <path fill="#FBBC04" d="M12 18c-1.97 0-3.76-1.09-4.58-3.17l-3.6 2.78C5.66 20.36 8.69 22 12 22c3.11 0 5.47-.84 7.23-2.81l-3.33-2.58C14.91 17.41 13.64 18 12 18z"/>
    <path fill="#EA4335" d="M7.42 14.83C7.15 14.08 7 13.06 7 12s.15-2.08.42-2.83L3.82 6.39C2.68 8.69 2 10.3 2 12s.68 3.31 1.82 5.61l3.6-2.78z"/>
  </svg>
);

const PhonePeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <circle cx="12" cy="12" r="11" fill="#5f259f"/>
    <path fill="white" d="M8 8h3c2.2 0 4 1.8 4 4s-1.8 4-4 4h-1v2h-2V8zm2 2v4h1c1.1 0 2-.9 2-2s-.9-2-2-2h-1z"/>
  </svg>
);

const PaytmIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <circle cx="12" cy="12" r="11" fill="#00BAF2"/>
    <path fill="white" d="M8 8h8v2h-3v6h-2v-6H8V8z"/>
    <circle cx="12" cy="16" r="1" fill="white"/>
  </svg>
);

const UPIIconGroup = () => (
  <div className="flex items-center gap-1">
    <GooglePayIcon />
    <PhonePeIcon />
    <PaytmIcon />
  </div>
);

// Card payment icons
const CardIconGroup = () => (
  <div className="flex items-center gap-1">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#1a1f71" d="M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z"/>
      <path fill="#fff" d="M8.5 8h7v1.5h-7V8zm0 3h7v1.5h-7V11zm0 3h4v1.5h-4V14z"/>
    </svg>
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" fill="#eb001b"/>
      <circle cx="12" cy="12" r="10" fill="#f79e1b" opacity="0.8"/>
    </svg>
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#003d82" d="M2 7h20v10H2V7z"/>
      <path fill="#f26522" d="M2 11h20v2H2v-2z"/>
    </svg>
  </div>
);

// Net banking icon
const NetBankingIcon = () => (
  <div className="flex items-center gap-1">
    <Building className="h-5 w-5 text-blue-600" />
    <span className="text-xs font-medium text-blue-600">Bank</span>
  </div>
);

// Cash on delivery icon
const CODIcon = () => (
  <div className="flex items-center gap-1">
    <Wallet className="h-5 w-5 text-green-600" />
    <span className="text-xs font-medium text-green-600">Cash</span>
  </div>
);

interface PaymentStepProps {
  orderData: OrderData;
  onComplete: (orderId: string) => void;
  onBack: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  popular?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  orderData, 
  onComplete, 
  onBack, 
  isProcessing, 
  setIsProcessing 
}) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  
  const subtotal = getTotalPrice();
  const shipping = 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const paymentOptions: PaymentOption[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: UPIIconGroup,
      description: 'Google Pay, PhonePe, Paytm & more',
      popular: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CardIconGroup,
      description: 'Visa, Mastercard, RuPay cards accepted',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: NetBankingIcon,
      description: 'All major banks supported',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: CODIcon,
      description: 'Pay when you receive your order',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePaymentDetails = (): boolean => {
    switch (selectedPayment) {
      case 'card':
        return !!(cardNumber && expiryDate && cvv && cardName);
      case 'upi':
        return validateUPIId(upiId).isValid;
      case 'netbanking':
      case 'cod':
        return true;
      default:
        return false;
    }
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails() || !orderData.shippingAddress) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const orderItems = items.map(item => ({
        id: `${item.id}-${item.variant || ''}`,
        name: item.name,
        price: formatPrice(item.price),
        image: item.image,
        quantity: item.quantity,
        variant: item.variant,
        productId: item.id,
      }));

      const orderId = await createOrder({
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email || 'guest@example.com',
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        subtotal,
        shipping,
        total,
        status: 'pending',
        paymentStatus: selectedPayment === 'cod' ? 'pending' : 'paid',
        paymentMethod: paymentOptions.find(opt => opt.id === selectedPayment)?.name || selectedPayment,
        notes: orderNotes || orderData.specialInstructions,
      });

      // Clear cart after successful order
      clearCart();

      // Show payment success screen
      setCompletedOrderId(orderId);
      setShowPaymentSuccess(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      // In a real app, show error message to user
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentSuccess(false);
    onComplete(completedOrderId);
  };

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case 'card':
        return (
          <Card>
            <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                <CreditCard className="h-5 w-5" />
                Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name as on card"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                  <Smartphone className="h-5 w-5" />
                  UPI Payment
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
                {/* Payment Apps */}
                <PaymentApps 
                  amount={total}
                  orderNotes={orderNotes}
                  onAppSelect={(appName) => {
                    setIsProcessing(true);
                    // Simulate payment completion after app selection
                    setTimeout(() => handlePayment(), 3000);
                  }}
                />
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* QR Code Payment */}
                <QRCodePayment 
                  amount={total}
                  orderNotes={orderNotes}
                  onPaymentComplete={() => {
                    setIsProcessing(true);
                    handlePayment();
                  }}
                />

                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Manual UPI ID */}
                <div className="space-y-2">
                  <Label htmlFor="upiId">Enter UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@paytm"
                  />
                  {upiId && !validateUPIId(upiId).isValid && (
                    <p className="text-sm text-red-500">
                      {validateUPIId(upiId).error}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'netbanking':
        return (
          <Card>
            <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                <Building className="h-5 w-5" />
                Net Banking
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
              <p className="text-center text-gray-600 py-4">
                You will be redirected to your bank's website to complete the payment.
              </p>
            </CardContent>
          </Card>
        );

      case 'cod':
        return (
          <Card>
            <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                <Wallet className="h-5 w-5" />
                Cash on Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
              <div className="space-y-2">
                <p className="text-gray-600">Pay when you receive your order.</p>
                <div className="text-sm text-gray-500">
                  <p>• Have exact change ready</p>
                  <p>• Payment accepted in cash only</p>
                  <p>• Additional COD charges may apply</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {showPaymentSuccess ? (
        <PaymentSuccess
          orderId={completedOrderId}
          amount={total}
          paymentMethod={paymentOptions.find(opt => opt.id === selectedPayment)?.name || selectedPayment}
          orderItems={items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: formatPrice(item.price)
          }))}
          onContinue={handlePaymentComplete}
        />
      ) : (
        <div className={`${isMobile ? 'min-h-screen flex flex-col' : 'flex flex-col h-full'}`}>
          <div className={`${isMobile ? 'flex-1 px-4 py-4' : 'flex-1 px-6 py-4'} space-y-6 ${isMobile ? '' : 'overflow-y-auto'}`}>
        {!isMobile && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Payment Method</h3>
            <p className="text-gray-600">Choose your preferred payment method</p>
          </div>
        )}

        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
          {/* Payment Methods */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-4`}>
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={isMobile ? 'text-base' : ''}>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
                <RadioGroup value={selectedPayment} onValueChange={(value: PaymentMethod) => setSelectedPayment(value)}>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className={`flex items-center justify-between border border-gray-200 rounded-lg hover:border-gray-300 ${isMobile ? 'p-3' : 'p-3'}`}>
                            <div className="flex items-center gap-3">
                              <option.icon className="h-5 w-5 text-gray-600" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{option.name}</span>
                                  {option.popular && (
                                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Form */}
            {renderPaymentForm()}

            {/* Order Notes */}
            <Card>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                  <StickyNote className="h-5 w-5" />
                  Order Notes (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
                <Textarea
                  placeholder="Add any special instructions for your order..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {orderNotes.length}/500 characters
                </p>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className={`${isMobile ? 'px-3 py-3' : 'pt-6'}`}>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Lock className="h-4 w-4" />
                  <span className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>Secure Payment</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
            <Card className={`${isMobile ? '' : 'sticky top-4'}`}>
              <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
                <CardTitle className={isMobile ? 'text-base' : ''}>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className={`flex justify-between font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handlePayment}
                    disabled={!validatePaymentDetails() || isProcessing}
                    className={`w-full bg-primary hover:bg-primary/90 ${isMobile ? 'h-10 text-sm' : 'h-12'}`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className={isMobile ? 'text-sm' : ''}>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className={isMobile ? 'text-sm' : ''}>Pay {formatPrice(total)}</span>
                      </div>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms & Conditions
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
            <Button variant="outline" onClick={onBack} disabled={isProcessing}>
              Back to Summary
            </Button>
          )}
        </div>
      </div>
        </div>
      )}
    </>
  );
};

export default PaymentStep;
