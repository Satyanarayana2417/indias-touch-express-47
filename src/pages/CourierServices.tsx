import { useState } from "react";
import { Package, Truck, Shield, Clock, Calculator, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CourierServices = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("you-give-we-ship");

  const services = [
    {
      icon: Package,
      title: "You Give, We Ship",
      description: "Send your personal items from India to anywhere in the world",
      features: ["Pickup from your location", "Professional packaging", "Insurance available", "Real-time tracking"],
      pricing: "Starting from ₹2,100"
    },
    {
      icon: Truck,
      title: "We Buy for You",
      description: "We purchase items on your behalf and ship them to you",
      features: ["Personal shopping service", "Quality verification", "Bulk consolidation", "Express shipping"],
      pricing: "Service fee + item cost"
    },
    {
      icon: Shield,
      title: "Express Shipping",
      description: "Fast and secure shipping for urgent deliveries",
      features: ["3-7 day delivery", "Premium packaging", "Full insurance", "Priority handling"],
      pricing: "Starting from ₹3,800"
    }
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
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Courier Services
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Professional courier services from India to the world. Whether you want to send 
              personal items or need us to shop on your behalf, we've got you covered.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                Our Services
              </h2>
              <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                Choose the service that best fits your needs. All services include tracking and insurance options.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="group hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-serif text-primary">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-soft-gray">{service.description}</p>
                      <ul className="space-y-2 text-sm">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center justify-center">
                            <Shield className="h-4 w-4 text-secondary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t">
                        <p className="text-lg font-semibold text-primary">{service.pricing}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shipping Calculator */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                  Get Shipping Quote
                </h2>
                <p className="text-lg text-soft-gray">
                  Calculate your shipping cost and get an instant quote
                </p>
              </div>

              <Card className="shadow-luxury">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Service Selection */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-3">
                          Select Service Type
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="service"
                              value="you-give-we-ship"
                              checked={serviceType === "you-give-we-ship"}
                              onChange={(e) => setServiceType(e.target.value)}
                              className="text-primary"
                            />
                            <span>You Give, We Ship</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="service"
                              value="we-buy-for-you"
                              checked={serviceType === "we-buy-for-you"}
                              onChange={(e) => setServiceType(e.target.value)}
                              className="text-primary"
                            />
                            <span>We Buy for You</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">
                            Package Weight (kg)
                          </label>
                          <Input type="number" placeholder="0.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">
                            Package Type
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="food">Food Items</SelectItem>
                              <SelectItem value="decorative">Decorative Items</SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="books">Books/Documents</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Destination Country
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="sg">Singapore</SelectItem>
                            <SelectItem value="ae">UAE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {serviceType === "we-buy-for-you" && (
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">
                            Item Description
                          </label>
                          <Textarea 
                            placeholder="Describe the items you want us to purchase..."
                            rows={3}
                          />
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-primary">Contact Information</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">
                            First Name
                          </label>
                          <Input placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">
                            Last Name
                          </label>
                          <Input placeholder="Doe" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Email Address
                        </label>
                        <Input type="email" placeholder="john@example.com" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Phone Number
                        </label>
                        <Input type="tel" placeholder="+1 (555) 123-4567" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Delivery Address
                        </label>
                        <Textarea 
                          placeholder="Enter complete delivery address..."
                          rows={3}
                        />
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary-hover font-semibold py-6">
                        <Calculator className="h-5 w-5 mr-2" />
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
                Why Choose Our Courier Services?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                10+ years of experience in international shipping with thousands of satisfied customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary">Secure Packaging</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Professional packaging to ensure your items arrive safely
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary">Fast Delivery</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Express shipping options available for urgent deliveries
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary">Global Reach</h3>
                <p className="text-primary-foreground/80 text-sm">
                  We ship to 50+ countries worldwide with reliable partners
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <Phone className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary">24/7 Support</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Round-the-clock customer support for all your queries
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourierServices;