import React from 'react';
import { ShoppingCart, Heart, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      {/* Products Count and View Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {products.length} products
        </p>
        <div className="flex items-center space-x-2">
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
        ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
        : 'space-y-4'
      }>
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`group cursor-pointer ${
              viewMode === 'list' ? 'flex flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4' : ''
            }`}
            onClick={() => onProductClick(product.id)}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative overflow-hidden bg-gray-50">
                  <button 
                    className="absolute top-2 left-2 p-1 sm:p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
                    onClick={(e) => onWishlistToggle(e, product.id)}
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
                  {product.badge && (
                    <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold z-10">
                      {product.badge}
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
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-2 sm:mb-3 leading-tight">
                    {product.name}
                  </h3>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
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
                    onClick={(e) => onWishlistToggle(e, product.id)}
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
                  {product.badge && (
                    <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold z-10">
                      {product.badge}
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
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base text-gray-700 line-clamp-2 mb-4 leading-tight">
                    {product.name}
                  </h3>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
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