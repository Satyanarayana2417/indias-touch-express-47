// 🧪 SIMPLE PRODUCT TEST SCRIPT
// Run this in the browser console to quickly test product functionality

console.log('🧪 Starting Simple Product Test...');

// Test 1: Check if we're in dev mode
const testDevMode = () => {
  console.log('\n1️⃣ Development Mode Test:');
  
  const isDev = import.meta?.env?.DEV;
  const apiKey = import.meta?.env?.VITE_FIREBASE_API_KEY;
  
  console.log('- import.meta.env.DEV:', isDev);
  console.log('- API Key defined:', !!apiKey && apiKey !== 'placeholder-api-key');
  
  const calculatedDevMode = isDev || !apiKey || apiKey === 'placeholder-api-key' || apiKey === 'demo';
  console.log('- Calculated dev mode:', calculatedDevMode);
  
  return calculatedDevMode;
};

// Test 2: Check localStorage products
const testLocalStorage = () => {
  console.log('\n2️⃣ LocalStorage Test:');
  
  const products = localStorage.getItem('dev_products');
  console.log('- dev_products exists:', !!products);
  
  if (products) {
    try {
      const parsed = JSON.parse(products);
      console.log('- Products count:', parsed.length);
      parsed.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.category})`);
      });
      return parsed;
    } catch (e) {
      console.log('- Parse error:', e.message);
      return [];
    }
  } else {
    console.log('- No products found in localStorage');
    return [];
  }
};

// Test 3: Add a test product directly to localStorage
const addTestProductDirectly = () => {
  console.log('\n3️⃣ Direct Product Addition Test:');
  
  const existingProducts = JSON.parse(localStorage.getItem('dev_products') || '[]');
  
  const testProduct = {
    id: 'test_' + Date.now(),
    name: 'Test Product ' + Date.now(),
    name_lowercase: 'test product ' + Date.now(),
    price: '₹199',
    image: 'https://via.placeholder.com/300x200.jpg',
    description: 'This is a test product to check visibility',
    category: 'test',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  existingProducts.push(testProduct);
  localStorage.setItem('dev_products', JSON.stringify(existingProducts));
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('dev-products-updated', { 
    detail: { products: existingProducts }
  }));
  
  console.log('- Test product added:', testProduct.name);
  console.log('- Total products now:', existingProducts.length);
  console.log('- Event dispatched: dev-products-updated');
  
  return testProduct;
};

// Test 4: Try to trigger subscriptions manually
const testSubscription = () => {
  console.log('\n4️⃣ Subscription Test:');
  
  if (typeof subscribeToProducts === 'undefined') {
    console.log('- subscribeToProducts function not available');
    return;
  }
  
  console.log('- Testing subscription...');
  let callCount = 0;
  
  const unsubscribe = subscribeToProducts((products) => {
    callCount++;
    console.log(`- Subscription callback #${callCount}:`, products.length, 'products');
    
    if (callCount === 1) {
      // Show first few products
      products.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name}`);
      });
    }
    
    // Stop after 3 calls to avoid spam
    if (callCount >= 3) {
      unsubscribe();
      console.log('- Subscription stopped after 3 calls');
    }
  });
  
  console.log('- Subscription active, waiting for updates...');
  
  // Auto-stop after 5 seconds
  setTimeout(() => {
    try {
      unsubscribe();
      console.log('- Subscription auto-stopped after 5 seconds');
    } catch (e) {
      console.log('- Subscription already stopped');
    }
  }, 5000);
};

// Test 5: Check if admin products page is loaded
const testAdminPage = () => {
  console.log('\n5️⃣ Admin Page Test:');
  
  const isAdminProductsPage = window.location.pathname.includes('/admin/products');
  console.log('- On admin products page:', isAdminProductsPage);
  
  // Look for admin-specific elements
  const adminElements = [
    'table', // Products table
    '[data-testid*="product"]', // Product elements
    'button[data-testid="add-product"]', // Add product button
    '.admin' // Admin-specific classes
  ];
  
  adminElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`- ${selector}:`, elements.length, 'elements');
  });
  
  // Check for "No products found" message
  const noProductsText = document.body.textContent?.includes('No products found');
  console.log('- "No products found" visible:', noProductsText);
};

// Main test runner
const runSimpleTest = async () => {
  console.log('🚀 Running Simple Product Test Suite...');
  console.log('=' .repeat(40));
  
  const isDevMode = testDevMode();
  const existingProducts = testLocalStorage();
  testAdminPage();
  
  if (isDevMode) {
    console.log('\n✅ Development mode detected - using localStorage');
    
    if (existingProducts.length === 0) {
      console.log('\n⚠️ No products found - adding test product...');
      addTestProductDirectly();
    } else {
      console.log('\n✅ Products found in localStorage');
    }
    
    testSubscription();
  } else {
    console.log('\n✅ Production mode detected - should use Firebase');
    
    if (typeof db !== 'undefined') {
      console.log('- Firebase available');
      testSubscription();
    } else {
      console.log('- Firebase not available');
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('- Dev Mode:', isDevMode);
  console.log('- Products in localStorage:', existingProducts.length);
  console.log('- subscribeToProducts available:', typeof subscribeToProducts !== 'undefined');
  
  console.log('\n💡 If products still not visible:');
  console.log('1. Check browser console for errors');
  console.log('2. Try refreshing the page');
  console.log('3. Check if you are on the correct admin page');
  console.log('4. Try manually calling: window.location.reload()');
};

// Auto-run
runSimpleTest();

// Make functions available for manual testing
window.testDevMode = testDevMode;
window.testLocalStorage = testLocalStorage;
window.addTestProductDirectly = addTestProductDirectly;
window.testSubscription = testSubscription;
window.runSimpleTest = runSimpleTest;