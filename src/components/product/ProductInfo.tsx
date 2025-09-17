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
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Options
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant, index) => (
              <Button
                key={index}
                variant={selectedVariant === variant ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVariantChange(variant)}
                className="min-w-[60px]"
              >
                {variant.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={onAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onToggleWishlist}
            className={isWishlisted ? 'text-red-500 border-red-500' : ''}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={!product.inStock}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${
          product.inStock ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-sm text-gray-600">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;