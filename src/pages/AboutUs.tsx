import { Users, Award, Globe, Heart, Package, Truck, Shield, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-shipping.jpg";

const AboutUs = () => {
  const navigate = useNavigate();
  
  const teamMembers = [
    {
      name: "Venkat Sharma",
      role: "Founder & CEO",
      image: heroImage,
      description: "10+ years in international logistics and e-commerce. Passionate about connecting India to the world."
    },
    {
      name: "Priya Reddy", 
      role: "Operations Manager",
      image: heroImage,
      description: "Expert in supply chain management and quality control. Ensures every package meets our standards."
    },
    {
      name: "Ravi Kumar",
      role: "Customer Experience Lead", 
      image: heroImage,
      description: "Dedicated to providing exceptional customer service and building lasting relationships."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We source only genuine, high-quality products directly from trusted suppliers and artisans across India."
    },
    {
      icon: Shield,
      title: "Trust & Reliability", 
      description: "Our commitment to safe packaging, timely delivery, and transparent communication has earned customer trust worldwide."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting Indian culture and products to diaspora communities and enthusiasts in 50+ countries worldwide."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Supporting local artisans, farmers, and small businesses while preserving traditional Indian crafts and flavors."
    }
  ];

  const milestones = [
    { year: "2014", event: "Founded Venkat Express in Hyderabad", description: "Started with a vision to bridge India and the world" },
    { year: "2016", event: "Expanded to 10 countries", description: "Growing customer base across US, UK, Canada, and Australia" },
    { year: "2018", event: "Launched online platform", description: "Made shopping easier with our user-friendly website" },
    { year: "2020", event: "Partnered with 100+ artisans", description: "Supporting traditional craftsmen and small businesses" },
    { year: "2022", event: "Achieved 10,000+ orders", description: "Milestone in customer satisfaction and trust" },
    { year: "2024", event: "Serving 50+ countries", description: "Expanding our global footprint" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Back Button */}
      <div className="container mx-auto px-4 pt-4 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="About Venkat Express"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-hero"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              About Venkat Express
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              For over a decade, we've been the trusted bridge connecting India's authentic 
              flavors and crafts to the world, one carefully packed shipment at a time.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Our Story
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-soft-gray leading-relaxed">
                    Founded in 2014 in the vibrant city of Hyderabad, Venkat Express began with a simple yet powerful mission: 
                    to help the Indian diaspora and international food enthusiasts access authentic Indian products with ease and confidence.
                  </p>
                  <p className="text-lg text-soft-gray leading-relaxed">
                    What started as a small courier service has grown into a comprehensive e-commerce platform, serving customers 
                    in over 50 countries. We've built our reputation on trust, quality, and an unwavering commitment to bringing 
                    the taste of home to Indians living abroad.
                  </p>
                  <p className="text-lg text-soft-gray leading-relaxed">
                    Today, we're proud to work with hundreds of trusted suppliers, artisans, and farmers across India, 
                    ensuring that every product we ship carries the authentic essence of our incredible subcontinent.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="text-center p-6">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-secondary mb-2">10+</div>
                      <p className="text-sm text-soft-gray">Years of Experience</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center p-6">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-secondary mb-2">50+</div>
                      <p className="text-sm text-soft-gray">Countries Served</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center p-6">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-secondary mb-2">15K+</div>
                      <p className="text-sm text-soft-gray">Happy Customers</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center p-6">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-secondary mb-2">99%</div>
                      <p className="text-sm text-soft-gray">Safe Delivery Rate</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                Our Values
              </h2>
              <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                These core principles guide everything we do, from sourcing products to delivering them to your doorstep.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="group text-center hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary mb-4">{value.title}</h3>
                      <p className="text-soft-gray leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                A decade of growth, innovation, and building trust with customers worldwide.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm mb-2">
                        {milestone.year}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-16 bg-primary-foreground/20 mx-auto"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary mb-2">{milestone.event}</h3>
                      <p className="text-primary-foreground/80">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                The passionate people behind Venkat Express, dedicated to bringing you the best of India.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="group text-center hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{member.name}</h3>
                    <p className="text-secondary font-medium mb-4">{member.role}</p>
                    <p className="text-soft-gray text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                Why Choose Venkat Express?
              </h2>
              <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                Here's what sets us apart from other international shipping services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Package className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">Expert Packaging</h3>
                <p className="text-soft-gray text-sm">
                  Specialized packaging techniques to ensure your items arrive fresh and intact.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Truck className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">Fast Shipping</h3>
                <p className="text-soft-gray text-sm">
                  Express delivery options with tracking to get your orders to you quickly.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">Quality Assured</h3>
                <p className="text-soft-gray text-sm">
                  Rigorous quality checks and partnerships with trusted suppliers.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">24/7 Support</h3>
                <p className="text-soft-gray text-sm">
                  Round-the-clock customer support to assist with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust Venkat Express for their authentic Indian product needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold px-8">
                Start Shopping
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold px-8"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
