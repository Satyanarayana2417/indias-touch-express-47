// 🔧 ADMIN PRODUCTS VISIBILITY FIX
// Run this script in your browser console on the admin products page

console.log('🔧 Admin Products Visibility Fix Script');
console.log('=====================================');

// Step 1: Check if we're on the right page
if (!window.location.pathname.includes('/admin/products')) {
  console.log('❌ Not on admin products page. Please navigate to /admin/products first.');
  console.log('Current page:', window.location.pathname);
} else {
  console.log('✅ On admin products page');
}

// Step 2: Check development mode
const checkDevMode = () => {
  const isDev = import.meta?.env?.DEV;
  console.log('\n📊 Development Mode Check:');
  console.log('- import.meta.env.DEV:', isDev);
  
  if (isDev) {
    console.log('✅ Development mode active - products should be in localStorage');
    return true;
  } else {
    console.log('✅ Production mode active - products should be in Firebase');
    return false;
  }
};

// Step 3: Check products in localStorage
const checkAndFixLocalStorage = () => {
  console.log('\n💾 LocalStorage Products Check:');
  
  const products = localStorage.getItem('dev_products');
  if (products) {
    try {
      const parsed = JSON.parse(products);
      console.log('✅ Found', parsed.length, 'products in localStorage');
      
      // Show first few products
      parsed.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.category}) - ${p.price}`);
      });
      
      return parsed;
    } catch (e) {
      console.log('❌ Error parsing localStorage products:', e.message);
      return [];
    }
  } else {
    console.log('❌ No products found in localStorage');
    console.log('🔧 Adding a test product...');
    
    // Add a test product
    const testProduct = {
      id: 'fix_test_' + Date.now(),
      name: 'Fix Test Product',
      name_lowercase: 'fix test product',
      price: '₹199',
      image: 'https://via.placeholder.com/300x200.jpg?text=Test+Product',
      description: 'Test product added by fix script',
      category: 'test',
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newProducts = [testProduct];
    localStorage.setItem('dev_products', JSON.stringify(newProducts));
    
    // Dispatch the update event
    window.dispatchEvent(new CustomEvent('dev-products-updated', { 
      detail: { products: newProducts }
    }));
    
    console.log('✅ Test product added and event dispatched');
    return newProducts;
  }
};

// Step 4: Force trigger subscriptions
const triggerSubscriptions = () => {
  console.log('\n📡 Triggering Subscription Updates:');
  
  // Get current products
  const products = JSON.parse(localStorage.getItem('dev_products') || '[]');
  
  // Dispatch events to trigger subscriptions
  window.dispatchEvent(new CustomEvent('dev-products-updated', { 
    detail: { products }
  }));
  
  // Also trigger storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'dev_products',
    newValue: JSON.stringify(products),
    storageArea: localStorage
  }));
  
  console.log('✅ Subscription events dispatched');
  console.log('- dev-products-updated event sent');
  console.log('- storage event sent');
};

// Step 5: Force refresh the admin products page
const forceRefresh = () => {
  console.log('\n🔄 Force Refreshing Admin Products:');
  
  // Try to find and trigger the refresh button
  const refreshButton = document.querySelector('button[data-testid="refresh"], button:has([data-lucide="refresh-cw"])');
  if (refreshButton) {
    console.log('✅ Found refresh button, clicking...');
    refreshButton.click();
  } else {
    console.log('❌ Refresh button not found, trying manual refresh...');
    
    // Try to trigger a manual refresh if functions are available
    if (typeof getAllProducts !== 'undefined') {
      console.log('🔧 Calling getAllProducts directly...');
      getAllProducts().then(products => {
        console.log('✅ Got', products.length, 'products directly');
        triggerSubscriptions();
      }).catch(err => {
        console.log('❌ Error getting products:', err.message);
      });
    } else {
      console.log('❌ getAllProducts function not available');
    }
  }
};

// Step 6: Check for errors
const checkForErrors = () => {
  console.log('\n🔍 Checking for Common Issues:');
  
  // Check if React is loaded
  const reactRoot = document.getElementById('root');
  console.log('- React root element:', !!reactRoot);
  
  // Check for admin authentication
  const adminAuth = localStorage.getItem('mockAdminUser');
  console.log('- Admin authentication:', !!adminAuth);
  
  if (adminAuth) {
    try {
      const admin = JSON.parse(adminAuth);
      console.log('- Admin email:', admin.email);
    } catch (e) {
      console.log('- Admin auth parse error');
    }
  }
  
  // Check for any console errors
  console.log('- Check browser console for any red error messages');
  
  // Check if product table/list is rendered
  const productTable = document.querySelector('table, [data-testid*="product"]');
  console.log('- Product display elements found:', !!productTable);
  
  // Check for "No products found" message
  const noProductsMessage = Array.from(document.querySelectorAll('*')).find(el => 
    el.textContent?.includes('No products found') || el.textContent?.includes('No products')
  );
  console.log('- "No products found" message visible:', !!noProductsMessage);
};

// Main fix function
const runFix = async () => {
  console.log('🚀 Running Complete Fix...\n');
  
  const isDevMode = checkDevMode();
  
  if (isDevMode) {
    const products = checkAndFixLocalStorage();
    triggerSubscriptions();
    
    // Wait a moment then check again
    setTimeout(() => {
      console.log('\n⏱️ Checking again after 2 seconds...');
      const currentProducts = JSON.parse(localStorage.getItem('dev_products') || '[]');
      console.log('- Products in localStorage:', currentProducts.length);
      
      checkForErrors();
      
      console.log('\n💡 Next Steps:');
      console.log('1. Check if products are now visible on the page');
      console.log('2. Try clicking the "Refresh" button manually');
      console.log('3. Try adding a new product via the form');
      console.log('4. If still not working, try: window.location.reload()');
      
    }, 2000);
  } else {
    checkForErrors();
    console.log('\n💡 Production mode - products should load from Firebase');
    console.log('Check Firebase console for any issues');
  }
  
  forceRefresh();
};

// Auto-run the fix
runFix();

// Make functions available for manual use
window.runProductsFix = runFix;
window.checkAndFixLocalStorage = checkAndFixLocalStorage;
window.triggerSubscriptions = triggerSubscriptions;
window.forceRefresh = forceRefresh;