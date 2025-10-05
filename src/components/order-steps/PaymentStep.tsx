import React from 'react';
import CheckoutPage from '../checkout/CheckoutPage';
import { OrderData } from '../OrderFlow';

interface PaymentStepProps {
  orderData: OrderData;
  onComplete: (orderId: string) => void;
  onBack: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = (props) => {
  return <CheckoutPage {...props} />;
};

export default PaymentStep;
