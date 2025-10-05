import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, getProductById, getProductsByCategory, subscribeToProduct } from '@/lib/products';
import RealtimeImageSync from '@/lib/realtimeImageSync';
import Layout from '@/components/Layout';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RecommendedProducts from '@/components/product/RecommendedProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Product interaction state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendedStartIndex, setRecommendedStartIndex] = useState(0);

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load product data
  useEffect(() => {
    if (!id) {
      setError('Product ID not found');
      setLoading(false);
      return;
    }

    // Subscribe to real-time product updates using enhanced sync
    const unsubscribe = RealtimeImageSync.listenForProductById(id, (productData) => {
      if (productData) {
        console.log('📦 Product detail updated in real-time', id);
        setProduct(productData);
        setError(null);
        
        // Set default variant if available
        if (productData.variants && productData.variants.length > 0) {
          const defaultVariant = productData.variants.find(v => v.isDefault) || productData.variants[0];
          setSelectedVariant(defaultVariant);
        }
        
        setLoading(false);
      } else {
        setError('Product not found');
        setLoading(false);
      }
    });

    // Listen for force refresh events
    const handleForceRefresh = () => {
      console.log('🔄 Force refreshing product detail', id);
      // The real-time listener will handle the refresh automatically
    };

    const handleImageUploaded = (event: any) => {
      const productId = event.detail?.productId;
      if (productId === id) {
        console.log('📸 Image uploaded for this product, refreshing');
      }
    };

    window.addEventListener('forceProductRefresh', handleForceRefresh);
    window.addEventListener('imageUploaded', handleImageUploaded);
    window.addEventListener('productSaved', handleImageUploaded);

    // Register listener for cleanup
    RealtimeImageSync.registerListener(`productDetail-${id}`, unsubscribe);

    return () => {
      unsubscribe();
      window.removeEventListener('forceProductRefresh', handleForceRefresh);
      window.removeEventListener('imageUploaded', handleImageUploaded);
      window.removeEventListener('productSaved', handleImageUploaded);
    };
  }, [id]);

  // Load recommended products when product changes
  useEffect(() => {
    const loadRecommendedProducts = async () => {
      if (!product) return;

      try {
        const recommended = await getProductsByCategory(product.category, 8);
        // Filter out current product and limit to 6
        const filtered = recommended.filter(p => p.id !== id).slice(0, 6);
        setRecommendedProducts(filtered);
      } catch (error) {
        console.error('Error loading recommended products:', error);
        setRecommendedProducts([]);
      }
    };

    loadRecommendedProducts();
  }, [product, id]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    // Handle products with variants
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        toast({
          title: "Please Select Variant",
          description: "Please select a size/weight option before adding to cart",
          variant: "destructive",
        });
        return;
      }

      if (selectedVariant.stock === 0) {
        toast({
          title: "Out of Stock",
          description: `${selectedVariant.name} is currently out of stock`,
          variant: "destructive",
        });
        return;
      }

      if (selectedVariant.stock < quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${selectedVariant.stock} units available for ${selectedVariant.name}`,
          variant: "destructive",
        });
        return;
      }

      // Add with variant info
      for (let i = 0; i < quantity; i++) {
        addItem(
          product.id!, 
          product.name, 
          selectedVariant.price, 
          product.image, 
          selectedVariant.name, 
          selectedVariant.originalPrice
        );
      }

      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} (${selectedVariant.name}) added to cart`,
      });
    } else {
      // Handle products without variants
      if (!product.inStock) {
        toast({
          title: "Out of Stock",
          description: "This item is currently out of stock",
          variant: "destructive",
        });
        return;
      }

      // Add without variant info
      for (let i = 0; i < quantity; i++) {
        addItem(
          product.id!, 
          product.name, 
          parseInt(product.price), 
          product.image
        );
      }

      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to cart`,
      });
    }
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    // Handle products with variants
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        toast({
          title: "Please Select Variant",
          description: "Please select a size/weight option before purchasing",
          variant: "destructive",
        });
        return;
      }

      if (selectedVariant.stock === 0) {
        toast({
          title: "Out of Stock",
          description: `${selectedVariant.name} is currently out of stock`,
          variant: "destructive",
        });
        return;
      }

      if (selectedVariant.stock < quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${selectedVariant.stock} units available for ${selectedVariant.name}`,
          variant: "destructive",
        });
        return;
      }
    } else {
      // Handle products without variants
      if (!product.inStock) {
        toast({
          title: "Out of Stock",
          description: "This item is currently out of stock",
          variant: "destructive",
        });
        return;
      }
    }

    // Add to cart first
    handleAddToCart();
    
    // Navigate to checkout after a brief delay
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  // Navigate to related products
  const handleRelatedProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted ? 
        `${product?.name} removed from your wishlist` : 
        `${product?.name} added to your wishlist`,
    });
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-200 aspect-square rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // No product found
  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                Product not found. The product you're looking for doesn't exist or has been removed.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get current variant price and stock
  const currentVariant = selectedVariant || product.variants?.[0];
  const currentPrice = currentVariant?.price || parseInt(product.price);
  const currentOriginalPrice = currentVariant?.originalPrice || (product.originalPrice ? parseInt(product.originalPrice) : null);
  const currentStock = currentVariant?.stock || (product.inStock ? 10 : 0);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Product details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Product Images */}
            <div className="order-1 lg:order-1">
              <ProductImageGallery
                images={product.images || [product.image]}
                productName={product.name}
                selectedImageIndex={selectedImageIndex}
                onImageChange={setSelectedImageIndex}
              />
            </div>

            {/* Product Information */}
            <div className="order-2 lg:order-2 lg:sticky lg:top-4 lg:self-start">
              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                isWishlisted={isWishlisted}
                onVariantChange={setSelectedVariant}
                onQuantityChange={setQuantity}
                onToggleWishlist={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onShare={() => {}}
              />
            </div>
          </div>

          {/* Product tabs (Description, Reviews, etc.) */}
          <ProductTabs product={product} />

          {/* Shipping & Returns info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-12">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">Free Shipping</h3>
                <p className="text-xs sm:text-sm text-green-600">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Secure Payment</h3>
                <p className="text-xs sm:text-sm text-blue-600">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors sm:col-span-2 lg:col-span-1">
              <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Easy Returns</h3>
                <p className="text-xs sm:text-sm text-orange-600">7-day return policy</p>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <RecommendedProducts
              products={recommendedProducts}
              startIndex={recommendedStartIndex}
              onProductClick={handleRelatedProductClick}
              onPrevious={() => setRecommendedStartIndex(Math.max(0, recommendedStartIndex - 3))}
              onNext={() => setRecommendedStartIndex(Math.min(recommendedProducts.length - 3, recommendedStartIndex + 3))}
              onAddToCart={(product) => {}}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;