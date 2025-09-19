import React from 'react';
import PaymentSuccess from '@/components/payment/PaymentSuccess';

const PaymentTestPage = () => {
  const mockOrder = {
    orderId: 'VE-TEST-12345',
    amount: 1499,
    paymentMethod: 'UPI',
    orderItems: [
      {
        name: 'Basmati Rice 1kg',
        quantity: 2,
        price: '₹599'
      },
      {
        name: 'Turmeric Powder 100g',
        quantity: 1,
        price: '₹301'
      }
    ]
  };

  const handleContinue = () => {
    console.log('Continue button clicked from test page');
    // Just log for testing, normally would navigate somewhere
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Success Test Page</h1>
        <div className="bg-white rounded-lg shadow-sm">
          <PaymentSuccess
            orderId={mockOrder.orderId}
            amount={mockOrder.amount}
            paymentMethod={mockOrder.paymentMethod}
            orderItems={mockOrder.orderItems}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;