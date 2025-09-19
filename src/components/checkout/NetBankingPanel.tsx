import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, ChevronRight, Shield, Info, Loader, Gift, HelpCircle } from 'lucide-react';

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
  offers?: string[];
  cashback?: string;
}

const NetBankingPanel: React.FC<NetBankingPanelProps> = ({
  total,
  onPayment,
  isProcessing,
  isMobile
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);

  // Load saved bank preference
  useEffect(() => {
    const savedBank = localStorage.getItem('preferredBank');
    if (savedBank) {
      setSelectedBank(savedBank);
    }
  }, []);

  // Save bank preference when selected
  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    localStorage.setItem('preferredBank', bankId);
  };

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

  // Bank list with popular Indian banks and image logos
  const banks: Bank[] = [
    {
      id: 'sbi',
      name: 'State Bank of India',
      code: 'SBI',
      logoIcon: (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
          <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      ),
      popular: true,
      offers: ['No transaction fees', 'Instant payment confirmation'],
      cashback: 'Earn 1% cashback up to ₹100'
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      code: 'HDFC',
      logoIcon: (
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-md">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-white w-1.5 h-1.5 rounded-sm"></div>
            <div className="bg-white w-1.5 h-1.5 rounded-sm"></div>
            <div className="bg-white w-1.5 h-1.5 rounded-sm"></div>
            <div className="bg-white w-1.5 h-1.5 rounded-sm"></div>
          </div>
        </div>
      ),
      popular: true,
      offers: ['Zero processing fees', 'SmartPay rewards'],
      cashback: 'Get 2% cashback up to ₹200'
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      code: 'ICICI',
      logoIcon: (
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
          <div className="w-5 h-1 bg-white rounded-full"></div>
        </div>
      ),
      popular: true,
      offers: ['Free transactions', 'ICICI Rewards points'],
      cashback: 'Up to 1.5% cashback'
    },
    {
      id: 'kotak',
      name: 'Kotak Mahindra Bank',
      code: 'KOTAK',
      logoIcon: (
        <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center shadow-md">
          <div className="flex space-x-0.5">
            <div className="w-1 h-4 bg-white rounded-full"></div>
            <div className="w-1 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      ),
      offers: ['Kotak 811 benefits', 'Priority banking'],
      cashback: 'Exclusive rewards available'
    },
    {
      id: 'axis',
      name: 'Axis Bank',
      code: 'AXIS',
      logoIcon: (
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center shadow-md">
          <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
        </div>
      ),
      popular: true,
      offers: ['AxisDirect benefits', 'No hidden charges'],
      cashback: 'Get rewards on every transaction'
    },
    {
      id: 'federal',
      name: 'Federal Bank',
      code: 'FEDERAL',
      logoIcon: (
        <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center shadow-md">
          <div className="w-4 h-3 bg-white rounded-sm flex items-center justify-center">
            <div className="text-gray-500 text-[8px] font-bold">F</div>
          </div>
        </div>
      ),
      offers: ['FedMobile benefits'],
      cashback: 'Standard cashback rates'
    },
    {
      id: 'iob',
      name: 'Indian Overseas Bank',
      code: 'IOB',
      logoIcon: (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
          <div className="flex flex-col space-y-0.5">
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      offers: ['No service charges'],
      cashback: 'Special offers available'
    },
    {
      id: 'indianbank',
      name: 'Indian Bank',
      code: 'INDIANBANK',
      logoIcon: (
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      ),
      offers: ['Government bank benefits'],
      cashback: 'Loyalty rewards program'
    },
  ];

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
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-lg'}`}>
            <Building className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
            Net Banking
          </CardTitle>
          <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-2'}`}>
            {/* Security Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200 ${isMobile ? 'px-3 py-2' : 'px-2 py-1'}`}>
              <Shield className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>100% Secure</span>
            </div>
            {/* Help Tooltip */}
            <Button
              variant="outline"
              size="sm"
              className={`p-0 ${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          </div>
        </div>
        
        {/* Help Content */}
        {showHelp && (
          <div className={`bg-blue-50 border border-blue-200 rounded-lg ${isMobile ? 'mt-4 p-4' : 'mt-3 p-3'}`}>
            <h4 className={`font-medium text-blue-900 mb-3 ${isMobile ? 'text-base' : 'text-sm'}`}>How to Pay with Net Banking:</h4>
            <ol className={`text-blue-800 space-y-2 list-decimal list-inside ${isMobile ? 'text-sm' : 'text-xs'}`}>
              <li>Select your bank from the list below</li>
              <li>Click on "Pay ₹{formatPrice(total).replace('₹', '')}" button</li>
              <li>You'll be redirected to your bank's secure website</li>
              <li>Login with your Net Banking credentials</li>
              <li>Confirm the payment details and complete transaction</li>
              <li>You'll receive confirmation via SMS and email</li>
            </ol>
            {isMobile && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">💡 Tip: Keep your banking app ready for faster login</p>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={`text-gray-600 ${isMobile ? 'text-base mb-2' : 'text-base'} mb-1`}>
          Select your bank to proceed with Net Banking payment
        </div>
        <div className={`text-gray-500 ${isMobile ? 'text-sm mb-6' : 'text-sm'} mb-4`}>
          All payments are secured with 256-bit SSL encryption
        </div>

        {/* Bank Selection */}
        <div className="space-y-2">
          {isMobile ? (
            // Mobile Dropdown
            <div>
              <Select value={selectedBank} onValueChange={handleBankSelect}>
                <SelectTrigger className="w-full h-14 text-left border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
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
                            <div className="text-xs text-green-600 font-medium">Popular</div>
                          )}
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {banks.map((bank) => (
                    <SelectItem 
                      key={bank.id} 
                      value={bank.id}
                      className="py-4 px-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {bank.logoIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{bank.name}</div>
                          {bank.popular && (
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Popular</div>
                          )}
                          {bank.cashback && (
                            <div className="text-xs text-blue-600 mt-0.5">{bank.cashback}</div>
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
                          ? 'border-gray-500 bg-white shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <RadioGroupItem
                          value={bank.id}
                          id={bank.id}
                          className={selectedBank === bank.id ? 'border-gray-500' : ''}
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

        {/* Selected Bank Pay Button and Offers */}
        {selectedBank && selectedBankData && (
          <div className="space-y-4">
            {/* Bank Offers Section */}
            {(selectedBankData.offers || selectedBankData.cashback) && (
              <div className={`p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg ${isMobile ? 'p-4' : 'p-3'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className={`text-green-600 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  <span className={`font-medium text-green-800 ${isMobile ? 'text-sm' : 'text-sm'}`}>Special Offers</span>
                </div>
                {selectedBankData.offers && (
                  <div className="space-y-1">
                    {selectedBankData.offers.map((offer, index) => (
                      <div key={index} className={`flex items-center gap-2 text-green-700 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                        <span>{offer}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedBankData.cashback && (
                  <div className={`flex items-center gap-2 text-green-700 font-medium mt-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                    <span>{selectedBankData.cashback}</span>
                  </div>
                )}
              </div>
            )}

            {/* Payment Button Section */}
            <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg ${isMobile ? 'p-4' : 'p-4'}`}>
              <div className={`flex items-center gap-3 mb-3 ${isMobile ? 'mb-4' : 'mb-3'}`}>
                <div className="flex-shrink-0">
                  {selectedBankData.logoIcon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isMobile ? 'text-base' : 'text-base'}`}>
                    {selectedBankData.name}
                  </div>
                  <div className={`text-gray-600 flex items-center gap-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span>You will be redirected to secure banking gateway</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isMobile ? 'h-14 text-base py-4' : 'h-14 text-base'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader className={`animate-spin mr-2 ${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
                    <span className={isMobile ? 'text-base' : 'text-base'}>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Shield className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                    <span className={isMobile ? 'text-base font-semibold' : 'text-base'}>Pay {formatPrice(total)}</span>
                  </>
                )}
              </Button>
              
              {/* Payment Security Info */}
              <div className={`text-center ${isMobile ? 'mt-4' : 'mt-3'}`}>
                <div className={`text-gray-600 flex items-center justify-center gap-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                  <Shield className="h-3 w-3 text-green-600 flex-shrink-0" />
                  <span>256-bit SSL encrypted • Bank-level security</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Information Section */}
        <div className={`bg-gray-50 border rounded-lg ${isMobile ? 'p-4 mt-4' : 'p-4 mt-6'}`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'mb-4' : 'mb-3'}`}>
            <Info className={`text-blue-600 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            <div className={`text-gray-800 font-medium ${isMobile ? 'text-base' : 'text-base'}`}>
              Payment Information
            </div>
          </div>
          <div className={`text-gray-600 space-y-3 ${isMobile ? 'text-sm' : 'text-sm'}`}>
            <div className="grid gap-3">
              <p className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Bank-grade security with 256-bit SSL encryption</span>
              </p>
              <p className="flex items-start gap-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-0.5"></div>
                <span>Instant payment confirmation via SMS and email</span>
              </p>
              <p className="flex items-start gap-3">
                <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0 mt-0.5"></div>
                <span>No additional charges from our platform</span>
              </p>
              <p className="flex items-start gap-3">
                <div className="w-4 h-4 bg-purple-600 rounded-full flex-shrink-0 mt-0.5"></div>
                <span>24/7 customer support for payment issues</span>
              </p>
            </div>
            
            {selectedBank && (
              <div className={`pt-3 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-3'}`}>
                <p className={`font-medium text-gray-700 mb-1 ${isMobile ? 'text-sm' : 'text-sm'}`}>Your selected bank will be saved for faster checkout next time</p>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>You can change this preference anytime</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetBankingPanel;