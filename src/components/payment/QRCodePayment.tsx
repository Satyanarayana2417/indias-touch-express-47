import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Download, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodePaymentProps {
  amount: number;
  orderNotes?: string;
  onPaymentComplete?: () => void;
  className?: string;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({
  amount,
  orderNotes = '',
  onPaymentComplete,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // UPI payment details
  const upiConfig = {
    pa: '9121055512@ybl',
    pn: 'Satyanarayana',
    cu: 'INR'
  };

  // Generate UPI payment URL
  const generateUPIUrl = () => {
    const params = new URLSearchParams({
      pa: upiConfig.pa,
      pn: upiConfig.pn,
      am: amount.toString(),
      cu: upiConfig.cu,
      tn: orderNotes || 'Order Payment'
    });
    
    return `upi://pay?${params.toString()}`;
  };

  // Generate QR code
  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current) {
        try {
          const upiUrl = generateUPIUrl();
          await QRCode.toCanvas(canvasRef.current, upiUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [amount, orderNotes]);

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(upiConfig.pa);
      toast({
        title: 'UPI ID Copied',
        description: 'UPI ID has been copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to Copy',
        description: 'Could not copy UPI ID to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `payment-qr-${amount}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5" />
          UPI QR Code Payment
        </CardTitle>
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Secure Payment
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
        </div>

        {/* Payment Amount */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{formatPrice(amount)}</div>
          <p className="text-sm text-gray-600">Scan to pay the exact amount</p>
        </div>

        {/* UPI Details */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">UPI ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{upiConfig.pa}</span>
              <Button variant="ghost" size="sm" onClick={copyUPIId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payee:</span>
            <span className="font-medium">{upiConfig.pn}</span>
          </div>
          {orderNotes && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Note:</span>
              <span className="font-medium text-right max-w-[60%]">{orderNotes}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button variant="outline" onClick={downloadQRCode} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          
          {onPaymentComplete && (
            <Button onClick={onPaymentComplete} className="w-full bg-green-600 hover:bg-green-700">
              I've Completed the Payment
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</p>
          <p>• Scan the QR code above</p>
          <p>• Verify the amount and complete payment</p>
          <p>• Do not edit the payment amount</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodePayment;