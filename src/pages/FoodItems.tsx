import { useState } from "react";
import { Search, Filter, Star, ShoppingCart, Heart, Leaf, Award, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "@/hooks/use-toast";
import featuredImage from "@/assets/featured-products.jpg";

const FoodItems = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addItem(String(product.id), product.name, product.price, product.image);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    // Navigate to cart page after adding item
    navigate('/cart');
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isInWishlist(productId.toString())) {
      await removeFromWishlist(productId.toString());
    } else {
      await addToWishlist({
        id: productId.toString(),
        name: foodProducts.find(p => p.id === productId)?.name || '',
        price: foodProducts.find(p => p.id === productId)?.price || '',
        image: foodProducts.find(p => p.id === productId)?.image || '',
        originalPrice: foodProducts.find(p => p.id === productId)?.originalPrice,
        inStock: foodProducts.find(p => p.id === productId)?.inStock || false,
        rating: foodProducts.find(p => p.id === productId)?.rating || 0,
        reviews: foodProducts.find(p => p.id === productId)?.reviews || 0
      });
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    toast({
      title: "Welcome!",
      description: "You can now save items to your wishlist.",
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const categories = [
    { id: "all", name: "All Food Items", count: 89 },
    { id: "spices", name: "Spices & Masala", count: 32 },
    { id: "rice-grains", name: "Rice & Grains", count: 18 },
    { id: "lentils", name: "Lentils & Pulses", count: 15 },
    { id: "oils-ghee", name: "Oils & Ghee", count: 12 },
    { id: "ready-to-eat", name: "Ready to Eat", count: 8 },
    { id: "snacks", name: "Snacks & Sweets", count: 4 }
  ];

  const foodProducts = [
    {
      id: 201,
      name: "Premium Basmati Rice (5kg)",
      price: "₹1,999",
      originalPrice: "₹2,399",
      rating: 4.8,
      reviews: 256,
      image: "https://t4.ftcdn.net/jpg/03/09/22/29/360_F_309222978_boIWb07TufCqJ8al1keo6nnXASPsXPsy.jpg",
      badges: ["Best Seller", "Premium Quality"],
      description: "Long-grain aromatic basmati rice from the foothills of the Himalayas. Perfect for biryanis, pilafs, and everyday meals.",
      category: "rice-grains",
      features: ["Aged 2+ years", "Extra long grains", "Authentic aroma", "Gluten-free"],
      origin: "Punjab, India",
      inStock: true
    },
    {
      id: 202,
      name: "Organic Turmeric Powder (500g)",
      price: "₹1,429",
      originalPrice: "₹1,689",
      rating: 4.9,
      reviews: 342,
      image: "https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg?s=612x612&w=0&k=20&c=f7q7ZkG-xp4ya1lLimbtdGj1hO5jafG46KEO3cRSsIA=",
      badges: ["Organic", "High Curcumin"],
      description: "Pure organic turmeric powder with high curcumin content. Known for its anti-inflammatory and healing properties.",
      category: "spices",
      features: ["Certified organic", "High curcumin", "No additives", "Lab tested"],
      origin: "Tamil Nadu, India",
      inStock: true
    },
    {
      id: 203,
      name: "Green Cardamom Pods (100g)",
      price: "₹2,779",
      originalPrice: "₹3,289",
      rating: 4.7,
      reviews: 189,
      image: "https://5.imimg.com/data5/SELLER/Default/2025/5/512396103/VE/VK/UI/31383306/-ceylon-cardamum-elettaria-cardamomum-500x500.jpg",
      badges: ["Premium", "Hand Picked"],
      description: "Finest quality green cardamom pods from the Western Ghats. Essential for authentic Indian sweets and chai.",
      category: "spices",
      features: ["Hand picked", "Bold aroma", "Premium grade", "Whole pods"],
      origin: "Kerala, India",
      inStock: true
    },
    {
      id: 204,
      name: "Toor Dal (Split Pigeon Peas) - 2kg",
      price: "₹1,099",
      originalPrice: "₹1,349",
      rating: 4.6,
      reviews: 124,
      image: "https://www.shutterstock.com/image-photo/toor-dal-split-yellow-lentils-600nw-2432623487.jpg",
      badges: ["Protein Rich", "Natural"],
      description: "High-quality toor dal, rich in protein and fiber. Perfect for making sambhar, dal curry, and other traditional dishes.",
      category: "lentils",
      features: ["High protein", "Rich in fiber", "No preservatives", "Machine cleaned"],
      origin: "Karnataka, India",
      inStock: true
    },
    {
      id: 205,
      name: "Cold Pressed Coconut Oil (500ml)",
      price: "₹1,599",
      originalPrice: "₹1,939",
      rating: 4.8,
      reviews: 203,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnTMJuzjw-UZd6lX-TpM8pKEhoPUp1_3zFQ&s",
      badges: ["Cold Pressed", "Virgin"],
      description: "Pure virgin coconut oil, cold-pressed to retain all natural nutrients. Perfect for cooking and traditional remedies.",
      category: "oils-ghee",
      features: ["Cold pressed", "Virgin quality", "No chemicals", "Traditional method"],
      origin: "Kerala, India",
      inStock: false
    },
    {
      id: 206,
      name: "Garam Masala Blend (200g)",
      price: "₹1,259",
      originalPrice: "₹1,519",
      rating: 4.9,
      reviews: 298,
      image: "https://thumbs.dreamstime.com/b/garam-masala-powder-white-bowl-isolated-bowl-garam-masala-powder-isolated-white-background-showcasing-its-rich-368394503.jpg",
      badges: ["Traditional Recipe", "Aromatic"],
      description: "Authentic garam masala blend made from 12 premium spices. Adds warmth and depth to curries and rice dishes.",
      category: "spices",
      features: ["12 spice blend", "Traditional recipe", "Freshly ground", "Aromatic"],
      origin: "Rajasthan, India",
      inStock: true
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? foodProducts 
    : foodProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-5xl font-serif font-bold mb-3 md:mb-6">
              Authentic Indian Food Items
            </h1>
            <p className="text-sm md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              From aromatic spices to premium grains, discover the finest selection of 
              authentic Indian food products, sourced directly from trusted farmers and producers.
            </p>
          </div>
        </section>

        {/* Categories & Trust Badges */}
        <section className="py-12 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Leaf className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">100% Natural</h3>
                <p className="text-sm text-soft-gray">No artificial preservatives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Premium Quality</h3>
                <p className="text-sm text-soft-gray">Handpicked and tested</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Fresh Delivery</h3>
                <p className="text-sm text-soft-gray">Packed fresh, delivered fast</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Authentic Taste</h3>
                <p className="text-sm text-soft-gray">Traditional flavors preserved</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Hidden on mobile, shown on larger screens */}
              <aside className="hidden lg:block lg:w-64 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-primary mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-secondary text-secondary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-xs text-soft-gray">({category.count})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-primary mb-4">Special Offers</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Free Shipping</p>
                        <p className="text-xs text-soft-gray">On orders over ₹4,000</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-600">Limited Time</p>
                        <p className="text-xs text-red-500">20% off spice bundles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-soft-gray" />
                      <Input
                        placeholder="Search food items..."
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    
                    {/* Mobile Filter Sheet */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden relative">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                          {selectedCategory !== "all" && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto">
                        <SheetHeader className="border-b pb-4">
                          <SheetTitle className="text-left">Filters</SheetTitle>
                          <SheetDescription className="text-left">
                            Filter food items by category
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="mt-6 space-y-6 pb-6">
                          {/* Categories */}
                          <div>
                            <h3 className="font-semibold text-primary mb-4 flex items-center justify-between">
                              Categories
                              {selectedCategory !== "all" && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  1 Selected
                                </span>
                              )}
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {categories.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => {
                                    setSelectedCategory(category.id);
                                    setTimeout(() => setIsFilterOpen(false), 150);
                                  }}
                                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                                    selectedCategory === category.id
                                      ? 'bg-primary text-primary-foreground shadow-sm'
                                      : 'hover:bg-muted border border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{category.name}</span>
                                    <span className={`text-xs ${
                                      selectedCategory === category.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>
                                      ({category.count})
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Special Offers in Filter */}
                          <div>
                            <h3 className="font-semibold text-primary mb-4">Special Offers</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-secondary/10 rounded-lg">
                                <p className="text-sm font-medium text-primary">Free Shipping</p>
                                <p className="text-xs text-soft-gray">On orders over ₹4,000</p>
                              </div>
                              <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm font-medium text-red-600">Limited Time</p>
                                <p className="text-xs text-red-500">20% off spice bundles</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="border-t pt-4 space-y-4">
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setSelectedCategory("all");
                              }}
                            >
                              Clear All
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={() => setIsFilterOpen(false)}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <Select defaultValue="featured">
                      <SelectTrigger className="w-36 sm:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Count and View Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-600">
                    Showing {filteredProducts.length} products
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className={`group cursor-pointer ${
                        viewMode === 'list' ? 'flex flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4' : ''
                      }`}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="relative overflow-hidden bg-gray-50">
                            <button 
                              className="absolute top-2 left-2 p-1 sm:p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
                              onClick={(e) => handleWishlistToggle(e, product.id)}
                            >
                              <Heart 
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                                  isInWishlist(product.id.toString()) 
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                                }`} 
                              />
                            </button>
                            {/* Badges */}
                            {product.badges && product.badges.length > 0 && (
                              <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold z-10">
                                {product.badges[0]}
                              </div>
                            )}
                            {/* Stock Status */}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                <span className="text-white font-semibold text-sm">Out of Stock</span>
                              </div>
                            )}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 sm:h-40 md:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-2 sm:p-3">
                            <div className="mb-2">
                              <span className="text-sm sm:text-lg font-bold text-gray-900">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                            <h3 className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-2 sm:mb-3 leading-tight">
                              {product.name}
                            </h3>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs sm:text-sm py-1.5 sm:py-2 transition-all duration-200"
                              variant="outline"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              {product.inStock ? 'Add' : 'Out of Stock'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <>
                          <div className="relative w-32 h-32 flex-shrink-0 mr-4 bg-gray-50 rounded-lg overflow-hidden">
                            <button 
                              className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
                              onClick={(e) => handleWishlistToggle(e, product.id)}
                            >
                              <Heart 
                                className={`w-4 h-4 transition-colors ${
                                  isInWishlist(product.id.toString()) 
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                                }`} 
                              />
                            </button>
                            {/* Badges */}
                            {product.badges && product.badges.length > 0 && (
                              <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold z-10">
                                {product.badges[0]}
                              </div>
                            )}
                            {/* Stock Status */}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                <span className="text-white font-semibold text-sm">Out of Stock</span>
                              </div>
                            )}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base text-gray-700 line-clamp-2 mb-4 leading-tight">
                              {product.name}
                            </h3>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm py-2 px-6 transition-all duration-200"
                              variant="outline"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8"
                  >
                    Load More Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default FoodItems;