import { useState } from "react";
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import featuredImage from "@/assets/featured-products.jpg";

const ShopProducts = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Products", count: 156 },
    { id: "spices", name: "Spices & Seasonings", count: 45 },
    { id: "grains", name: "Rice & Grains", count: 28 },
    { id: "snacks", name: "Snacks & Sweets", count: 32 },
    { id: "oils", name: "Oils & Ghee", count: 18 },
    { id: "ready-to-eat", name: "Ready to Eat", count: 23 },
    { id: "beverages", name: "Tea & Beverages", count: 10 }
  ];

  const products = [
    {
      id: 1,
      name: "Premium Basmati Rice (5kg)",
      price: "$24.99",
      originalPrice: "$29.99",
      rating: 4.8,
      reviews: 156,
      image: featuredImage,
      badge: "Best Seller",
      description: "Authentic long-grain basmati rice from the foothills of Himalayas. Perfect for biryanis and pilafs.",
      category: "grains",
      inStock: true
    },
    {
      id: 2,
      name: "Organic Turmeric Powder (500g)",
      price: "$16.99",
      originalPrice: "$19.99",
      rating: 4.9,
      reviews: 234,
      image: featuredImage,
      badge: "Organic",
      description: "Pure, organic turmeric powder with high curcumin content. Sourced directly from Indian farms.",
      category: "spices",
      inStock: true
    },
    {
      id: 3,
      name: "Cardamom Pods (100g)",
      price: "$32.99",
      originalPrice: "$38.99",
      rating: 4.7,
      reviews: 89,
      image: featuredImage,
      badge: "Premium",
      description: "Green cardamom pods from Kerala. Essential for authentic Indian sweets and chai.",
      category: "spices",
      inStock: true
    },
    {
      id: 4,
      name: "Coconut Oil (500ml)",
      price: "$18.99",
      originalPrice: "$22.99",
      rating: 4.6,
      reviews: 145,
      image: featuredImage,
      badge: "Cold Pressed",
      description: "Virgin coconut oil, cold-pressed and unrefined. Perfect for cooking and skin care.",
      category: "oils",
      inStock: false
    },
    {
      id: 5,
      name: "Masala Chai Tea Blend (250g)",
      price: "$14.99",
      originalPrice: "$17.99",
      rating: 4.8,
      reviews: 203,
      image: featuredImage,
      badge: "Traditional",
      description: "Authentic masala chai blend with cardamom, cinnamon, ginger, and black pepper.",
      category: "beverages",
      inStock: true
    },
    {
      id: 6,
      name: "Samosa Snack Pack (20 pieces)",
      price: "$19.99",
      originalPrice: "$24.99",
      rating: 4.5,
      reviews: 78,
      image: featuredImage,
      badge: "Frozen",
      description: "Ready-to-fry vegetable samosas with spiced potato and pea filling.",
      category: "snacks",
      inStock: true
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Shop Products
          </h1>
          <p className="text-lg text-soft-gray max-w-2xl">
            Discover authentic Indian food products, spices, and specialty items. 
            All products are carefully sourced and quality guaranteed.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
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
                <h3 className="font-semibold text-primary mb-4">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Under $20</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">$20 - $50</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">$50 - $100</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Over $100</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-soft-gray" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="flex items-center space-x-4">
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

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`group relative overflow-hidden border hover:shadow-luxury transition-all duration-300 ${
                    viewMode === "grid" ? "hover:-translate-y-1" : ""
                  }`}
                >
                  <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                    <div className={viewMode === "list" ? "flex space-x-4" : ""}>
                      {/* Product Image */}
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : ""}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "grid" ? "w-full h-48" : "w-full h-full rounded-lg"
                          }`}
                        />
                        
                        {/* Badge */}
                        <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
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
                        >
                          <Heart className="h-4 w-4" />
                        </Button>

                        {/* Quick Add to Cart - appears on hover (grid view only) */}
                        {viewMode === "grid" && product.inStock && (
                          <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <Button 
                              size="sm" 
                              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className={`space-y-3 ${viewMode === "grid" ? "p-4" : "flex-1"}`}>
                        <div>
                          <h3 className="font-semibold text-primary line-clamp-1 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-soft-gray line-clamp-2">
                            {product.description}
                          </p>
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
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            {product.price}
                          </span>
                          <span className="text-sm text-soft-gray line-through">
                            {product.originalPrice}
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                            Save {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                          </span>
                        </div>

                        {/* List View Add to Cart */}
                        {viewMode === "list" && (
                          <Button 
                            className={`w-full md:w-auto ${product.inStock ? 'bg-primary hover:bg-primary-hover' : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProducts;