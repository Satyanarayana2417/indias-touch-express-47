import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import LocationModalManager from "@/components/LocationModalManager";
import Index from "./pages/Index";
import ShopProducts from "./pages/ShopProducts";
import ProductDetail from "./pages/ProductDetail";
import CourierServices from "./pages/CourierServices";
import TrackOrder from "./pages/TrackOrder";
import FoodItems from "./pages/FoodItems";
import DecorativeItems from "./pages/DecorativeItems";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocationProvider>
        <WishlistProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LocationModalManager />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop-products" element={<ShopProducts />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/courier-services" element={<CourierServices />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/food-items" element={<FoodItems />} />
                  <Route path="/decorative-items" element={<DecorativeItems />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <MobileBottomNav />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </WishlistProvider>
      </LocationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
