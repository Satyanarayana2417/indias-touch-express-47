import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import LocationModalManager from "@/components/LocationModalManager";
import UserProtectedRoute from "@/components/UserProtectedRoute";

// Import protected admin components using the new withAdminAuth HOC
import {
  ProtectedAdminDashboard,
  ProtectedAdminProducts,
  ProtectedAdminProductForm,
  ProtectedAdminOrders,
  ProtectedAdminProductRequests,
  ProtectedAdminUsers,
  ProtectedAdminSettings
} from "@/components/ProtectedAdminComponents";

// Import regular components
import Index from "./pages/Index";
import ShopProducts from "./pages/ShopProducts";
import ProductDetail from "./pages/ProductDetail";
import CourierServices from "./pages/CourierServices";
import TrackOrder from "./pages/TrackOrder";
import FoodItems from "./pages/FoodItems";
import DecorativeItems from "./pages/DecorativeItems";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import AccountOrders from "./pages/AccountOrders";
import AccountRequests from "./pages/AccountRequests";
import AccountProfile from "./pages/AccountProfile";
import AccountAddresses from "./pages/AccountAddresses";
import Help from "./pages/Help";
import ProhibitedItems from "./pages/ProhibitedItems";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentTestPage from "./pages/PaymentTestPage";

const queryClient = new QueryClient();

/**
 * Updated App Component with New Admin Route Protection
 * 
 * Key Changes:
 * 1. Removed AdminProtectedRoute wrapper and AdminLayout nesting
 * 2. Each admin route now uses individual protected components created with withAdminAuth HOC
 * 3. Admin routes are now direct routes that handle their own protection internally
 * 4. This provides more granular control and better security isolation
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <LocationProvider>
          <WishlistProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <LocationModalManager />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/shop-products" element={<ShopProducts />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/courier-services" element={<CourierServices />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/food-items" element={<FoodItems />} />
                    <Route path="/decorative-items" element={<DecorativeItems />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/prohibited-items" element={<ProhibitedItems />} />
                    <Route path="/payment-test" element={<PaymentTestPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Cart and Checkout - Protected Routes */}
                    <Route path="/cart" element={
                      <UserProtectedRoute>
                        <Cart />
                      </UserProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <UserProtectedRoute>
                        <Checkout />
                      </UserProtectedRoute>
                    } />
                    <Route path="/payment-success" element={
                      <UserProtectedRoute>
                        <PaymentSuccessPage />
                      </UserProtectedRoute>
                    } />
                    
                    {/* Search and Wishlist */}
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    
                    {/* Account Routes - Protected */}
                    <Route path="/account" element={
                      <UserProtectedRoute>
                        <Account />
                      </UserProtectedRoute>
                    } />
                    <Route path="/account/orders" element={
                      <UserProtectedRoute>
                        <AccountOrders />
                      </UserProtectedRoute>
                    } />
                    <Route path="/account/requests" element={
                      <UserProtectedRoute>
                        <AccountRequests />
                      </UserProtectedRoute>
                    } />
                    <Route path="/account/profile" element={
                      <UserProtectedRoute>
                        <AccountProfile />
                      </UserProtectedRoute>
                    } />
                    <Route path="/account/addresses" element={
                      <UserProtectedRoute>
                        <AccountAddresses />
                      </UserProtectedRoute>
                    } />
                    <Route path="/help" element={<Help />} />
                    
                    {/* 
                      Admin Routes - New Security Implementation
                      Each route uses individual protected components with withAdminAuth HOC
                      This ensures only authenticated users with role: 'admin' in Firestore can access these routes
                    */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Main Admin Dashboard */}
                    <Route path="/admin" element={<ProtectedAdminDashboard />} />
                    <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
                    
                    {/* Products Management */}
                    <Route path="/admin/products" element={<ProtectedAdminProducts />} />
                    <Route path="/admin/products/new" element={<ProtectedAdminProductForm />} />
                    <Route path="/admin/products/:id/edit" element={<ProtectedAdminProductForm />} />
                    
                    {/* Orders Management */}
                    <Route path="/admin/orders" element={<ProtectedAdminOrders />} />
                    
                    {/* Product Requests Management */}
                    <Route path="/admin/requests" element={<ProtectedAdminProductRequests />} />
                    
                    {/* Users Management */}
                    <Route path="/admin/users" element={<ProtectedAdminUsers />} />
                    
                    {/* Settings */}
                    <Route path="/admin/settings" element={<ProtectedAdminSettings />} />
                    
                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <MobileBottomNav />
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </WishlistProvider>
        </LocationProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
