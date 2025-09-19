import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Package, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const { addItem } = useCart();

  // Mock search results - in production, this would come from your database
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock products for demonstration
  const allProducts = [
    // Products starting with 'A'
    {
      id: 1,
      name: "Asafoetida (Hing) Powder",
      price: "₹1,349",
      originalPrice: "₹1,599",
      rating: 4.7,
      reviews: 89,
      image: "https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/asafoetida-powder-500x500.jpg",
      badge: "Pure",
      description: "Authentic asafoetida powder for traditional Indian cooking.",
      category: "spices",
      inStock: true
    },
    // Products starting with 'B'
    {
      id: 2,
      name: "Basmati Rice Premium",
      price: "₹1,999",
      originalPrice: "₹2,399",
      rating: 4.8,
      reviews: 256,
      image: "https://5.imimg.com/data5/SELLER/Default/2022/9/AW/WY/JQ/17906995/basmati-rice-1000x1000.jpg",
      badge: "Premium Quality",
      description: "Long-grain aromatic basmati rice from the Himalayas.",
      category: "rice-grains",
      inStock: true
    },
    {
      id: 3,
      name: "Brass Diya Set",
      price: "₹2,939",
      originalPrice: "₹3,369",
      rating: 4.6,
      reviews: 78,
      image: "https://m.media-amazon.com/images/I/61eiR2QdMJL.jpg",
      badge: "Traditional",
      description: "Traditional brass diya set for festivals and ceremonies.",
      category: "decorative",
      inStock: true
    },
    // Products starting with 'C'
    {
      id: 4,
      name: "Cardamom Pods Green",
      price: "₹2,099",
      originalPrice: "₹2,529",
      rating: 4.7,
      reviews: 89,
      image: "https://media.istockphoto.com/id/1327578667/photo/cardamom-pods-isolated-on-white-background-top-view.jpg",
      badge: "Premium",
      description: "Green cardamom pods from Kerala for authentic flavors.",
      category: "spices",
      inStock: true
    },
    {
      id: 5,
      name: "Coffee Powder Premium",
      price: "₹1,999",
      originalPrice: "₹2,399",
      rating: 4.8,
      reviews: 156,
      image: "https://www.jiomart.com/images/product/original/rvfav9k7op/pack-of-2-200-gram-100-arabica-instant-classic-strong-coffee-powder-premium-coffee-strong-coffee-classic-coffee-espresso-latte-cappucino-pure-coffee-hot-cold-coffee-non-breakable-jar-product-images-orvfav9k7op-p600689638-0-202304190917.png?im=Resize=(1000,1000)",
      badge: "Best Seller",
      description: "Premium 100% Arabica instant coffee powder.",
      category: "beverages",
      inStock: true
    },
    // Products starting with 'G'
    {
      id: 6,
      name: "Garam Masala Premium",
      price: "₹1,599",
      originalPrice: "₹1,939",
      rating: 4.8,
      reviews: 156,
      image: "https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png",
      badge: "Best Seller",
      description: "Authentic garam masala blend with traditional spices.",
      category: "spices",
      inStock: true
    },
    // Products starting with 'H'
    {
      id: 7,
      name: "Haldi (Turmeric) Powder",
      price: "₹1,099",
      originalPrice: "₹1,349",
      rating: 4.9,
      reviews: 234,
      image: "https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg",
      badge: "Organic",
      description: "Pure organic turmeric powder with high curcumin content.",
      category: "spices",
      inStock: true
    },
    {
      id: 8,
      name: "Honey Pure Raw",
      price: "₹1,429",
      originalPrice: "₹1,689",
      rating: 4.6,
      reviews: 145,
      image: "https://5.imimg.com/data5/SELLER/Default/2021/8/HK/LM/NO/1234567/raw-honey-500x500.jpg",
      badge: "Natural",
      description: "Pure raw honey with natural enzymes and nutrients.",
      category: "natural",
      inStock: true
    },
    // Products starting with 'M'
    {
      id: 9,
      name: "Masala Chai Blend",
      price: "₹299",
      originalPrice: "₹399",
      rating: 4.8,
      reviews: 203,
      image: "https://png.pngtree.com/png-clipart/20250124/original/pngtree-masala-tea-on-white-background-png-image_20310650.png",
      badge: "Traditional",
      description: "Authentic masala chai blend with cardamom and spices.",
      category: "beverages",
      inStock: true
    },
    // Products starting with 'T'
    {
      id: 10,
      name: "Turmeric Powder Organic",
      price: "₹1,099",
      originalPrice: "₹1,349",
      rating: 4.9,
      reviews: 234,
      image: "https://m.media-amazon.com/images/I/616TtvR-zQS._UF350,350_QL80_.jpg",
      badge: "Organic",
      description: "Pure organic turmeric powder sourced from Indian farms.",
      category: "spices",
      inStock: true
    }
  ];

  // Simulate search
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = (query: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim();
      
      // Only show results if there's a search term
      if (!normalizedQuery) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      // Filter by product name only (title only) and use startsWith for letter-based filtering
      const filteredResults = allProducts.filter(product =>
        product.name.toLowerCase().startsWith(normalizedQuery)
      );
      
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleAddToCart = (product: any) => {
    addItem(product.id.toString(), product.name, product.price, product.image);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative max-w-2xl">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 text-base border-2 border-gray-300 rounded-full focus:border-primary transition-colors"
              />
              <Button 
                type="submit"
                size="sm" 
                className="absolute right-1 top-1 h-10 px-4 bg-primary hover:bg-primary-hover rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    <>Showing {searchResults.length} results for "<span className="font-semibold">{searchQuery}</span>"</>
                  ) : searchQuery ? (
                    <>No results found for "<span className="font-semibold">{searchQuery}</span>"</>
                  ) : (
                    "Enter a search term to find products"
                  )}
                </>
              )}
            </p>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Searching products...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" : "space-y-4"}>
            {searchResults.map((product) => (
              <Card 
                key={product.id} 
                className={`${viewMode === "list" ? "flex" : ""} cursor-pointer hover:shadow-lg transition-shadow`}
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className={`p-4 ${viewMode === "list" ? "flex space-x-4 w-full" : ""}`}>
                  {/* Product Image */}
                  <div className={viewMode === "list" ? "flex-shrink-0 w-32 h-32" : "aspect-square mb-4"}>
                    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {product.badge && (
                          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mb-2">
                            {product.badge}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-primary hover:bg-primary/90"
                        size="sm"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching "<span className="font-semibold">{searchQuery}</span>"
            </p>
            <p className="text-sm text-gray-500">
              Try searching for different keywords or browse our categories
            </p>
          </div>
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
