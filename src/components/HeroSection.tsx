import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-shipping.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium Indian goods packaging and shipping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
            From India,{" "}
            <span className="text-secondary">With Love</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your favorite Indian items, delivered worldwide with care and authenticity. 
            10+ years of trusted international shipping.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary-hover text-lg px-8 py-6 font-semibold shadow-gold"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary">10+</div>
              <div className="text-sm text-white/80 font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary">50+</div>
              <div className="text-sm text-white/80 font-medium">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary">10K+</div>
              <div className="text-sm text-white/80 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary">99%</div>
              <div className="text-sm text-white/80 font-medium">Safe Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 right-16 w-16 h-16 bg-white/10 rounded-full animate-pulse hidden lg:block"></div>
    </section>
  );
};

export default HeroSection;