import { useState, useEffect } from "react";
import { useLocation } from "@/context/LocationContext";
import LocationModal from "./LocationModal";
import type { LocationData } from "@/context/LocationContext";

const LocationModalManager = () => {
  const { hasShownModal, setHasShownModal, setUserLocation } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Show modal only if it hasn't been shown in this session
    if (!hasShownModal) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownModal]);

  const handleLocationChoice = (type: 'allow' | 'session' | 'deny', location?: LocationData) => {
    // Mark modal as shown for this session
    setHasShownModal(true);
    
    if (location && (type === 'allow' || type === 'session')) {
      // Set location with appropriate storage type
      const storageType = type === 'allow' ? 'localStorage' : 'sessionStorage';
      setUserLocation(location, storageType);
    }
    
    // Close modal
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    // Mark modal as shown even if closed without choosing
    setHasShownModal(true);
    setIsModalOpen(false);
  };

  return (
    <LocationModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onLocationChoice={handleLocationChoice}
    />
  );
};

export default LocationModalManager;