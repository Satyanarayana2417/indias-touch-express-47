import { useState } from "react";
import { Search, Filter, Star, ShoppingCart, Heart, Leaf, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import featuredImage from "@/assets/featured-products.jpg";

const FoodItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addItem(product.id, product.name, product.price, product.image);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    // Navigate to cart page after adding item
    navigate('/cart');
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
      image: featuredImage,
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
      price: "$16.99",
      originalPrice: "$19.99",
      rating: 4.9,
      reviews: 342,
      image: featuredImage,
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
      price: "$32.99",
      originalPrice: "$38.99",
      rating: 4.7,
      reviews: 189,
      image: featuredImage,
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
      price: "$12.99",
      originalPrice: "$15.99",
      rating: 4.6,
      reviews: 124,
      image: featuredImage,
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
      price: "$18.99",
      originalPrice: "$22.99",
      rating: 4.8,
      reviews: 203,
      image: featuredImage,
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
      price: "$14.99",
      originalPrice: "$17.99",
      rating: 4.9,
      reviews: 298,
      image: featuredImage,
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
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Authentic Indian Food Items
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              From aromatic spices to premium grains, discover the finest selection of 
              authentic Indian food products, sourced directly from trusted farmers and producers.
            </p>
          </div>
        </section>

        {/* Categories & Trust Badges */}
        <section className="py-12 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              {/* Sidebar */}
              <aside className="lg:w-64 space-y-6">
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
                    <h3 className="font-semibold text-primary mb-4">Special Offers</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Free Shipping</p>
                        <p className="text-xs text-soft-gray">On orders over $50</p>
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
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-soft-gray" />
                      <Input
                        placeholder="Search food items..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48">
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

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 space-y-1">
                            {product.badges.map((badge, idx) => (
                              <div key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">
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
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-soft-gray hover:text-red-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>

                          {/* Quick Add to Cart */}
                          {product.inStock && (
                            <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <Button 
                                size="sm" 
                                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-primary line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-soft-gray line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <p className="text-xs text-secondary font-medium">
                              Origin: {product.origin}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
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
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-secondary fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-soft-gray">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-primary">
                                {product.price}
                              </span>
                              <span className="text-sm text-soft-gray line-through">
                                {product.originalPrice}
                              </span>
                            </div>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
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
                    Load More Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FoodItems;