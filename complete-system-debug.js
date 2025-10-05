/**
 * 🔧 COMPLETE SYSTEM DEBUG SCRIPT
 * Comprehensive investigation of image upload and product visibility issues
 */

console.log('🚀 Starting Complete System Debug...\n');

// Test 1: Check Firebase Configuration
console.log('=== 1. FIREBASE CONFIGURATION ===');
try {
  const firebase = window.firebase;
  if (firebase) {
    console.log('✅ Firebase SDK loaded');
    
    // Check Auth
    const auth = firebase.auth();
    if (auth?.currentUser) {
      console.log('✅ User authenticated:', auth.currentUser.email);
    } else {
      console.log('❌ User not authenticated');
    }
    
    // Check Firestore
    const db = firebase.firestore();
    if (db) {
      console.log('✅ Firestore available');
    }
    
    // Check Functions
    const functions = firebase.functions();
    if (functions) {
      console.log('✅ Firebase Functions available');
    }
  } else {
    console.log('❌ Firebase SDK not loaded');
  }
} catch (error) {
  console.log('❌ Firebase configuration error:', error);
}

// Test 2: Check Product Data Flow
console.log('\n=== 2. PRODUCT DATA FLOW ===');
async function checkProductDataFlow() {
  try {
    // Check localStorage products (dev mode)
    const devProducts = JSON.parse(localStorage.getItem('venkat_products') || '[]');
    console.log(`📦 Development products in localStorage: ${devProducts.length}`);
    
    // Check if we can access Firebase products
    if (window.firebase?.firestore) {
      const db = window.firebase.firestore();
      const snapshot = await db.collection('products').limit(5).get();
      console.log(`🔥 Firebase products: ${snapshot.size} (limited to 5)`);
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`   • ${data.name} - Image: ${data.image ? 'YES' : 'NO'}`);
      });
    }
  } catch (error) {
    console.log('❌ Product data flow error:', error);
  }
}

// Test 3: Check Image Upload Components
console.log('\n=== 3. IMAGE UPLOAD COMPONENTS ===');
function checkImageUploadComponents() {
  // Check if enhanced image upload component is present
  const uploadComponent = document.querySelector('[class*="enhanced-image-upload"]') || 
                         document.querySelector('[role="tablist"]');
  if (uploadComponent) {
    console.log('✅ Enhanced image upload component found');
  } else {
    console.log('❌ Enhanced image upload component not found');
  }
  
  // Check for URL input field
  const urlInput = document.querySelector('input[placeholder*="URL"]') ||
                  document.querySelector('input[type="url"]');
  if (urlInput) {
    console.log('✅ URL input field found');
  } else {
    console.log('❌ URL input field not found');
  }
  
  // Check for file input
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    console.log('✅ File input field found');
  } else {
    console.log('❌ File input field not found');
  }
}

// Test 4: Check Cloudinary Configuration
console.log('\n=== 4. CLOUDINARY CONFIGURATION ===');
function checkCloudinaryConfig() {
  // This would be tested by making an actual upload attempt
  console.log('ℹ️  Cloudinary config check requires actual upload test');
  console.log('   Cloud name: doxwyrp8n');
  console.log('   Upload preset: venkat express');
}

// Test 5: Check Real-time Subscriptions
console.log('\n=== 5. REAL-TIME SUBSCRIPTIONS ===');
async function checkRealtimeSubscriptions() {
  try {
    if (window.firebase?.firestore) {
      console.log('🔄 Testing real-time subscription...');
      const db = window.firebase.firestore();
      
      // Test subscription
      const unsubscribe = db.collection('products')
        .limit(1)
        .onSnapshot(
          (snapshot) => {
            console.log('✅ Real-time subscription working, got update');
            unsubscribe(); // Stop listening
          },
          (error) => {
            console.log('❌ Real-time subscription error:', error);
          }
        );
    }
  } catch (error) {
    console.log('❌ Real-time subscription test error:', error);
  }
}

// Test 6: Check Current Page Context
console.log('\n=== 6. CURRENT PAGE CONTEXT ===');
function checkCurrentPageContext() {
  const currentPath = window.location.pathname;
  console.log(`📍 Current page: ${currentPath}`);
  
  if (currentPath.includes('/admin')) {
    console.log('🔧 Admin context detected');
    
    // Check admin-specific elements
    const addProductBtn = document.querySelector('a[href*="/admin/products/new"]');
    if (addProductBtn) {
      console.log('✅ Add Product button found');
    }
    
    const productTable = document.querySelector('table');
    if (productTable) {
      console.log('✅ Product table found');
    }
  } else {
    console.log('🏠 Main website context');
    
    // Check main website elements
    const featuredSection = document.querySelector('[class*="featured"]') ||
                           document.querySelector('h2:contains("Featured")');
    if (featuredSection) {
      console.log('✅ Featured products section found');
    }
  }
}

// Test 7: Network Connectivity
console.log('\n=== 7. NETWORK CONNECTIVITY ===');
async function checkNetworkConnectivity() {
  try {
    // Test Firebase Functions endpoint
    const functionsUrl = 'https://us-central1-venkat-express-india.cloudfunctions.net/';
    console.log('🌐 Testing Firebase Functions connectivity...');
    
    // Just check if we can reach the endpoint (will likely get CORS error, but that's expected)
    fetch(functionsUrl + 'fetchImageFromUrl', { method: 'GET' })
      .then(() => console.log('✅ Firebase Functions endpoint reachable'))
      .catch((error) => {
        if (error.message.includes('CORS')) {
          console.log('✅ Firebase Functions endpoint reachable (CORS expected)');
        } else {
          console.log('❌ Firebase Functions connectivity issue:', error.message);
        }
      });
  } catch (error) {
    console.log('❌ Network connectivity test error:', error);
  }
}

// Test 8: Check for JavaScript Errors
console.log('\n=== 8. JAVASCRIPT ERRORS ===');
function checkJavaScriptErrors() {
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = (...args) => {
    errorCount++;
    console.log(`❌ JS Error #${errorCount}:`, ...args);
    originalError.apply(console, args);
  };
  
  // Restore after 5 seconds
  setTimeout(() => {
    console.error = originalError;
    console.log(`📊 Total JavaScript errors detected: ${errorCount}`);
  }, 5000);
}

// Test 9: Performance Metrics
console.log('\n=== 9. PERFORMANCE METRICS ===');
function checkPerformanceMetrics() {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    console.log(`⚡ Page load time: ${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`);
    console.log(`🔗 DOM ready: ${Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)}ms`);
  }
}

// Test 10: Environment Detection
console.log('\n=== 10. ENVIRONMENT DETECTION ===');
function checkEnvironment() {
  const isDev = window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
  console.log(`🌍 Environment: ${isDev ? 'Development' : 'Production'}`);
  console.log(`🔗 URL: ${window.location.href}`);
  
  // Check if in development mode with localStorage fallback
  const devProducts = localStorage.getItem('venkat_products');
  if (devProducts && isDev) {
    console.log('💾 Development mode with localStorage detected');
  }
}

// Execute all tests
async function runAllTests() {
  checkImageUploadComponents();
  checkCloudinaryConfig();
  checkCurrentPageContext();
  checkJavaScriptErrors();
  checkPerformanceMetrics();
  checkEnvironment();
  
  // Async tests
  await checkProductDataFlow();
  await checkRealtimeSubscriptions();
  await checkNetworkConnectivity();
  
  console.log('\n🏁 Complete System Debug Finished');
  console.log('\n📋 SUMMARY:');
  console.log('1. Check each section above for specific issues');
  console.log('2. Red ❌ items need attention');
  console.log('3. Green ✅ items are working correctly');
  console.log('4. Open browser DevTools for additional details');
}

// Auto-run tests
runAllTests();

// Provide manual test functions
window.debugSystem = {
  runAllTests,
  checkProductDataFlow,
  checkRealtimeSubscriptions,
  checkNetworkConnectivity,
  checkImageUploadComponents
};

console.log('\n💡 TIP: Use window.debugSystem.runAllTests() to run tests again');