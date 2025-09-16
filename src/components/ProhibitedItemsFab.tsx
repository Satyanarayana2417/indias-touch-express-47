import { ShieldAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * Mobile-only floating action button that links to /prohibited-items
 * Features animated ripple waves for enhanced visual impact
 * Only visible in the hero section, hidden when scrolling past it
 */
const ProhibitedItemsFab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  // Hide the FAB on the prohibited items page itself
  if (location.pathname === "/prohibited-items") return null;

  // Show FAB only in hero section (typically first 500-600px of viewport height)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroSectionHeight = window.innerHeight * 0.8; // Approximate hero section height
      
      // Show FAB when in hero section, hide when scrolled past
      setIsVisible(scrollPosition < heroSectionHeight);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('FAB clicked - navigating to /prohibited-items');
    
    // Use window.location for more reliable navigation
    window.location.href = '/prohibited-items';
  };

  return (
    <>
      {/* Custom CSS for ripple animations */}
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes ripple-delayed {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          .ripple-wave {
            animation: ripple 2s infinite;
          }
          
          .ripple-wave-delayed {
            animation: ripple-delayed 2s infinite 1s;
          }
          
          .ripple-wave-slow {
            animation: ripple 3s infinite 0.5s;
          }
        `}
      </style>
      
      <div className={`md:hidden fixed z-[60] right-4 bottom-24 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {/* Animated Ripple Waves */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Wave 1 - Fast ripple */}
          <div className="absolute h-12 w-12 rounded-full border-2 border-red-500/70 ripple-wave"></div>
          {/* Wave 2 - Medium ripple */}
          <div className="absolute h-12 w-12 rounded-full border-2 border-red-500/50 ripple-wave-slow"></div>
          {/* Wave 3 - Delayed ripple */}
          <div className="absolute h-12 w-12 rounded-full border-2 border-red-400/40 ripple-wave-delayed"></div>
        </div>
        
        {/* Main Button */}
        <button
          onClick={handleClick}
          aria-label="View prohibited shipping items"
          className="relative h-12 w-12 rounded-full bg-red-600 text-white shadow-lg shadow-red-400/30 border border-red-500 flex items-center justify-center active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400/40 cursor-pointer hover:bg-red-700 hover:shadow-xl"
        >
          <ShieldAlert className="h-6 w-6" />
          <span className="sr-only">Prohibited Items</span>
        </button>
      </div>
    </>
  );
};

export default ProhibitedItemsFab;
