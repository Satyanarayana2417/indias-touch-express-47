import React, { useState } from 'react';
import { X, Check, MapPin, Package, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddressStep from '@/components/order-steps/AddressStep';
import OrderSummaryStep from '@/components/order-steps/OrderSummaryStep';
import PaymentStep from '@/components/order-steps/PaymentStep';
import { ShippingAddress } from '@/lib/orders';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (orderId: string) => void;
}

type OrderStep = 'address' | 'summary' | 'payment';

export interface OrderData {
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  specialInstructions?: string;
}

const OrderFlow: React.FC<OrderFlowProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState<OrderStep>('address');
  const [orderData, setOrderData] = useState<OrderData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();

  const steps = [
    { id: 'address', label: 'Address Details', icon: MapPin, completed: false },
    { id: 'summary', label: 'Order Summary', icon: Package, completed: false },
    { id: 'payment', label: 'Payment', icon: CreditCard, completed: false },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Mark completed steps
  const stepsWithStatus = steps.map((step, index) => ({
    ...step,
    completed: index < currentStepIndex,
    current: index === currentStepIndex,
  }));

  const handleStepComplete = (stepData: any) => {
    if (currentStep === 'address') {
      // Address step passes ShippingAddress directly, store it as shippingAddress
      setOrderData(prev => ({ ...prev, shippingAddress: stepData }));
      setCurrentStep('summary');
    } else if (currentStep === 'summary') {
      // Summary step passes additional data like special instructions
      setOrderData(prev => ({ ...prev, ...stepData }));
      setCurrentStep('payment');
    }
  };

  const handleBackStep = () => {
    if (currentStep === 'summary') {
      setCurrentStep('address');
    } else if (currentStep === 'payment') {
      setCurrentStep('summary');
    }
  };

  const handleOrderComplete = (orderId: string) => {
    setIsProcessing(false);
    onOrderComplete(orderId);
    onClose();
    // Reset state for next use
    setCurrentStep('address');
    setOrderData({});
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      // Reset state
      setCurrentStep('address');
      setOrderData({});
    }
  };

  const getCurrentStepTitle = () => {
    switch (currentStep) {
      case 'address':
        return 'Delivery Address';
      case 'summary':
        return 'Order Summary';
      case 'payment':
        return 'Complete Payment';
      default:
        return 'Order';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'address':
        return (
          <AddressStep
            onNext={handleStepComplete}
            onCancel={handleClose}
            initialData={orderData.shippingAddress}
          />
        );
      case 'summary':
        return (
          <OrderSummaryStep
            orderData={orderData}
            onNext={handleStepComplete}
            onBack={handleBackStep}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            orderData={orderData}
            onComplete={handleOrderComplete}
            onBack={handleBackStep}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      default:
        return null;
    }
  };

  // Full-screen layout for both mobile and desktop
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-white px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={currentStep === 'address' ? handleClose : handleBackStep}
                  className="h-8 w-8 p-0"
                  disabled={isProcessing}
                >
                  {currentStep === 'address' ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ArrowLeft className="h-4 w-4" />
                  )}
                </Button>
                <h1 className={`font-semibold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {getCurrentStepTitle()}
                </h1>
              </div>
              {!isMobile && !isProcessing && currentStep !== 'address' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Step Indicator */}
            <div className={`flex items-center justify-between mt-4 ${isMobile ? '' : 'max-w-2xl mx-auto'}`}>
              {stepsWithStatus.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center rounded-full text-sm font-medium ${
                        isMobile ? 'w-8 h-8' : 'w-10 h-10'
                      } ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : step.current
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      {step.completed ? (
                        <Check className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      ) : isMobile ? (
                        index + 1
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium ${isMobile ? 'mt-1' : 'mt-2'} ${
                        step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isMobile && index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="min-h-full">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderFlow;
