import { ArrowRight, Package, Home, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import featuredImage from "@/assets/featured-products.jpg";

const GridHero = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 h-auto md:h-[500px]">
          
          {/* Main Hero Card - Large */}
          <Card className="md:col-span-2 lg:col-span-3 md:row-span-2 group relative overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[300px] flex flex-col">
                <img
                  src={featuredImage}
                  alt="New Arrivals in Authentic Indian Flavors"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20"></div>
                <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                  <div className="space-y-3">
                    <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      New Arrivals
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-serif font-bold leading-tight">
                      New in Authentic Indian Flavors
                    </h2>
                    <p className="text-white/90 text-sm lg:text-base">
                      Spices, Snacks & More
                    </p>
                    <Button 
                      size="lg"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold w-fit"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decorative Items Card - Medium */}
          <Card className="md:col-span-2 lg:col-span-2 group relative overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[200px] flex flex-col">
                <img
                  src={featuredImage}
                  alt="Beautify Your Home with Indian Decor"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-secondary" />
                      <span className="text-secondary text-sm font-semibold">Home Decor</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold">
                      Beautify Your Home
                    </h3>
                    <p className="text-white/90 text-sm">
                      Explore our new collection
                    </p>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-primary text-sm w-fit"
                    >
                      Shop Decor
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courier Service Card - Small */}
          <Card className="md:col-span-2 lg:col-span-1 group relative overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary to-primary-hover">
            <CardContent className="p-4 h-full flex flex-col justify-center text-white text-center min-h-[200px]">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">
                    Ship Parcels Worldwide
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    Fast, reliable service from India
                  </p>
                  <Button 
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold"
                  >
                    Get a Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer Card - Small */}
          <Card className="md:col-span-2 lg:col-span-2 group relative overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-secondary to-secondary-hover">
            <CardContent className="p-4 h-full flex items-center min-h-[200px]">
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-secondary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-lg text-secondary-foreground mb-1">
                    Top Brands, Now Shipping
                  </h3>
                  <p className="text-secondary-foreground/80 text-sm mb-3">
                    Your favorite Indian brands, delivered
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-semibold"
                  >
                    Explore Brands
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Promo Card - Small */}
          <Card className="md:col-span-2 lg:col-span-1 group relative overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[200px] flex flex-col">
                <img
                  src={featuredImage}
                  alt="Premium Quality Products"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white text-center">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mx-auto">
                      <Package className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <h3 className="text-sm font-serif font-bold">
                      Premium Quality
                    </h3>
                    <p className="text-white/90 text-xs">
                      Handpicked products
                    </p>
                    <Button 
                      size="sm"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs font-semibold w-full"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default GridHero;