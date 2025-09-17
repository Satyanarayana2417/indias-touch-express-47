import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, ExternalLink, QrCode, Download, Copy } from 'lucide-react';
import { validateUPIId } from '@/lib/paymentValidation';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface UPIPaymentPanelProps {
  upiId: string;
  setUpiId: (id: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  total: number;
  onPayment: () => void;
  isProcessing: boolean;
  isMobile: boolean;
}

const UPIPaymentPanel: React.FC<UPIPaymentPanelProps> = ({
  upiId,
  setUpiId,
  isVerified,
  setIsVerified,
  total,
  onPayment,
  isProcessing,
  isMobile
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [showQRCode, setShowQRCode] = useState(true); // Show QR code by default
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
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
      am: total.toString(),
      cu: upiConfig.cu,
      tn: 'Order Payment'
    });
    
    return `upi://pay?${params.toString()}`;
  };

  // Generate QR code when component mounts or total changes
  useEffect(() => {
    const generateQRCode = async () => {
      const upiUrl = generateUPIUrl();
      
      try {
        const qrDataURL = await QRCodeLib.toDataURL(upiUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [total]);

  const handleCopyUPIUrl = () => {
    const upiUrl = generateUPIUrl();
    navigator.clipboard.writeText(upiUrl).then(() => {
      toast({
        title: "UPI URL Copied",
        description: "UPI payment URL has been copied to clipboard",
      });
    });
  };

  const handleDownloadQR = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `payment-qr-${total}.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleVerifyUPI = async () => {
    if (!upiId.trim()) {
      setVerificationError('Please enter a valid UPI ID');
      return;
    }

    const validation = validateUPIId(upiId);
    if (!validation.isValid) {
      setVerificationError(validation.error || 'Invalid UPI ID');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      // Simulate UPI verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVerified(true);
      setVerificationError('');
    } catch (error) {
      setVerificationError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpiChange = (value: string) => {
    setUpiId(value);
    setIsVerified(false);
    setVerificationError('');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className={isMobile ? 'pb-3' : ''}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Add new UPI ID
            <a 
              href="#" 
              className="ml-auto text-blue-500 text-sm hover:underline"
            >
              How to find?
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId" className="text-sm font-medium">
              UPI ID
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(e) => handleUpiChange(e.target.value)}
                  placeholder="Enter your UPI ID"
                  className={`
                    ${isVerified ? 'border-green-500' : ''}
                    ${verificationError ? 'border-red-500' : ''}
                  `}
                  disabled={isVerifying || isProcessing}
                />
                {verificationError && (
                  <p className="text-red-500 text-xs mt-1">{verificationError}</p>
                )}
                {isVerified && (
                  <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                    <Check className="h-3 w-3" />
                    <span>UPI ID verified successfully</span>
                  </div>
                )}
              </div>
              <Button
                onClick={handleVerifyUPI}
                disabled={!upiId.trim() || isVerifying || isVerified || isProcessing}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isVerified ? (
                  <Check className="h-4 w-4" />
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>

          {/* Payment Apps Quick Access */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Or pay directly with:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Google Pay', color: 'bg-blue-600' },
                { name: 'PhonePe', color: 'bg-purple-600' },
                { name: 'Paytm', color: 'bg-blue-500' }
              ].map((app) => (
                <Button
                  key={app.name}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    window.open(generateUPIUrl());
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${app.color}`}></div>
                  <span className="text-xs">{app.name}</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">Scan QR Code to Pay:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRCode(!showQRCode)}
                className="text-blue-500 hover:text-blue-600"
              >
                <QrCode className="h-4 w-4 mr-1" />
                {showQRCode ? 'Hide QR' : 'Show QR'}
              </Button>
            </div>
            
            {showQRCode && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-100">
                {qrCodeDataURL ? (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg inline-block shadow-sm">
                      <img
                        src={qrCodeDataURL}
                        alt="UPI Payment QR Code"
                        className="mx-auto"
                        style={{ width: isMobile ? '160px' : '180px', height: isMobile ? '160px' : '180px' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        Amount: {formatPrice(total)}
                      </p>
                      <p className="text-xs text-gray-600">
                        Scan with any UPI app like Google Pay, PhonePe, or Paytm
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUPIUrl}
                        className="flex items-center gap-1 bg-white"
                      >
                        <Copy className="h-3 w-3" />
                        Copy UPI Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadQR}
                        className="flex items-center gap-1 bg-white"
                      >
                        <Download className="h-3 w-3" />
                        Download QR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Button
            onClick={onPayment}
            disabled={!isVerified || isProcessing}
            className={`
              w-full bg-gray-800 hover:bg-gray-900 text-white font-medium
              ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'}
            `}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Pay ${formatPrice(total)}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UPIPaymentPanel;