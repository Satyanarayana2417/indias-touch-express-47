import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { getProductsByCategory, Product as FirebaseProduct } from "@/lib/products";

// Types
interface CategoryItem {
  id: string;
  name: string;
  image: string;
  slug: string;
}

// Category data (keeping this static as these are navigation categories)
const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Spices",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8UtOkMc3o3iYeZNN5bQcuNgoarH6o0REWog&s",
    slug: "spices"
  },
  {
    id: "2",
    name: "Snacks & Sweets",
    image: "https://png.pngtree.com/png-clipart/20231109/original/pngtree-diwali-sweet-and-salty-snacks-or-food-items-from-maharashtra-png-image_13523457.png",
    slug: "snacks-sweets"
  },
  {
    id: "3",
    name: "Home Decor",
    image: "https://i.pinimg.com/736x/73/7f/be/737fbeabe529ae48fc4cfa7b5960b052.jpg",
    slug: "home-decor"
  },
  {
    id: "4",
    name: "Kitchenware",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlQmsCoZGNqFp_Y6fsDKo_I98ANV6B99nncQ&s",
    slug: "kitchenware"
  },
  {
    id: "5",
    name: "Festive Items",
    image: "https://media.istockphoto.com/id/490077454/photo/copper-kalash-and-hindu-puja-or-hindu-pooja-items.jpg?s=612x612&w=0&k=20&c=D8W_3Kor_R00sDXoMaOXMdX3rdYSyQchMqIcg3w01b4=",
    slug: "festive-items"
  },
  {
    id: "6",
    name: "Courier Service",
    image: "https://www.shutterstock.com/image-photo/above-table-top-view-female-600nw-1831476562.jpg",
    slug: "courier-service"
  }
];

// Carousel Component
interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, className = "" }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-white"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-white"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ category: CategoryItem }> = ({ category }) => {
  return (
    <div className="flex-shrink-0 w-32 text-center cursor-pointer group">
      <div className="relative mb-3 overflow-hidden rounded-lg bg-white">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
        {category.name}
      </p>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: FirebaseProduct }> = ({ product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      // Navigate to product detail page to see variations
      navigate(`/product/${product.id}`);
      return;
    }
    
    addItem(product.id || '', product.name, product.price);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card 
      className="flex-shrink-0 w-64 hover:shadow-lg transition-shadow duration-200 border-0 cursor-pointer"
      onClick={handleProductClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          
          {product.badge && (
            <Badge 
              className={`absolute top-2 left-2 ${
                product.badge === 'Bestseller' ? 'bg-green-600' :
                product.badge === 'New Arrival' ? 'bg-blue-600' :
                product.badge === 'Sale' || product.badge === 'Flash Deal' ? 'bg-red-600' :
                product.badge === 'Limited' ? 'bg-purple-600' :
                'bg-orange-600'
              }`}
            >
              {product.badge}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${
              isWishlisted ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
            onClick={toggleWishlist}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full bg-white border border-gray-300 hover:bg-white text-gray-700 rounded-full py-2 px-4 font-medium transition-colors duration-200"
            disabled={!product.inStock}
          >
            {product.variants && product.variants.length > 0 ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Section Header Component
const SectionHeader: React.FC<{ title: string; viewAllLink?: string }> = ({ 
  title, 
  viewAllLink 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {viewAllLink && (
        <Button variant="link" className="text-orange-600 hover:text-orange-700 p-0">
          View all →
        </Button>
      )}
    </div>
  );
};

// Main Component
const ThreeRowCarousels: React.FC = () => {
  const [foodProducts, setFoodProducts] = useState<FirebaseProduct[]>([]);
  const [decorativeProducts, setDecorativeProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Load food products (limit to 6 for carousel)
        const foodItems = await getProductsByCategory('food', 6);
        setFoodProducts(foodItems);
        
        // Load decorative products (limit to 6 for carousel)
        const decorativeItems = await getProductsByCategory('decorative', 6);
        setDecorativeProducts(decorativeItems);
        
      } catch (error) {
        console.error('Error loading carousel products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* First Carousel: Categories */}
        <section className="mb-12">
          <SectionHeader title="Get it all right here" viewAllLink="/categories" />
          <Carousel>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Carousel>
        </section>

        {/* Second Carousel: Featured Food Items */}
        <section className="mb-12">
          <SectionHeader title="Save on Popular Food Items" viewAllLink="/food-items" />
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : foodProducts.length > 0 ? (
            <Carousel>
              {foodProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No food products available
            </div>
          )}
        </section>

        {/* Third Carousel: Home Decor */}
        <section className="mb-12">
          <SectionHeader title="Flash Deals on Decor" viewAllLink="/home-decor" />
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : decorativeProducts.length > 0 ? (
            <Carousel>
              {decorativeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No decorative products available
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ThreeRowCarousels;

