import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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

const ShopProducts = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Mock products data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Premium Basmati Rice (5kg)",
      price: 1999,
      originalPrice: 2399,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
      rating: 4.5,
      reviews: 128,
      category: "grains",
      inStock: true,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Organic Turmeric Powder (500g)",
      price: 1429,
      originalPrice: 1689,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500",
      rating: 4.7,
      reviews: 95,
      category: "spices",
      inStock: true,
      badge: "Organic"
    },
    {
      id: 3,
      name: "Green Cardamom Pods (100g)",
      price: 2779,
      originalPrice: 3289,
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=500",
      rating: 4.6,
      reviews: 67,
      category: "spices",
      inStock: true,
      badge: "Premium"
    },
    {
      id: 4,
      name: "Toor Dal (Split Pigeon Peas) - 2kg",
      price: 1099,
      originalPrice: 1349,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      rating: 4.4,
      reviews: 42,
      category: "grains",
      inStock: true,
      badge: "Protein Rich"
    },
    {
      id: 5,
      name: "Assorted Mithai Box",
      price: 1299,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1599785209773-8b2f48444053?w=500",
      rating: 4.8,
      reviews: 156,
      category: "sweets",
      inStock: false
    },
    {
      id: 6,
      name: "Homemade Mango Pickle",
      price: 249,
      image: "https://images.unsplash.com/photo-1596040033229-a5b48b654d59?w=500",
      rating: 4.3,
      reviews: 89,
      category: "pickles",
      inStock: true
    },
    {
      id: 7,
      name: "Kashmiri Red Chili Powder",
      price: 399,
      originalPrice: 449,
      image: "https://images.unsplash.com/photo-1583497491093-05802c5a2e40?w=500",
      rating: 4.6,
      reviews: 73,
      category: "spices",
      inStock: true
    },
    {
      id: 8,
      name: "Copper Water Bottle",
      price: 1199,
      originalPrice: 1399,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      rating: 4.2,
      reviews: 34,
      category: "kitchen",
      inStock: true
    }
  ];

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
            <ProductGrid
              products={filteredProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isInWishlist={isInWishlist}
            />
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