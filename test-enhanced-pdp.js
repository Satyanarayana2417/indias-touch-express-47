// Enhanced Product Detail Page - Feature Validation Test
// Run this in browser console on any product detail page

console.log('🚀 Enhanced Product Detail Page - Feature Validation');

// Test 1: Check if dynamic routing is working
const testDynamicRouting = () => {
  const url = window.location.pathname;
  const isProductPage = url.includes('/product/') || url.includes('/products/');
  console.log(`✅ Dynamic Routing: ${isProductPage ? 'WORKING' : 'FAILED'} - URL: ${url}`);
  return isProductPage;
};

// Test 2: Check if product data is loaded
const testProductData = () => {
  const productTitle = document.querySelector('h1');
  const productPrice = document.querySelector('[data-testid="product-price"]') || 
                      document.querySelector('span[class*="font-bold"]');
  const hasData = productTitle && productPrice;
  console.log(`✅ Product Data: ${hasData ? 'LOADED' : 'MISSING'}`);
  return hasData;
};

// Test 3: Check image gallery functionality
const testImageGallery = () => {
  const mainImage = document.querySelector('img[alt*="Image"]');
  const thumbnails = document.querySelectorAll('button img[alt*="Thumbnail"]');
  const hasGallery = mainImage && thumbnails.length > 0;
  console.log(`✅ Image Gallery: ${hasGallery ? 'WORKING' : 'BASIC'} - Main: ${!!mainImage}, Thumbnails: ${thumbnails.length}`);
  return { mainImage: !!mainImage, thumbnails: thumbnails.length };
};

// Test 4: Check variant selection
const testVariantSelection = () => {
  const variantButtons = document.querySelectorAll('button[class*="variant"]') ||
                        document.querySelectorAll('button:contains("g")') ||
                        document.querySelectorAll('div[class*="grid"] button');
  const hasVariants = variantButtons.length > 0;
  console.log(`✅ Variant Selection: ${hasVariants ? 'AVAILABLE' : 'NOT FOUND'} - Count: ${variantButtons.length}`);
  return variantButtons.length;
};

// Test 5: Check add to cart functionality
const testAddToCart = () => {
  const addToCartBtn = document.querySelector('button:contains("Add to Cart")') ||
                      document.querySelector('button[class*="cart"]') ||
                      Array.from(document.querySelectorAll('button')).find(btn => 
                        btn.textContent?.includes('Add to Cart')
                      );
  const hasAddToCart = !!addToCartBtn;
  console.log(`✅ Add to Cart: ${hasAddToCart ? 'FOUND' : 'MISSING'}`);
  return hasAddToCart;
};

// Test 6: Check buy now functionality
const testBuyNow = () => {
  const buyNowBtn = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent?.includes('Buy Now')
  );
  const hasBuyNow = !!buyNowBtn;
  console.log(`✅ Buy Now: ${hasBuyNow ? 'FOUND' : 'MISSING'}`);
  return hasBuyNow;
};

// Test 7: Check mobile responsiveness
const testMobileResponsiveness = () => {
  const viewport = window.innerWidth;
  const isMobile = viewport < 768;
  const hasResponsiveClasses = document.querySelector('[class*="sm:"]') ||
                              document.querySelector('[class*="md:"]') ||
                              document.querySelector('[class*="lg:"]');
  console.log(`✅ Mobile Responsive: ${hasResponsiveClasses ? 'IMPLEMENTED' : 'BASIC'} - Viewport: ${viewport}px`);
  return { viewport, responsive: !!hasResponsiveClasses, isMobile };
};

// Test 8: Check recommended products
const testRecommendedProducts = () => {
  const recommendedSection = document.querySelector('h2:contains("You Might Also Like")') ||
                            Array.from(document.querySelectorAll('h2')).find(h2 => 
                              h2.textContent?.includes('You Might Also Like')
                            );
  const productCards = document.querySelectorAll('[class*="card"]') ||
                      document.querySelectorAll('[class*="product"]');
  const hasRecommended = !!recommendedSection;
  console.log(`✅ Recommended Products: ${hasRecommended ? 'FOUND' : 'MISSING'} - Cards: ${productCards.length}`);
  return { section: hasRecommended, cards: productCards.length };
};

// Test 9: Check stock validation
const testStockValidation = () => {
  const stockIndicator = document.querySelector('[class*="stock"]') ||
                        Array.from(document.querySelectorAll('*')).find(el => 
                          el.textContent?.includes('In Stock') || el.textContent?.includes('Out of Stock')
                        );
  const hasStockInfo = !!stockIndicator;
  console.log(`✅ Stock Validation: ${hasStockInfo ? 'IMPLEMENTED' : 'MISSING'}`);
  return hasStockInfo;
};

// Test 10: Check quantity selector
const testQuantitySelector = () => {
  const quantityButtons = document.querySelectorAll('button[class*="icon"]');
  const quantityInput = document.querySelector('input[type="number"]') ||
                       document.querySelector('span[class*="font-medium"]');
  const hasQuantitySelector = quantityButtons.length >= 2 || !!quantityInput;
  console.log(`✅ Quantity Selector: ${hasQuantitySelector ? 'WORKING' : 'MISSING'}`);
  return hasQuantitySelector;
};

// Run all tests
const runAllTests = () => {
  console.log('\n🧪 Running Enhanced PDP Feature Tests...\n');
  
  const results = {
    dynamicRouting: testDynamicRouting(),
    productData: testProductData(),
    imageGallery: testImageGallery(),
    variantSelection: testVariantSelection(),
    addToCart: testAddToCart(),
    buyNow: testBuyNow(),
    mobileResponsive: testMobileResponsiveness(),
    recommendedProducts: testRecommendedProducts(),
    stockValidation: testStockValidation(),
    quantitySelector: testQuantitySelector()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('=======================');
  
  const passedTests = Object.entries(results).filter(([key, value]) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v === true || (typeof v === 'number' && v > 0));
    }
    return false;
  }).length;
  
  const totalTests = Object.keys(results).length;
  const score = Math.round((passedTests / totalTests) * 100);
  
  console.log(`🎯 Overall Score: ${score}% (${passedTests}/${totalTests} tests passed)`);
  console.log(`📱 Mobile Optimized: ${results.mobileResponsive?.responsive ? '✅' : '❌'}`);
  console.log(`🛒 E-commerce Ready: ${results.addToCart && results.buyNow ? '✅' : '❌'}`);
  console.log(`🎨 Enhanced UI: ${results.imageGallery?.mainImage && results.variantSelection > 0 ? '✅' : '❌'}`);
  
  if (score >= 80) {
    console.log('\n🎉 EXCELLENT! Enhanced PDP is working great!');
  } else if (score >= 60) {
    console.log('\n👍 GOOD! Most features are working, minor issues detected.');
  } else {
    console.log('\n⚠️  NEEDS ATTENTION! Several features need fixing.');
  }
  
  return results;
};

// Export for manual testing
window.testEnhancedPDP = runAllTests;

// Auto-run if on product page
if (window.location.pathname.includes('/product')) {
  setTimeout(runAllTests, 2000); // Wait for page to fully load
} else {
  console.log('📍 Navigate to a product page to run automated tests, or run window.testEnhancedPDP() manually');
}