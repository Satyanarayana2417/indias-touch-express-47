import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import GridHero from "@/components/GridHero";
import ProductShowcaseRows from "@/components/ProductShowcaseRows";
import ServiceSelection from "@/components/ServiceSelection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import { ProductRequestBanner } from "@/components/ProductRequestBanner";
import ThreeRowCarousels from "@/components/ThreeRowCarousels";

const Index = () => {
  const location = useLocation();

  // Function to scroll to hero section
  const scrollToHero = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to top if hero section not found
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check if we need to scroll to hero section after navigation
  useEffect(() => {
    if (location.state?.scrollToHero) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        scrollToHero();
      }, 100);
    }
  }, [location.state]);

  return (
    <Layout>
      <GridHero />
      <ProductShowcaseRows />
      <div className="container mx-auto px-4 py-8">
        <ProductRequestBanner />
      </div>
      <ThreeRowCarousels />
      <ServiceSelection />
      <HowItWorks />
    </Layout>
  );
};

export default Index;
