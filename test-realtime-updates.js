// ✅ REAL-TIME UPDATE VERIFICATION SCRIPT
// Run this in your browser console to see the real-time updates in action

console.log('🔍 Testing Real-Time Product Updates...');

// Check if we're using the real-time subscription
const testRealTimeUpdates = () => {
  console.log('📊 Current system status:');
  
  // Check if Firebase is connected
  if (typeof db !== 'undefined') {
    console.log('✅ Firebase connected');
  } else {
    console.log('❌ Firebase not connected');
  }
  
  // Check if products are being loaded with real-time subscription
  if (typeof subscribeToProducts !== 'undefined') {
    console.log('✅ Real-time subscription available');
    
    // Test the subscription
    const unsubscribe = subscribeToProducts((products) => {
      console.log(`🔄 Real-time update received: ${products.length} products`);
      console.log('Latest products:', products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        updatedAt: p.updatedAt
      })));
    });
    
    // Clean up after 10 seconds
    setTimeout(() => {
      unsubscribe();
      console.log('🛑 Test subscription stopped');
    }, 10000);
    
    console.log('⏱️ Listening for real-time updates for 10 seconds...');
    console.log('💡 Try adding/editing a product in another tab to see real-time updates!');
  } else {
    console.log('❌ Real-time subscription not available');
  }
};

// Run the test
testRealTimeUpdates();

// Also check the current page for real-time functionality
console.log('📍 Current page:', window.location.pathname);

if (window.location.pathname.includes('/shop') || window.location.pathname === '/') {
  console.log('✅ You are on a page that should show real-time product updates');
  console.log('💡 Products will update automatically when admin makes changes');
} else if (window.location.pathname.includes('/admin')) {
  console.log('✅ You are on the admin panel');
  console.log('💡 Changes you make here will appear instantly on the main website');
}