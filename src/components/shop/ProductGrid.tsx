import React from 'react';
import { Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (e: React.MouseEvent, productId: number) => void;
  isInWishlist: (productId: string) => boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onViewModeChange,
  onProductClick,
  onAddToCart,
  onWishlistToggle,
  isInWishlist
}) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {products.length} products
        </p>
        <div className="hidden sm:flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
        : 'space-y-4'
      }>
        {products.map((product) => (
          <Card
            key={product.id}
            className={`group cursor-pointer hover:shadow-lg transition-all duration-200 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            }`}
            onClick={() => onProductClick(product.id)}
          >
            <CardContent className={`p-2 sm:p-3 md:p-4 ${viewMode === 'list' ? 'flex w-full' : ''}`}>
              {/* Product Image */}
              <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${
                viewMode === 'list' 
                  ? 'w-32 h-32 flex-shrink-0 mr-4' 
                  : 'aspect-square mb-2 sm:mb-3 md:mb-4'
              }`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-yellow-500 text-black text-[9px] sm:text-[10px] md:text-xs font-semibold rounded-full">
                    {product.badge}
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => onWishlistToggle(e, product.id)}
                  className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 p-1 sm:p-1.5 md:p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform ${
                    isInWishlist(String(product.id)) ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${isInWishlist(String(product.id)) ? 'fill-current' : ''}`} />
                </button>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className={`font-semibold text-gray-900 mb-1 sm:mb-1.5 md:mb-2 line-clamp-2 ${
                  viewMode === 'list' ? 'text-lg' : 'text-xs sm:text-sm md:text-base'
                }`}>
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-1 sm:mb-1.5 md:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className={`flex items-center justify-between ${
                  viewMode === 'list' ? 'mb-4' : 'mb-1 sm:mb-1.5 md:mb-2'
                }`}>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="font-bold text-gray-900 text-[10px] sm:text-xs md:text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[9px] sm:text-[10px] md:text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  disabled={!product.inStock}
                  className={`w-full transition-opacity duration-200 text-[10px] sm:text-xs md:text-sm py-1 sm:py-1.5 md:py-2 ${
                    viewMode === 'list' 
                      ? 'opacity-100' 
                      : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  size="sm"
                >
                  <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 sm:mr-1.5 md:mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;