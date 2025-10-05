// Sample Product Creator for Development
// Run this in browser console to create sample products

const createSampleProducts = () => {
  const sampleProducts = [
    {
      id: 'sample-1',
      name: 'Premium Turmeric Powder',
      name_lowercase: 'premium turmeric powder',
      price: '299',
      originalPrice: '399',
      image: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop'
      ],
      description: 'Premium quality turmeric powder with high curcumin content. Perfect for cooking and health benefits.',
      detailedDescription: 'Our premium turmeric powder is sourced from the finest turmeric roots and ground to perfection. Rich in curcumin, it offers excellent anti-inflammatory properties and adds a golden color to your dishes.',
      category: 'spices',
      rating: 4.5,
      reviews: 120,
      badge: 'Best Seller',
      inStock: true,
      variants: [
        { name: '250g', price: 299, originalPrice: 399, stock: 50, isDefault: true },
        { name: '500g', price: 549, originalPrice: 699, stock: 30 },
        { name: '1kg', price: 999, originalPrice: 1299, stock: 15 }
      ],
      nutritionalInfo: 'Rich in curcumin, vitamin C, and antioxidants',
      ingredients: '100% Pure Turmeric Powder',
      origin: 'Karnataka, India',
      weight: '250g, 500g, 1kg options',
      dimensions: '10cm x 15cm x 5cm'
    },
    {
      id: 'sample-2',
      name: 'Organic Garam Masala',
      name_lowercase: 'organic garam masala',
      price: '199',
      originalPrice: '249',
      image: 'https://images.unsplash.com/photo-1596542804477-b8060a00ee95?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596542804477-b8060a00ee95?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1599814953235-bb5c4cf5ddc0?w=500&h=500&fit=crop'
      ],
      description: 'Authentic blend of aromatic spices for perfect Indian cuisine.',
      detailedDescription: 'Hand-ground blend of premium spices including cardamom, cinnamon, cloves, and bay leaves.',
      category: 'spices',
      rating: 4.7,
      reviews: 89,
      badge: 'Organic',
      inStock: true,
      variants: [
        { name: '100g', price: 199, originalPrice: 249, stock: 25, isDefault: true },
        { name: '250g', price: 449, originalPrice: 549, stock: 18 }
      ],
      nutritionalInfo: 'Contains antioxidants and essential oils',
      ingredients: 'Cardamom, Cinnamon, Cloves, Bay Leaves, Black Pepper',
      origin: 'Kerala, India',
      weight: '100g, 250g options'
    },
    {
      id: 'sample-3',
      name: 'Traditional Brass Diya Set',
      name_lowercase: 'traditional brass diya set',
      price: '899',
      originalPrice: '1199',
      image: 'https://images.unsplash.com/photo-1605379399843-5870eea9b74e?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1605379399843-5870eea9b74e?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'
      ],
      description: 'Beautiful handcrafted brass diyas perfect for festivals and daily prayers.',
      detailedDescription: 'Set of 6 traditional brass diyas with intricate designs. Perfect for Diwali, daily prayers, and special occasions.',
      category: 'decorative',
      rating: 4.8,
      reviews: 45,
      badge: 'Handmade',
      inStock: true,
      variants: [
        { name: 'Set of 6', price: 899, originalPrice: 1199, stock: 12, isDefault: true },
        { name: 'Set of 12', price: 1699, originalPrice: 2199, stock: 8 }
      ],
      ingredients: '100% Pure Brass',
      origin: 'Rajasthan, India',
      dimensions: '5cm diameter each diya'
    },
    {
      id: 'sample-4',
      name: 'Basmati Rice Premium',
      name_lowercase: 'basmati rice premium',
      price: '599',
      originalPrice: '699',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=500&h=500&fit=crop',
      description: 'Premium quality basmati rice with long grains and aromatic fragrance.',
      detailedDescription: 'Aged basmati rice with exceptional length and aroma. Perfect for biryani and pulao.',
      category: 'food',
      rating: 4.6,
      reviews: 234,
      badge: 'Premium',
      inStock: true,
      variants: [
        { name: '1kg', price: 599, originalPrice: 699, stock: 45, isDefault: true },
        { name: '5kg', price: 2899, originalPrice: 3399, stock: 20 },
        { name: '10kg', price: 5599, originalPrice: 6499, stock: 12 }
      ],
      nutritionalInfo: 'High in carbohydrates, low in fat',
      ingredients: '100% Basmati Rice',
      origin: 'Punjab, India',
      weight: '1kg, 5kg, 10kg options'
    },
    {
      id: 'sample-5',
      name: 'Handwoven Cotton Saree',
      name_lowercase: 'handwoven cotton saree',
      price: '2499',
      originalPrice: '3199',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop',
      description: 'Beautiful handwoven cotton saree with traditional designs.',
      detailedDescription: 'Authentic handwoven cotton saree featuring traditional motifs and vibrant colors.',
      category: 'decorative',
      rating: 4.9,
      reviews: 67,
      badge: 'Handwoven',
      inStock: true,
      variants: [
        { name: 'One Size', price: 2499, originalPrice: 3199, stock: 8, isDefault: true }
      ],
      ingredients: '100% Pure Cotton',
      origin: 'West Bengal, India',
      dimensions: '6 meters length'
    }
  ];

  // Save to localStorage for development mode
  localStorage.setItem('dev_products', JSON.stringify(sampleProducts));
  
  // Also save to the regular products key used by the app
  localStorage.setItem('venkat_products', JSON.stringify(sampleProducts));
  
  console.log('✅ Sample products created:', sampleProducts.length);
  console.log('🔄 Refreshing page to load products...');
  
  // Dispatch events to update UI
  window.dispatchEvent(new CustomEvent('dev-products-updated', { 
    detail: { products: sampleProducts }
  }));
  
  window.dispatchEvent(new CustomEvent('productDataUpdated'));
  
  return sampleProducts;
};

// Auto-run the function
const products = createSampleProducts();

// Export for manual use
window.createSampleProducts = createSampleProducts;

console.log('🎉 Sample products ready! Navigate to any product page:');
products.forEach((product, index) => {
  console.log(`${index + 1}. /product/${product.id} - ${product.name}`);
});