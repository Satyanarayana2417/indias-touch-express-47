import React from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/products';

interface RecommendedProductsProps {
  products: Product[];
  startIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onProductClick: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  products,
  startIndex,
  onPrevious,
  onNext,
  onProductClick,
  onAddToCart
}) => {
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numericPrice);
  };

  const visibleProducts = products.slice(startIndex, startIndex + 3);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">You Might Also Like</h2>
        {products.length > 3 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
              disabled={startIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={startIndex + 3 >= products.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product) => (
          <Card
            key={product.id}
            className="group cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => product.id && onProductClick(product.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  ({product.reviews || 0})
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  disabled={!product.inStock}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {!product.inStock && (
                <span className="text-xs text-red-500 mt-1 block">
                  Out of Stock
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;