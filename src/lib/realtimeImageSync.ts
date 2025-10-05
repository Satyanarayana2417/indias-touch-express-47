import { doc, onSnapshot, collection, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Real-time Image Sync Service
 * Ensures that images uploaded in admin panel instantly appear on main website
 */
export class RealtimeImageSync {
  private static listeners: Map<string, () => void> = new Map();
  
  /**
   * Listen for product changes and trigger image updates
   */
  static listenForProductChanges(callback: (products: any[]) => void): () => void {
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🔄 Real-time update: Products changed', products.length);
      callback(products);
      
      // Trigger custom event for components that need it
      window.dispatchEvent(new CustomEvent('productDataUpdated', {
        detail: { products }
      }));
    }, (error) => {
      console.error('Error listening for product changes:', error);
    });

    return unsubscribe;
  }

  /**
   * Listen for featured products changes
   */
  static listenForFeaturedProducts(callback: (products: any[]) => void): () => void {
    const featuredQuery = query(
      collection(db, 'products'),
      where('featured', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(8)
    );

    const unsubscribe = onSnapshot(featuredQuery, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🌟 Real-time update: Featured products changed', products.length);
      callback(products);
    }, (error) => {
      console.error('Error listening for featured products:', error);
    });

    return unsubscribe;
  }

  /**
   * Listen for specific product changes (for product detail pages)
   */
  static listenForProductById(productId: string, callback: (product: any) => void): () => void {
    const productRef = doc(db, 'products', productId);

    const unsubscribe = onSnapshot(productRef, (doc) => {
      if (doc.exists()) {
        const product = { id: doc.id, ...doc.data() };
        console.log('📦 Real-time update: Product updated', productId);
        callback(product);
      } else {
        console.log('Product not found:', productId);
        callback(null);
      }
    }, (error) => {
      console.error('Error listening for product:', error);
    });

    return unsubscribe;
  }

  /**
   * Force refresh all product displays
   */
  static forceRefresh(): void {
    console.log('🔄 Forcing refresh of all product displays');
    window.dispatchEvent(new CustomEvent('forceProductRefresh'));
  }

  /**
   * Cleanup all listeners
   */
  static cleanup(): void {
    this.listeners.forEach((unsubscribe, key) => {
      unsubscribe();
      console.log(`🧹 Cleaned up listener: ${key}`);
    });
    this.listeners.clear();
  }

  /**
   * Register a listener for cleanup
   */
  static registerListener(key: string, unsubscribe: () => void): void {
    // Cleanup existing listener if any
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.();
    }
    
    this.listeners.set(key, unsubscribe);
  }

  /**
   * Image upload event handler - triggers immediate refresh
   */
  static onImageUploaded(productId?: string): void {
    console.log('📸 Image uploaded, triggering refresh', productId);
    
    // Trigger immediate refresh with a small delay to ensure Firebase sync
    setTimeout(() => {
      this.forceRefresh();
      
      // Also trigger specific events
      window.dispatchEvent(new CustomEvent('imageUploaded', {
        detail: { productId }
      }));
    }, 500);
  }

  /**
   * Product saved event handler - triggers immediate refresh
   */
  static onProductSaved(productId: string): void {
    console.log('💾 Product saved, triggering refresh', productId);
    
    // Immediate refresh
    setTimeout(() => {
      this.forceRefresh();
      
      window.dispatchEvent(new CustomEvent('productSaved', {
        detail: { productId }
      }));
    }, 300);
  }
}

// Global event listeners for cross-component communication
if (typeof window !== 'undefined') {
  // Listen for manual refresh requests
  window.addEventListener('requestProductRefresh', () => {
    RealtimeImageSync.forceRefresh();
  });

  // Auto-cleanup on page unload
  window.addEventListener('beforeunload', () => {
    RealtimeImageSync.cleanup();
  });
}

export default RealtimeImageSync;
