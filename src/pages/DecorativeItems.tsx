import { useState } from "react";
import { Search, Filter, Star, ShoppingCart, Heart, Sparkles, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "@/hooks/use-toast";
import featuredImage from "@/assets/featured-products.jpg";

const DecorativeItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
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
      await addToWishlist(productId.toString());
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
                {/* Mobile Category Filter */}
                <div className="lg:hidden mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-start sm:items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-soft-gray" />
                      <Input
                        placeholder="Search decorative items..."
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <Select defaultValue="featured">
                    <SelectTrigger className="w-full sm:w-48">
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

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="group relative overflow-hidden border hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 space-y-1">
                            {product.badges.map((badge, idx) => (
                              <div key={idx} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold">
                                {badge}
                              </div>
                            ))}
                          </div>
                          
                          {/* Stock Status */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold">Out of Stock</span>
                            </div>
                          )}

                          {/* Wishlist Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-white/90 hover:bg-white text-soft-gray hover:text-red-500 transition-colors"
                            onClick={(e) => handleWishlistToggle(e, product.id)}
                          >
                            <Heart 
                              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-colors ${
                                isInWishlist(product.id.toString()) 
                                  ? 'text-red-500 fill-red-500' 
                                  : 'text-soft-gray hover:text-red-500'
                              }`} 
                            />
                          </Button>

                          {/* Quick Add to Cart */}
                          {product.inStock && (
                            <div className="absolute inset-x-1 bottom-1 sm:inset-x-2 sm:bottom-2 md:inset-x-3 md:bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <Button 
                                size="sm" 
                                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-[10px] sm:text-xs py-1 sm:py-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 sm:mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
                          <div>
                            <h3 className="font-semibold text-primary line-clamp-1 mb-1 text-xs sm:text-sm md:text-base">
                              {product.name}
                            </h3>
                            <p className="text-[10px] sm:text-xs md:text-sm text-soft-gray line-clamp-2 mb-1 sm:mb-2">
                              {product.description}
                            </p>
                            <p className="text-[9px] sm:text-xs md:text-sm text-secondary font-medium">
                              By {product.artisan}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="text-[8px] sm:text-[10px] md:text-xs bg-muted text-muted-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-secondary fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs md:text-sm text-soft-gray">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
                                {product.price}
                              </span>
                              <span className="text-[10px] sm:text-xs md:text-sm text-soft-gray line-through">
                                {product.originalPrice}
                              </span>
                            </div>
                            <span className="text-[8px] sm:text-[10px] md:text-xs bg-red-100 text-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-semibold">
                              Save {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8"
                  >
                    Explore More Crafts
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