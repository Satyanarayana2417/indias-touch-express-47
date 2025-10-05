// 🔍 PRODUCT VISIBILITY DEBUG SCRIPT
// Run this in your browser console to diagnose why products aren't showing

console.log('🔍 Starting Product Visibility Diagnostic...');

// 1. Check development mode detection
const checkDevMode = () => {
  console.log('\n📊 Development Mode Check:');
  console.log('- import.meta.env.DEV:', import.meta.env?.DEV);
  console.log('- VITE_FIREBASE_API_KEY:', import.meta.env?.VITE_FIREBASE_API_KEY);
  
  const isDevMode = import.meta.env?.DEV || 
                    import.meta.env?.VITE_FIREBASE_API_KEY === undefined || 
                    import.meta.env?.VITE_FIREBASE_API_KEY === "placeholder-api-key" ||
                    import.meta.env?.VITE_FIREBASE_API_KEY === "demo";
                    
  console.log('- Calculated isDevMode:', isDevMode);
  return isDevMode;
};

// 2. Check localStorage products
const checkLocalStorage = () => {
  console.log('\n💾 LocalStorage Check:');
  
  // Check both possible keys
  const devProducts1 = localStorage.getItem('dev_products');
  const devProducts2 = localStorage.getItem('devProducts');
  
  console.log('- dev_products key:', devProducts1 ? 'EXISTS' : 'EMPTY');
  console.log('- devProducts key:', devProducts2 ? 'EXISTS' : 'EMPTY');
  
  if (devProducts1) {
    try {
      const products1 = JSON.parse(devProducts1);
      console.log('- dev_products count:', products1.length);
      console.log('- dev_products sample:', products1.slice(0, 2));
    } catch (e) {
      console.log('- dev_products parse error:', e.message);
    }
  }
  
  if (devProducts2) {
    try {
      const products2 = JSON.parse(devProducts2);
      console.log('- devProducts count:', products2.length);
      console.log('- devProducts sample:', products2.slice(0, 2));
    } catch (e) {
      console.log('- devProducts parse error:', e.message);
    }
  }
  
  // Check all localStorage keys for products
  console.log('\n🔑 All localStorage keys containing "product":');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.toLowerCase().includes('product')) {
      console.log(`- ${key}:`, localStorage.getItem(key)?.substring(0, 100) + '...');
    }
  }
};

// 3. Check Firebase connection
const checkFirebase = () => {
  console.log('\n🔥 Firebase Check:');
  console.log('- db available:', typeof db !== 'undefined');
  console.log('- auth available:', typeof auth !== 'undefined');
  
  if (typeof db !== 'undefined') {
    console.log('- Firebase app:', db.app.name);
    console.log('- Project ID:', db.app.options.projectId);
  }
};

// 4. Test product functions
const testProductFunctions = async () => {
  console.log('\n🔧 Function Tests:');
  
  // Test getAllProducts
  if (typeof getAllProducts !== 'undefined') {
    try {
      console.log('- Testing getAllProducts...');
      const products = await getAllProducts();
      console.log('- getAllProducts result:', products.length, 'products');
      console.log('- Sample products:', products.slice(0, 2));
    } catch (error) {
      console.log('- getAllProducts error:', error.message);
    }
  } else {
    console.log('- getAllProducts function not available');
  }
  
  // Test subscribeToProducts
  if (typeof subscribeToProducts !== 'undefined') {
    console.log('- Testing subscribeToProducts...');
    try {
      const unsubscribe = subscribeToProducts((products) => {
        console.log('- subscribeToProducts callback:', products.length, 'products');
        unsubscribe(); // Stop after first call
      });
      console.log('- subscribeToProducts: Listening...');
    } catch (error) {
      console.log('- subscribeToProducts error:', error.message);
    }
  } else {
    console.log('- subscribeToProducts function not available');
  }
};

// 5. Check current page context
const checkPageContext = () => {
  console.log('\n📍 Page Context:');
  console.log('- Current URL:', window.location.href);
  console.log('- Page title:', document.title);
  
  // Check if we're on admin pages
  const isAdminPage = window.location.pathname.includes('/admin');
  console.log('- Is admin page:', isAdminPage);
  
  // Check for React components in the page
  const reactRoot = document.getElementById('root');
  console.log('- React root found:', !!reactRoot);
  
  // Check for any product-related elements
  const productElements = document.querySelectorAll('[class*="product"], [id*="product"]');
  console.log('- Product-related elements:', productElements.length);
};

// 6. Check authentication state
const checkAuthState = () => {
  console.log('\n🔐 Authentication Check:');
  
  if (typeof auth !== 'undefined' && auth.currentUser) {
    console.log('- User logged in:', auth.currentUser.email);
    console.log('- User UID:', auth.currentUser.uid);
  } else {
    console.log('- No user logged in');
  }
  
  // Check admin context
  const adminData = localStorage.getItem('mockAdminUser');
  if (adminData) {
    try {
      const admin = JSON.parse(adminData);
      console.log('- Mock admin found:', admin.email);
    } catch (e) {
      console.log('- Mock admin parse error');
    }
  } else {
    console.log('- No mock admin found');
  }
};

// 7. Attempt to add a test product
const addTestProduct = async () => {
  console.log('\n➕ Test Product Creation:');
  
  if (typeof addProduct !== 'undefined') {
    const testProduct = {
      name: 'Debug Test Product',
      name_lowercase: 'debug test product',
      price: '₹99',
      image: 'https://via.placeholder.com/300x300.jpg',
      description: 'Test product for debugging',
      category: 'test',
      inStock: true
    };
    
    try {
      console.log('- Creating test product...');
      const productId = await addProduct(testProduct);
      console.log('- Test product created with ID:', productId);
      
      // Check if it's now in storage
      setTimeout(() => {
        checkLocalStorage();
      }, 100);
      
    } catch (error) {
      console.log('- Test product creation failed:', error.message);
    }
  } else {
    console.log('- addProduct function not available');
  }
};

// Main diagnostic function
const runFullDiagnostic = async () => {
  console.log('🚀 Running Full Product Visibility Diagnostic...');
  console.log('='.repeat(50));
  
  const isDevMode = checkDevMode();
  checkLocalStorage();
  checkFirebase();
  checkPageContext();
  checkAuthState();
  
  await testProductFunctions();
  
  console.log('\n💡 Recommendations:');
  
  if (isDevMode) {
    console.log('- You are in DEVELOPMENT mode');
    console.log('- Products should be stored in localStorage');
    
    const hasProducts = localStorage.getItem('dev_products') || localStorage.getItem('devProducts');
    if (!hasProducts) {
      console.log('- ❌ No products found in localStorage');
      console.log('- Try adding a test product...');
      await addTestProduct();
    } else {
      console.log('- ✅ Products found in localStorage');
    }
  } else {
    console.log('- You are in PRODUCTION mode');
    console.log('- Products should be stored in Firebase');
    
    if (typeof db === 'undefined') {
      console.log('- ❌ Firebase not connected');
    } else {
      console.log('- ✅ Firebase connected');
    }
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Check the console for any errors');
  console.log('2. Verify you are logged in as admin');
  console.log('3. Try refreshing the page');
  console.log('4. Try adding a new product manually');
  
  console.log('\n🔍 Diagnostic Complete!');
  console.log('='.repeat(50));
};

// Auto-run the diagnostic
runFullDiagnostic().catch(console.error);

// Make functions available globally for manual testing
window.checkDevMode = checkDevMode;
window.checkLocalStorage = checkLocalStorage;
window.checkFirebase = checkFirebase;
window.testProductFunctions = testProductFunctions;
window.addTestProduct = addTestProduct;
window.runFullDiagnostic = runFullDiagnostic;