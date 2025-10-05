import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentSuccess from '@/components/payment/PaymentSuccess';
import { useIsMobile } from '@/hooks/use-mobile';

const PaymentSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Mock data - in a real app, you'd fetch this from your backend
  const mockOrderData = {
    orderId: orderId || 'ORD-' + Date.now(),
    amount: 1184.00,
    paymentMethod: 'Net Banking - HDFC',
    orderItems: [
      { name: 'Premium Basmati Rice 5kg', quantity: 2, price: '₹599.00' },
      { name: 'Organic Turmeric Powder', quantity: 1, price: '₹299.00' },
      { name: 'Traditional Ghee 1L', quantity: 1, price: '₹499.00' }
    ]
  };

  const handleViewOrderDetails = () => {
    navigate(`/track-order?orderId=${mockOrderData.orderId}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate(`/track-order?orderId=${mockOrderData.orderId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <PaymentSuccess
        orderId={mockOrderData.orderId}
        amount={mockOrderData.amount}
        paymentMethod={mockOrderData.paymentMethod}
        orderItems={mockOrderData.orderItems}
        onContinue={handleTrackOrder}
        onGoHome={handleGoHome}
        onViewOrderDetails={handleViewOrderDetails}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default PaymentSuccessPage;
