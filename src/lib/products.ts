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
  limit,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

// Helper function to normalize product name for search
const normalizeProductName = (name: string): string => {
  return name.toLowerCase().trim();
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
    const productData = {
      ...product,
      name_lowercase: normalizeProductName(product.name),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to get products');
  }
};

// Get a single product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertDocToProduct(docSnap as QueryDocumentSnapshot<DocumentData>);
    } else {
      return null;
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

    // Firestore "starts with" query using range
    const q = query(
      collection(db, COLLECTION_NAME),
      where('name_lowercase', '>=', normalizedTerm),
      where('name_lowercase', '<=', normalizedTerm + '\uf8ff'),
      orderBy('name_lowercase'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array to fallback to mock data instead of throwing
    return [];
  }
};

// Search products by category
export const getProductsByCategory = async (category: string, maxResults: number = 20): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category.toLowerCase()),
      orderBy('name_lowercase'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToProduct);
  } catch (error) {
    console.error('Error getting products by category:', error);
    // Return empty array to fallback to mock data instead of throwing
    return [];
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };

    // Update name_lowercase if name is being updated
    if (updates.name) {
      updateData.name_lowercase = normalizeProductName(updates.name);
    }

    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
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
