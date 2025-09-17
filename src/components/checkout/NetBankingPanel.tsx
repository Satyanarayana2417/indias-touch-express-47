import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, ChevronRight } from 'lucide-react';

interface NetBankingPanelProps {
  total: number;
  onPayment: (bankCode: string) => void;
  isProcessing: boolean;
  isMobile: boolean;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  logoIcon: React.ReactNode;
  popular?: boolean;
  gatewayUrl?: string;
}

const NetBankingPanel: React.FC<NetBankingPanelProps> = ({
  total,
  onPayment,
  isProcessing,
  isMobile
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('');

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Generate payment gateway URLs (these would be real bank URLs in production)
  const generateBankUrl = (bankCode: string) => {
    const baseUrls: { [key: string]: string } = {
      SBI: 'https://retail.onlinesbi.com/retail/login.htm',
      HDFC: 'https://netbanking.hdfcbank.com/netbanking/',
      ICICI: 'https://infinity.icicibank.com/corp/Login.jsp',
      KOTAK: 'https://netbanking.kotak.com/knb2/',
      AXIS: 'https://www.axisbank.com/retail/online-services/axis-bank-internet-banking',
      FEDERAL: 'https://www.federalbank.co.in/personal/online-services/internet-banking',
      IOB: 'https://iobnet.co.in/internetbanking/',
      INDIANBANK: 'https://onlinesbi.com/',
    };
    
    return baseUrls[bankCode] || '#';
  };

  // Bank list with popular Indian banks and improved logos
  const banks: Bank[] = [
    {
      id: 'sbi',
      name: 'State Bank of India',
      code: 'SBI',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          SBI
        </div>
      ),
      popular: true,
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      code: 'HDFC',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          HDFC
        </div>
      ),
      popular: true,
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      code: 'ICICI',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          ICICI
        </div>
      ),
      popular: true,
    },
    {
      id: 'kotak',
      name: 'Kotak Mahindra Bank',
      code: 'KOTAK',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-red-800 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          KMB
        </div>
      ),
    },
    {
      id: 'axis',
      name: 'Axis Bank',
      code: 'AXIS',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          AXIS
        </div>
      ),
      popular: true,
    },
    {
      id: 'federal',
      name: 'Federal Bank',
      code: 'FEDERAL',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          FED
        </div>
      ),
    },
    {
      id: 'iob',
      name: 'Indian Overseas Bank',
      code: 'IOB',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          IOB
        </div>
      ),
    },
    {
      id: 'indianbank',
      name: 'Indian Bank',
      code: 'INDIANBANK',
      logoIcon: (
        <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-green-800 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
          IB
        </div>
      ),
    },
  ];

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handlePayment = () => {
    if (selectedBank) {
      const bank = banks.find(b => b.id === selectedBank);
      if (bank) {
        // In a real implementation, you would:
        // 1. Create a payment session with your payment gateway
        // 2. Redirect to the bank's URL with proper parameters
        // 3. Handle the callback after payment completion
        
        // For demo purposes, we'll simulate the redirect
        const bankUrl = generateBankUrl(bank.code);
        console.log(`Redirecting to ${bank.name} at: ${bankUrl}`);
        
        // Simulate bank redirect - in real implementation, use window.location.href = bankUrl
        onPayment(bank.code);
      }
    }
  };

  const selectedBankData = banks.find(bank => bank.id === selectedBank);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
          <Building className="h-5 w-5" />
          Net Banking
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'} mb-1`}>
          Select your bank to proceed with Net Banking payment
        </div>
        <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} mb-4`}>
          All payments are secured with 256-bit SSL encryption
        </div>

        {/* Bank Selection */}
        <div className="space-y-2">
          {isMobile ? (
            // Mobile Dropdown
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Bank
              </Label>
              <Select value={selectedBank} onValueChange={handleBankSelect}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Choose your bank">
                    {selectedBank && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {banks.find(b => b.id === selectedBank)?.logoIcon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {banks.find(b => b.id === selectedBank)?.name}
                          </div>
                          {banks.find(b => b.id === selectedBank)?.popular && (
                            <div className="text-xs text-green-600">Popular</div>
                          )}
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem 
                      key={bank.id} 
                      value={bank.id}
                      className="py-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {bank.logoIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{bank.name}</div>
                          {bank.popular && (
                            <div className="text-xs text-green-600 font-medium">Popular</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            // Desktop Radio Buttons
            <RadioGroup value={selectedBank} onValueChange={handleBankSelect}>
              <div className="space-y-2">
                {banks.map((bank) => (
                  <div key={bank.id} className="relative">
                    <Label
                      htmlFor={bank.id}
                      className={`
                        flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedBank === bank.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <RadioGroupItem
                          value={bank.id}
                          id={bank.id}
                          className={selectedBank === bank.id ? 'border-blue-500' : ''}
                        />
                        
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-shrink-0">
                            {bank.logoIcon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                              {bank.name}
                            </div>
                            {bank.popular && (
                              <div className="text-xs text-green-600 font-medium">Popular</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        {/* Selected Bank Pay Button */}
        {selectedBank && selectedBankData && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              {selectedBankData.logoIcon}
              <div>
                <div className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {selectedBankData.name}
                </div>
                <div className="text-xs text-gray-600">
                  You will be redirected to your bank's secure payment gateway
                </div>
              </div>
            </div>
            
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold ${
                isMobile ? 'h-10 text-sm' : 'h-12 text-base'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Redirecting...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </Button>
          </div>
        )}

        {/* Information */}
        <div className={`bg-gray-50 p-3 rounded-lg border ${isMobile ? '' : 'mt-4'}`}>
          <div className={`text-gray-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'} mb-2`}>
            Important Information:
          </div>
          <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} space-y-1`}>
            <p>• You will be redirected to your bank's secure website</p>
            <p>• Please have your Net Banking credentials ready</p>
            <p>• Payment confirmation will be sent via SMS and email</p>
            <p>• Transaction is protected by bank-level security</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetBankingPanel;