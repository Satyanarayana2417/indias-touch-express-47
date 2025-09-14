import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, ShoppingCart, Menu, Grid3X3, Truck, Package, UtensilsCrossed, Sparkles, Info, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();
  const { currentUser } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Auth removed: no login/logout handling

  const handleLogoClick = () => {
    navigate('/', { state: { scrollToHero: true } });
    setIsDrawerOpen(false);
  };

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      id: 'categories',
      icon: Grid3X3,
      label: 'Categories',
      path: '/shop-products',
      isActive: location.pathname === '/shop-products' || location.pathname.includes('/food-items') || location.pathname.includes('/decorative-items')
    },
    {
      id: 'cart',
      icon: ShoppingCart,
      label: 'Cart',
      path: '/cart',
      isActive: location.pathname === '/cart',
      badge: totalItems > 0 ? totalItems : null
    },
    {
      id: 'profile',
      icon: User,
      label: currentUser ? 'Account' : 'Sign In',
      path: currentUser ? '/account' : '/login',
      isActive: location.pathname === '/account' || location.pathname === '/login'
    },
    {
      id: 'menu',
      icon: Menu,
      label: 'Menu',
      path: '#',
      isActive: false // Menu doesn't have an active state since it opens a drawer
    }
  ];

  const handleNavigation = (path: string, id: string) => {
    if (id === 'menu') {
      setIsDrawerOpen(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 relative ${
                  item.isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <IconComponent className="w-5 h-5" />
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
            <a 
              href="/" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setIsDrawerOpen(false);
              }}
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span>Home</span>
            </a>
            <a 
              href="/shop-products" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop-products');
                setIsDrawerOpen(false);
              }}
            >
              <Store className="h-5 w-5 text-gray-600" />
              <span>Shop Products</span>
            </a>
            <a 
              href="/courier-services" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/courier-services');
                setIsDrawerOpen(false);
              }}
            >
              <Truck className="h-5 w-5 text-gray-600" />
              <span>Courier Services</span>
            </a>
            <a 
              href="/track-order" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/track-order');
                setIsDrawerOpen(false);
              }}
            >
              <Package className="h-5 w-5 text-gray-600" />
              <span>Track Order</span>
            </a>
            <a 
              href="/food-items" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/food-items');
                setIsDrawerOpen(false);
              }}
            >
              <UtensilsCrossed className="h-5 w-5 text-gray-600" />
              <span>Food Items</span>
            </a>
            <a 
              href="/decorative-items" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/decorative-items');
                setIsDrawerOpen(false);
              }}
            >
              <Sparkles className="h-5 w-5 text-gray-600" />
              <span>Decorative Items</span>
            </a>
            <a 
              href="/about-us" 
              className="py-3 px-2 flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                navigate('/about-us');
                setIsDrawerOpen(false);
              }}
            >
              <Info className="h-5 w-5 text-gray-600" />
              <span>About Us</span>
            </a>
          </nav>
          <DrawerFooter>
            <div className="w-full space-y-2">
              {/* Auth buttons removed */}
              <Button 
                size="default" 
                className="w-full"
                onClick={() => setIsDrawerOpen(false)}
              >
                Get Quote
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileBottomNav;