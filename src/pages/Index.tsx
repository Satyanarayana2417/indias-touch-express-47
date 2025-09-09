import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GridHero from "@/components/GridHero";
import ServiceSelection from "@/components/ServiceSelection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <GridHero />
        <ServiceSelection />
        <FeaturedProducts />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
