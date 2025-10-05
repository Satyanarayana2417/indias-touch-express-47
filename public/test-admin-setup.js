// Admin Setup and Product Test Script
// This script sets up an admin session and tests product creation

// 1. Setup admin session
function setupAdminSession() {
    console.log('Setting up admin session...');
    
    const mockAdmin = {
        uid: 'admin-development-' + Date.now(),
        email: 'admin@venkatexpress.com',
        displayName: 'Development Admin'
    };
    
    // Store admin user in localStorage (required for development mode)
    localStorage.setItem('mockAdminUser', JSON.stringify(mockAdmin));
    localStorage.setItem('adminSessionStart', Date.now().toString());
    
    console.log('✅ Admin session created:', mockAdmin);
    console.log('✅ Admin session stored in localStorage');
    
    return mockAdmin;
}

// 2. Test product data structure
function getTestProduct() {
    return {
        name: 'Test Product ' + Date.now(),
        description: 'This is a test product created to verify admin functionality',
        detailedDescription: 'Detailed description of the test product with more information about its features and benefits.',
        category: 'rice',
        price: '29.99',
        originalPrice: '39.99',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400'
        ],
        inStock: true,
        variants: [
            {
                name: '1kg',
                price: '29.99',
                originalPrice: '39.99',
                stock: 50,
                isDefault: true
            },
            {
                name: '2kg',
                price: '55.99',
                originalPrice: '75.99',
                stock: 30,
                isDefault: false
            }
        ],
        nutritionalInfo: 'Rich in fiber and nutrients',
        ingredients: 'Premium quality rice',
        origin: 'India',
        weight: '1kg',
        badge: 'Premium'
    };
}

// 3. Test localStorage product storage (development mode)
function testProductStorage() {
    console.log('Testing product storage in development mode...');
    
    // Get existing products from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('devProducts') || '[]');
    console.log('Existing products in localStorage:', existingProducts.length);
    
    // Create test product
    const testProduct = getTestProduct();
    testProduct.id = 'test-product-' + Date.now();
    testProduct.createdAt = new Date();
    testProduct.updatedAt = new Date();
    testProduct.name_lowercase = testProduct.name.toLowerCase();
    
    // Add to localStorage
    existingProducts.push(testProduct);
    localStorage.setItem('devProducts', JSON.stringify(existingProducts));
    
    console.log('✅ Test product added to localStorage:', testProduct.name);
    console.log('✅ Total products now:', existingProducts.length);
    
    return testProduct;
}

// 4. Main test function
function runAdminProductTest() {
    console.log('🚀 Starting Admin Product Test...');
    console.log('');
    
    try {
        // Step 1: Setup admin session
        console.log('Step 1: Setting up admin session');
        const admin = setupAdminSession();
        console.log('');
        
        // Step 2: Test product creation
        console.log('Step 2: Testing product creation');
        const product = testProductStorage();
        console.log('');
        
        // Step 3: Verify everything is working
        console.log('Step 3: Verification');
        const storedAdmin = JSON.parse(localStorage.getItem('mockAdminUser') || 'null');
        const storedProducts = JSON.parse(localStorage.getItem('devProducts') || '[]');
        
        console.log('✅ Admin in localStorage:', !!storedAdmin);
        console.log('✅ Admin email:', storedAdmin?.email);
        console.log('✅ Products in localStorage:', storedProducts.length);
        console.log('✅ Latest product:', storedProducts[storedProducts.length - 1]?.name);
        console.log('');
        
        console.log('🎉 Test completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Go to: http://localhost:8081/admin/login');
        console.log('2. Login with: admin@venkatexpress.com (any password)');
        console.log('3. Navigate to: http://localhost:8081/admin/products/new');
        console.log('4. Try adding a product');
        
        return {
            success: true,
            admin: storedAdmin,
            productsCount: storedProducts.length,
            latestProduct: product
        };
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 5. Helper functions for manual testing
function checkCurrentState() {
    console.log('Current State Check:');
    console.log('Admin user:', JSON.parse(localStorage.getItem('mockAdminUser') || 'null'));
    console.log('Products:', JSON.parse(localStorage.getItem('devProducts') || '[]').length, 'items');
    console.log('Session start:', localStorage.getItem('adminSessionStart'));
}

function clearEverything() {
    localStorage.removeItem('mockAdminUser');
    localStorage.removeItem('adminSessionStart');
    localStorage.removeItem('devProducts');
    console.log('✅ All test data cleared');
}

// Make functions globally available
window.runAdminProductTest = runAdminProductTest;
window.setupAdminSession = setupAdminSession;
window.testProductStorage = testProductStorage;
window.checkCurrentState = checkCurrentState;
window.clearEverything = clearEverything;

// Auto-run the test
console.log('Admin Product Test Script Loaded');
console.log('Available functions:');
console.log('- runAdminProductTest() - Run complete test');
console.log('- setupAdminSession() - Setup admin only');
console.log('- testProductStorage() - Test product creation only');
console.log('- checkCurrentState() - Check current localStorage state');
console.log('- clearEverything() - Clear all test data');
console.log('');
console.log('Running automatic test...');
runAdminProductTest();