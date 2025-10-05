import { useState } from "react";
import { Search, Package, Truck, CheckCircle, MapPin, Clock, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState(null);

  // Mock tracking data
  const mockOrderData = {
    orderNumber: "VE123456789",
    status: "in-transit",
    estimatedDelivery: "Dec 15, 2024",
    currentLocation: "Dubai, UAE",
    timeline: [
      {
        status: "Order Placed",
        date: "Dec 5, 2024",
        time: "10:30 AM",
        location: "Hyderabad, India",
        completed: true,
        description: "Your order has been received and confirmed"
      },
      {
        status: "Order Processed",
        date: "Dec 6, 2024", 
        time: "2:15 PM",
        location: "Hyderabad, India",
        completed: true,
        description: "Items packed and ready for shipment"
      },
      {
        status: "Shipped",
        date: "Dec 7, 2024",
        time: "9:00 AM", 
        location: "Hyderabad, India",
        completed: true,
        description: "Package handed over to courier partner"
      },
      {
        status: "In Transit",
        date: "Dec 10, 2024",
        time: "6:45 PM",
        location: "Dubai, UAE",
        completed: true,
        description: "Package in transit to destination country"
      },
      {
        status: "Customs Clearance",
        date: "Dec 12, 2024",
        time: "Expected",
        location: "New York, USA",
        completed: false,
        description: "Package undergoing customs clearance"
      },
      {
        status: "Out for Delivery",
        date: "Dec 14, 2024", 
        time: "Expected",
        location: "New York, USA",
        completed: false,
        description: "Package out for final delivery"
      },
      {
        status: "Delivered",
        date: "Dec 15, 2024",
        time: "Expected", 
        location: "New York, USA",
        completed: false,
        description: "Package delivered to recipient"
      }
    ],
    packageDetails: {
      weight: "2.5 kg",
      dimensions: "30x20x15 cm",
      contents: "Spices and Food Items",
      value: "₹7,579"
    },
    recipient: {
      name: "John Smith",
      address: "123 Main St, New York, NY 10001, USA",
      phone: "+1 (555) 123-4567"
    }
  };

  const handleTrackOrder = () => {
    if (trackingNumber.trim()) {
      // In a real app, this would make an API call
      setOrderData(mockOrderData);
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (status === "In Transit") {
      return <Truck className="h-6 w-6 text-secondary" />;
    } else {
      return <Package className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your shipment
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-luxury">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">
                    Tracking Number
                  </label>
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter your tracking number (e.g., VE123456789)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleTrackOrder} className="px-8">
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  <p className="text-sm text-soft-gray mt-2">
                    You can find your tracking number in the confirmation email we sent you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-8">
            {/* Status Overview */}
            <Card className="shadow-luxury">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{mockOrderData.orderNumber}</span>
                  <span className="text-lg font-normal text-secondary">
                    {mockOrderData.status === "in-transit" ? "In Transit" : mockOrderData.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-semibold text-primary">Current Location</p>
                    <p className="text-soft-gray">{mockOrderData.currentLocation}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-semibold text-primary">Estimated Delivery</p>
                    <p className="text-soft-gray">{mockOrderData.estimatedDelivery}</p>
                  </div>
                  <div className="text-center">
                    <Package className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-semibold text-primary">Package Weight</p>
                    <p className="text-soft-gray">{mockOrderData.packageDetails.weight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Tracking Timeline */}
              <div className="lg:col-span-2">
                <Card className="shadow-luxury">
                  <CardHeader>
                    <CardTitle>Tracking Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockOrderData.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(event.status, event.completed)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-semibold ${event.completed ? 'text-primary' : 'text-soft-gray'}`}>
                                {event.status}
                              </h3>
                              <span className="text-sm text-soft-gray">
                                {event.date} {event.time}
                              </span>
                            </div>
                            <p className="text-sm text-soft-gray mb-1">{event.location}</p>
                            <p className="text-sm text-soft-gray">{event.description}</p>
                            {index < mockOrderData.timeline.length - 1 && (
                              <div className="mt-4 ml-3 w-0.5 h-6 bg-white"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Package & Recipient Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Package Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-soft-gray">Weight:</span>
                      <span className="font-medium">{mockOrderData.packageDetails.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray">Dimensions:</span>
                      <span className="font-medium">{mockOrderData.packageDetails.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray">Contents:</span>
                      <span className="font-medium">{mockOrderData.packageDetails.contents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray">Value:</span>
                      <span className="font-medium">{mockOrderData.packageDetails.value}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-primary">{mockOrderData.recipient.name}</p>
                      <p className="text-sm text-soft-gray">{mockOrderData.recipient.address}</p>
                      <p className="text-sm text-soft-gray">{mockOrderData.recipient.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3">How long does shipping take?</h3>
                <p className="text-soft-gray text-sm">
                  Standard shipping typically takes 7-14 business days. Express shipping options 
                  are available for 3-7 business days delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3">What if my package is delayed?</h3>
                <p className="text-soft-gray text-sm">
                  In case of delays due to customs or other factors, we'll notify you immediately 
                  and provide updated delivery estimates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3">Can I change my delivery address?</h3>
                <p className="text-soft-gray text-sm">
                  Address changes are possible before the package leaves India. Contact our 
                  support team as soon as possible for assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3">Is my package insured?</h3>
                <p className="text-soft-gray text-sm">
                  Basic insurance is included with all shipments. Additional insurance coverage 
                  is available for high-value items.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
