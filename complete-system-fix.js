/**
 * 🔧 COMPLETE SYSTEM FIX SCRIPT
 * Automatic fixes for image upload and product visibility issues
 */

console.log('🚀 Starting Complete System Fix...\n');

// Fix 1: Ensure Firebase is properly initialized
function fixFirebaseInitialization() {
  console.log('=== 1. FIXING FIREBASE INITIALIZATION ===');
  
  if (!window.firebase) {
    console.log('❌ Firebase not loaded - this needs to be fixed in the app');
    return false;
  }
  
  try {
    // Ensure Firebase is initialized
    const app = window.firebase.app();
    console.log('✅ Firebase app initialized');
    
    // Check auth state
    const auth = window.firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('✅ User authenticated:', user.email);
      } else {
        console.log('⚠️  User not authenticated - some features may not work');
      }
    });
    
    return true;
  } catch (error) {
    console.log('❌ Firebase initialization error:', error);
    return false;
  }
}

// Fix 2: Repair product data synchronization
async function fixProductDataSync() {
  console.log('\n=== 2. FIXING PRODUCT DATA SYNC ===');
  
  try {
    const isDev = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1';
    
    if (isDev) {
      console.log('🔧 Development environment detected');
      
      // Check if localStorage has products
      const devProducts = JSON.parse(localStorage.getItem('venkat_products') || '[]');
      console.log(`📦 Found ${devProducts.length} products in localStorage`);
      
      // If no products in localStorage but Firebase is available, sync them
      if (devProducts.length === 0 && window.firebase?.firestore) {
        console.log('🔄 Syncing products from Firebase to localStorage...');
        
        const db = window.firebase.firestore();
        const snapshot = await db.collection('products').get();
        
        const firebaseProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (firebaseProducts.length > 0) {
          localStorage.setItem('venkat_products', JSON.stringify(firebaseProducts));
          console.log(`✅ Synced ${firebaseProducts.length} products to localStorage`);
          
          // Trigger UI update
          window.dispatchEvent(new CustomEvent('productDataUpdated'));
        }
      }
    } else {
      console.log('🔧 Production environment - using Firebase directly');
      
      // Test Firebase connection
      if (window.firebase?.firestore) {
        const db = window.firebase.firestore();
        const testSnapshot = await db.collection('products').limit(1).get();
        console.log('✅ Firebase connection working');
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Product data sync error:', error);
    return false;
  }
}

// Fix 3: Repair real-time subscriptions
function fixRealtimeSubscriptions() {
  console.log('\n=== 3. FIXING REAL-TIME SUBSCRIPTIONS ===');
  
  try {
    if (!window.firebase?.firestore) {
      console.log('❌ Firestore not available');
      return false;
    }
    
    const db = window.firebase.firestore();
    
    // Enhanced subscription with error handling
    const subscribeToProducts = (callback) => {
      console.log('🔄 Setting up enhanced real-time subscription...');
      
      return db.collection('products')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            console.log(`📦 Real-time update: ${snapshot.size} products`);
            
            const products = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            // Update localStorage for dev mode
            const isDev = window.location.hostname === 'localhost';
            if (isDev) {
              localStorage.setItem('venkat_products', JSON.stringify(products));
            }
            
            // Trigger callback
            callback(products);
            
            // Trigger global event
            window.dispatchEvent(new CustomEvent('productDataUpdated', {
              detail: { products }
            }));
          },
          (error) => {
            console.error('❌ Real-time subscription error:', error);
            
            // Fallback to localStorage in dev mode
            const isDev = window.location.hostname === 'localhost';
            if (isDev) {
              const devProducts = JSON.parse(localStorage.getItem('venkat_products') || '[]');
              callback(devProducts);
            }
          }
        );
    };
    
    // Make subscription available globally
    window.fixedSubscribeToProducts = subscribeToProducts;
    console.log('✅ Enhanced real-time subscription available as window.fixedSubscribeToProducts');
    
    return true;
  } catch (error) {
    console.log('❌ Real-time subscription fix error:', error);
    return false;
  }
}

// Fix 4: Repair image upload functionality
function fixImageUploadFunctionality() {
  console.log('\n=== 4. FIXING IMAGE UPLOAD FUNCTIONALITY ===');
  
  try {
    // Enhanced URL validation
    const validateImageUrl = (url) => {
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        return { isValid: false, error: 'URL must start with http:// or https://' };
      }
      
      // Check for image extensions or known image hosts
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
      const knownImageHosts = [
        'imgur.com', 'i.imgur.com',
        'images.unsplash.com', 'unsplash.com',
        'res.cloudinary.com',
        'amazonaws.com', 's3.amazonaws.com',
        'googleusercontent.com',
        'githubusercontent.com',
        'wikimedia.org',
        'pexels.com',
        'pixabay.com'
      ];
      
      const hasImageExtension = imageExtensions.test(url);
      const isKnownImageHost = knownImageHosts.some(host => url.includes(host));
      
      if (hasImageExtension || isKnownImageHost) {
        return { isValid: true };
      }
      
      return { 
        isValid: false, 
        error: 'URL should end with an image extension (.jpg, .png, etc.) or be from a known image hosting service' 
      };
    };
    
    // Enhanced image upload service
    const fixedUrlImageService = {
      validateImageUrl,
      
      async fetchAndUploadImage(imageUrl, productId, isMainImage = false) {
        console.log('🔄 Starting enhanced image upload...');
        
        // Validate URL first
        const validation = validateImageUrl(imageUrl);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        // Check authentication
        const auth = window.firebase?.auth();
        if (!auth?.currentUser) {
          throw new Error('You must be logged in to upload images');
        }
        
        try {
          // Call Firebase Function
          const functions = window.firebase.functions();
          const fetchImageFromUrl = functions.httpsCallable('fetchImageFromUrl');
          
          console.log('📤 Calling Firebase Function...');
          const result = await fetchImageFromUrl({
            imageUrl: imageUrl,
            productId: productId,
            isMainImage: isMainImage
          });
          
          console.log('📥 Function result:', result);
          
          if (result.data.success && result.data.cloudinaryUrl) {
            console.log('✅ Image uploaded successfully');
            return result.data.cloudinaryUrl;
          } else {
            throw new Error(result.data.error || 'Upload failed');
          }
        } catch (error) {
          console.error('❌ Upload error:', error);
          
          // Provide helpful error messages
          if (error.code === 'unauthenticated') {
            throw new Error('Please log in as an admin to upload images');
          } else if (error.code === 'permission-denied') {
            throw new Error('You do not have permission to upload images');
          } else if (error.code === 'functions/not-found') {
            throw new Error('Image upload service is not available. Please try again later.');
          } else {
            throw new Error(error.message || 'Image upload failed. Please try again.');
          }
        }
      }
    };
    
    // Make service available globally
    window.fixedUrlImageService = fixedUrlImageService;
    console.log('✅ Enhanced image upload service available as window.fixedUrlImageService');
    
    return true;
  } catch (error) {
    console.log('❌ Image upload fix error:', error);
    return false;
  }
}

// Fix 5: Repair UI components
function fixUIComponents() {
  console.log('\n=== 5. FIXING UI COMPONENTS ===');
  
  try {
    // Add CSS fixes for better visibility
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced image upload component visibility */
      .enhanced-image-upload-wrapper {
        border: 2px dashed #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
      }
      
      /* URL input field enhancements */
      input[type="url"], input[placeholder*="URL"] {
        border: 2px solid #d1d5db;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 14px;
      }
      
      input[type="url"]:focus, input[placeholder*="URL"]:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      /* Error state styling */
      .url-input-error {
        border-color: #ef4444 !important;
        background-color: #fef2f2;
      }
      
      /* Success state styling */
      .url-input-success {
        border-color: #10b981 !important;
        background-color: #f0fdf4;
      }
      
      /* Loading states */
      .upload-loading {
        opacity: 0.6;
        pointer-events: none;
      }
      
      /* Better error messages */
      .error-message {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
      }
      
      /* Success messages */
      .success-message {
        color: #10b981;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
    
    console.log('✅ UI component styles applied');
    
    // Add helpful tooltips
    const addTooltips = () => {
      const urlInputs = document.querySelectorAll('input[type="url"], input[placeholder*="URL"]');
      urlInputs.forEach(input => {
        if (!input.title) {
          input.title = 'Enter a direct image URL (e.g., https://example.com/image.jpg)';
        }
      });
    };
    
    // Add tooltips now and on DOM changes
    addTooltips();
    
    // Observer for dynamic content
    const observer = new MutationObserver(addTooltips);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return true;
  } catch (error) {
    console.log('❌ UI component fix error:', error);
    return false;
  }
}

// Fix 6: Add manual refresh functionality
function addManualRefresh() {
  console.log('\n=== 6. ADDING MANUAL REFRESH FUNCTIONALITY ===');
  
  try {
    window.manualRefreshProducts = async () => {
      console.log('🔄 Manual product refresh initiated...');
      
      try {
        const isDev = window.location.hostname === 'localhost';
        
        if (isDev) {
          // Development mode: refresh from localStorage and Firebase
          if (window.firebase?.firestore) {
            const db = window.firebase.firestore();
            const snapshot = await db.collection('products').get();
            
            const products = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            localStorage.setItem('venkat_products', JSON.stringify(products));
            console.log(`✅ Refreshed ${products.length} products in localStorage`);
          }
        }
        
        // Trigger UI updates
        window.dispatchEvent(new CustomEvent('productDataUpdated'));
        
        // Reload page as fallback
        setTimeout(() => {
          console.log('🔄 Reloading page for complete refresh...');
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.log('❌ Manual refresh error:', error);
        // Fallback: just reload the page
        window.location.reload();
      }
    };
    
    console.log('✅ Manual refresh available as window.manualRefreshProducts()');
    return true;
  } catch (error) {
    console.log('❌ Manual refresh setup error:', error);
    return false;
  }
}

// Master fix function
async function runCompleteFix() {
  console.log('🔧 RUNNING COMPLETE SYSTEM FIX\n');
  
  const results = {
    firebase: fixFirebaseInitialization(),
    dataSync: await fixProductDataSync(),
    realtime: fixRealtimeSubscriptions(),
    imageUpload: fixImageUploadFunctionality(),
    uiComponents: fixUIComponents(),
    manualRefresh: addManualRefresh()
  };
  
  console.log('\n📊 FIX RESULTS:');
  Object.entries(results).forEach(([key, success]) => {
    console.log(`${success ? '✅' : '❌'} ${key}: ${success ? 'Fixed' : 'Failed'}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalFixes = Object.keys(results).length;
  
  console.log(`\n🎯 SUCCESS RATE: ${successCount}/${totalFixes} fixes applied`);
  
  if (successCount === totalFixes) {
    console.log('🎉 ALL FIXES APPLIED SUCCESSFULLY!');
    console.log('\n💡 Try these now:');
    console.log('   • window.manualRefreshProducts() - Refresh product data');
    console.log('   • window.fixedUrlImageService - Enhanced image upload');
    console.log('   • window.fixedSubscribeToProducts - Enhanced subscriptions');
  } else {
    console.log('⚠️  Some fixes failed. Check the detailed logs above.');
  }
  
  return results;
}

// Auto-run the complete fix
runCompleteFix();

// Make available globally
window.runCompleteFix = runCompleteFix;