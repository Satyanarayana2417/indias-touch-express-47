import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationData {
  city: string;
  state: string;
  country: string;
}

interface LocationContextType {
  userLocation: LocationData | null;
  setUserLocation: (location: LocationData | null, storageType?: 'localStorage' | 'sessionStorage') => void;
  isLocationSet: boolean;
  hasShownModal: boolean;
  setHasShownModal: (shown: boolean) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [userLocation, setUserLocationState] = useState<LocationData | null>(null);
  const [hasShownModal, setHasShownModalState] = useState(false);

  // Initialize location from storage on mount
  useEffect(() => {
    // Check sessionStorage first (for modal shown flag)
    const modalShown = sessionStorage.getItem('locationModalShown');
    if (modalShown === 'true') {
      setHasShownModalState(true);
    }

    // Check for saved location (localStorage first, then sessionStorage)
    const savedLocationLocal = localStorage.getItem('userLocation');
    const savedLocationSession = sessionStorage.getItem('userLocation');
    
    if (savedLocationLocal) {
      try {
        const location = JSON.parse(savedLocationLocal);
        setUserLocationState(location);
      } catch (error) {
        console.error('Error parsing saved location from localStorage:', error);
        localStorage.removeItem('userLocation');
      }
    } else if (savedLocationSession) {
      try {
        const location = JSON.parse(savedLocationSession);
        setUserLocationState(location);
      } catch (error) {
        console.error('Error parsing saved location from sessionStorage:', error);
        sessionStorage.removeItem('userLocation');
      }
    }
  }, []);

  const setUserLocation = (location: LocationData | null, storageType: 'localStorage' | 'sessionStorage' = 'localStorage') => {
    setUserLocationState(location);
    
    if (location) {
      const locationString = JSON.stringify(location);
      if (storageType === 'localStorage') {
        localStorage.setItem('userLocation', locationString);
        // Remove from sessionStorage if it exists to avoid conflicts
        sessionStorage.removeItem('userLocation');
      } else {
        sessionStorage.setItem('userLocation', locationString);
        // Remove from localStorage if it exists to avoid conflicts
        localStorage.removeItem('userLocation');
      }
    } else {
      // Clear both storages when location is null
      localStorage.removeItem('userLocation');
      sessionStorage.removeItem('userLocation');
    }
  };

  const setHasShownModal = (shown: boolean) => {
    setHasShownModalState(shown);
    if (shown) {
      sessionStorage.setItem('locationModalShown', 'true');
    } else {
      sessionStorage.removeItem('locationModalShown');
    }
  };

  const clearLocation = () => {
    setUserLocationState(null);
    localStorage.removeItem('userLocation');
    sessionStorage.removeItem('userLocation');
  };

  const isLocationSet = userLocation !== null;

  const value: LocationContextType = {
    userLocation,
    setUserLocation,
    isLocationSet,
    hasShownModal,
    setHasShownModal,
    clearLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export type { LocationData };