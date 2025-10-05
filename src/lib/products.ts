import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ImageUploadService } from '@/lib/imageUpload';
import { CloudinaryService } from '@/lib/cloudinaryService';
import { verifyAdminAccess } from '@/lib/adminUtils';

// Check if we're in development mode
const isDevMode = import.meta.env.DEV || 
                  import.meta.env.VITE_FIREBASE_API_KEY === undefined || 
                  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-api-key" ||
                  import.meta.env.VITE_FIREBASE_API_KEY === "demo";

export interface ProductVariant {
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isDefault?: boolean;
}

export interface Product {
  id?: string;
  name: string;
  name_lowercase: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[]; // Additional product images
  description: string;
  detailedDescription?: string;
  category: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  inStock: boolean;
  variants?: ProductVariant[];
  nutritionalInfo?: string;
  ingredients?: string;
  origin?: string;
  weight?: string;
  dimensions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'products';
const DEV_STORAGE_KEY = 'dev_products';

// Helper function to normalize product name for search
const normalizeProductName = (name: string): string => {
  return name.toLowerCase().trim();
};

// Development mode storage functions
const getDevProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(DEV_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // If no products exist, create some sample products
      console.log('🎨 No products found, creating sample products for development...');
      const sampleProducts = createSampleProducts();
      saveDevProducts(sampleProducts);
      return sampleProducts;
    }
  } catch (error) {
    console.error('Error reading dev products:', error);
    return [];
  }
};

// Create sample products for development
const createSampleProducts = (): Product[] => {
  return [
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
};

const saveDevProducts = (products: Product[]): void => {
  try {
    console.log('💾 Saving dev products:', products.length, 'products');
    localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(products));
    
    // Dispatch custom event to notify other components of the change
    console.log('📡 Dispatching dev-products-updated event');
    window.dispatchEvent(new CustomEvent('dev-products-updated', { 
      detail: { products }
    }));
    
    console.log('✅ Dev products saved and event dispatched');
  } catch (error) {
    console.error('Error saving dev products:', error);
  }
};

const generateId = (): string => {
  return 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Convert Firestore document to Product interface
const convertDocToProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    name_lowercase: data.name_lowercase,
    price: data.price,
    originalPrice: data.originalPrice,
    image: data.image,
    images: data.images || [],
    description: data.description,
    detailedDescription: data.detailedDescription,
    category: data.category,
    rating: data.rating,
    reviews: data.reviews,
    badge: data.badge,
    inStock: data.inStock,
    variants: data.variants || [],
    nutritionalInfo: data.nutritionalInfo,
    ingredients: data.ingredients,
    origin: data.origin,
    weight: data.weight,
    dimensions: data.dimensions,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Verify admin access before attempting to add product
    await verifyAdminAccess();
    
    console.log('Adding product in development mode:', isDevMode);
    
    if (isDevMode) {
      // Development mode: use localStorage
      console.log('🔧 Adding product in development mode');
      const products = getDevProducts();
      console.log('📦 Current products count:', products.length);
      
      const newProduct: Product = {
        ...product,
        id: generateId(),
        name_lowercase: normalizeProductName(product.name),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('➕ Adding new product:', newProduct.name, 'ID:', newProduct.id);
      products.push(newProduct);
      saveDevProducts(products);
      
      // Verify save
      const savedProducts = getDevProducts();
      console.log('✅ Product saved successfully. New count:', savedProducts.length);
      console.log('🆔 Product ID:', newProduct.id);
      
      return newProduct.id;
    } else {
      // Production mode: use Firestore
      console.log('Using Firestore for product storage');
      const productData = {
        ...product,
        name_lowercase: normalizeProductName(product.name),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding product:', error);
    // Re-throw the original error if it's an admin access error
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error;
    }
    throw new Error('Failed to add product');
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    if (isDevMode) {
      // Development mode: return products from localStorage
      console.log('📦 Getting all products from localStorage (dev mode)');
      const products = getDevProducts();
      console.log('📊 Found', products.length, 'products in localStorage');
      return products;
    } else {
      // Production mode: use Firestore
      console.log('📦 Getting all products from Firestore (production mode)');
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const products = querySnapshot.docs.map(convertDocToProduct);
      console.log('📊 Found', products.length, 'products in Firestore');
      return products;
    }
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to get products');
  }
};

// Get a single product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    if (isDevMode) {
      // Development mode: find product in localStorage
      const products = getDevProducts();
      return products.find(p => p.id === productId) || null;
    } else {
      // Production mode: use Firestore
      const docRef = doc(db, COLLECTION_NAME, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDocToProduct(docSnap as QueryDocumentSnapshot<DocumentData>);
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error('Error getting product by ID:', error);
    // Return null to fallback to mock data instead of throwing
    return null;
  }
};

// Search products by name (starts with)
export const searchProducts = async (searchTerm: string, maxResults: number = 6): Promise<Product[]> => {
  try {
    const normalizedTerm = normalizeProductName(searchTerm);
    
    if (!normalizedTerm) {
      return [];
    }

    if (isDevMode) {
      // Development mode: search in localStorage
      const products = getDevProducts();
      return products
        .filter(product => product.name_lowercase.startsWith(normalizedTerm))
        .slice(0, maxResults);
    } else {
      // Production mode: use Firestore
      const q = query(
        collection(db, COLLECTION_NAME),
        where('name_lowercase', '>=', normalizedTerm),
        where('name_lowercase', '<=', normalizedTerm + '\uf8ff'),
        orderBy('name_lowercase'),
        firestoreLimit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertDocToProduct);
    }
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array to fallback to mock data instead of throwing
    return [];
  }
};

// Search products by category
export const getProductsByCategory = async (category: string, maxResults: number = 20): Promise<Product[]> => {
  try {
    if (isDevMode) {
      // Development mode: filter from localStorage products
      const products = getDevProducts();
      const categoryProducts = products
        .filter(product => product.category.toLowerCase() === category.toLowerCase())
        .sort((a, b) => a.name_lowercase.localeCompare(b.name_lowercase))
        .slice(0, maxResults);
      
      return categoryProducts;
    } else {
      // Production mode: use Firestore
      const q = query(
        collection(db, COLLECTION_NAME),
        where('category', '==', category.toLowerCase()),
        orderBy('name_lowercase'),
        firestoreLimit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertDocToProduct);
    }
  } catch (error) {
    console.error('Error getting products by category:', error);
    // Return empty array to fallback to mock data instead of throwing
    return [];
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    // Verify admin access before attempting to update product
    await verifyAdminAccess();
    
    if (isDevMode) {
      // Development mode: update product in localStorage
      const products = getDevProducts();
      const index = products.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        const updateData = {
          ...updates,
          updatedAt: new Date(),
        };

        // Update name_lowercase if name is being updated
        if (updates.name) {
          updateData.name_lowercase = normalizeProductName(updates.name);
        }

        products[index] = { ...products[index], ...updateData };
        saveDevProducts(products);
      } else {
        throw new Error('Product not found');
      }
    } else {
      // Production mode: use Firestore
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Update name_lowercase if name is being updated
      if (updates.name) {
        updateData.name_lowercase = normalizeProductName(updates.name);
      }

      const productRef = doc(db, COLLECTION_NAME, productId);
      await updateDoc(productRef, updateData);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    // Re-throw the original error if it's an admin access error
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error;
    }
    throw new Error('Failed to update product');
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  if (isDevMode) {
    // Development mode: remove from localStorage
    const products = getDevProducts();
    const updatedProducts = products.filter(p => p.id !== productId);
    saveDevProducts(updatedProducts);
    return;
  }

  try {
    // Verify admin access before attempting to delete product
    await verifyAdminAccess();
    
    // First get the product to access its images
    const product = await getProductById(productId);
    
    if (product) {
      // Get all image URLs
      const allImages = [product.image, ...(product.images || [])].filter(Boolean);
      
      // Separate Firebase Storage and Cloudinary images
      const firebaseImages = allImages.filter(url => !CloudinaryService.isCloudinaryUrl(url));
      const cloudinaryImages = allImages.filter(url => CloudinaryService.isCloudinaryUrl(url));
      
      // Delete from Firebase Storage (existing functionality)
      if (firebaseImages.length > 0) {
        await ImageUploadService.deleteProductImages(firebaseImages);
      }
      
      // Delete from Cloudinary (new functionality)
      if (cloudinaryImages.length > 0) {
        try {
          await CloudinaryService.deleteImages(cloudinaryImages);
        } catch (error) {
          console.error('Failed to delete some Cloudinary images:', error);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    // Delete the product document
    const productRef = doc(db, COLLECTION_NAME, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    // Re-throw the original error if it's an admin access error
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error;
    }
    throw new Error('Failed to delete product');
  }
};

// Batch add products (useful for initial data seeding)
export const batchAddProducts = async (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> => {
  const addedIds: string[] = [];
  
  for (const product of products) {
    try {
      const id = await addProduct(product);
      addedIds.push(id);
    } catch (error) {
      console.error(`Failed to add product: ${product.name}`, error);
    }
  }
  
  return addedIds;
};

// Sample products for seeding (run this once to populate your Firestore)
export const seedProducts = async (): Promise<void> => {
  const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: "Premium Garam Masala",
      name_lowercase: "premium garam masala",
      price: "₹299",
      originalPrice: "₹399",
      image: "https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png",
      images: [
        "https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png",
        "https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/garam-masala-powder-500x500.jpg",
        "https://m.media-amazon.com/images/I/61eiR2QdMJL.jpg",
        "https://cdn.shopify.com/s/files/1/0258/4307/3103/products/asset_2_800x.jpg"
      ],
      description: "Authentic garam masala blend with traditional Indian spices for rich, aromatic flavors.",
      detailedDescription: "Our Premium Garam Masala is a carefully crafted blend of the finest whole spices, roasted to perfection and ground to release maximum flavor. This aromatic spice blend is essential for authentic Indian cooking and adds warmth and depth to curries, rice dishes, and grilled meats. Made with traditional recipes passed down through generations.",
      category: "spices",
      rating: 4.8,
      reviews: 156,
      badge: "Best Seller",
      inStock: true,
      variants: [
        { name: "100g", price: 199, originalPrice: 249, stock: 50, isDefault: true },
        { name: "250g", price: 299, originalPrice: 399, stock: 30 },
        { name: "500g", price: 499, originalPrice: 649, stock: 20 },
        { name: "1kg", price: 899, originalPrice: 1199, stock: 10 }
      ],
      ingredients: "Coriander, Cumin, Black Cardamom, Green Cardamom, Cinnamon, Cloves, Black Pepper, Bay Leaves, Nutmeg, Mace",
      nutritionalInfo: "Per 100g: Energy 375 kcal, Protein 12g, Fat 15g, Carbohydrates 55g, Fiber 35g",
      origin: "Rajasthan, India",
      weight: "250g"
    },
    {
      name: "Organic Turmeric Powder",
      name_lowercase: "organic turmeric powder",
      price: "₹399",
      originalPrice: "₹499",
      image: "https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg",
      images: [
        "https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg",
        "https://m.media-amazon.com/images/I/616TtvR-zQS._UF350,350_QL80_.jpg",
        "https://5.imimg.com/data5/SELLER/Default/2021/8/HK/LM/NO/1234567/turmeric-powder-500x500.jpg"
      ],
      description: "Pure organic turmeric powder with high curcumin content, sourced directly from Indian farms.",
      detailedDescription: "Sourced directly from organic farms in Kerala, our turmeric powder contains high levels of curcumin, the active compound known for its anti-inflammatory and antioxidant properties. Perfect for cooking, beauty treatments, and wellness drinks. Our turmeric is sun-dried and ground using traditional methods to preserve its natural goodness.",
      category: "spices",
      rating: 4.9,
      reviews: 234,
      badge: "Organic",
      inStock: true,
      variants: [
        { name: "250g", price: 299, originalPrice: 349, stock: 40 },
        { name: "500g", price: 399, originalPrice: 499, stock: 25, isDefault: true },
        { name: "1kg", price: 699, originalPrice: 899, stock: 15 }
      ],
      ingredients: "100% Pure Organic Turmeric (Curcuma longa)",
      nutritionalInfo: "Per 100g: Energy 312 kcal, Protein 9.7g, Fat 3.2g, Carbohydrates 67.1g, Curcumin 3-5%",
      origin: "Kerala, India",
      weight: "500g"
    },
    {
      name: "Cardamom Pods",
      name_lowercase: "cardamom pods",
      price: "₹899",
      originalPrice: "₹1099",
      image: "https://media.istockphoto.com/id/1327578667/photo/cardamom-pods-isolated-on-white-background-top-view.jpg",
      images: [
        "https://media.istockphoto.com/id/1327578667/photo/cardamom-pods-isolated-on-white-background-top-view.jpg",
        "https://5.imimg.com/data5/SELLER/Default/2022/9/AW/WY/JQ/17906995/cardamom-1000x1000.jpg"
      ],
      description: "Green cardamom pods from Kerala, essential for authentic Indian sweets and chai.",
      detailedDescription: "Premium quality green cardamom pods sourced directly from the hills of Kerala. Known as the 'Queen of Spices', cardamom adds a sweet, floral aroma to both sweet and savory dishes. Our cardamom pods are hand-picked and carefully dried to preserve their essential oils and intense flavor.",
      category: "spices",
      rating: 4.7,
      reviews: 89,
      badge: "Premium",
      inStock: true,
      variants: [
        { name: "50g", price: 599, originalPrice: 699, stock: 25 },
        { name: "100g", price: 899, originalPrice: 1099, stock: 15, isDefault: true },
        { name: "250g", price: 1999, originalPrice: 2499, stock: 8 }
      ],
      ingredients: "100% Pure Green Cardamom (Elettaria cardamomum)",
      nutritionalInfo: "Per 100g: Energy 311 kcal, Protein 10.8g, Fat 6.7g, Carbohydrates 68.5g",
      origin: "Kerala, India",
      weight: "100g"
    },
    {
      name: "Premium Coffee Powder",
      name_lowercase: "premium coffee powder",
      price: "₹1,999",
      originalPrice: "₹2,399",
      image: "https://www.jiomart.com/images/product/original/rvfav9k7op/pack-of-2-200-gram-100-arabica-instant-classic-strong-coffee-powder-premium-coffee-strong-coffee-classic-coffee-espresso-latte-cappucino-pure-coffee-hot-cold-coffee-non-breakable-jar-product-images-orvfav9k7op-p600689638-0-202304190917.png?im=Resize=(1000,1000)",
      description: "Premium 100% Arabica instant coffee powder for rich, smooth coffee experience.",
      category: "beverages",
      rating: 4.8,
      reviews: 156,
      badge: "Best Seller",
      inStock: true,
    },
    {
      name: "Premium Basmati Rice",
      name_lowercase: "premium basmati rice",
      price: "₹1,999",
      originalPrice: "₹2,399",
      image: "https://5.imimg.com/data5/SELLER/Default/2022/9/AW/WY/JQ/17906995/basmati-rice-1000x1000.jpg",
      description: "Long-grain aromatic basmati rice from the foothills of Himalayas, perfect for biryanis.",
      category: "rice-grains",
      rating: 4.8,
      reviews: 256,
      badge: "Premium Quality",
      inStock: true,
    },
    {
      name: "Brass Diya Set",
      name_lowercase: "brass diya set",
      price: "₹2,939",
      originalPrice: "₹3,369",
      image: "https://m.media-amazon.com/images/I/61eiR2QdMJL.jpg",
      description: "Traditional brass diya set for festivals and religious ceremonies.",
      category: "decorative",
      rating: 4.6,
      reviews: 78,
      badge: "Traditional",
      inStock: true,
    },
  ];

  try {
    const addedIds = await batchAddProducts(sampleProducts);
    console.log(`Successfully added ${addedIds.length} products to Firestore`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Real-time product sync
export const subscribeToProducts = (callback: (products: Product[]) => void): Unsubscribe => {
  if (isDevMode) {
    console.log('🔄 Setting up development mode product subscription');
    // Development mode: Use localStorage with real-time updates
    let isActive = true;
    
    const loadDevProducts = () => {
      if (isActive) {
        const products = getDevProducts().sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // newest first
        });
        console.log('📦 Loading dev products for subscription:', products.length);
        callback(products);
      }
    };
    
    // Initial load
    loadDevProducts();
    
    // Listen for custom product update events (same tab)
    const handleProductUpdate = () => {
      if (isActive) {
        console.log('📡 Received dev-products-updated event');
        loadDevProducts();
      }
    };
    
    // Listen for storage changes (different tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEV_STORAGE_KEY && isActive) {
        console.log('🔄 Received storage change event');
        loadDevProducts();
      }
    };
    
    window.addEventListener('dev-products-updated', handleProductUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // Return unsubscribe function
    return () => {
      isActive = false;
      window.removeEventListener('dev-products-updated', handleProductUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  } else {
    // Production mode: Use Firestore real-time subscription
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(convertDocToProduct);
      callback(products);
    }, (error) => {
      console.error('Error in products subscription:', error);
    });
  }
};

// Subscribe to a specific product
export const subscribeToProduct = (
  productId: string, 
  callback: (product: Product | null) => void
): Unsubscribe => {
  const productRef = doc(db, COLLECTION_NAME, productId);
  
  return onSnapshot(productRef, (doc) => {
    if (doc.exists()) {
      const product = convertDocToProduct(doc as QueryDocumentSnapshot<DocumentData>);
      callback(product);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in product subscription:', error);
    callback(null);
  });
};

// Get products with pagination
export const getProductsPaginated = async (
  lastProduct?: Product,
  limitCount: number = 20
): Promise<{ products: Product[]; hasMore: boolean }> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount + 1) // Get one extra to check if there are more
    );

    // If we have a last product, start after it
    if (lastProduct && lastProduct.createdAt) {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount + 1)
      );
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.slice(0, limitCount).map(convertDocToProduct);
    const hasMore = snapshot.docs.length > limitCount;

    return { products, hasMore };
  } catch (error) {
    console.error('Error getting paginated products:', error);
    throw new Error('Failed to get products');
  }
};

// Get products by multiple categories
export const getProductsByCategories = async (categories: string[]): Promise<Product[]> => {
  try {
    if (categories.length === 0) {
      return [];
    }

    const promises = categories.map(category => 
      getProductsByCategory(category.toLowerCase())
    );
    
    const results = await Promise.all(promises);
    const allProducts = results.flat();
    
    // Remove duplicates based on ID
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueProducts;
  } catch (error) {
    console.error('Error getting products by categories:', error);
    return [];
  }
};

// Get low stock products (for admin alerts)
export const getLowStockProducts = async (threshold: number = 5): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    
    return allProducts.filter(product => {
      if (!product.variants || product.variants.length === 0) {
        return false; // No variants to check stock
      }
      
      // Check if any variant has low stock
      return product.variants.some(variant => variant.stock <= threshold);
    });
  } catch (error) {
    console.error('Error getting low stock products:', error);
    return [];
  }
};

// Get out of stock products
export const getOutOfStockProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    
    return allProducts.filter(product => {
      if (!product.variants || product.variants.length === 0) {
        return !product.inStock;
      }
      
      // Check if all variants are out of stock
      return product.variants.every(variant => variant.stock === 0);
    });
  } catch (error) {
    console.error('Error getting out of stock products:', error);
    return [];
  }
};

// Update product stock
export const updateProductStock = async (
  productId: string, 
  variantName: string, 
  newStock: number
): Promise<void> => {
  try {
    const product = await getProductById(productId);
    if (!product || !product.variants) {
      throw new Error('Product or variants not found');
    }

    const updatedVariants = product.variants.map(variant => 
      variant.name === variantName 
        ? { ...variant, stock: newStock }
        : variant
    );

    // Update overall inStock status
    const hasStock = updatedVariants.some(variant => variant.stock > 0);

    await updateProduct(productId, {
      variants: updatedVariants,
      inStock: hasStock
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw new Error('Failed to update product stock');
  }
};

// Bulk update products
export const bulkUpdateProducts = async (
  updates: Array<{ id: string; data: Partial<Product> }>
): Promise<void> => {
  try {
    const promises = updates.map(({ id, data }) => updateProduct(id, data));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error bulk updating products:', error);
    throw new Error('Failed to bulk update products');
  }
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    if (isDevMode) {
      // Development mode: filter from localStorage products
      const products = getDevProducts();
      const featuredProducts = products.filter(product => 
        product.badge && ['Best Seller', 'Featured', 'Premium'].includes(product.badge)
      );
      
      // Sort by rating and limit
      const sortedFeatured = featuredProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
      
      // If we don't have enough featured products, fill with regular products
      if (sortedFeatured.length < limit) {
        const regularProducts = products
          .filter(p => !featuredProducts.includes(p))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit - sortedFeatured.length);
        
        return [...sortedFeatured, ...regularProducts];
      }
      
      return sortedFeatured;
    } else {
      // Production mode: use Firestore
      const q = query(
        collection(db, COLLECTION_NAME),
        where('badge', 'in', ['Best Seller', 'Featured', 'Premium']),
        orderBy('rating', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(convertDocToProduct);
    }
  } catch (error) {
    console.error('Error getting featured products:', error);
    // Fallback to regular products
    const allProducts = await getAllProducts();
    return allProducts.slice(0, limit);
  }
};

// Search products with advanced filters
export const searchProductsAdvanced = async (filters: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  limit?: number;
}): Promise<Product[]> => {
  try {
    let products = await getAllProducts();

    // Apply filters
    if (filters.query) {
      const searchTerm = normalizeProductName(filters.query);
      products = products.filter(product => 
        product.name_lowercase.includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      products = products.filter(product => 
        product.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter(product => {
        const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    if (filters.inStock !== undefined) {
      products = products.filter(product => product.inStock === filters.inStock);
    }

    if (filters.rating !== undefined) {
      products = products.filter(product => 
        (product.rating || 0) >= filters.rating!
      );
    }

    // Limit results
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }

    return products;
  } catch (error) {
    console.error('Error in advanced search:', error);
    return [];
  }
};
