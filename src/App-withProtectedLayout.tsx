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

// Import the new protected admin layout
import { ProtectedAdminLayout } from "@/components/ProtectedAdminLayout";

// Import regular components (no need to protect these individually since the layout is protected)
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminOrders from "./pages/AdminOrders";
import AdminProductRequests from "./pages/AdminProductRequests";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
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
 * Alternative App Component Implementation - Layout-Level Protection
 * 
 * This approach maintains your existing nested routing structure but applies
 * the new Firestore-based admin protection at the layout level.
 * 
 * Key Benefits:
 * 1. Minimal changes to existing routing structure
 * 2. Single point of admin protection (at layout level)
 * 3. All nested admin routes automatically protected
 * 4. Maintains familiar routing patterns
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
                      Admin Routes - NEW SECURITY IMPLEMENTATION
                      
                      The ProtectedAdminLayout now handles all admin authentication:
                      1. Checks if user is authenticated with Firebase Auth
                      2. Fetches user document from Firestore 'users' collection  
                      3. Verifies user has role: 'admin'
                      4. Redirects unauthorized users appropriately
                      
                      All nested routes are automatically protected by the layout.
                      No need to protect individual admin components.
                    */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    <Route path="/admin" element={<ProtectedAdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<AdminProductForm />} />
                      <Route path="products/:id/edit" element={<AdminProductForm />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="requests" element={<AdminProductRequests />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                    
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
