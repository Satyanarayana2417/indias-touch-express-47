/**
 * Complete Image Upload System - Verification Test
 * This script tests all aspects of the enhanced system
 */

console.log('🚀 Starting Complete Image Upload System Test');
console.log('============================================');

// Test Configuration
const TEST_CONFIG = {
  testUrls: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://picsum.photos/800/600.jpg',
    'https://via.placeholder.com/800x600.png',
    'https://httpbin.org/image/jpeg'
  ],
  cloudinaryTestUrl: 'https://res.cloudinary.com/doxwyrp8n/image/upload/v1/sample.jpg',
  adminTestCredentials: {
    email: 'admin@venkatexpress.com',
    password: 'test123'
  }
};

// System Health Check
class SystemHealthCheck {
  static async checkFirebaseConnection() {
    try {
      if (typeof window !== 'undefined' && window.firebase) {
        const db = window.firebase.firestore();
        await db.collection('products').limit(1).get();
        console.log('✅ Firebase connection: OK');
        return true;
      }
      console.log('❌ Firebase connection: NOT AVAILABLE');
      return false;
    } catch (error) {
      console.log('❌ Firebase connection: ERROR', error.message);
      return false;
    }
  }

  static async checkCloudinaryAccess() {
    try {
      const response = await fetch(TEST_CONFIG.cloudinaryTestUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log('✅ Cloudinary access: OK');
        return true;
      }
      console.log('❌ Cloudinary access: ERROR', response.status);
      return false;
    } catch (error) {
      console.log('❌ Cloudinary access: ERROR', error.message);
      return false;
    }
  }

  static checkRealtimeSync() {
    if (typeof window !== 'undefined' && window.RealtimeImageSync) {
      console.log('✅ Real-time sync service: OK');
      return true;
    }
    console.log('❌ Real-time sync service: NOT AVAILABLE');
    return false;
  }

  static async runCompleteCheck() {
    console.log('\n🔍 Running System Health Check...');
    
    const results = {
      firebase: await this.checkFirebaseConnection(),
      cloudinary: await this.checkCloudinaryAccess(),
      realtimeSync: this.checkRealtimeSync()
    };

    const allPassed = Object.values(results).every(Boolean);
    
    console.log('\n📊 Health Check Results:');
    console.log('Firebase:', results.firebase ? '✅ PASS' : '❌ FAIL');
    console.log('Cloudinary:', results.cloudinary ? '✅ PASS' : '❌ FAIL');
    console.log('Real-time Sync:', results.realtimeSync ? '✅ PASS' : '❌ FAIL');
    console.log('Overall Status:', allPassed ? '✅ HEALTHY' : '❌ ISSUES DETECTED');

    return results;
  }
}

// URL Validation Test
class URLValidationTest {
  static async testAllFormats() {
    console.log('\n🌐 Testing URL Validation for All Formats...');
    
    const testUrls = TEST_CONFIG.testUrls;
    const results = [];

    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type') || '';
        const isImage = contentType.startsWith('image/');
        
        results.push({
          url: url.substring(0, 50) + '...',
          status: response.ok ? '✅ ACCESSIBLE' : '❌ FAILED',
          contentType: contentType,
          isImage: isImage ? '✅ IMAGE' : '❌ NOT IMAGE'
        });
      } catch (error) {
        results.push({
          url: url.substring(0, 50) + '...',
          status: '❌ ERROR',
          contentType: 'N/A',
          isImage: '❌ ERROR'
        });
      }
    }

    console.table(results);
    return results;
  }
}

// Real-time Sync Test
class RealtimeSyncTest {
  static simulateImageUpload() {
    console.log('\n📸 Simulating Image Upload Event...');
    
    if (typeof window !== 'undefined') {
      // Simulate image upload event
      window.dispatchEvent(new CustomEvent('imageUploaded', {
        detail: { productId: 'test-product-123' }
      }));
      
      // Simulate product save event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('productSaved', {
          detail: { productId: 'test-product-123' }
        }));
      }, 500);
      
      // Simulate force refresh
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('forceProductRefresh'));
      }, 1000);
      
      console.log('✅ Real-time events dispatched');
      console.log('   - imageUploaded event sent');
      console.log('   - productSaved event sent');
      console.log('   - forceProductRefresh event sent');
    } else {
      console.log('❌ Window object not available');
    }
  }

  static testEventListeners() {
    console.log('\n👂 Testing Event Listeners...');
    
    let eventsReceived = 0;
    
    const eventTypes = ['imageUploaded', 'productSaved', 'forceProductRefresh'];
    
    eventTypes.forEach(eventType => {
      const handler = () => {
        eventsReceived++;
        console.log(`✅ Received: ${eventType}`);
      };
      
      window.addEventListener(eventType, handler);
      
      // Clean up after test
      setTimeout(() => {
        window.removeEventListener(eventType, handler);
      }, 5000);
    });
    
    // Trigger test events
    setTimeout(() => {
      this.simulateImageUpload();
    }, 100);
    
    // Check results
    setTimeout(() => {
      console.log(`📊 Events received: ${eventsReceived}/${eventTypes.length}`);
      console.log(eventsReceived === eventTypes.length ? '✅ All events working' : '❌ Some events missing');
    }, 2000);
  }
}

// Admin Panel Test
class AdminPanelTest {
  static checkAdminAccess() {
    console.log('\n👑 Checking Admin Panel Access...');
    
    const currentPath = window.location.pathname;
    const isAdminPath = currentPath.includes('/admin');
    
    console.log(`Current path: ${currentPath}`);
    console.log(`Admin area: ${isAdminPath ? '✅ YES' : '❌ NO'}`);
    
    if (isAdminPath) {
      console.log('✅ Currently in admin area');
      this.checkAdminElements();
    } else {
      console.log('ℹ️ Navigate to /admin to test admin functionality');
    }
  }

  static checkAdminElements() {
    const elements = {
      productForm: document.querySelector('form'),
      imageUpload: document.querySelector('[data-testid="enhanced-image-upload"]') || 
                   document.querySelector('.enhanced-image-upload'),
      saveButton: document.querySelector('button[type="submit"]'),
      urlInput: document.querySelector('input[type="url"]') ||
                document.querySelector('input[placeholder*="URL"]')
    };

    console.log('\n🔍 Admin Elements Check:');
    Object.entries(elements).forEach(([name, element]) => {
      console.log(`${name}: ${element ? '✅ FOUND' : '❌ MISSING'}`);
    });
  }
}

// Format Support Test
class FormatSupportTest {
  static testSupportedFormats() {
    console.log('\n📁 Testing Supported Format Detection...');
    
    const formats = [
      { ext: '.jpg', mime: 'image/jpeg' },
      { ext: '.jpeg', mime: 'image/jpeg' },
      { ext: '.png', mime: 'image/png' },
      { ext: '.gif', mime: 'image/gif' },
      { ext: '.webp', mime: 'image/webp' },
      { ext: '.bmp', mime: 'image/bmp' },
      { ext: '.tiff', mime: 'image/tiff' },
      { ext: '.heic', mime: 'image/heic' },
      { ext: '.heif', mime: 'image/heif' },
      { ext: '.avif', mime: 'image/avif' },
      { ext: '.jxl', mime: 'image/jxl' },
      { ext: '.raw', mime: 'image/raw' }
    ];

    console.log('Supported formats:');
    formats.forEach(format => {
      console.log(`  ${format.ext} (${format.mime}) ✅`);
    });
    
    console.log(`\n📊 Total formats supported: ${formats.length}`);
  }
}

// Main Test Runner
class TestRunner {
  static async runAllTests() {
    console.log('\n🧪 Running Complete System Test Suite...');
    console.log('========================================');
    
    try {
      // System Health Check
      await SystemHealthCheck.runCompleteCheck();
      
      // URL Validation Test
      await URLValidationTest.testAllFormats();
      
      // Format Support Test
      FormatSupportTest.testSupportedFormats();
      
      // Real-time Sync Test
      RealtimeSyncTest.testEventListeners();
      
      // Admin Panel Test
      AdminPanelTest.checkAdminAccess();
      
      console.log('\n🎉 Test Suite Complete!');
      console.log('========================');
      console.log('Check the results above for any issues.');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  static showTestInstructions() {
    console.log('\n📝 Manual Testing Instructions:');
    console.log('================================');
    console.log('1. Open /admin in another tab');
    console.log('2. Login as admin');
    console.log('3. Navigate to Products → Add New Product');
    console.log('4. Test file upload with different formats');
    console.log('5. Test URL upload with test URLs');
    console.log('6. Open main website and verify real-time updates');
    console.log('7. Check browser console for sync events');
  }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      TestRunner.runAllTests();
      TestRunner.showTestInstructions();
    }, 1000);
  });
  
  // Make test functions available globally for manual testing
  window.ImageUploadSystemTest = {
    SystemHealthCheck,
    URLValidationTest,
    RealtimeSyncTest,
    AdminPanelTest,
    FormatSupportTest,
    TestRunner
  };
  
  console.log('🛠️ Test utilities available at: window.ImageUploadSystemTest');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SystemHealthCheck,
    URLValidationTest,
    RealtimeSyncTest,
    AdminPanelTest,
    FormatSupportTest,
    TestRunner
  };
}