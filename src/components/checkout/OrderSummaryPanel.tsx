import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryPanelProps {
  subtotal: number;
  platformFee: number;
  handlingFee: number;
  total: number;
  itemCount: number;
  isMobile: boolean;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  subtotal,
  platformFee,
  handlingFee,
  total,
  itemCount,
  isMobile
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Price Breakdown Card */}
      <Card className="shadow-sm">
        <CardHeader className={`border-b ${isMobile ? 'pb-3' : ''}`}>
          <CardTitle className={`text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Price ({itemCount} item{itemCount > 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {/* Price Items */}
          <div className="flex justify-between items-center">
            <span className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Price ({itemCount} item{itemCount > 1 ? 's' : ''})
            </span>
            <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Platform Fee
            </span>
            <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              {formatPrice(platformFee)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Handling Fee
            </span>
            <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              {formatPrice(handlingFee)}
            </span>
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Total Amount
              </span>
              <span className={`font-bold text-blue-600 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className={`text-center text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <p>Safe and Secure Payments. Easy returns.</p>
        <p>100% Authentic products.</p>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;