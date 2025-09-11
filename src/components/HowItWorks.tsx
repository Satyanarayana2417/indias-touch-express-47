import { Search, Package, Truck, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "You Request or Shop",
      description: "Browse our products or tell us what specific items you need from India. We source everything with care.",
      step: "01"
    },
    {
      icon: Package,
      title: "We Pack with Care",
      description: "Our expert team carefully packs your items using premium materials to ensure they arrive in perfect condition.",
      step: "02"
    },
    {
      icon: Truck,
      title: "Express Shipping",
      description: "We use trusted international courier services to ship your package with full tracking and insurance.",
      step: "03"
    },
    {
      icon: CheckCircle,
      title: "Delivered Worldwide",
      description: "Receive your authentic Indian items anywhere in the world, typically within 7-14 business days.",
      step: "04"
    }
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Simple, transparent, and reliable. Our proven process ensures your 
            Indian favorites reach you safely, no matter where you are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Step Number - Above Icon */}
                <div className="mx-auto w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.step}
                </div>

                {/* Icon Container */}
                <div className="relative mx-auto w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                  <Icon className="h-10 w-10 text-secondary" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-secondary">
                    {step.title}
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-primary-foreground/20"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-primary-foreground/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Join thousands of satisfied customers who trust Venkat Express 
              for their authentic Indian product needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Shopping Now
              </button>
              <button className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;