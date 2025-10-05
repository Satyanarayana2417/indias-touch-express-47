import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { getProductsByCategory, Product as FirebaseProduct } from "@/lib/products";
import featuredImage from "@/assets/featured-products.jpg";
import heroShipping from "@/assets/hero-shipping.jpg";
import { useRef, useState, useEffect } from "react";

const ProductShowcaseRows = () => {
  const spicesCarouselRef = useRef<HTMLDivElement>(null);
  const decorCarouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState({ spices: false, decor: false });
  const [canScrollRight, setCanScrollRight] = useState({ spices: true, decor: true });
  const [spiceProducts, setSpiceProducts] = useState<FirebaseProduct[]>([]);
  const [decorProducts, setDecorProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSpices, setLoadingSpices] = useState(true);
  const [loadingDecor, setLoadingDecor] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadingSpices(true);
        setLoadingDecor(true);
        
        // Load spice products (limit to 6 for carousel)
        const spices = await getProductsByCategory('spices', 6);
        setSpiceProducts(spices);
        setLoadingSpices(false);
        
        // Load decorative products (limit to 6 for carousel)
        const decoratives = await getProductsByCategory('decorative', 6);
        setDecorProducts(decoratives);
        setLoadingDecor(false);
        
      } catch (error) {
        console.error('Error loading showcase products:', error);
        setLoadingSpices(false);
        setLoadingDecor(false);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right', carouselRef: React.RefObject<HTMLDivElement>) => {
    if (carouselRef.current) {
      const scrollAmount = 240; // Width of one product card (224px) plus gap (16px)
      const scrollLeft = carouselRef.current.scrollLeft;
      const newScrollLeft = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const updateScrollButtons = (carouselRef: React.RefObject<HTMLDivElement>, type: 'spices' | 'decor') => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const canLeft = scrollLeft > 0;
      const canRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      if (type === 'spices') {
        setCanScrollLeft(prev => ({ ...prev, spices: canLeft }));
        setCanScrollRight(prev => ({ ...prev, spices: canRight }));
      } else {
        setCanScrollLeft(prev => ({ ...prev, decor: canLeft }));
        setCanScrollRight(prev => ({ ...prev, decor: canRight }));
      }
    }
  };

  useEffect(() => {
    const spicesElement = spicesCarouselRef.current;
    const decorElement = decorCarouselRef.current;

    const handleSpicesScroll = () => updateScrollButtons(spicesCarouselRef, 'spices');
    const handleDecorScroll = () => updateScrollButtons(decorCarouselRef, 'decor');

    if (spicesElement) {
      spicesElement.addEventListener('scroll', handleSpicesScroll);
      handleSpicesScroll(); // Initial check
    }
    if (decorElement) {
      decorElement.addEventListener('scroll', handleDecorScroll);
      handleDecorScroll(); // Initial check
    }

    return () => {
      if (spicesElement) spicesElement.removeEventListener('scroll', handleSpicesScroll);
      if (decorElement) decorElement.removeEventListener('scroll', handleDecorScroll);
    };
  }, []);

  const addToCart = (product: FirebaseProduct) => {
    addItem(product.id || '', product.name, product.price);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleProductClick = (product: FirebaseProduct) => {
    navigate(`/product/${product.id}`);
  };

  const ProductCard = ({ product, onAddToCart, onProductClick }: { 
    product: FirebaseProduct, 
    onAddToCart: (product: FirebaseProduct) => void,
    onProductClick: (product: FirebaseProduct) => void 
  }) => (
    <div className="flex-shrink-0 w-52 sm:w-56 group">
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <div className="relative overflow-hidden bg-white">
          <button 
            className="absolute top-3 left-3 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <div className="mb-2">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
          </div>
          <h3 className="text-sm text-gray-700 line-clamp-2 mb-3 leading-tight">
            {product.name}
          </h3>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-white font-medium text-sm py-2 transition-all duration-200"
            variant="outline"
            disabled={!product.inStock}
          >
            <Plus className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );

  const CarouselSection = ({ 
    title, 
    viewAllLink, 
    products, 
    carouselRef, 
    onAddToCart,
    onProductClick,
    scrollType,
    loading
  }: {
    title: string;
    viewAllLink: string;
    products: FirebaseProduct[];
    carouselRef: React.RefObject<HTMLDivElement>;
    onAddToCart: (product: FirebaseProduct) => void;
    onProductClick: (product: FirebaseProduct) => void;
    scrollType: 'spices' | 'decor';
    loading?: boolean;
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
          {title}
        </h2>
        <a 
          href={viewAllLink}
          className="text-sm font-medium text-primary hover:underline transition-colors"
        >
          View all
        </a>
      </div>
      
      <div className="relative">
        {/* Navigation Arrows */}
        {(scrollType === 'spices' ? canScrollLeft.spices : canScrollLeft.decor) && (
          <Button
            onClick={() => scrollCarousel('left', carouselRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border hover:bg-white text-gray-600 p-0 transition-all duration-300"
            variant="outline"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        {(scrollType === 'spices' ? canScrollRight.spices : canScrollRight.decor) && (
          <Button
            onClick={() => scrollCarousel('right', carouselRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border hover:bg-white text-gray-600 p-0 transition-all duration-300"
            variant="outline"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Product Carousel */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );

  const PromotionalBanner = ({ 
    headline, 
    buttonText, 
    backgroundImage, 
    imageAlt 
  }: {
    headline: string;
    buttonText: string;
    backgroundImage: string;
    imageAlt: string;
  }) => (
    <div className="relative overflow-hidden rounded-lg group" style={{ aspectRatio: '16/9' }}>
      <img
        src={backgroundImage}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
      <div className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-10 text-white">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-6 leading-tight max-w-md">
          {headline}
        </h2>
        <Button 
          size="lg" 
          className="bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold w-fit transition-all duration-300 hover:scale-105"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );

  return (
    <section className="py-4 lg:py-8 bg-background">
      <div className="container mx-auto px-4 space-y-8 lg:space-y-12">
        {/* First Row: Banner Left, Carousel Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          {/* Promotional Banner */}
          <div className="order-2 lg:order-1">
            <PromotionalBanner
              headline="Elevate Your Cooking"
              buttonText="Shop Now"
              backgroundImage={featuredImage}
              imageAlt="Modern kitchen scene with Indian spices"
            />
          </div>
          
          {/* Product Carousel */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <CarouselSection
              title="Authentic Spices & Sauces"
              viewAllLink="/food-items"
              products={spiceProducts}
              carouselRef={spicesCarouselRef}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              scrollType="spices"
              loading={loadingSpices}
            />
          </div>
        </div>

        {/* Second Row: Carousel Left, Banner Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          {/* Product Carousel */}
          <div className="flex flex-col justify-center">
            <CarouselSection
              title="Handcrafted Home Decor"
              viewAllLink="/decorative-items"
              products={decorProducts}
              carouselRef={decorCarouselRef}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              scrollType="decor"
              loading={loadingDecor}
            />
          </div>
          
          {/* Promotional Banner */}
          <div>
            <PromotionalBanner
              headline="Beautify Your Living Space"
              buttonText="Shop Now"
              backgroundImage={heroShipping}
              imageAlt="Well-decorated room with decorative items"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseRows;

