import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllProducts, subscribeToProducts, searchProductsAdvanced, Product as FirebaseProduct } from "@/lib/products";
import RealtimeImageSync from "@/lib/realtimeImageSync";
import featuredImage from "@/assets/featured-products.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  badge?: string;
}

// Convert Firebase Product to local Product interface for compatibility
const convertFirebaseProduct = (fbProduct: FirebaseProduct): Product => ({
  id: parseInt(fbProduct.id || '0'),
  name: fbProduct.name,
  price: parseFloat(fbProduct.price.replace(/[^\d.]/g, '') || '0'),
  originalPrice: fbProduct.originalPrice ? parseFloat(fbProduct.originalPrice.replace(/[^\d.]/g, '') || '0') : undefined,
  image: fbProduct.image,
  rating: fbProduct.rating || 0,
  reviews: fbProduct.reviews || 0,
  category: fbProduct.category,
  badge: fbProduct.badge,
  inStock: fbProduct.inStock
});

const ShopProducts = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Load products from Firebase with real-time sync
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Get products from Firebase
        const firebaseProducts = await getAllProducts();
        
        if (firebaseProducts.length > 0) {
          // Convert Firebase products to local format
          const convertedProducts = firebaseProducts.map(convertFirebaseProduct);
          setAllProducts(convertedProducts);
        } else {
          // No products found - show empty state
          setAllProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadProducts();

    // Set up real-time listener for all products
    const unsubscribe = RealtimeImageSync.listenForProductChanges((firebaseProducts) => {
      console.log('🛍️ Shop products updated in real-time');
      if (firebaseProducts.length > 0) {
        const convertedProducts = firebaseProducts.map(convertFirebaseProduct);
        setAllProducts(convertedProducts);
      } else {
        setAllProducts([]);
      }
      setLoading(false);
    });

    // Listen for force refresh events
    const handleForceRefresh = () => {
      console.log('🔄 Force refreshing shop products');
      loadProducts();
    };

    const handleImageUploaded = () => {
      console.log('📸 Image uploaded, refreshing shop products');
      setTimeout(loadProducts, 1000); // Small delay to ensure Firebase sync
    };

    window.addEventListener('forceProductRefresh', handleForceRefresh);
    window.addEventListener('imageUploaded', handleImageUploaded);
    window.addEventListener('productSaved', handleImageUploaded);

    // Register listener for cleanup
    RealtimeImageSync.registerListener('shopProducts', unsubscribe);

    return () => {
      unsubscribe();
      window.removeEventListener('forceProductRefresh', handleForceRefresh);
      window.removeEventListener('imageUploaded', handleImageUploaded);
      window.removeEventListener('productSaved', handleImageUploaded);
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [allProducts, selectedCategory, priceRange, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(String(product.id), product.name, product.price, product.image);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    navigate('/cart');
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId.toString())) {
      await removeFromWishlist(productId.toString());
    } else {
      addToWishlist({
        id: productId.toString(),
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        originalPrice: product.originalPrice?.toString(),
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 20000]);
    setSearchQuery("");
    setSortBy("relevance");
  };

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Mobile Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop Products</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover authentic Indian products delivered worldwide
          </p>
        </div>

        {/* Main Content */}
        <div className="lg:flex lg:gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            isFilterOpen={isFilterOpen}
            onFilterToggle={setIsFilterOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1 mt-4 lg:mt-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={isInWishlist}
              />
            )}
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default ShopProducts;
