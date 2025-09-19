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
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import UserProtectedRoute from "@/components/UserProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
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
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }>
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
