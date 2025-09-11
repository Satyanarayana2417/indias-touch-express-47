import { useState } from "react";
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import featuredImage from "@/assets/featured-products.jpg";

const ShopProducts = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
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
    { id: "all", name: "All Products", count: 12 },
    { id: "spices", name: "Spices & Seasonings", count: 4 },
    { id: "snacks", name: "Snacks & Sweets", count: 4 },
    { id: "oils", name: "Oils & Ghee", count: 2 },
    { id: "ready-to-eat", name: "Ready to Eat", count: 0 },
    { id: "beverages", name: "Tea & Beverages", count: 2 }
  ];

  const products = [
    {
      id: 101,
      name: "Premium coffee powder",
      price: "₹1,999",
      originalPrice: "₹2,399",
      rating: 4.8,
      reviews: 156,
      image: "https://www.jiomart.com/images/product/original/rvfav9k7op/pack-of-2-200-gram-100-arabica-instant-classic-strong-coffee-powder-premium-coffee-strong-coffee-classic-coffee-espresso-latte-cappucino-pure-coffee-hot-cold-coffee-non-breakable-jar-product-images-orvfav9k7op-p600689638-0-202304190917.png?im=Resize=(1000,1000)",
      badge: "Best Seller",
      description: "Authentic long-grain basmati rice from the foothills of Himalayas. Perfect for biryanis and pilafs.",
      category: "beverages",
      inStock: true
    },
    {
      id: 102,
      name: "Organic Turmeric Powder",
      price: "₹1,359",
      originalPrice: "₹1,599",
      rating: 4.9,
      reviews: 234,
      image: "https://m.media-amazon.com/images/I/616TtvR-zQS._UF350,350_QL80_.jpg",
      badge: "Organic",
      description: "Pure, organic turmeric powder with high curcumin content. Sourced directly from Indian farms.",
      category: "spices",
      inStock: true
    },
    {
      id: 103,
      name: "Cardamom Pods (100g)",
      price: "₹2,639",
      originalPrice: "₹3,119",
      rating: 4.7,
      reviews: 89,
      image: "https://media.istockphoto.com/id/177772296/photo/green-cardamom-pods.jpg?s=612x612&w=0&k=20&c=LBsB6yJtxCi08SDI7PpFLRsbIbOZnvY2i2KbjROzXk0=",
      badge: "Premium",
      description: "Green cardamom pods from Kerala. Essential for authentic Indian sweets and chai.",
      category: "spices",
      inStock: true
    },
    {
      id: 104,
      name: "Coconut Oil (500ml)",
      price: "₹1,519",
      originalPrice: "₹1,839",
      rating: 4.6,
      reviews: 145,
      image: "https://t3.ftcdn.net/jpg/06/26/68/56/360_F_626685608_zJ6FiGMYwhiNX4T00WHzNpyTFtS80Ydi.jpg",
      badge: "Cold Pressed",
      description: "Virgin coconut oil, cold-pressed and unrefined. Perfect for cooking and skin care.",
      category: "oils",
      inStock: false
    },
    {
      id: 105,
      name: "Masala Chai Tea Blend (250g)",
      price: "₹1,199",
      originalPrice: "₹1,439",
      rating: 4.8,
      reviews: 203,
      image: "https://png.pngtree.com/png-clipart/20250124/original/pngtree-masala-tea-on-white-background-png-image_20310650.png",
      badge: "Traditional",
      description: "Authentic masala chai blend with cardamom, cinnamon, ginger, and black pepper.",
      category: "beverages",
      inStock: true
    },
    {
      id: 106,
      name: "Samosa Snack Pack (20 pieces)",
      price: "₹1,599",
      originalPrice: "₹1,999",
      rating: 4.5,
      reviews: 78,
      image: "https://bigbirdfoods.com/wp-content/uploads/2019/01/Vegetable-Samosa-1.jpg",
      badge: "Frozen",
      description: "Ready-to-fry vegetable samosas with spiced potato and pea filling.",
      category: "snacks",
      inStock: true
    },
    // Additional products to test cart with many items
    {
      id: 107,
      name: "Premium Ghee (500ml)",
      price: "₹899",
      originalPrice: "₹1,099",
      rating: 4.9,
      reviews: 312,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6SXkA14RJ9J0fHijeMFdC0SsQoJA8FbapA&s",
      badge: "Pure",
      description: "Traditional cow ghee made from fresh cream. Perfect for cooking and rituals.",
      category: "oils",
      inStock: true
    },
    {
      id: 108,
      name: "premium tea powder",
      price: "₹599",
      originalPrice: "₹799",
      rating: 4.7,
      reviews: 189,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXVj16b1-9X9PUp4f0teogbKTDdfqGfsTC1w&s",
      badge: "Premium",
      description: "a versatile, high-quality tea powder made from carefully selected tea leaves, delivering a rich, authentic, and aromatic tea experience",
      category: "beverages",
      inStock: true
    },
    {
      id: 109,
      name: "Red Chili Powder (200g)",
      price: "₹299",
      originalPrice: "₹399",
      rating: 4.6,
      reviews: 156,
      image: "https://t4.ftcdn.net/jpg/06/68/59/49/360_F_668594985_30FQV0Mhp8TDVpFQWHYG0QuGM99zChDp.jpg",
      badge: "Spicy",
      description: "Authentic red chili powder made from selected chilies.",
      category: "spices",
      inStock: true
    },
    {
      id: 110,
      name: "Coriander Seeds (100g)",
      price: "₹199",
      originalPrice: "₹249",
      rating: 4.8,
      reviews: 92,
      image: "https://t4.ftcdn.net/jpg/01/97/17/61/360_F_197176150_fR1MpKFiON9fVtGDEE1WeuL5vdMZZPL4.jpg",
      badge: "Fresh",
      description: "Premium quality coriander seeds for authentic Indian flavors.",
      category: "spices",
      inStock: true
    },
    {
      id: 111,
      name: "Green Tea (50 bags)",
      price: "₹449",
      originalPrice: "₹599",
      rating: 4.4,
      reviews: 234,
      image: "https://thumbs.dreamstime.com/b/green-herbal-tea-bag-cup-fresh-steeping-teabag-isolated-white-63427804.jpg",
      badge: "Organic",
      description: "Premium green tea bags with natural antioxidants.",
      category: "beverages",
      inStock: true
    },
    {
      id: 112,
      name: "Jaggery (500g)",
      price: "₹349",
      originalPrice: "₹449",
      rating: 4.7,
      reviews: 178,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3R6ylz_AKRHz-MNz0yAn7rmMTdIu1oSOflA&s",
      badge: "Natural",
      description: "Pure organic jaggery made from sugarcane.",
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
          <p className="text-sm md:text-lg text-soft-gray max-w-2xl">
            Discover authentic Indian food products, spices, and specialty items. 
            All products are carefully sourced and quality guaranteed.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown on larger screens */}
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
                <h3 className="font-semibold text-primary mb-4 flex items-center justify-between">
                  Price Range
                  {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  {/* Price Range Display */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  
                  {/* Price Range Slider */}
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Current Range Display */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-primary">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  
                  {/* Quick Price Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([0, 4000])}
                      className="text-xs"
                    >
                      Under ₹4,000
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([4000, 8000])}
                      className="text-xs"
                    >
                      ₹4,000 - ₹8,000
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([8000, 20000])}
                      className="text-xs"
                    >
                      ₹8,000+
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([0, 200])}
                      className="text-xs"
                    >
                      All Prices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Categories - Horizontal scroll on mobile */}
          <div className="lg:hidden mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-soft-gray" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                {/* Mobile Filter Sheet */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden relative">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {(selectedCategory !== "all" || priceRange[0] !== 0 || priceRange[1] !== 200) && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto">
                    <SheetHeader className="border-b pb-4">
                      <SheetTitle className="text-left">Filters</SheetTitle>
                      <SheetDescription className="text-left">
                        Filter products by category and price range
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

                      {/* Price Range */}
                      <div>
                        <h3 className="font-semibold text-primary mb-4 flex items-center justify-between">
                          Price Range
                          {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </h3>
                        <div className="space-y-6">
                          {/* Price Range Display */}
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span className="font-medium">${priceRange[0]}</span>
                            <span className="font-medium">${priceRange[1]}</span>
                          </div>
                          
                          {/* Price Range Slider */}
                          <div className="px-2">
                            <Slider
                              value={priceRange}
                              onValueChange={(value) => setPriceRange(value as [number, number])}
                              max={200}
                              min={0}
                              step={5}
                              className="w-full"
                            />
                          </div>
                          
                          {/* Current Range Display */}
                          <div className="text-center bg-primary/5 p-3 rounded-lg">
                            <span className="text-lg font-semibold text-primary">
                              ${priceRange[0]} - ${priceRange[1]}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {priceRange[1] - priceRange[0] === 200 ? 'All products' : 'Products in this range'}
                            </p>
                          </div>
                          
                          {/* Quick Price Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant={priceRange[0] === 0 && priceRange[1] === 4000 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPriceRange([0, 4000])}
                              className="text-sm h-10"
                            >
                              Under ₹4,000
                            </Button>
                            <Button
                              variant={priceRange[0] === 4000 && priceRange[1] === 8000 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPriceRange([4000, 8000])}
                              className="text-sm h-10"
                            >
                              ₹4,000 - ₹8,000
                            </Button>
                            <Button
                              variant={priceRange[0] === 8000 && priceRange[1] === 20000 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPriceRange([8000, 20000])}
                              className="text-sm h-10"
                            >
                              ₹8,000+
                            </Button>
                            <Button
                              variant={priceRange[0] === 0 && priceRange[1] === 20000 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPriceRange([0, 20000])}
                              className="text-sm h-10"
                            >
                              All Prices
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Apply and Clear buttons */}
                      <div className="sticky bottom-0 bg-white border-t pt-4 mt-6">
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              setSelectedCategory("all");
                              setPriceRange([0, 200]);
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
            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => 
                viewMode === "grid" ? (
                  // Grid View - Home page style
                  <div 
                    key={product.id} 
                    className="group cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative overflow-hidden bg-gray-50">
                        <button 
                          className="absolute top-2 left-2 p-1 sm:p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </button>
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold z-10">
                            {product.badge}
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
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {product.inStock ? 'Add' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View - Keep existing detailed style
                  <Card 
                    key={product.id} 
                    className="group relative overflow-hidden border hover:shadow-luxury transition-all duration-300 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="relative overflow-hidden w-32 h-32 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
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
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-semibold text-primary line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
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
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-primary">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* List View Add to Cart */}
                          <Button 
                            className="w-full md:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm py-2 transition-all duration-200"
                            variant="outline"
                            disabled={!product.inStock}
                            onClick={() => product.inStock && handleAddToCart(product)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {product.inStock ? 'Add' : 'Out of Stock'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
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