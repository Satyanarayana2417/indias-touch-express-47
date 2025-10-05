import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollapsibleProhibitedCard from "@/components/CollapsibleProhibitedCard";
import { ShieldAlert } from "lucide-react";

// Removed unused CATEGORIES array to prevent potential issues

const ProhibitedItems = () => {
  console.log('ProhibitedItems component rendering...');
  
  // Add error boundary check
  try {

  // Dangerous goods data
  const dangerousGoodsItems = [
    {
      name: "Explosives & Fireworks",
      reason: "Fire and explosion hazard",
      image: "https://img.freepik.com/premium-photo/enjoyable-firecrackers-isolated-white-background_787273-52253.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      name: "Gas Cylinders & Propane",
      reason: "Pressurized and flammable",
      image: "https://thumbs.dreamstime.com/b/creative-abstract-manufacturing-concept-high-quality-d-render-illustration-isolated-white-background-77425462.jpg"
    },
    {
      name: "Firearms & Ammunition",
      reason: "Weapons and security threat",
      image: "https://hips.hearstapps.com/hmg-prod/images/wdqo7vvrqra-1525367089.jpg?resize=640:*"
    },
    {
      name: "Paints & Solvents",
      reason: "Toxic fumes and fire risk",
      image: "https://www.solvents.org.uk/wp-content/uploads/2015/02/sia-paint-solvents-1.jpg"
    },
    {
      name: "Toxic Substances",
      reason: "Health and environmental hazard",
      image: "https://media.istockphoto.com/id/841426282/photo/chemical-products.jpg?s=612x612&w=0&k=20&c=QN3uctUgO1Ve1zwec8_wQ1iJCkk5Ls_71MNKHhiq0E8="
    },
    {
      name: "Lithium Batteries",
      reason: "Fire and explosion risk",
      image: "https://thumbs.dreamstime.com/b/two-used-lithium-button-batteries-white-background-close-up-lie-positive-terminals-selective-focus-205945346.jpg"
    }
  ];

  // Food items data
  const foodItems = [
    {
      name: "Fresh Fruits & Vegetables",
      reason: "Risk of pests and contamination",
      image: "https://media.istockphoto.com/id/512907694/photo/collection-vegetables.jpg?s=612x612&w=0&k=20&c=LGPsT8tp72qkDNwRbA6kr75w1JgzoNl8uklz4B5BxJs="
    },
    {
      name: "Fresh Meat, Poultry & Seafood",
      reason: "Highly perishable, risk of infection",
      image: "https://t3.ftcdn.net/jpg/06/66/04/40/360_F_666044026_nKobnVEmUSCWCgTfr4NniUZ1E4AQ8Vn6.jpg"
    },
    {
      name: "Dairy Products",
      reason: "Spoil quickly during transport",
      image: "https://www.shutterstock.com/image-photo/dairy-products-on-white-background-600nw-577182346.jpg"
    },
    {
      name: "Cooked/Homemade Food",
      reason: "Not allowed for shipping",
      image: "https://img.freepik.com/premium-photo/grilled-chicken-bacon-salad-with-fresh-greens-plate_711700-30875.jpg"
    },
    {
      name: "Raw Eggs & Egg Products",
      reason: "Risk of contamination",
      image: "https://tiimg.tistatic.com/fp/1/007/849/fresh-nutrients-enriched-high-in-protien-vitamins-healthy-white-eggs--496.jpg"
    },
    {
      name: "Liquid Food Items",
      reason: "Large quantities restricted",
      image: "https://www.shutterstock.com/image-photo/set-alcohol-drinks-glasses-isolated-600nw-138005636.jpg"
    },
    {
      name: "Seeds, Nuts & Plants",
      reason: "Can spread plant diseases",
      image: "https://img.freepik.com/premium-photo/pile-nuts-seeds-white-background_664644-5404.jpg"
    },
    {
      name: "Alcoholic Beverages",
      reason: "Restricted in many regions",
      image: "https://thumbs.dreamstime.com/b/bottles-glasses-assorted-alcoholic-beverages-over-white-background-46894302.jpg"
    },
    {
      name: "Baby Food & Formula",
      reason: "Large quantities restricted",
      image: "https://img.freepik.com/premium-photo/png-plate-baby-puree-isolated-white-background_185193-164089.jpg?semt=ais_incoming&w=740&q=80"
    },
    {
      name: "Powdered Food Items",
      reason: "Security restrictions at airports",
      image: "https://media.istockphoto.com/id/1170112938/photo/turmeric-pepper-powder-and-dried-parsley-shot-from-above-on-white-background.jpg?s=612x612&w=0&k=20&c=FvjtYniqWdUJgyb8YeHrQPBat487FdD2bGSFINfb-3M="
    },
    {
      name: "Canned Food",
      reason: "High liquid content restricted",
      image: "https://img.freepik.com/free-vector/set-tin-food_1308-26262.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      name: "Spices (Large Quantities)",
      reason: "Customs regulations apply",
      image: "https://thumbs.dreamstime.com/b/spices-herbs-white-background-top-view-208329519.jpg"
    },
    {
      name: "Rice",
      reason: "Quarantine restrictions in many countries",
      image: "https://img.freepik.com/premium-photo/dry-white-long-rice-basmati-wooden-bowl-isolated-white-background_434420-1800.jpg"
    },
    {
      name: "Salt",
      reason: "Large quantities restricted, customs regulations",
      image: "https://media.istockphoto.com/id/1302310204/photo/salt-crystals-in-a-wooden-plate-on-a-white-background-top-view.jpg?s=612x612&w=0&k=20&c=LUmBnVIjAVA0bhUttIbDkus8JPSC5N1AuQAB9FNue6I="
    }
  ];

  // Illegal / Restricted Substances data
  const illegalSubstancesItems = [
    {
      name: "Narcotics, Drugs & Cannabis",
      reason: "Illegal controlled substances",
      image: "https://st2.depositphotos.com/3562409/7419/i/950/depositphotos_74196287-stock-photo-no-drugs.jpg"
    },
    {
      name: "Prescription Medicines Without Authorization",
      reason: "Requires proper medical authorization",
      image: "https://media.istockphoto.com/id/183367047/photo/mixed-medicine-many-pills-and-capsules.jpg?s=612x612&w=0&k=20&c=CLMM0Zrb2s3lTzlJa4gQ5FtJ0DoiPyZ0I-vcehCVI2w="
    },
    {
      name: "Alcoholic Beverages (Restricted Countries)",
      reason: "Banned or heavily restricted in many regions",
      image: "https://media.istockphoto.com/id/176977772/photo/different-alcoholic-drinks.jpg?s=612x612&w=0&k=20&c=VtfIpbI-ouq7lKgipVsXnrz3COAlEGM2sKvWxxNUnY8="
    }
  ];

  // High-Value & Restricted Items data
  const highValueItems = [
    {
      name: "Currency Notes, Coins & Traveler's Cheques",
      reason: "High theft risk, legal restrictions",
      image: "https://img.freepik.com/premium-photo/close-up-view-donation-plate-with-indian-banknotes-coins-white-background_380726-857.jpg"
    },
    {
      name: "Precious Metals (Gold, Silver, Platinum)",
      reason: "Extremely high value, theft risk",
      image: "https://swissgoldsafe.ch/wp-content/uploads/2024/06/verschiedene_gold_und_silber_barren_web_2-1-1.jpeg"
    },
    {
      name: "Precious Stones (Diamonds, Rubies, Emeralds)",
      reason: "High value, requires special insurance",
      image: "https://www.shutterstock.com/image-illustration/diamond-sapphire-ruby-emerald-3d-600nw-672452734.jpg"
    },
    {
      name: "Valuable Jewelry & Watches",
      reason: "High theft risk, insurance limitations",
      image: "https://thumbs.dreamstime.com/b/jewelry-gold-necklaces-rings-bracelets-watch-wealth-40521438.jpg"
    }
  ];

  // Miscellaneous Prohibited Items data
  const miscellaneousItems = [
    {
      name: "Pornographic Material",
      reason: "Varies by country, cultural restrictions",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Counterfeit Goods & Pirated Software",
      reason: "Intellectual property violations",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Cultural Artifacts & Antiques",
      reason: "Restricted in many countries",
      image: "https://thumbs.dreamstime.com/b/set-beautiful-antique-items-picture-frames-furniture-silverware-retro-vintage-isolated-white-background-151870132.jpg"
    },
    {
      name: "Aerosols, Perfumes & Deodorants",
      reason: "Pressurized cans, flammable contents",
      image: "https://img.freepik.com/premium-photo/perfume-bottle-isolated-white-background_900706-23621.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Banner - Mobile Optimized */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=60')] mix-blend-overlay bg-cover bg-center"></div>
          <div className="relative z-10 container mx-auto px-4 py-12 md:py-24 text-center text-white">
            <div className="inline-flex items-center px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-4 md:mb-6 animate-pulse">
              <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 mr-1.5 md:mr-2" />
              <span className="uppercase tracking-wide text-[10px] md:text-xs font-semibold text-yellow-200">Important Compliance Notice</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-6 drop-shadow-sm">Prohibited Items for International Shipping</h1>
            <p className="max-w-3xl mx-auto text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed">
              To protect safety, comply with aviation law, and ensure smooth customs clearance, the following categories of items cannot be shipped through Venkat Express international courier services.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-8 md:py-16 bg-white">
          <div className="container mx-auto px-3 md:px-4">
            {/* Dangerous / Hazardous Goods Card */}
            <CollapsibleProhibitedCard
              title="Dangerous / Hazardous Goods"
              description="Items that pose risk during transport or may cause fire, explosion, or injury"
              headerImage="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=300&q=80"
              items={dangerousGoodsItems}
              colorScheme="red"
              prohibitionMessage="All items in this category are strictly prohibited"
            />

            {/* Food Items Card */}
            <CollapsibleProhibitedCard
              title="Food Items"
              description="Restricted/prohibited food items due to safety, contamination, and customs regulations"
              headerImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80"
              items={foodItems}
              colorScheme="orange"
              prohibitionMessage="Food items require special handling and documentation"
            />

            {/* Illegal / Restricted Substances Card */}
            <CollapsibleProhibitedCard
              title="Illegal / Restricted Substances"
              description="Controlled substances and items with legal restrictions or complete bans"
              headerImage="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=300&q=80"
              items={illegalSubstancesItems}
              colorScheme="purple"
              prohibitionMessage="These substances are strictly prohibited and illegal to ship"
            />

            {/* High-Value & Restricted Items Card */}
            <CollapsibleProhibitedCard
              title="High-Value & Restricted Items"
              description="Valuable items with high theft risk and special insurance requirements"
              headerImage="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=300&q=80"
              items={highValueItems}
              colorScheme="teal"
              prohibitionMessage="High-value items require special handling and insurance coverage"
            />

            {/* Miscellaneous Prohibited Items Card */}
            <CollapsibleProhibitedCard
              title="Miscellaneous Prohibited Items"
              description="Various items restricted due to cultural, legal, or safety considerations"
              headerImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80"
              items={miscellaneousItems}
              colorScheme="slate"
              prohibitionMessage="Items with specific regional or cultural restrictions"
            />
          </div>
        </section>

        {/* Advisory Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none" aria-hidden>
            <div className="absolute -left-10 top-10 w-72 h-72 rounded-full bg-gradient-to-br from-red-400 to-orange-300 blur-3xl"></div>
            <div className="absolute right-0 bottom-10 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 blur-3xl"></div>
          </div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-secondary mb-4 md:mb-6">Why Are These Items Restricted?</h2>
                <p className="text-primary-foreground/80 leading-relaxed mb-4 md:mb-6 text-sm md:text-lg">International air cargo is governed by IATA, ICAO, airline, and destination-country regulations. Shipping prohibited items can result in fines, seizure, or legal action. Our compliance ensures safety, integrity, and smooth delivery for all customers.</p>
                <ul className="space-y-3 text-sm text-primary-foreground/90">
                  <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-secondary rounded-full"></span>Protects airline crew, cargo handlers & passengers</li>
                  <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-secondary rounded-full"></span>Prevents environmental contamination & fire risk</li>
                  <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-secondary rounded-full"></span>Ensures customs & border compliance</li>
                  <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-secondary rounded-full"></span>Avoids shipment delays, penalties or disposal fees</li>
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
                  <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center"><ShieldAlert className="h-6 w-6 mr-2" /> Quick Self-Check</h3>
                  <ol className="list-decimal list-inside space-y-2 text-primary-foreground/80 text-sm mb-6">
                    <li>Is the item flammable, pressurized, or corrosive?</li>
                    <li>Is it a liquid with high alcohol or chemical content?</li>
                    <li>Does it contain batteries that are damaged or loose?</li>
                    <li>Is it restricted by your destination country?</li>
                  </ol>
                  <p className="text-xs text-primary-foreground/60 leading-relaxed">If you are unsure whether an item is allowed, contact our support team before packaging. Declaring contents accurately helps us serve you faster and keeps global logistics safe.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">Need Clarification About an Item?</h2>
              <p className="text-soft-gray mb-6">We are here to help. If your product is not listed above but you suspect it may be restricted, reach out for a compliance check before shipment.</p>
              <a href="/help" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-hover font-medium px-8 py-4 shadow-gold transition focus:outline-none focus:ring-4 focus:ring-secondary/40">
                Contact Support Team
              </a>
              <p className="text-xs text-muted-foreground mt-4">This list is not exhaustive. Regulations are updated periodically based on airline & customs directives.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
  } catch (error) {
    console.error('Error in ProhibitedItems component:', error);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600">There was an error loading the prohibited items page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
};

export default ProhibitedItems;

