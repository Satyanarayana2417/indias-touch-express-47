import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import featuredImage from "@/assets/featured-products.jpg";
import heroShipping from "@/assets/hero-shipping.jpg";

/*
  Advanced Mosaic Hero (10 Cards)
  Large screens: custom CSS grid (12 cols, auto rows 120px) with manual placement.
  md: 2-column simplified grid
  mobile: single column stack
*/

const cardBase = "relative overflow-hidden rounded-lg group shadow-md hover:shadow-lg transition-all duration-300 bg-white";
const imageBase = "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105";
const overlayBase = "absolute inset-0";
const innerBase = "relative z-10 flex flex-col h-full p-4";
const tagBase = "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-secondary text-secondary-foreground/90 shadow";
const linkStyle = "mt-2 inline-block text-sm font-medium text-secondary hover:underline";

const GridHero = () => {
  return (
    <section id="hero" className="pt-2 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={"grid gap-6 md:grid-cols-2 lg:[grid-template-columns:repeat(12,minmax(0,1fr))] lg:[grid-auto-rows:120px]"}
        >
          {/* Left Column Card 1 - Top Card (Medium Size) */}
          <article className={`${cardBase} lg:[grid-column:1/4] lg:[grid-row:1/3] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-48 md:h-56 lg:h-full">
              <img src="https://plus.unsplash.com/premium_photo-1669130744503-4939a5bcef43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aW5kaWFuJTIwc3BpY2VzfGVufDB8fDB8fHww" alt="Free spice sample with aromatic Indian spices" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/40 to-transparent`}></div>
              <div className={`${innerBase} justify-end text-white`}> 
                <h3 className="font-serif font-bold text-lg leading-snug">Free Spice Sample<br/>With First Order</h3>
                <a href="#" className="text-sm font-medium mt-2 underline decoration-secondary/60 hover:decoration-secondary transition-colors">Learn More</a>
              </div>
            </div>
          </article>

          {/* Card 2 - Large Prominent */}
          <article className={`${cardBase} lg:[grid-column:4/10] lg:[grid-row:1/4] flex`}> 
            <div className="relative flex-1 flex flex-col justify-end p-6 lg:p-8">
              <img src="https://i.ibb.co/Fqbv2fGG/IMG-20250911-133122.webp" alt="Global Express Shipping" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 space-y-4">
                <span className={tagBase + " bg-secondary text-secondary-foreground w-fit"}>⚡️ Express Shipping</span>
                <h2 className="font-serif font-bold text-2xl lg:text-4xl leading-tight max-w-xl text-white">
                
                </h2>
                <div>
                 
                </div>
              </div>
            </div>
          </article>

          {/* Top Card (Small Rectangle) - Hot New Arrivals */}
          <article className={`${cardBase} lg:[grid-column:10/13] lg:[grid-row:1/3] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-48 md:h-40 lg:h-full">
              <img src="https://images.unsplash.com/photo-1497990571654-77aa8ec36038?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJyYXNzfGVufDB8fDB8fHww" alt="Hot New Arrivals - trendy decorative item" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/50 to-transparent`} />
              <div className={`${innerBase} justify-end text-white`}> 
                <h3 className="font-serif font-bold text-lg leading-tight">Hot New Arrivals</h3>
                <a href="#" className="text-sm font-medium mt-2 underline decoration-secondary/60 hover:decoration-secondary transition-colors">Shop Now</a>
              </div>
            </div>
          </article>

          {/* Left Column Card 2 - Middle Card (Large Size) */}
          <article className={`${cardBase} lg:[grid-column:1/4] lg:[grid-row:3/6] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-48 md:h-72 lg:h-full">
              <img src="https://artisanhd.com/wp-content/uploads/2017/06/Cluster4-Family.jpg" alt="Vibrant collage of popular food and decorative items" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/50 to-black/10`} />
              <div className={`${innerBase} justify-between text-white`}> 
                <div className="flex-1" />
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-xl leading-tight">Shop Top Categories:<br/>Food & Decor</h3>
                  <div className="flex flex-col gap-2">
                    <a href="#" className="text-sm font-medium underline decoration-secondary/60 hover:decoration-secondary transition-colors">Shop All</a>
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold w-fit">
                      Shop All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Card 5 */}
          <article className={`${cardBase} lg:[grid-column:4/7] lg:[grid-row:4/6]`}> 
            <div className="relative w-full h-48 md:h-56 lg:h-full">
              <img src="https://t3.ftcdn.net/jpg/01/05/94/58/360_F_105945852_XrwXKqIJAXkgz3fBFrXajFZ3nmPNmIo9.jpg" alt="New Artisan Collection" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/30 to-transparent`} />
              <div className={`${innerBase} justify-end text-white`}> 
                <h3 className="font-serif font-bold text-lg">New Artisan Collection</h3>
                <a href="#" className="text-xs font-medium mt-2 underline">Shop now</a>
              </div>
            </div>
          </article>

          {/* Card 6 */}
          <article className={`${cardBase} lg:[grid-column:7/10] lg:[grid-row:4/6]`}> 
            <div className="relative w-full h-48 md:h-56 lg:h-full">
              <img src="https://i.ibb.co/Q7PMmhfw/IMG-20250911-130316.webp" alt="Up to 30% Off" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/40 to-transparent`} />
              <div className={`${innerBase} justify-between text-white`}> 
               
                <div className="mt-auto">
                  <h3 className="font-serif font-bold text-xl"></h3>
                  <a href="#" className="text-xs font-medium mt-2 underline"></a>
                </div>
              </div>
            </div>
          </article>

          {/* Middle Card (Medium, Square-ish) - Festival Gift Catalog */}
          <article className={`${cardBase} lg:[grid-column:10/13] lg:[grid-row:3/5] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-48 md:h-56 lg:h-full">
              <img src="https://images.unsplash.com/photo-1625552186152-668cd2f0b707?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2lmdGJveHxlbnwwfHwwfHx8MA%3D%3D" alt="Festival gift catalog - curated gift box" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/40 to-black/10`} />
              <div className={`${innerBase} justify-center items-center text-center text-white`}> 
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-xl leading-tight">Introducing Our Festival Gift Catalog</h3>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Bottom Card (Large, Tall Rectangle) - Authentic Indian Sweets */}
          <article className={`${cardBase} lg:[grid-column:10/13] lg:[grid-row:5/8] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-64 md:h-80 lg:h-full">
              <img src="https://mithaicana.com/cdn/shop/files/collection-of-indian-sweet-boxes-and-gift-hampers.jpg?v=1715144138&width=1500" alt="Authentic Indian sweets - vibrant assortment" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/50 to-transparent`} />
              <div className={`${innerBase} justify-between text-white`}> 
                <div className="flex-1" />
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-xl leading-tight">Authentic Indian Sweets, Delivered Fresh</h3>
                  <a href="#" className="text-sm font-medium underline decoration-secondary/60 hover:decoration-secondary transition-colors">Shop Now</a>
                  <div className="pt-2">
                    <span className={`${tagBase} bg-secondary text-secondary-foreground`}>⚡️ Express Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Left Column Card 3 - Bottom Card (Small Size) */}
          <article className={`${cardBase} lg:[grid-column:1/4] lg:[grid-row:6/7] hover:transform hover:scale-[1.02] hover:-translate-y-1`}> 
            <div className="relative w-full h-32 md:h-40 lg:h-full">
              <img src="https://images.pexels.com/photos/28645470/pexels-photo-28645470/free-photo-of-rustic-kitchen-scene-with-preserved-vegetables-in-jars.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="High-quality product shot of authentic mango pickle jar" className={imageBase} />
              <div className={`${overlayBase} bg-gradient-to-t from-black/40 to-transparent`} />
              <div className={`${innerBase} justify-end text-white`}> 
                <h3 className="font-serif font-bold text-lg leading-snug">New: Authentic<br/>Mango Pickle</h3>
                <a href="#" className="text-sm font-medium mt-2 underline decoration-secondary/60 hover:decoration-secondary transition-colors">Shop Now</a>
              </div>
            </div>
          </article>

          {/* Card 10 - Wide Banner */}
          <article className={`${cardBase} lg:[grid-column:4/10] lg:[grid-row:6/8] flex bg-secondary text-secondary-foreground`}> 
            <div className="relative flex-1 flex flex-col justify-center p-6 lg:p-10">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-hover/40 to-secondary/20" />
              <div className="relative z-10 space-y-4 max-w-xl">
                <h3 className="font-serif font-bold text-2xl lg:text-3xl leading-tight">Can't find it? Let us source it for you.</h3>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                  Make a Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default GridHero;