import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { OrderData } from '../OrderFlow';
import PaymentMethodsPanel from './PaymentMethodsPanel';
import UPIPaymentPanel from './UPIPaymentPanel';
import CreditCardPanel from './CreditCardPanel';
import NetBankingPanel from './NetBankingPanel';
import OrderSummaryPanel from './OrderSummaryPanel';
import { createOrder } from '@/lib/orders';

interface CheckoutPageProps {
  orderData: OrderData;
  onComplete: (orderId: string) => void;
  onBack: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'emi';

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
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
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  
  // Calculate pricing
  const subtotal = getTotalPrice();
  const platformFee = 5;
  const handlingFee = 80;
  const total = subtotal + platformFee + handlingFee;
  
  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handlePayment = async () => {
    if (!orderData.shippingAddress) return;
    
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
        shipping: 0,
        total,
        status: 'pending',
        paymentStatus: selectedPayment === 'cod' ? 'pending' : 'paid',
        paymentMethod: selectedPayment,
        notes: orderData.specialInstructions,
      });

      clearCart();
      onComplete(orderId);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const handleNetBankingPayment = async (bankCode: string) => {
    if (!orderData.shippingAddress) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate redirect to bank's net banking gateway
      console.log(`Redirecting to ${bankCode} Net Banking...`);
      
      // In a real implementation, you would redirect to the bank's payment gateway
      // For demo purposes, we'll simulate this
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
        shipping: 0,
        total,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: `netbanking-${bankCode.toLowerCase()}`,
        notes: orderData.specialInstructions,
      });

      clearCart();
      onComplete(orderId);
    } catch (error) {
      console.error('Net Banking payment failed:', error);
      setIsProcessing(false);
    }
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method as PaymentMethod);
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <PaymentMethodsPanel 
          selectedPayment={selectedPayment}
          onPaymentSelect={handlePaymentSelect}
          isMobile={true}
          onPaymentComplete={handlePayment}
        />
        
        {selectedPayment === 'upi' && (
          <UPIPaymentPanel
            upiId={upiId}
            setUpiId={setUpiId}
            isVerified={isUpiVerified}
            setIsVerified={setIsUpiVerified}
            total={total}
            onPayment={handlePayment}
            isProcessing={isProcessing}
            isMobile={true}
          />
        )}

        {selectedPayment === 'card' && (
          <CreditCardPanel
            total={total}
            onPayment={handlePayment}
            isProcessing={isProcessing}
            isMobile={true}
          />
        )}

        {selectedPayment === 'netbanking' && (
          <NetBankingPanel
            total={total}
            onPayment={handleNetBankingPayment}
            isProcessing={isProcessing}
            isMobile={true}
          />
        )}
        
        <OrderSummaryPanel
          subtotal={subtotal}
          platformFee={platformFee}
          handlingFee={handlingFee}
          total={total}
          itemCount={items.length}
          isMobile={true}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Payment Methods */}
          <div className="lg:col-span-1">
            <PaymentMethodsPanel 
              selectedPayment={selectedPayment}
              onPaymentSelect={handlePaymentSelect}
              isMobile={false}
              onPaymentComplete={handlePayment}
            />
          </div>

          {/* Center Panel - Payment Details */}
          <div className="lg:col-span-1">
            {selectedPayment === 'upi' && (
              <UPIPaymentPanel
                upiId={upiId}
                setUpiId={setUpiId}
                isVerified={isUpiVerified}
                setIsVerified={setIsUpiVerified}
                total={total}
                onPayment={handlePayment}
                isProcessing={isProcessing}
                isMobile={false}
              />
            )}

            {selectedPayment === 'card' && (
              <CreditCardPanel
                total={total}
                onPayment={handlePayment}
                isProcessing={isProcessing}
                isMobile={false}
              />
            )}

            {selectedPayment === 'netbanking' && (
              <NetBankingPanel
                total={total}
                onPayment={handleNetBankingPayment}
                isProcessing={isProcessing}
                isMobile={false}
              />
            )}
          </div>

          {/* Right Panel - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummaryPanel
              subtotal={subtotal}
              platformFee={platformFee}
              handlingFee={handlingFee}
              total={total}
              itemCount={items.length}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;