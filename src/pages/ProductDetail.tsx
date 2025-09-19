import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, getProductById, getProductsByCategory } from '@/lib/products';
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
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to get product from Firebase first
        let productData = await getProductById(id);
        
        // Fallback to mock data if Firebase doesn't have the product
        if (!productData) {
          productData = getMockProductById(id);
        }

        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Set default variant if available
        if (productData.variants && productData.variants.length > 0) {
          const defaultVariant = productData.variants.find(v => v.isDefault) || productData.variants[0];
          setSelectedVariant(defaultVariant);
        }

        // Load recommended products
        try {
          const recommended = await getProductsByCategory(productData.category, 8);
          // Filter out current product and limit to 6
          const filtered = recommended.filter(p => p.id !== id).slice(0, 6);
          
          // If we don't have enough from Firebase, supplement with mock data
          if (filtered.length < 6) {
            const mockRecommended = getMockRecommendedProducts(productData.category, id);
            const combined = [...filtered, ...mockRecommended].slice(0, 6);
            setRecommendedProducts(combined);
          } else {
            setRecommendedProducts(filtered);
          }
        } catch (error) {
          console.error('Error loading recommended products:', error);
          // Fallback to mock recommended products
          const mockRecommended = getMockRecommendedProducts(productData.category, id);
          setRecommendedProducts(mockRecommended);
        }

      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Mock data function for fallback
  const getMockProductById = (productId: string): Product | null => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Basmati Rice',
        name_lowercase: 'premium basmati rice',
        price: '899',
        originalPrice: '999',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
          'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500',
          'https://images.unsplash.com/photo-1553830591-2f39e38a8dd6?w=500'
        ],
        description: 'Authentic Indian Basmati rice, aged for perfect aroma and taste.',
        detailedDescription: 'Our premium Basmati rice is carefully selected from the foothills of the Himalayas, aged for over 12 months to develop its distinctive aroma and elongated grains. Perfect for biryanis, pulaos, and everyday meals.',
        category: 'Rice & Grains',
        rating: 4.5,
        reviews: 128,
        badge: 'Best Seller',
        inStock: true,
        variants: [
          { name: '1kg', price: 899, originalPrice: 999, stock: 10, isDefault: true },
          { name: '5kg', price: 4299, originalPrice: 4799, stock: 5 },
          { name: '10kg', price: 8399, originalPrice: 9299, stock: 3 }
        ],
        nutritionalInfo: 'Energy: 345 kcal\nProtein: 7.1g\nCarbohydrates: 78g\nFat: 0.7g\nFiber: 1.3g',
        ingredients: '100% Pure Basmati Rice',
        origin: 'Punjab, India',
        weight: '1kg',
        dimensions: '25cm x 15cm x 8cm'
      },
      // Add more mock products as needed
    ];
    
    return mockProducts.find(p => p.id === productId) || null;
  };

  const getMockRecommendedProducts = (category: string, currentId: string): Product[] => {
    const mockProducts: Product[] = [
      {
        id: 'rec1',
        name: 'Organic Turmeric Powder',
        name_lowercase: 'organic turmeric powder',
        price: '299',
        originalPrice: '349',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300',
        description: 'Pure organic turmeric powder from Kerala farms.',
        category: 'Spices',
        rating: 4.7,
        reviews: 85,
        inStock: true
      },
      {
        id: 'rec2',
        name: 'Alphonso Mango Pulp',
        name_lowercase: 'alphonso mango pulp',
        price: '199',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
        description: 'Premium Alphonso mango pulp, naturally sweet.',
        category: 'Fruits & Preserves',
        rating: 4.6,
        reviews: 64,
        inStock: true
      },
      {
        id: 'rec3',
        name: 'Traditional Brass Diya Set',
        name_lowercase: 'traditional brass diya set',
        price: '799',
        originalPrice: '899',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        description: 'Handcrafted brass diyas for festivals and ceremonies.',
        category: 'Decorative Items',
        rating: 4.4,
        reviews: 42,
        inStock: true
      }
    ];
    
    return mockProducts.filter(p => p.id !== currentId).slice(0, 6);
  };

  // Event handlers
  const handleAddToCart = () => {
    if (!product) return;
    
    const finalPrice = selectedVariant ? selectedVariant.price : parseFloat(product.price);
    const productName = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;
    const variantName = selectedVariant ? selectedVariant.name : undefined;
    
    // Add items based on quantity - addItem adds one item at a time
    for (let i = 0; i < quantity; i++) {
      addItem(
        product.id || '1',
        productName,
        finalPrice,
        product.image,
        variantName
      );
    }
    
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${productName} has been added to your cart.`,
    });
  };

  const handleRecommendedPrevious = () => {
    setRecommendedStartIndex(Math.max(0, recommendedStartIndex - 3));
  };

  const handleRecommendedNext = () => {
    setRecommendedStartIndex(Math.min(recommendedProducts.length - 3, recommendedStartIndex + 3));
  };

  const handleRecommendedProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleRecommendedAddToCart = (recommendedProduct: Product) => {
    addItem(
      recommendedProduct.id || '1',
      recommendedProduct.name,
      parseFloat(recommendedProduct.price),
      recommendedProduct.image
    );
    
    toast({
      title: 'Added to cart',
      description: `${recommendedProduct.name} has been added to your cart.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Product link copied to clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Product not found'}
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <Layout>
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

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImageGallery
            images={productImages}
            productName={product.name}
            selectedImageIndex={selectedImageIndex}
            onImageChange={setSelectedImageIndex}
          />
          
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            isWishlisted={isWishlisted}
            onVariantChange={setSelectedVariant}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
            onShare={handleShare}
          />
        </div>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-medium">Free Shipping</h4>
              <p className="text-sm text-gray-600">On orders over ₹1,000</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-medium">Secure Payment</h4>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-medium">Easy Returns</h4>
              <p className="text-sm text-gray-600">7-day return policy</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Recommended Products */}
        <RecommendedProducts
          products={recommendedProducts}
          startIndex={recommendedStartIndex}
          onPrevious={handleRecommendedPrevious}
          onNext={handleRecommendedNext}
          onProductClick={handleRecommendedProductClick}
          onAddToCart={handleRecommendedAddToCart}
        />
      </div>
    </Layout>
  );
};

export default ProductDetail;