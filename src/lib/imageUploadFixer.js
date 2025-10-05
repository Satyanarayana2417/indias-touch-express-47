// Image Upload Fix Script
// This script fixes common image upload issues in the admin panel

console.log('🔧 Starting Image Upload Fix...');

// Fix 1: Enhanced Error Handling for Image Upload Service
export class FixedImageUploadService {
  static MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  static ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif',
    'image/avif', 'image/jxl', 'image/jp2'
  ];

  static validateFile(file) {
    console.log('🔍 Validating file:', file.name, file.type, file.size);
    
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: `File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return { isValid: false, error: `File type ${file.type} is not supported. Please use: ${this.ALLOWED_TYPES.join(', ')}` };
    }

    console.log('✅ File validation passed');
    return { isValid: true };
  }

  static async uploadProductImage(file, productId, isMainImage = false) {
    console.log('📤 Starting upload:', file.name);
    
    try {
      // Import Firebase services
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../lib/firebase.js');
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${extension}`;
      
      // Create storage path
      const folderPath = productId 
        ? `products/${productId}/${isMainImage ? 'main' : 'gallery'}`
        : `products/temp`;
      
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      
      console.log('📁 Upload path:', `${folderPath}/${fileName}`);
      
      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          productId: productId || 'temp',
          isMainImage: isMainImage.toString(),
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      };

      // Upload file
      console.log('⬆️ Uploading to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, file, metadata);
      
      // Get download URL
      console.log('🔗 Getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Upload successful:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  static async compressImage(file, maxWidth = 1200, quality = 0.8) {
    console.log('🗜️ Compressing image:', file.name);
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              
              console.log('✅ Image compressed:', 
                'Original:', Math.round(file.size / 1024), 'KB',
                '→ Compressed:', Math.round(compressedFile.size / 1024), 'KB'
              );
              
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, file.type, quality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Fix 2: Enhanced URL Image Service with better error handling
export class FixedUrlImageService {
  static validateImageUrl(url) {
    console.log('🌐 Validating URL:', url);
    
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return { isValid: false, error: 'Please enter a valid URL' };
    }

    try {
      const urlObj = new URL(url.trim());
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }

      console.log('✅ URL validation passed');
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  static async fetchAndUploadImage(imageUrl, productId, isMainImage = false) {
    console.log('🔄 Fetching image from URL:', imageUrl);
    
    try {
      // Validate URL first
      const validation = this.validateImageUrl(imageUrl);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Import Firebase Functions
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { app } = await import('../lib/firebase.js');
      
      const functions = getFunctions(app);
      const fetchImageFromUrl = httpsCallable(functions, 'fetchImageFromUrl');
      
      console.log('📞 Calling Firebase Function...');
      const result = await fetchImageFromUrl({
        imageUrl: imageUrl.trim(),
        productId,
        isMainImage
      });

      console.log('📥 Function result:', result.data);

      if (!result.data.success) {
        throw new Error(result.data.error || 'Upload failed');
      }

      if (!result.data.cloudinaryUrl) {
        throw new Error('No image URL returned from server');
      }

      console.log('✅ URL upload successful:', result.data.cloudinaryUrl);
      return result.data.cloudinaryUrl;
    } catch (error) {
      console.error('❌ URL upload failed:', error);
      
      // Provide helpful error messages
      if (error.code === 'unauthenticated') {
        throw new Error('Please log in as an admin to upload images');
      } else if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to upload images. Admin access required.');
      } else if (error.code === 'functions/not-found') {
        throw new Error('Image upload service is not available. Please contact support.');
      } else if (error.code === 'functions/internal') {
        throw new Error('Server error occurred. Please try again later.');
      }
      
      throw error;
    }
  }
}

// Fix 3: Authentication and Admin Role Checker
export class AuthenticationFixer {
  static async checkAuthStatus() {
    console.log('🔒 Checking authentication status...');
    
    try {
      const { getAuth } = await import('firebase/auth');
      const { app } = await import('../lib/firebase.js');
      
      const auth = getAuth(app);
      const user = auth.currentUser;
      
      if (!user) {
        console.log('❌ No user authenticated');
        return { authenticated: false, error: 'Please login first' };
      }
      
      console.log('✅ User authenticated:', user.email);
      return { authenticated: true, user };
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      return { authenticated: false, error: error.message };
    }
  }

  static async checkAdminRole() {
    console.log('👑 Checking admin role...');
    
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const { getAuth } = await import('firebase/auth');
      const { app } = await import('../lib/firebase.js');
      
      const auth = getAuth(app);
      const db = getFirestore(app);
      const user = auth.currentUser;
      
      if (!user) {
        return { isAdmin: false, error: 'Not authenticated' };
      }
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('❌ User document not found');
        return { isAdmin: false, error: 'User profile not found' };
      }
      
      const userData = userDoc.data();
      const isAdmin = userData.role === 'admin';
      
      console.log(isAdmin ? '✅ User has admin role' : '❌ User is not admin');
      return { isAdmin, userData };
    } catch (error) {
      console.error('❌ Admin role check failed:', error);
      return { isAdmin: false, error: error.message };
    }
  }

  static async ensureAdminAccess() {
    const authStatus = await this.checkAuthStatus();
    if (!authStatus.authenticated) {
      throw new Error(authStatus.error);
    }
    
    const adminStatus = await this.checkAdminRole();
    if (!adminStatus.isAdmin) {
      throw new Error('Admin access required to upload images');
    }
    
    return true;
  }
}

// Fix 4: Firebase Functions Deployment Checker
export class FunctionChecker {
  static async testFunctionAvailability() {
    console.log('☁️ Testing Firebase Functions availability...');
    
    try {
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { app } = await import('../lib/firebase.js');
      
      const functions = getFunctions(app);
      const testFunction = httpsCallable(functions, 'fetchImageFromUrl');
      
      // Test with a simple call
      await testFunction({
        imageUrl: 'https://via.placeholder.com/100x100.jpg',
        productId: 'test'
      });
      
      console.log('✅ Firebase Functions are available');
      return true;
    } catch (error) {
      console.error('❌ Firebase Functions test failed:', error);
      
      if (error.code === 'functions/not-found') {
        console.error('🚨 Functions not deployed! Run: firebase deploy --only functions');
      }
      
      return false;
    }
  }
}

// Fix 5: Complete System Diagnostic
export class SystemDiagnostic {
  static async runCompleteCheck() {
    console.log('🩺 Running complete system diagnostic...');
    
    const results = {
      auth: await AuthenticationFixer.checkAuthStatus(),
      admin: await AuthenticationFixer.checkAdminRole(),
      functions: await FunctionChecker.testFunctionAvailability()
    };
    
    console.log('📊 Diagnostic Results:', results);
    
    const issues = [];
    
    if (!results.auth.authenticated) {
      issues.push('❌ Authentication: Please login as admin');
    }
    
    if (!results.admin.isAdmin) {
      issues.push('❌ Admin Role: User does not have admin permissions');
    }
    
    if (!results.functions) {
      issues.push('❌ Firebase Functions: Not deployed or not accessible');
    }
    
    if (issues.length === 0) {
      console.log('✅ All systems operational!');
    } else {
      console.log('🚨 Issues found:');
      issues.forEach(issue => console.log(issue));
    }
    
    return { results, issues };
  }
}

// Auto-run diagnostic if in browser
if (typeof window !== 'undefined') {
  window.ImageUploadFixer = {
    FixedImageUploadService,
    FixedUrlImageService,
    AuthenticationFixer,
    FunctionChecker,
    SystemDiagnostic
  };
  
  console.log('🛠️ Image Upload Fixer loaded. Run: ImageUploadFixer.SystemDiagnostic.runCompleteCheck()');
}