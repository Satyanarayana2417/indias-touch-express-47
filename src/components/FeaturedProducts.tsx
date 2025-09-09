import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import featuredImage from "@/assets/featured-products.jpg";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Premium Basmati Rice",
      price: "$24.99",
      originalPrice: "$29.99",
      rating: 4.8,
      reviews: 156,
      image: featuredImage,
      badge: "Best Seller",
      description: "Authentic long-grain basmati rice from the foothills of Himalayas"
    },
    {
      id: 2,
      name: "Spice Collection Box",
      price: "$45.99",
      originalPrice: "$55.99",
      rating: 4.9,
      reviews: 89,
      image: featuredImage,
      badge: "Premium",
      description: "Handpicked spices including cardamom, cinnamon, and saffron"
    },
    {
      id: 3,
      name: "Brass Decorative Diya Set",
      price: "$34.99",
      originalPrice: "$42.99",
      rating: 4.7,
      reviews: 67,
      image: featuredImage,
      badge: "Handcrafted",
      description: "Traditional brass oil lamps, perfect for festivals and decor"
    },
    {
      id: 4,
      name: "Organic Turmeric Powder",
      price: "$16.99",
      originalPrice: "$19.99",
      rating: 4.9,
      reviews: 234,
      image: featuredImage,
      badge: "Organic",
      description: "Pure, organic turmeric powder with high curcumin content"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Discover our most popular authentic Indian products, carefully selected 
            for quality and shipped fresh to your doorstep.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden border hover:shadow-luxury transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                    {product.badge}
                  </div>
                  
                  {/* Wishlist Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-soft-gray hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Quick Add to Cart - appears on hover */}
                  <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-primary line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-soft-gray line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-secondary fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-soft-gray">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-sm text-soft-gray line-through">
                      {product.originalPrice}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                      Save {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;