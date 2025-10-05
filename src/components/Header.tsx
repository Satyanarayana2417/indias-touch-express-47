import { Search, User, ShoppingCart, MapPin, Package, ChevronDown, Globe, Heart, UtensilsCrossed, Sparkles, Truck, Menu, Mic, ShieldAlert } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLocation as useUserLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "@/components/SearchBar";
import AddressModal from "@/components/AddressModal";

// Function to scroll to hero section
const scrollToHero = () => {
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Fallback: scroll to top if hero section not found
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Walmart-style star icon component
const WalmartSpark = ({ className = "h-4 w-4", onClick }: { className?: string; onClick?: () => void }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" onClick={onClick}>
    <path d="M12 2L14.5 8.5L22 8.5L16.5 13.5L19 20L12 16L5 20L7.5 13.5L2 8.5L9.5 8.5L12 2Z" />
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="20" cy="12" r="1.5" />
    <circle cx="6.5" cy="6.5" r="1" />
    <circle cx="17.5" cy="6.5" r="1" />
    <circle cx="6.5" cy="17.5" r="1" />
    <circle cx="17.5" cy="17.5" r="1" />
  </svg>
);

const Header = () => {
  const { getTotalItems, getTotalPrice } = useCart();
  // Wishlist context exposes 'items' not 'wishlist'
  const { items: wishlistItems } = useWishlist();
  // Get auth context for profile icon
  const { currentUser } = useAuth();
  // Adapt to current LocationContext which exposes selectedLocation & deliveryAddress
  const { selectedLocation, deliveryAddress, userLocation } = useUserLocation();
  const isLocationSet = !!(selectedLocation || deliveryAddress);
  // Prefer area/city + pincode if available
  const displayLocation = (() => {
    if (userLocation) {
      // If city string already includes area (e.g. "Ramanthapur, Hyderabad") keep it
      const base = userLocation.city;
      if (userLocation.pincode) return `${base}, ${userLocation.pincode}`;
      return base;
    }
    return deliveryAddress || selectedLocation;
  })();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll state for hiding/showing quick nav
  const [isQuickNavVisible, setIsQuickNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsQuickNavVisible(false);
      } else {
        // Scrolling up or at top
        setIsQuickNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  // Removed auth button click handler since login/account pages removed
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Logo click handler - navigate to homepage and scroll to hero
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll to hero section
      scrollToHero();
    } else {
      // If on other pages, navigate to homepage with scroll instruction
      navigate('/', { state: { scrollToHero: true } });
    }
  };

  return (
    <>
    {/* Mobile Header - Walmart Style */}
    <div className="md:hidden bg-[#0071ce] shadow-sm w-full">
      {/* Main Header Bar */}
      <div className="bg-[#0071ce] px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Replaced menu + star icon with combined brand logo for mobile */}
          <button onClick={handleLogoClick} className="flex items-center flex-shrink-0 focus:outline-none" aria-label="Venkat Express Home">
            <img
              src="/venkat-express-logo.png"
              alt="Venkat Express"
              className="h-10 w-auto object-contain drop-shadow-sm"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Try fallback to original filename with spaces if user placed it without renaming
                if (!img.dataset.fallbackTried) {
                  img.dataset.fallbackTried = 'true';
                  img.src = 'https://i.ibb.co/TDVkGrfG/IMG-20250916-WA0024.webp';
                } else {
                  // Final fallback: show text if image still missing
                  img.replaceWith(Object.assign(document.createElement('span'), { 
                    innerText: 'Venkat Express', 
                    className: 'text-white font-semibold text-lg' 
                  }));
                }
              }}
            />
          </button>

          {/* Search Bar - Takes remaining space */}
          <div className="flex-1">
            <SearchBar
              placeholder="search venkat express"
              isMobile={true}
            />
          </div>

          {/* Right Section - Mic Icon */}
          <button 
            className="relative text-white p-1 flex-shrink-0"
          >
            <Mic className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Location/Delivery Bar */}
      <div className="bg-[#0071ce] px-4 py-2 border-t border-[#0066cc]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Pickup or delivery toggle */}
            <div className="flex items-center space-x-2 text-white">
              <Truck className="h-4 w-4" />
              <span className="text-sm font-medium">Pickup or delivery?</span>
            </div>
          </div>
          
          {/* Location */}
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center space-x-1 text-white"
          >
            <span className="text-sm font-medium max-w-[120px] inline-block truncate">
              {isLocationSet ? (displayLocation || 'Location') : 'Sacramento, 95829'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Filters - Mobile Horizontal Scroll */}
      <div className="bg-white px-4 py-3 border-t border-gray-100">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 items-center">
            <a href="/shop-products" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">Shop Products</a>
            <a href="/courier-services" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">Courier Services</a>
            <a href="/food-items" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">Food Items</a>
            <a href="/decorative-items" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">Decorative Items</a>
            <a href="/track-order" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">Track Order</a>
            <a href="/about-us" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50">About Us</a>
          </div>
        </div>
      </div>
    </div>

    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      {/* Mobile Header - Hidden since content moved above */}
      <div className="md:hidden hidden">
      </div>

      {/* Desktop Header - Walmart Style */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between h-20 border-b border-gray-100">
            {/* Left Section: Interactive Brand Component + Location */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-8">
                {/* Replaced star icon with branded logo */}
                <button onClick={handleLogoClick} className="flex items-center focus:outline-none" aria-label="Venkat Express Home">
                  <img
                    src="https://i.ibb.co/Lzj866ZR/IMG-20250916-103734-1.webp"
                    alt="Venkat Express"
                    className="h-14 w-auto object-contain drop-shadow-sm"
                    decoding="async"
                    loading="lazy"
                  />
                </button>
                {/* New Interactive Brand Component */}
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full flex items-center space-x-4 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200 min-w-[250px] h-12">
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-sm font-bold text-gray-700 leading-tight">
                      {isLocationSet ? 'Your Location:' : 'Shipping From:'}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight truncate" title={isLocationSet ? (displayLocation || deliveryAddress || selectedLocation) : 'Hyderabad, Telangana • India'}>
                      {isLocationSet ? (displayLocation || deliveryAddress || selectedLocation) : 'Hyderabad, Telangana • India'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Middle Section: Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <SearchBar
                placeholder="Search for Indian food, spices, decorative items..."
                isMobile={false}
              />
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center space-x-10">
              <button 
                onClick={() => navigate('/track-order')} 
                className="flex flex-col items-center text-xs hover:text-primary transition-colors"
              >
                <Package className="h-5 w-5 mb-1" />
                <span>Track Order</span>
              </button>
              
              <button 
                onClick={() => navigate('/wishlist')} 
                className="flex flex-col items-center text-xs hover:text-primary transition-colors relative"
              >
                <div className="relative">
                  <Heart className="h-5 w-5 mb-1" />
                  {Array.isArray(wishlistItems) && wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </button>
              
              {/* Profile Icon */}
              <button 
                onClick={() => currentUser ? navigate('/account') : navigate('/login')} 
                className="flex flex-col items-center text-xs hover:text-primary transition-colors"
              >
                <User className="h-5 w-5 mb-1" />
                <span>{currentUser ? 'Account' : 'Sign In'}</span>
              </button>
              
              <button 
                onClick={() => navigate('/cart')}
                className="flex flex-col items-center text-xs hover:text-primary transition-colors"
              >
                <div className="relative mb-1">
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs font-medium flex items-center justify-center text-white">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium">{formatPrice(getTotalPrice())}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Secondary Navigation Bar */}
          <div className="bg-white py-2">
            <nav className="flex items-center space-x-3">
              <a 
                href="/shop-products" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                Shop Products
              </a>
              <a 
                href="/courier-services" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                Courier Services
              </a>
              <a 
                href="/track-order" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                Track Order
              </a>
              <a 
                href="/food-items" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                Food Items
              </a>
              <a 
                href="/decorative-items" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                Decorative Items
              </a>
              <a 
                href="/about-us" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
              >
                About Us
              </a>
              <a 
                href="/prohibited-items" 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-primary hover:shadow-md transition-all duration-200 shadow-sm border border-gray-100"
                aria-label="View list of prohibited items for international shipping"
              >
                Prohibited Items
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
    
    {/* Address Modal - Mobile Only */}
    <AddressModal
      isOpen={isAddressModalOpen}
      onClose={() => setIsAddressModalOpen(false)}
      onAddressSelect={(address) => {
        console.log('Selected address:', address);
        // Address selection is handled inside the modal
      }}
    />
    </>
  );
};

export default Header;