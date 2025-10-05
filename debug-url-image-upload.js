// 🔍 URL Image Upload Debug Helper
// Copy and paste this into your browser console on the admin page

console.log('🚀 Starting URL Image Upload Debug...');

// Test 1: Check Firebase initialization
console.log('📡 Firebase App:', window.firebase ? 'Initialized' : 'Not found');

// Test 2: Check authentication
const checkAuth = () => {
  try {
    const auth = firebase.auth();
    const user = auth.currentUser;
    console.log('👤 Current user:', user ? user.email : 'Not logged in');
    return user;
  } catch (error) {
    console.error('❌ Auth error:', error);
    return null;
  }
};

const user = checkAuth();

// Test 3: Check admin role
const checkAdminRole = async () => {
  if (!user) return false;
  
  try {
    const db = firebase.firestore();
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    console.log('👑 User role:', userData?.role || 'No role found');
    return userData?.role === 'admin';
  } catch (error) {
    console.error('❌ Role check error:', error);
    return false;
  }
};

// Test 4: Check functions availability
const checkFunctions = () => {
  try {
    const functions = firebase.functions();
    console.log('⚡ Functions:', functions ? 'Available' : 'Not available');
    return functions;
  } catch (error) {
    console.error('❌ Functions error:', error);
    return null;
  }
};

// Test 5: Test actual function call
const testFunctionCall = async () => {
  try {
    const functions = checkFunctions();
    if (!functions) return;

    console.log('🧪 Testing function call...');
    const fetchImage = functions.httpsCallable('fetchImageFromUrl');
    
    const testUrl = 'https://via.placeholder.com/300x300.png';
    console.log('📸 Testing with URL:', testUrl);
    
    const result = await fetchImage({
      imageUrl: testUrl,
      productId: 'test-' + Date.now()
    });
    
    console.log('✅ Function call successful:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Function call failed:', error);
    
    // Detailed error analysis
    if (error.code) {
      switch (error.code) {
        case 'functions/not-found':
          console.log('💡 Solution: Deploy functions with "firebase deploy --only functions"');
          break;
        case 'functions/unauthenticated':
          console.log('💡 Solution: Make sure you are logged in');
          break;
        case 'functions/permission-denied':
          console.log('💡 Solution: Make sure your user has admin role');
          break;
        case 'functions/deadline-exceeded':
          console.log('💡 Solution: Function timed out, try with a smaller image');
          break;
        default:
          console.log('💡 Error code:', error.code, 'Message:', error.message);
      }
    }
    
    return null;
  }
};

// Test 6: Test URL validation
const testUrlValidation = (testUrl = 'https://via.placeholder.com/300x300.png') => {
  console.log('🔍 Testing URL validation for:', testUrl);
  
  try {
    const url = new URL(testUrl);
    console.log('✅ URL is valid');
    
    // Check if it looks like an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const hasImageExt = imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
    console.log('🖼️ Has image extension:', hasImageExt);
    
    return true;
  } catch (e) {
    console.log('❌ Invalid URL');
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('\n=== RUNNING ALL TESTS ===\n');
  
  // Basic checks
  testUrlValidation();
  
  // Admin check
  const isAdmin = await checkAdminRole();
  console.log('🔐 Is admin:', isAdmin);
  
  if (!isAdmin) {
    console.log('⚠️ You need admin privileges to upload images via URL');
    return;
  }
  
  // Function test
  await testFunctionCall();
  
  console.log('\n=== TESTS COMPLETE ===\n');
  console.log('📋 Next steps:');
  console.log('1. If functions are not found, run: firebase deploy --only functions');
  console.log('2. If permission denied, check your admin role in Firestore');
  console.log('3. If timeout, try with a smaller image URL');
  console.log('4. Check the Network tab for detailed error responses');
};

// Auto-run tests
runAllTests();

// Export test functions for manual use
window.debugImageUpload = {
  checkAuth,
  checkAdminRole,
  checkFunctions,
  testFunctionCall,
  testUrlValidation,
  runAllTests
};

console.log('💡 Use window.debugImageUpload.runAllTests() to run tests again');