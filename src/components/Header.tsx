import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-bold text-primary">
              Venkat Express
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for Indian food, spices, decorative items..."
                className="pl-4 pr-12 h-12 text-base rounded-full border-2 border-muted focus:border-primary transition-colors"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-10 px-4 bg-primary hover:bg-primary-hover rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-5 w-5 mr-2" />
              Account
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-secondary text-xs font-medium flex items-center justify-center text-secondary-foreground">
                0
              </span>
            </Button>
            <Button 
              size="sm" 
              className="hidden md:flex bg-gradient-gold text-primary font-medium hover:bg-secondary-hover shadow-gold rounded-full"
            >
              Get Quote
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu with Light Blue Background and Pill Buttons */}
        <nav className="hidden md:flex bg-blue-50 border-t py-4 space-x-3 rounded-b-lg">
          <a href="/shop-products" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            Shop Products
          </a>
          <a href="/courier-services" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            Courier Services
          </a>
          <a href="/track-order" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            Track Order
          </a>
          <a href="/food-items" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            Food Items
          </a>
          <a href="/decorative-items" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            Decorative Items
          </a>
          <a href="/about-us" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm">
            About Us
          </a>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden pb-3 pt-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-4 pr-12 h-10 border-2 border-muted focus:border-primary"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;