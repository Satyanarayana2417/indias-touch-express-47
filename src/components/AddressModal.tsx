import { useState, useEffect } from "react";
import { X, MapPin, Search, Target, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";

interface Address {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isSelected?: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: Address) => void;
}

const AddressModal = ({ isOpen, onClose, onAddressSelect }: AddressModalProps) => {
  const { currentUser } = useAuth();
  const { setUserLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    // Sample data - in real app, this would come from Firestore
    {
      id: "1",
      name: "Home",
      address: "3-25, Om Shanthi Bhavan Road, Opp Ambedkar Colony",
      area: "Ramanthapur",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500013",
      isSelected: true
    },
    {
      id: "2", 
      name: "Work",
      address: "Hi-Tech City, Financial District",
      area: "Gachibowli",
      city: "Hyderabad", 
      state: "Telangana",
      pincode: "500032",
      isSelected: false
    }
  ]);
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use the existing geocoding function from LocationContext
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const area = data.address.neighbourhood || data.address.suburb || data.address.locality || '';
            const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
            const state = data.address.state || '';
            const country = data.address.country || '';
            
            const fullCity = area && area !== city ? `${area}, ${city}` : city;
            setUserLocation({ city: fullCity, state, country }, 'sessionStorage');
            
            // Close modal and show current location is being used
            onClose();
          }
        } catch (error) {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please try again.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to access your location. Please enable location permissions.');
        setIsLoadingLocation(false);
      }
    );
  };

  const handleAddressSelect = (address: Address) => {
    // Update selected state
    setSavedAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isSelected: addr.id === address.id
      }))
    );
    
    // Update location context
    setUserLocation({
      city: `${address.area}, ${address.city}`,
      state: address.state,
      country: "India"
    }, 'localStorage');
    
    onAddressSelect(address);
    onClose();
  };

  const handleMoreOptions = (addressId: string, action: 'edit' | 'delete') => {
    setShowMoreOptions(null);
    
    if (action === 'edit') {
      // TODO: Open edit address modal
      console.log('Edit address:', addressId);
    } else if (action === 'delete') {
      // TODO: Delete address from Firestore
      setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
  };

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:hidden">
        <div className="bg-white w-full rounded-t-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Login Required</h3>
          <p className="text-gray-600 mb-6">Please log in to manage your delivery addresses.</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:hidden">
      {/* Modal Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Bottom Sheet */}
      <div className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-hidden relative animate-in slide-in-from-bottom-full duration-300">
        {/* Grab Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Select delivery address</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Search Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by area, street name, pin code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 rounded-lg border-gray-200"
              />
            </div>
            
            {/* Current Location Button */}
            <Button
              onClick={handleCurrentLocation}
              disabled={isLoadingLocation}
              variant="outline"
              className="w-full justify-start h-12 text-left border-gray-200 hover:bg-blue-50 hover:border-blue-200"
            >
              <Target className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-600 font-medium">
                {isLoadingLocation ? "Getting your location..." : "Use my current location"}
              </span>
            </Button>
          </div>
          
          {/* Saved Addresses Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Saved addresses</h3>
              <button className="flex items-center text-blue-600 text-sm font-medium">
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </button>
            </div>
            
            {/* Address List */}
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div key={address.id} className="relative">
                  <div
                    onClick={() => handleAddressSelect(address)}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{address.name}</span>
                        {address.isSelected && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            Currently selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {address.address}, {address.area}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreOptions(showMoreOptions === address.id ? null : address.id);
                      }}
                      className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  {/* More Options Menu */}
                  {showMoreOptions === address.id && (
                    <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleMoreOptions(address.id, 'edit')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMoreOptions(address.id, 'delete')}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
