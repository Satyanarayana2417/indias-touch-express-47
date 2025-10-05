// Product Sync Debug Tool
// This tool helps diagnose and fix the issue where admin-created products 
// don't appear on the main website

console.log('🔍 Product Sync Debug Tool Loaded');

// 1. Check localStorage keys
function checkLocalStorageKeys() {
    console.log('\n📋 LocalStorage Product Keys Check:');
    
    const devProducts = localStorage.getItem('dev_products');
    const devProductsAlt = localStorage.getItem('devProducts'); 
    const mockProducts = localStorage.getItem('mockProducts');
    
    console.log('✓ dev_products (correct key):', devProducts ? JSON.parse(devProducts).length + ' items' : 'Not found');
    console.log('✓ devProducts (incorrect key):', devProductsAlt ? JSON.parse(devProductsAlt).length + ' items' : 'Not found');
    console.log('✓ mockProducts:', mockProducts ? JSON.parse(mockProducts).length + ' items' : 'Not found');
    
    return {
        devProducts: devProducts ? JSON.parse(devProducts) : [],
        devProductsAlt: devProductsAlt ? JSON.parse(devProductsAlt) : [],
        mockProducts: mockProducts ? JSON.parse(mockProducts) : []
    };
}

// 2. Fix key mismatch by migrating data
function fixKeyMismatch() {
    console.log('\n🔧 Fixing localStorage key mismatch...');
    
    // Get data from both possible keys
    const correctKeyData = localStorage.getItem('dev_products');
    const incorrectKeyData = localStorage.getItem('devProducts');
    
    let mergedProducts = [];
    
    // Parse existing data
    if (correctKeyData) {
        mergedProducts = [...mergedProducts, ...JSON.parse(correctKeyData)];
    }
    
    if (incorrectKeyData) {
        const incorrectProducts = JSON.parse(incorrectKeyData);
        // Merge without duplicates (check by id)
        incorrectProducts.forEach(product => {
            if (!mergedProducts.find(p => p.id === product.id)) {
                mergedProducts.push(product);
            }
        });
    }
    
    // Save to correct key
    if (mergedProducts.length > 0) {
        localStorage.setItem('dev_products', JSON.stringify(mergedProducts));
        console.log('✅ Merged and saved', mergedProducts.length, 'products to dev_products key');
        
        // Remove incorrect key
        if (incorrectKeyData) {
            localStorage.removeItem('devProducts');
            console.log('✅ Removed incorrect devProducts key');
        }
    }
    
    return mergedProducts;
}

// 3. Add test products to verify the system works
function addTestProducts() {
    console.log('\n➕ Adding test products...');
    
    const testProducts = [
        {
            id: 'test-homepage-' + Date.now(),
            name: 'Test Product for Homepage',
            name_lowercase: 'test product for homepage',
            description: 'This test product should appear on the homepage and all product pages',
            detailedDescription: 'Detailed description of test product',
            category: 'rice',
            price: '25.99',
            originalPrice: '35.99',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
            rating: 4.5,
            reviews: 42,
            badge: 'Featured',
            inStock: true,
            variants: [{
                name: '1kg',
                price: '25.99',
                originalPrice: '35.99',
                stock: 100,
                isDefault: true
            }],
            nutritionalInfo: 'Rich in nutrients',
            ingredients: 'Premium rice',
            origin: 'India',
            weight: '1kg',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'test-decorative-' + Date.now(),
            name: 'Test Decorative Item',
            name_lowercase: 'test decorative item',
            description: 'This test product should appear in decorative items section',
            detailedDescription: 'Beautiful handcrafted decorative item',
            category: 'decorative',
            price: '45.99',
            originalPrice: '65.99',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
            rating: 4.8,
            reviews: 23,
            badge: 'Premium',
            inStock: true,
            variants: [{
                name: 'Standard',
                price: '45.99',
                originalPrice: '65.99',
                stock: 50,
                isDefault: true
            }],
            origin: 'India',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    
    // Get existing products
    const existingProducts = JSON.parse(localStorage.getItem('dev_products') || '[]');
    
    // Add test products
    const updatedProducts = [...existingProducts, ...testProducts];
    
    // Save back to localStorage
    localStorage.setItem('dev_products', JSON.stringify(updatedProducts));
    
    console.log('✅ Added', testProducts.length, 'test products');
    console.log('✅ Total products now:', updatedProducts.length);
    
    return testProducts;
}

// 4. Verify products are accessible via different routes
function verifyProductAccess() {
    console.log('\n🔍 Verifying product access...');
    
    const products = JSON.parse(localStorage.getItem('dev_products') || '[]');
    
    console.log('Total products in storage:', products.length);
    
    // Check products by category
    const categories = ['rice', 'spices', 'decorative', 'snacks', 'beverages'];
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        console.log(`${category.charAt(0).toUpperCase() + category.slice(1)} products:`, categoryProducts.length);
    });
    
    // Check featured products (products with Featured badge)
    const featuredProducts = products.filter(p => p.badge === 'Featured' || p.badge === 'Best Seller' || p.badge === 'Premium');
    console.log('Featured products:', featuredProducts.length);
    
    return {
        total: products.length,
        byCategory: categories.map(cat => ({
            category: cat,
            count: products.filter(p => p.category === cat).length
        })),
        featured: featuredProducts.length
    };
}

// 5. Force reload components (simulate React state update)
function forceComponentReload() {
    console.log('\n🔄 Triggering component reload...');
    
    // Dispatch a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('productDataUpdated', {
        detail: { timestamp: Date.now() }
    }));
    
    console.log('✅ Dispatched productDataUpdated event');
    console.log('💡 Refresh the page to see updated products');
}

// 6. Complete diagnostic and fix
function runCompleteDiagnostic() {
    console.log('🚀 Running Complete Product Sync Diagnostic...');
    console.log('='.repeat(60));
    
    // Step 1: Check current state
    const storageState = checkLocalStorageKeys();
    
    // Step 2: Fix key mismatch
    const mergedProducts = fixKeyMismatch();
    
    // Step 3: Add test products if needed
    if (mergedProducts.length === 0) {
        console.log('\n⚠️  No products found, adding test products...');
        addTestProducts();
    }
    
    // Step 4: Verify access
    const accessReport = verifyProductAccess();
    
    // Step 5: Force reload
    forceComponentReload();
    
    console.log('\n📊 DIAGNOSTIC SUMMARY:');
    console.log('='.repeat(30));
    console.log('✅ Products in storage:', accessReport.total);
    console.log('✅ Featured products:', accessReport.featured);
    console.log('✅ Categories with products:', accessReport.byCategory.filter(c => c.count > 0).length);
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Refresh the browser page');
    console.log('2. Check homepage for featured products');
    console.log('3. Check /shop-products page');
    console.log('4. Check /food-items and /decorative-items pages');
    console.log('5. Try adding a new product via admin panel');
    
    return {
        success: true,
        productsCount: accessReport.total,
        report: accessReport
    };
}

// 7. Helper functions for manual testing
function clearAllProducts() {
    localStorage.removeItem('dev_products');
    localStorage.removeItem('devProducts');
    localStorage.removeItem('mockProducts');
    console.log('✅ All product data cleared');
}

function showAllProducts() {
    const products = JSON.parse(localStorage.getItem('dev_products') || '[]');
    console.log('All products:', products);
    return products;
}

// Make functions globally available
window.checkLocalStorageKeys = checkLocalStorageKeys;
window.fixKeyMismatch = fixKeyMismatch;
window.addTestProducts = addTestProducts;
window.verifyProductAccess = verifyProductAccess;
window.forceComponentReload = forceComponentReload;
window.runCompleteDiagnostic = runCompleteDiagnostic;
window.clearAllProducts = clearAllProducts;
window.showAllProducts = showAllProducts;

// Auto-run diagnostic
console.log('\n🛠️ Product Sync Debug Tool');
console.log('Available functions:');
console.log('- runCompleteDiagnostic() - Run full diagnostic and fix');
console.log('- checkLocalStorageKeys() - Check storage keys');
console.log('- fixKeyMismatch() - Fix key mismatch issues');
console.log('- addTestProducts() - Add test products');
console.log('- verifyProductAccess() - Check product accessibility');
console.log('- clearAllProducts() - Clear all product data');
console.log('- showAllProducts() - Display all products');
console.log('\n⚡ Running automatic diagnostic...');

// Run the diagnostic automatically
setTimeout(() => {
    runCompleteDiagnostic();
}, 1000);