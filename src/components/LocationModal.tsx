import { useState } from "react";
import { reverseGeocodeGoogle } from '@/lib/geocoding';
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationChoice: (type: 'allow' | 'session' | 'deny', location?: { city: string; state: string; country: string; fullAddress?: string; latitude?: number; longitude?: number }) => void;
}

const LocationModal = ({ isOpen, onClose, onLocationChoice }: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'allow' | 'session' | null>(null);

  if (!isOpen) return null;

  // Function to get location from coordinates using OpenStreetMap Nominatim
  const getCityFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      // Try Google first if API key configured
      try {
        const googleResult = await reverseGeocodeGoogle(latitude, longitude);
        // Google result already contains formatted address; attempt to parse pincode (postal code)
        let pincode: string | undefined = undefined;
        if (googleResult.fullAddress) {
          const pinMatch = googleResult.fullAddress.match(/\b\d{5,6}\b/); // India 6 digits, fallback 5+ for other regions
          if (pinMatch) pincode = pinMatch[0];
        }
        return { ...googleResult, pincode };
      } catch (googleErr) {
        // Silent fallback to existing providers
        // console.warn('Google geocoding failed, falling back:', googleErr);
      }

      // Try OpenStreetMap Nominatim first
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Get the most specific area information available
        const area = data.address.neighbourhood || 
                    data.address.suburb || 
                    data.address.locality || 
                    data.address.subdistrict || 
                    data.address.district ||
                    data.address.county ||
                    '';
        
        const city = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.state_district || 
                    'Unknown City';
        
  const state = data.address.state || '';
        const country = data.address.country || '';
  const pincode = data.address.postcode || undefined;
        
        // If we have area info, include it with the city
        const fullCity = area && area !== city ? `${area}, ${city}` : city;
        
        // Build a richer fullAddress (street/road + area + city + state + country)
        const street = data.address.road || data.address.pedestrian || data.address.suburb || '';
        const parts = [street, area !== city ? area : null, city, state, country].filter(Boolean);
        const fullAddress = parts.join(', ');
        return { city: fullCity, state, country, fullAddress, latitude, longitude, pincode };
      }
      
      // Fallback to BigDataCloud API if Nominatim fails
      const fallbackResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData) {
        const area = fallbackData.locality || fallbackData.localityInfo?.administrative?.[3]?.name || '';
        const city = fallbackData.city || fallbackData.locality || 'Unknown City';
        const state = fallbackData.principalSubdivision || '';
        const country = fallbackData.countryName || '';
        const pincode = fallbackData.postcode || fallbackData.plusCode || undefined;
        
        const fullCity = area && area !== city ? `${area}, ${city}` : city;
        
        const fullAddress = [fullCity, state, country].filter(Boolean).join(', ');
        return { city: fullCity, state, country, fullAddress, latitude, longitude, pincode };
      }
      
      throw new Error('Unable to determine location');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Handle location access request
  // NOTE: We only request coordinates and immediately convert to a coarse (city/area + pincode) string.
  // No coordinates are persisted beyond local/session storage for user experience.
  // Compatible with Chrome, Safari (requires HTTPS), and modern mobile browsers.
  // If permission is denied, we fall back to manual entry (AddressModal via manager).
  const handleLocationRequest = async (type: 'allow' | 'session') => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await getCityFromCoordinates(latitude, longitude);
            onLocationChoice(type, location);
          } catch (error) {
            console.error('Error getting city name:', error);
            // Fallback to coordinates if geocoding fails
            const { latitude, longitude } = position.coords;
            onLocationChoice(type, { 
              city: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, 
              state: '', 
              country: '',
              fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              latitude,
              longitude
            });
          } finally {
            setIsLoading(false);
            setLoadingType(null);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
          setLoadingType(null);
          // User denied or error occurred, treat as deny
          onLocationChoice('deny');
        },
        {
          // High accuracy attempts GPS on mobile; may take longer on some devices
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      console.error('Location request error:', error);
      setIsLoading(false);
      setLoadingType(null);
      onLocationChoice('deny');
    }
  };

  const handleDeny = () => {
    onLocationChoice('deny');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg md:rounded-2xl shadow-2xl max-w-sm md:max-w-md w-full mx-4 p-4 md:p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full mb-3 md:mb-4">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Share Your Location
          </h2>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed px-2">
            We'd like to access your location to provide accurate shipping estimates. 
            Choose how you'd like to share your location.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 md:space-y-3">
          <Button
            onClick={() => handleLocationRequest('allow')}
            disabled={isLoading}
            className="w-full h-10 md:h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            {isLoading && loadingType === 'allow' ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs md:text-sm">Getting location...</span>
              </div>
            ) : (
              'Allow Location Access'
            )}
          </Button>

          <Button
            onClick={() => handleLocationRequest('session')}
            disabled={isLoading}
            variant="outline"
            className="w-full h-10 md:h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            {isLoading && loadingType === 'session' ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs md:text-sm">Getting location...</span>
              </div>
            ) : (
              'Only While Using the App'
            )}
          </Button>

          <Button
            onClick={handleDeny}
            disabled={isLoading}
            variant="ghost"
            className="w-full h-10 md:h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            Don't Allow
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-3 md:mt-4 px-2">
          Your location data is only used to improve your experience and is not shared with third parties.
        </p>
      </div>
    </div>
  );
};

export default LocationModal;