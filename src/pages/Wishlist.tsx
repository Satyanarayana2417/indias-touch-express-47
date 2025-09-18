import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { wishlistProducts, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addItem(product.id, product.name, product.price, product.image);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            {wishlistProducts.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearWishlist}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlistProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring and save your favorite items!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/shop-products')} className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Shop All Products
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/food-items')}
                  className="flex items-center gap-2"
                >
                  Browse Food Items
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Products Grid */}
        {!loading && wishlistProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {wishlistProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Remove from Wishlist Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500" />
                    </Button>

                    {/* Badges */}
                    {product.badges && product.badges.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                          {product.badges[0]}
                        </div>
                      </div>
                    )}

                    {/* Stock Status */}
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
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
                    
                    <h3 
                      className="text-sm font-medium text-gray-700 line-clamp-2 mb-3 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(product.rating || 0) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviews || 0})
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.inStock === false}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Continue Shopping Section */}
        {!loading && wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Continue Shopping
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/shop-products')}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Shop All Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/food-items')}
                className="flex items-center gap-2"
              >
                Browse Food Items
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/decorative-items')}
                className="flex items-center gap-2"
              >
                Browse Decorative Items
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;