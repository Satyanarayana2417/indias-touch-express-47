import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Plus, Minus, ShoppingCart, CreditCard, Truck, Shield, RotateCcw, ZoomIn, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, getProductById, getProductsByCategory } from '@/lib/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [recommendedStartIndex, setRecommendedStartIndex] = useState(0);

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
        
        // First try to get from Firebase
        let productData = await getProductById(id);
        
        // If not found in Firebase, use mock data
        if (!productData) {
          productData = getMockProductById(id);
        }
        
        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(productData);
        
        // Set default variant
        if (productData.variants && productData.variants.length > 0) {
          const defaultVariant = productData.variants.find(v => v.isDefault) || productData.variants[0];
          setSelectedVariant(defaultVariant);
        }

        // Load recommended products from same category
        try {
          const recommended = await getProductsByCategory(productData.category, 8);
          // Filter out current product and get first 6
          const filtered = recommended.filter(p => p.id !== id).slice(0, 6);
          setRecommendedProducts(filtered);
        } catch (err) {
          // Use mock recommended products if Firebase fails
          setRecommendedProducts(getMockRecommendedProducts(productData.category, id));
        }
        
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Mock product data with variants
  const getMockProductById = (productId: string): Product | null => {
    const mockProducts: Record<string, Product> = {
      '1': {
        id: '1',
        name: 'Premium Garam Masala',
        name_lowercase: 'premium garam masala',
        price: '₹299',
        originalPrice: '₹399',
        image: 'https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png',
        images: [
          'https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png',
          'https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/garam-masala-powder-500x500.jpg',
          'https://m.media-amazon.com/images/I/61eiR2QdMJL.jpg'
        ],
        description: 'Authentic garam masala blend with traditional Indian spices.',
        detailedDescription: 'Our Premium Garam Masala is a carefully crafted blend of the finest whole spices, roasted to perfection and ground to release maximum flavor. This aromatic spice blend is essential for authentic Indian cooking and adds warmth and depth to curries, rice dishes, and grilled meats.',
        category: 'spices',
        rating: 4.8,
        reviews: 156,
        badge: 'Best Seller',
        inStock: true,
        variants: [
          { name: '100g', price: 199, originalPrice: 249, stock: 50, isDefault: true },
          { name: '250g', price: 299, originalPrice: 399, stock: 30 },
          { name: '500g', price: 499, originalPrice: 649, stock: 20 },
          { name: '1kg', price: 899, originalPrice: 1199, stock: 10 }
        ],
        ingredients: 'Coriander, Cumin, Black Cardamom, Green Cardamom, Cinnamon, Cloves, Black Pepper, Bay Leaves, Nutmeg, Mace',
        nutritionalInfo: 'Per 100g: Energy 375 kcal, Protein 12g, Fat 15g, Carbohydrates 55g, Fiber 35g',
        origin: 'Rajasthan, India',
        weight: '250g'
      },
      '2': {
        id: '2',
        name: 'Organic Turmeric Powder',
        name_lowercase: 'organic turmeric powder',
        price: '₹399',
        originalPrice: '₹499',
        image: 'https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg',
        images: [
          'https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg',
          'https://m.media-amazon.com/images/I/616TtvR-zQS._UF350,350_QL80_.jpg',
          'https://5.imimg.com/data5/SELLER/Default/2021/8/HK/LM/NO/1234567/turmeric-powder-500x500.jpg'
        ],
        description: 'Pure organic turmeric powder with high curcumin content.',
        detailedDescription: 'Sourced directly from organic farms in Kerala, our turmeric powder contains high levels of curcumin, the active compound known for its anti-inflammatory and antioxidant properties. Perfect for cooking, beauty treatments, and wellness drinks.',
        category: 'spices',
        rating: 4.9,
        reviews: 234,
        badge: 'Organic',
        inStock: true,
        variants: [
          { name: '250g', price: 299, originalPrice: 349, stock: 40 },
          { name: '500g', price: 399, originalPrice: 499, stock: 25, isDefault: true },
          { name: '1kg', price: 699, originalPrice: 899, stock: 15 }
        ],
        ingredients: '100% Pure Organic Turmeric (Curcuma longa)',
        nutritionalInfo: 'Per 100g: Energy 312 kcal, Protein 9.7g, Fat 3.2g, Carbohydrates 67.1g, Curcumin 3-5%',
        origin: 'Kerala, India',
        weight: '500g'
      }
    };

    return mockProducts[productId] || null;
  };

  const getMockRecommendedProducts = (category: string, currentId: string): Product[] => {
    const mockRecommended: Product[] = [
      {
        id: '3',
        name: 'Premium Cardamom',
        name_lowercase: 'premium cardamom',
        price: '₹899',
        image: 'https://media.istockphoto.com/id/1327578667/photo/cardamom-pods-isolated-on-white-background-top-view.jpg',
        description: 'Green cardamom pods from Kerala.',
        category: 'spices',
        rating: 4.7,
        reviews: 89,
        inStock: true
      },
      {
        id: '4',
        name: 'Black Pepper Powder',
        name_lowercase: 'black pepper powder',
        price: '₹399',
        image: 'https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/black-pepper-powder-500x500.jpg',
        description: 'Freshly ground black pepper from Malabar coast.',
        category: 'spices',
        rating: 4.6,
        reviews: 112,
        inStock: true
      },
      {
        id: '5',
        name: 'Cinnamon Sticks',
        name_lowercase: 'cinnamon sticks',
        price: '₹299',
        image: 'https://media.istockphoto.com/id/465208505/photo/cinnamon-sticks.jpg',
        description: 'Premium Ceylon cinnamon sticks.',
        category: 'spices',
        rating: 4.8,
        reviews: 78,
        inStock: true
      }
    ];

    return mockRecommended.filter(p => p.id !== currentId);
  };

  const getCurrentPrice = (): string => {
    if (selectedVariant) {
      return `₹${selectedVariant.price}`;
    }
    return product?.price || '₹0';
  };

  const getCurrentOriginalPrice = (): string | undefined => {
    if (selectedVariant?.originalPrice) {
      return `₹${selectedVariant.originalPrice}`;
    }
    return product?.originalPrice;
  };

  const isVariantOutOfStock = (): boolean => {
    if (selectedVariant) {
      return selectedVariant.stock <= 0;
    }
    return !product?.inStock;
  };

  const handleAddToCart = () => {
    if (!product || isVariantOutOfStock()) return;

    const variantName = selectedVariant ? selectedVariant.name : undefined;
    const price = getCurrentPrice();
    const originalPrice = getCurrentOriginalPrice();

    for (let i = 0; i < quantity; i++) {
      addItem(product.id!, product.name, price, product.image, variantName, originalPrice);
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name}${variantName ? ` (${variantName})` : ''} added to cart.`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxStock = selectedVariant ? selectedVariant.stock : 10;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const productImages = product?.images || [product?.image || ''];
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1);
    } else {
      setSelectedImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1);
    }
  };

  const handleRecommendedNavigation = (direction: 'prev' | 'next') => {
    const visibleCount = 3;
    if (direction === 'prev') {
      setRecommendedStartIndex(prev => Math.max(0, prev - visibleCount));
    } else {
      setRecommendedStartIndex(prev => Math.min(recommendedProducts.length - visibleCount, prev + visibleCount));
    }
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
        title: "Link Copied",
        description: "Product link has been copied to clipboard.",
      });
    }
    setShowShareMenu(false);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product?.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Go Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images || [product.image];
  const currentImage = productImages[selectedImageIndex] || product.image;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop-products')} className="hover:text-orange-600">Products</button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <div 
                className={`relative overflow-hidden rounded-lg bg-white border-2 border-gray-200 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`w-full h-96 object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                />
                
                {/* Image Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation('prev');
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation('next');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                <div className="absolute top-4 right-4">
                  <ZoomIn className="w-6 h-6 text-gray-600" />
                </div>
                
                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>
              
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-orange-500 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Title, Rating and Actions Bar */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{product.name}</h1>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full border-2 transition-colors ${
                      isWishlisted 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 hover:border-red-300 text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-300 text-gray-600"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
                        <button
                          onClick={handleShare}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          Share Product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Price Display */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-orange-600">{getCurrentPrice()}</span>
                {getCurrentOriginalPrice() && (
                  <span className="text-xl text-gray-500 line-through">{getCurrentOriginalPrice()}</span>
                )}
                {getCurrentOriginalPrice() && selectedVariant && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save ₹{selectedVariant.originalPrice! - selectedVariant.price}
                  </Badge>
                )}
              </div>
              {selectedVariant && (
                <p className="text-sm text-gray-600">
                  Price for {selectedVariant.name} • {selectedVariant.stock} in stock
                </p>
              )}
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Size/Weight:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariant?.name === variant.name;
                    const isOutOfStock = variant.stock <= 0;
                    const discount = variant.originalPrice ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100) : 0;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                        disabled={isOutOfStock}
                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                            : isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-base">{variant.name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-semibold">₹{variant.price}</span>
                              {variant.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">₹{variant.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          {discount > 0 && !isOutOfStock && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {discount}% off
                            </span>
                          )}
                        </div>
                        {isOutOfStock && (
                          <div className="text-xs text-red-500 mt-1 font-medium">Out of Stock</div>
                        )}
                        {!isOutOfStock && variant.stock <= 5 && (
                          <div className="text-xs text-amber-600 mt-1">Only {variant.stock} left</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status Alert */}
            {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-800">
                  <strong>Limited Stock:</strong> Only {selectedVariant.stock} items left in stock!
                </AlertDescription>
              </Alert>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center bg-gray-50 font-medium text-lg border-x-2 border-gray-300">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedVariant ? quantity >= selectedVariant.stock : quantity >= 10}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedVariant ? (
                    <span>
                      <span className="font-medium">{selectedVariant.stock}</span> available
                      {selectedVariant.stock <= 5 && <span className="text-amber-600 ml-1">(Limited!)</span>}
                    </span>
                  ) : (
                    <span>In Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isVariantOutOfStock() ? (
                <div className="space-y-3">
                  <Button disabled className="w-full bg-gray-400 text-white py-4 text-lg font-semibold">
                    Out of Stock
                  </Button>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      This item is currently out of stock. Check back later or explore similar products below.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart • {getCurrentPrice()}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 py-4 text-lg font-semibold transition-colors duration-200"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </>
              )}
              
              {/* Total Price Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{selectedVariant ? (selectedVariant.price * quantity) : (parseInt(product.price.replace('₹', '')) * quantity)}
                  </span>
                </div>
                {selectedVariant?.originalPrice && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">You save:</span>
                    <span className="text-green-600 font-medium">
                      ₹{(selectedVariant.originalPrice - selectedVariant.price) * quantity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Free Delivery</div>
                <div className="text-xs text-gray-600">On orders above ₹500</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Quality Assured</div>
                <div className="text-xs text-gray-600">Premium quality products</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-gray-600">7-day return policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.detailedDescription || product.description}
                  </p>
                  {product.origin && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Origin:</h4>
                      <p className="text-gray-700">{product.origin}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.ingredients ? (
                    <p className="text-gray-700">{product.ingredients}</p>
                  ) : (
                    <p className="text-gray-500">Ingredient information not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.nutritionalInfo ? (
                    <p className="text-gray-700">{product.nutritionalInfo}</p>
                  ) : (
                    <p className="text-gray-500">Nutritional information not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              {recommendedProducts.length > 3 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRecommendedNavigation('prev')}
                    disabled={recommendedStartIndex === 0}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRecommendedNavigation('next')}
                    disabled={recommendedStartIndex >= recommendedProducts.length - 3}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((recommendedProduct) => (
                <Card key={recommendedProduct.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4">
                    <div 
                      onClick={() => navigate(`/product/${recommendedProduct.id}`)}
                      className="space-y-3"
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={recommendedProduct.image}
                          alt={recommendedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {recommendedProduct.badge && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                            {recommendedProduct.badge}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{recommendedProduct.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{recommendedProduct.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-orange-600">{recommendedProduct.price}</span>
                            {recommendedProduct.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">{recommendedProduct.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{recommendedProduct.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
