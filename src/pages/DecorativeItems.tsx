import { useState } from "react";
import { Search, Filter, Star, ShoppingCart, Heart, Sparkles, Palette, Grid, List, ArrowLeft } from "lucide-react";
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

const DecorativeItems = () => {
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
        name: decorativeProducts.find(p => p.id === productId)?.name || '',
        price: decorativeProducts.find(p => p.id === productId)?.price || '',
        image: decorativeProducts.find(p => p.id === productId)?.image || '',
        originalPrice: decorativeProducts.find(p => p.id === productId)?.originalPrice,
        inStock: decorativeProducts.find(p => p.id === productId)?.inStock || false,
        rating: decorativeProducts.find(p => p.id === productId)?.rating || 0,
        reviews: decorativeProducts.find(p => p.id === productId)?.reviews || 0
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
    { id: "all", name: "All Decorative Items", count: 67 },
    { id: "brass", name: "Brass Items", count: 24 },
    { id: "textiles", name: "Textiles & Fabrics", count: 18 },
    { id: "pottery", name: "Pottery & Ceramics", count: 12 },
    { id: "woodcraft", name: "Wooden Crafts", count: 8 },
    { id: "jewelry", name: "Traditional Jewelry", count: 5 }
  ];

  const decorativeProducts = [
    {
      id: 301,
      name: "Handcrafted Brass Diya Set (12 pieces)",
      price: "₹2,939",
      originalPrice: "₹3,619",
      rating: 4.8,
      reviews: 167,
      image: featuredImage,
      badges: ["Handcrafted", "Festival Special"],
      description: "Beautiful set of 12 traditional brass oil lamps, perfect for Diwali, weddings, and spiritual ceremonies.",
      category: "brass",
      features: ["Pure brass", "Handcrafted", "Traditional design", "Set of 12"],
      artisan: "Craftsmen of Moradabad",
      inStock: true
    },
    {
      id: 302,
      name: "Kashmiri Pashmina Shawl",
      price: "₹7,579",
      originalPrice: "₹10,199",
      rating: 4.9,
      reviews: 89,
      image: featuredImage,
      badges: ["Authentic", "Luxury"],
      description: "Authentic Kashmiri pashmina shawl with intricate embroidery. Made from finest cashmere wool by master craftsmen.",
      category: "textiles",
      features: ["100% cashmere", "Hand embroidered", "Authentic Kashmiri", "Luxury quality"],
      artisan: "Kashmiri Weavers",
      inStock: true
    },
    {
      id: 303,
      name: "Blue Pottery Vase with Floral Design",
      price: "₹3,869",
      originalPrice: "₹4,719",
      rating: 4.7,
      reviews: 134,
      image: featuredImage,
      badges: ["Jaipur Craft", "Unique"],
      description: "Exquisite blue pottery vase featuring traditional Jaipur craftsmanship with beautiful floral motifs.",
      category: "pottery",
      features: ["Blue pottery", "Handpainted", "Jaipur craft", "Floral design"],
      artisan: "Jaipur Potters Guild",
      inStock: true
    },
    {
      id: 304,
      name: "Carved Wooden Elephant Pair",
      price: "₹5,729",
      originalPrice: "₹6,749",
      rating: 4.6,
      reviews: 92,
      image: featuredImage,
      badges: ["Hand Carved", "Rosewood"],
      description: "Intricately carved wooden elephant pair made from premium rosewood. Symbol of good luck and prosperity.",
      category: "woodcraft",
      features: ["Rosewood material", "Hand carved", "Traditional design", "Set of 2"],
      artisan: "Karnataka Wood Carvers",
      inStock: false
    },
    {
      id: 305,
      name: "Kundan Traditional Necklace Set",
      price: "₹10,529",
      originalPrice: "₹12,659",
      rating: 4.8,
      reviews: 76,
      image: featuredImage,
      badges: ["Traditional", "Bridal"],
      description: "Stunning Kundan necklace set with matching earrings. Perfect for weddings and special occasions.",
      category: "jewelry",
      features: ["Kundan stones", "Gold plated", "Matching earrings", "Bridal quality"],
      artisan: "Rajasthani Jewelers",
      inStock: true
    },
    {
      id: 306,
      name: "Mandala Wall Hanging Tapestry",
      price: "₹2,439",
      originalPrice: "₹3,039",
      rating: 4.5,
      reviews: 203,
      image: featuredImage,
      badges: ["Bohemian", "Cotton"],
      description: "Beautiful mandala design wall tapestry made from premium cotton. Perfect for home decor and meditation spaces.",
      category: "textiles",
      features: ["100% cotton", "Mandala design", "Bohemian style", "Wall hanging"],
      artisan: "Rajasthani Textile Artists",
      inStock: true
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? decorativeProducts 
    : decorativeProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Back Button */}
      <div className="container mx-auto px-4 pt-4 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Handcrafted Decorative Items
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Discover exquisite handcrafted decorative items that showcase India's rich artistic heritage. 
              From brass artifacts to traditional textiles, each piece tells a story of craftsmanship.
            </p>
          </div>
        </section>

        {/* Art Heritage Showcase */}
        <section className="py-12 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Handcrafted</h3>
                <p className="text-sm text-soft-gray">Made by skilled artisans</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Palette className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Traditional Art</h3>
                <p className="text-sm text-soft-gray">Authentic Indian crafts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Unique Pieces</h3>
                <p className="text-sm text-soft-gray">One-of-a-kind items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-3">
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary">Cultural Heritage</h3>
                <p className="text-sm text-soft-gray">Preserving traditions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block lg:w-64 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-primary mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
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
                    <h3 className="font-semibold text-primary mb-4">Featured Artisans</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Moradabad Brass</p>
                        <p className="text-xs text-soft-gray">Master craftsmen since 1850</p>
                      </div>
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Kashmiri Weavers</p>
                        <p className="text-xs text-soft-gray">Authentic pashmina artisans</p>
                      </div>
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Jaipur Blue Pottery</p>
                        <p className="text-xs text-soft-gray">Traditional ceramic art</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Mobile Filters */}
                <div className="lg:hidden mb-6">
                  <div className="flex gap-4 items-center">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Filter className="h-4 w-4 mr-2" />
                          Categories
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle>Filter Products</SheetTitle>
                          <SheetDescription>
                            Choose categories to filter decorative items
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
                                <p className="text-xs text-red-500">20% off handcrafted items</p>
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
                        <SelectItem value="newest">Newest Arrivals</SelectItem>
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

        {/* Artisan Stories */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">
              Supporting Indian Artisans
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-12">
              Every purchase directly supports skilled craftsmen and women across India, 
              helping preserve traditional arts and providing sustainable livelihoods.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                <p className="text-primary-foreground/80">Artisans Supported</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">15</div>
                <p className="text-primary-foreground/80">Traditional Crafts</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">12</div>
                <p className="text-primary-foreground/80">Indian States</p>
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

export default DecorativeItems;