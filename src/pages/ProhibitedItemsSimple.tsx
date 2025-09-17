import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProhibitedItemsSimple = () => {
  console.log('ProhibitedItemsSimple component rendering...');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Prohibited Items - Simple Test</h1>
          <p className="text-center text-lg mb-8">
            This is a simplified version to test navigation. If you can see this, 
            the routing is working properly.
          </p>
          <div className="bg-blue-100 p-6 rounded-lg text-center">
            <p className="text-blue-800">
              Navigation test successful! The issue might be with complex components 
              or data in the main ProhibitedItems page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProhibitedItemsSimple;