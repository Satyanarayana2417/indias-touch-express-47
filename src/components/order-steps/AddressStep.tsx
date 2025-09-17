import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, Home, Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { ShippingAddress } from '@/lib/orders';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddressStepProps {
  onNext: (address: ShippingAddress) => void;
  onCancel: () => void;
  initialData?: ShippingAddress;
}

interface SavedAddress {
  id: string;
  name: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

const AddressStep: React.FC<AddressStepProps> = ({ onNext, onCancel, initialData }) => {
  const { currentUser } = useAuth();
  const { userLocation, setUserLocation } = useLocation();
  const isMobile = useIsMobile();
  
  const [selectedMode, setSelectedMode] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Form state for new/edit address
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: initialData?.fullName || '',
    address: initialData?.address || '',
    city: initialData?.city || userLocation?.city || '',
    state: initialData?.state || userLocation?.state || '',
    postalCode: initialData?.postalCode || userLocation?.pincode || '',
    country: initialData?.country || userLocation?.country || 'India',
    phone: initialData?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Mock saved addresses - in real app, fetch from Firestore
  const [savedAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      name: 'Home',
      fullName: 'John Doe',
      address: '3-25, Om Shanthi Bhavan Road, Opp Ambedkar Colony',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500013',
      country: 'India',
      phone: '+91 9876543210',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Work',
      fullName: 'John Doe',
      address: 'Hi-Tech City, Financial District, Mindspace',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500032',
      country: 'India',
      phone: '+91 9876543210',
    },
  ]);

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [savedAddresses, selectedAddressId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid 6-digit postal code';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = () => {
    if (selectedMode === 'saved' && selectedAddressId) {
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        const shippingAddress: ShippingAddress = {
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        };
        onNext(shippingAddress);
      }
    } else if (selectedMode === 'new') {
      if (validateForm()) {
        onNext(formData);
      }
    }
  };

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className={`${isMobile ? 'min-h-screen flex flex-col' : 'flex flex-col h-full'}`}>
      <div className={`${isMobile ? 'flex-1 px-4 py-4' : 'flex-1 px-6 py-4'} space-y-6 ${isMobile ? '' : 'overflow-y-auto'}`}>
        {!isMobile && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Delivery Address</h3>
            <p className="text-gray-600">Choose where you'd like your order delivered</p>
          </div>
        )}

        {/* Address Selection Mode */}
        <RadioGroup value={selectedMode} onValueChange={(value: 'saved' | 'new') => setSelectedMode(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="saved" id="saved" />
            <Label htmlFor="saved">Use saved address</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">Add new address</Label>
          </div>
        </RadioGroup>

        {/* Saved Addresses */}
        {selectedMode === 'saved' && (
          <div className="space-y-4">
            <div className="grid gap-3">
              {savedAddresses.map((address) => (
                <Card
                  key={address.id}
                  className={`cursor-pointer transition-all ${
                    selectedAddressId === address.id
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <CardContent className={isMobile ? 'p-3' : 'p-4'}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300">
                            {selectedAddressId === address.id && (
                              <div className="w-full h-full rounded-full bg-blue-500 scale-50" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{address.name}</span>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-medium">{address.fullName}</p>
                          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                            {address.address}, {address.city}, {address.state} - {address.postalCode}
                          </p>
                          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'}`}>{address.phone}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({
                            fullName: address.fullName,
                            address: address.address,
                            city: address.city,
                            state: address.state,
                            postalCode: address.postalCode,
                            country: address.country,
                            phone: address.phone,
                          });
                          setSelectedMode('new');
                          setIsEditingAddress(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* New Address Form */}
        {selectedMode === 'new' && (
          <Card>
            <CardHeader className={isMobile ? 'px-3 py-3' : ''}>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {isEditingAddress ? 'Edit Address' : 'Add New Address'}
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 ${isMobile ? 'px-3 pb-3' : ''}`}>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House/Flat number, Building name, Street name, Area"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">PIN Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="600001"
                    maxLength={6}
                    className={errors.postalCode ? 'border-red-500' : ''}
                  />
                  {errors.postalCode && <p className="text-sm text-red-600">{errors.postalCode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`${isMobile ? 'mt-4 px-4 pb-6 mb-20' : 'flex-shrink-0 border-t bg-white px-6 py-4'}`}>
        <div className={`flex ${isMobile ? 'gap-3' : 'justify-between'}`}>
          {!isMobile && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleContinue}
            disabled={selectedMode === 'saved' ? !selectedAddressId : false}
            className={`bg-primary hover:bg-primary/90 ${isMobile ? 'w-full h-10 text-sm font-medium' : ''}`}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressStep;