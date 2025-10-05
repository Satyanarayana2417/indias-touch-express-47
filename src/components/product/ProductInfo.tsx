import React from 'react';
import { Star, Plus, Minus, ShoppingCart, CreditCard, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, ProductVariant } from '@/lib/products';

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  isWishlisted: boolean;
  onVariantChange: (variant: ProductVariant) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedVariant,
  quantity,
  isWishlisted,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onShare
}) => {
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numericPrice);
  };

  const getDiscountPercentage = () => {
    if (!selectedVariant || !selectedVariant.originalPrice) return null;
    return Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating || 0} ({product.reviews || 0} reviews)
            </span>
          </div>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.price)}
          </span>
          {selectedVariant?.originalPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(selectedVariant.originalPrice)}
              </span>
              <Badge variant="destructive">
                {getDiscountPercentage()}% OFF
              </Badge>
            </>
          )}
          {product.originalPrice && !selectedVariant && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="destructive">
                Sale
              </Badge>
            </>
          )}
        </div>
        {product.badge && (
          <Badge variant="destructive" className="w-fit">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Select Size/Weight
          </h3>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {product.variants.map((variant, index) => {
              const isSelected = selectedVariant === variant;
              const isOutOfStock = variant.stock === 0;
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => !isOutOfStock && onVariantChange(variant)}
                  disabled={isOutOfStock}
                  className={`min-w-[80px] h-12 flex-col justify-center relative ${
                    isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                      : isSelected 
                        ? 'ring-2 ring-primary/20' 
                        : 'hover:border-primary'
                  }`}
                >
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-xs opacity-75">
                    {formatPrice(variant.price)}
                  </span>
                  {isOutOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center bg-gray-100/80 text-xs font-medium text-gray-600">
                      Out of Stock
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
          {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <p className="text-sm text-orange-600 mt-2">
              Only {selectedVariant.stock} left in stock!
            </p>
          )}
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            {selectedVariant && selectedVariant.stock > 0 && (
              <span className="text-xs text-gray-500">
                {selectedVariant.stock} available
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center min-w-[60px] h-10 border border-gray-200 rounded-md bg-gray-50">
              <span className="font-medium text-lg">{quantity}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const maxStock = selectedVariant?.stock || 10;
                onQuantityChange(Math.min(maxStock, quantity + 1));
              }}
              disabled={
                selectedVariant 
                  ? quantity >= selectedVariant.stock 
                  : quantity >= 10
              }
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {selectedVariant && quantity >= selectedVariant.stock && selectedVariant.stock > 0 && (
            <p className="text-xs text-orange-600 mt-1">
              Maximum available quantity selected
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action Buttons */}
          <div className="flex space-x-3">
            <Button
              size="lg"
              className="flex-1 h-12"
              onClick={onAddToCart}
              disabled={!product.inStock || (selectedVariant && selectedVariant.stock === 0)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onToggleWishlist}
              className={`h-12 px-3 ${isWishlisted ? 'text-red-500 border-red-500 bg-red-50' : 'hover:text-red-500 hover:border-red-300'}`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onShare}
              className="h-12 px-3 hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Buy Now Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
            disabled={!product.inStock || (selectedVariant && selectedVariant.stock === 0)}
            onClick={onBuyNow}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Stock Status and Additional Info */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              selectedVariant 
                ? selectedVariant.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                : product.inStock ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600">
              {selectedVariant 
                ? selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock'
                : product.inStock ? 'In Stock' : 'Out of Stock'
              }
            </span>
          </div>
          {selectedVariant && selectedVariant.stock > 0 && (
            <span className="text-sm text-gray-500">
              {selectedVariant.stock} units available
            </span>
          )}
        </div>

        {/* Delivery Info */}
        <div className="text-sm text-gray-600">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium">📦 Free Delivery</span>
            <span>on orders above ₹500</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">🚚 Delivery</span>
            <span>2-3 business days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;