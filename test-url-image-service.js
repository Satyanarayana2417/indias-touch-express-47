// Test script for the URL image upload functionality
// Run this in the browser console to test the UrlImageService

// Test URLs
const testUrls = {
  valid: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://via.placeholder.com/300x200.jpg',
    'https://picsum.photos/200/300',
  ],
  invalid: [
    'https://www.google.com',
    'not-a-url',
    'ftp://example.com/image.jpg',
    'https://example.com/nonexistent.jpg'
  ]
};

async function testUrlImageService() {
  console.log('🧪 Testing URL Image Service...');
  
  // Test 1: Validation
  console.log('\n📋 Testing URL Validation:');
  
  testUrls.valid.forEach(url => {
    const result = UrlImageService.validateImageUrl(url);
    console.log(`✅ ${url}: ${result.isValid ? 'VALID' : 'INVALID'} ${result.error || ''}`);
  });
  
  testUrls.invalid.forEach(url => {
    const result = UrlImageService.validateImageUrl(url);
    console.log(`❌ ${url}: ${result.isValid ? 'VALID' : 'INVALID'} ${result.error || ''}`);
  });
  
  // Test 2: Image check
  console.log('\n🖼️  Testing Image Check:');
  
  for (const url of testUrls.valid) {
    try {
      const result = await UrlImageService.checkUrlIsImage(url);
      console.log(`${result.isImage ? '✅' : '❌'} ${url}:`, result);
    } catch (error) {
      console.log(`❌ ${url}: Error -`, error.message);
    }
  }
  
  // Test 3: Full upload (requires authentication)
  console.log('\n⬆️  Testing Full Upload (requires auth):');
  console.log('ℹ️  To test full upload, use the admin panel with valid authentication.');
  
  console.log('\n✅ URL Image Service test completed!');
}

// Auto-run if UrlImageService is available
if (typeof UrlImageService !== 'undefined') {
  testUrlImageService();
} else {
  console.log('❌ UrlImageService not found. Make sure you are on a page where it is loaded.');
  console.log('💡 Try running this in the admin product form page.');
}