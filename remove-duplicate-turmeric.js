// 🎯 Duplicate Turmeric Product Detection and Removal Helper
// Copy and paste this into the browser console on the Admin Products page

/**
 * Search for all turmeric-related products and highlight them
 */
function searchForTurmeric() {
    console.log('🔍 Searching for Turmeric products...');
    
    // Search in the admin products page
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.value = 'turmeric';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Search filter applied: "turmeric"');
    }
    
    // Highlight turmeric products in yellow
    setTimeout(() => {
        const rows = document.querySelectorAll('tbody tr');
        let turmericCount = 0;
        
        rows.forEach(row => {
            const nameCell = row.querySelector('td:first-child');
            if (nameCell && nameCell.textContent.toLowerCase().includes('turmeric')) {
                row.style.backgroundColor = '#fef3c7'; // Yellow highlight
                row.style.border = '2px solid #f59e0b';
                turmericCount++;
                console.log(`🌟 Found: ${nameCell.textContent.trim()}`);
            }
        });
        
        console.log(`📊 Total turmeric products found: ${turmericCount}`);
        
        if (turmericCount > 1) {
            console.log('⚠️ DUPLICATES DETECTED! Please review and delete duplicates.');
            console.log('👀 Look for similar products like:');
            console.log('   - "Organic Turmeric Powder"');
            console.log('   - "Turmeric Powder Organic"');
            console.log('   - "Haldi Powder"');
            console.log('   - "Turmeric Powder"');
        } else if (turmericCount === 1) {
            console.log('✅ Perfect! Only one turmeric product found.');
        } else {
            console.log('❌ No turmeric products found. Check your search or database.');
        }
    }, 1000);
}

/**
 * Compare two products to help identify duplicates
 */
function compareProducts(productA, productB) {
    console.log('🔍 Comparing products:');
    console.log('Product A:', productA);
    console.log('Product B:', productB);
    
    const similarities = [];
    
    if (productA.toLowerCase().includes('turmeric') && productB.toLowerCase().includes('turmeric')) {
        similarities.push('Both contain "turmeric"');
    }
    
    if (productA.toLowerCase().includes('organic') && productB.toLowerCase().includes('organic')) {
        similarities.push('Both are organic');
    }
    
    if (productA.toLowerCase().includes('powder') && productB.toLowerCase().includes('powder')) {
        similarities.push('Both are powder form');
    }
    
    if (similarities.length > 0) {
        console.log('⚠️ Similarities found:', similarities);
        console.log('🤔 These might be duplicates - review carefully!');
    } else {
        console.log('✅ Products seem different');
    }
}

/**
 * Clear all highlights
 */
function clearHighlights() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.backgroundColor = '';
        row.style.border = '';
    });
    console.log('✅ Highlights cleared');
}

/**
 * Show summary of current products
 */
function showProductSummary() {
    const rows = document.querySelectorAll('tbody tr');
    console.log(`📊 Total products visible: ${rows.length}`);
    
    const productNames = [];
    rows.forEach(row => {
        const nameCell = row.querySelector('td:first-child');
        if (nameCell) {
            productNames.push(nameCell.textContent.trim());
        }
    });
    
    console.log('📋 All visible products:', productNames);
}

// Auto-run turmeric search
console.log('🚀 Turmeric Duplicate Detection Tool Loaded!');
console.log('📋 Available commands:');
console.log('   - searchForTurmeric()     - Find and highlight turmeric products');
console.log('   - clearHighlights()       - Remove highlighting');
console.log('   - showProductSummary()    - Show all products');
console.log('   - compareProducts(a, b)   - Compare two product names');
console.log('');
console.log('🎯 Running automatic search...');
searchForTurmeric();