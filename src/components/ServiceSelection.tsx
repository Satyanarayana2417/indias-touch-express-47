import { ShoppingBag, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ServiceSelection = () => {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Choose Your Service
          </h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Whether you want to shop from our curated collection or send your own items, 
            we've got you covered with our premium services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Shop & Ship Service */}
          <Card className="group relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-luxury">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-bold text-primary">
                  Shop & Ship
                </h3>
                <p className="text-soft-gray leading-relaxed">
                  Browse our curated collection of authentic Indian food items, spices, 
                  and decorative pieces. We'll carefully pack and ship them to your doorstep.
                </p>
              </div>

              <ul className="text-left space-y-2 text-sm text-soft-gray">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Premium Indian spices & food items
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Traditional decorative items
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Quality guaranteed packaging
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Express international shipping
                </li>
              </ul>

              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6"
                size="lg"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>

          {/* Courier Service */}
          <Card className="group relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-luxury">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-bold text-primary">
                  Courier Your Items
                </h3>
                <p className="text-soft-gray leading-relaxed">
                  Have specific items you want to send? We'll collect, pack, and ship 
                  your personal items with the same care and attention to detail.
                </p>
              </div>

              <ul className="text-left space-y-2 text-sm text-soft-gray">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Personal item pickup service
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Custom packaging solutions
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Real-time tracking
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  Insurance coverage available
                </li>
              </ul>

              <Button 
                variant="outline"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-6"
                size="lg"
              >
                Get Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServiceSelection;
