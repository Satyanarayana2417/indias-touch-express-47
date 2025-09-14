import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Public type for richer location data used by modals/components
export interface LocationData {
  city: string;
  state: string;
  country: string;
}

interface LocationContextType {
  // Existing simple location/address strings still used by Header & other components
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  // Rich location object (city/state/country)
  userLocation: LocationData | null;
  setUserLocation: (location: LocationData, storage: 'localStorage' | 'sessionStorage') => void;
  // Modal session flag
  hasShownModal: boolean;
  setHasShownModal: (shown: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

const PERSISTENT_KEY = 'userLocationPersistent';
const SESSION_KEY = 'userLocationSession';
const MODAL_FLAG_KEY = 'hasShownLocationModal';

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [userLocation, setUserLocationState] = useState<LocationData | null>(null);
  const [hasShownModal, setHasShownModalState] = useState(false);

  // Load any previously stored location (persistent first, session second)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const persistentRaw = localStorage.getItem(PERSISTENT_KEY);
        const sessionRaw = sessionStorage.getItem(SESSION_KEY);
        const modalFlag = sessionStorage.getItem(MODAL_FLAG_KEY);
        if (modalFlag === 'true') setHasShownModalState(true);

        let loaded: LocationData | null = null;
        if (persistentRaw) {
          loaded = JSON.parse(persistentRaw);
        } else if (sessionRaw) {
          loaded = JSON.parse(sessionRaw);
        }
        if (loaded) {
          setUserLocationState(loaded);
          // Derive simple strings for backward compatibility
          setSelectedLocation(loaded.city);
          setDeliveryAddress(`${loaded.city}${loaded.state ? ', ' + loaded.state : ''}`);
        }
      }
    } catch (e) {
      // Silently ignore malformed JSON
      console.warn('Failed to load stored location', e);
    }
  }, []);

  const setHasShownModal = (shown: boolean) => {
    setHasShownModalState(shown);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(MODAL_FLAG_KEY, shown ? 'true' : 'false');
      }
    } catch {
      /* ignore */
    }
  };

  const setUserLocation = (location: LocationData, storage: 'localStorage' | 'sessionStorage') => {
    setUserLocationState(location);
    // Keep legacy simple fields in sync
    setSelectedLocation(location.city);
    setDeliveryAddress(`${location.city}${location.state ? ', ' + location.state : ''}`);
    try {
      if (typeof window !== 'undefined') {
        if (storage === 'localStorage') {
          localStorage.setItem(PERSISTENT_KEY, JSON.stringify(location));
          sessionStorage.removeItem(SESSION_KEY);
        } else {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(location));
        }
      }
    } catch (e) {
      console.warn('Failed to store user location', e);
    }
  };

  const value: LocationContextType = {
    selectedLocation,
    setSelectedLocation,
    deliveryAddress,
    setDeliveryAddress,
    userLocation,
    setUserLocation,
    hasShownModal,
    setHasShownModal
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};