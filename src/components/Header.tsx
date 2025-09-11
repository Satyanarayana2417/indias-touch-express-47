import { Search, User, ShoppingCart, Menu, MapPin, Package, ChevronDown, Globe, Heart, Home, Store, Truck, UtensilsCrossed, Sparkles, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";

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
  const navigate = useNavigate();
  const location = useLocation();
  
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
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="container mx-auto px-4 pt-4">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between h-12">
            {/* Drawer / Hamburger */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle 
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={handleLogoClick}
                  >
                    Venkat Express
                  </DrawerTitle>
                </DrawerHeader>
                <nav className="flex flex-col divide-y py-2 text-base">
                  <a href="/" className="py-3 px-2 flex items-center space-x-3">
                    <Home className="h-5 w-5 text-gray-600" />
                    <span>Home</span>
                  </a>
                  <a href="/shop-products" className="py-3 px-2 flex items-center space-x-3">
                    <Store className="h-5 w-5 text-gray-600" />
                    <span>Shop Products</span>
                  </a>
                  <a href="/courier-services" className="py-3 px-2 flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <span>Courier Services</span>
                  </a>
                  <a href="/track-order" className="py-3 px-2 flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span>Track Order</span>
                  </a>
                  <a href="/food-items" className="py-3 px-2 flex items-center space-x-3">
                    <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                    <span>Food Items</span>
                  </a>
                  <a href="/decorative-items" className="py-3 px-2 flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-gray-600" />
                    <span>Decorative Items</span>
                  </a>
                  <a href="/about-us" className="py-3 px-2 flex items-center space-x-3">
                    <Info className="h-5 w-5 text-gray-600" />
                    <span>About Us</span>
                  </a>
                </nav>
                <DrawerFooter>
                  <div className="w-full">
                    <Button size="default" className="w-full">Get Quote</Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Logo */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
                <WalmartSpark className="h-8 w-8 text-yellow-500 hover:text-yellow-600 transition-colors" />
                <div className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors border border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">Venkat Express</span>
                    <span className="text-xs text-gray-500 leading-tight">Global Shipping</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                aria-label="View cart"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs font-medium flex items-center justify-center text-white">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search (compact) */}
          <div className="pb-2 pt-2">
            <div className="px-2">
              <SearchBar
                placeholder="Search products"
                isMobile={true}
              />
            </div>
          </div>

          {/* Category Filters - Mobile only (horizontal pill scroll) */}
          <div className="pb-3">
            <div className="overflow-x-auto px-2">
              <div className="flex space-x-3 items-center py-2">
                <a href="/shop-products" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border">Shop Products</a>
                <a href="/courier-services" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border">Courier Services</a>
                <a href="/new-arrivals" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border">New Arrivals</a>
                <a href="/food-items" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border">Food Items</a>
                <a href="/decorative-items" className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border">Decorative Items</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header - Walmart Style */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between h-20 border-b border-gray-100">
            {/* Left Section: Interactive Brand Component + Location */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-8">
                <WalmartSpark className="h-10 w-10 text-yellow-500 cursor-pointer hover:text-yellow-600 transition-colors" onClick={handleLogoClick} />
                {/* New Interactive Brand Component */}
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full flex items-center space-x-4 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200 min-w-[250px] h-12">
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-sm font-bold text-gray-700 leading-tight">Shipping From:</span>
                    <span className="text-xs text-gray-500 leading-tight truncate">Hyderabad, Telangana • India</span>
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
              <a href="/track-order" className="flex flex-col items-center text-xs hover:text-primary transition-colors">
                <Package className="h-5 w-5 mb-1" />
                <span>Track Order</span>
              </a>
              
              <a href="/wishlist" className="flex flex-col items-center text-xs hover:text-primary transition-colors">
                <Heart className="h-5 w-5 mb-1" />
                <span>Wishlist</span>
              </a>
              
              <a href="/account" className="flex flex-col items-center text-xs hover:text-primary transition-colors">
                <User className="h-5 w-5 mb-1" />
                <span>Sign In & Account</span>
              </a>
              
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
          <div className="bg-gray-50 py-2">
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
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;