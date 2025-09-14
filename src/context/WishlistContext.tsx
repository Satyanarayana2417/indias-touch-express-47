import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

// Richer shape expected by Wishlist page
export interface WishlistProduct {
  id: string;
  name: string;
  price: string;          // keep display price (₹299) as-is for UI
  image: string;
  originalPrice?: string;
  badges?: string[];
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}

interface WishlistContextType {
  wishlistProducts: WishlistProduct[];
  loading: boolean;
  addToWishlist: (product: WishlistProduct | (string | number), name?: string, price?: string | number, image?: string) => void;
  removeFromWishlist: (id: string) => Promise<void> | void;
  clearWishlist: () => Promise<void> | void;
  isInWishlist: (id: string) => boolean;
  // Backward compatibility (legacy names)
  items: WishlistProduct[];
  addItem: (item: WishlistProduct) => void;
  removeItem: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const STORAGE_KEY = 'wishlist_v1';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false); // reserved for async expansion

  // Load persisted wishlist
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as WishlistProduct[];
          if (Array.isArray(parsed)) {
            setWishlistProducts(parsed.filter(p => p && p.id));
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load wishlist', e);
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistProducts));
      }
    } catch (e) {
      console.warn('Failed to persist wishlist', e);
    }
  }, [wishlistProducts]);

  const addToWishlist: WishlistContextType['addToWishlist'] = (first, name, price, image) => {
    let product: WishlistProduct | null = null;
    if (typeof first === 'object' && first !== null && 'id' in first) {
      product = { ...first } as WishlistProduct;
    } else {
      const id = String(first);
      product = {
        id,
        name: name || 'Unknown Product',
        price: typeof price === 'number' ? `₹${price}` : (price || '₹0'),
        image: image || '/placeholder.svg'
      };
    }
    setWishlistProducts(prev => {
      const filtered = prev.filter(p => p.id !== product!.id);
      return [...filtered, product!];
    });
  };

  const removeFromWishlist = async (id: string) => {
    setWishlistProducts(prev => prev.filter(p => p.id !== id));
  };

  const clearWishlist = async () => {
    setWishlistProducts([]);
  };

  const isInWishlist = useCallback((id: string) => wishlistProducts.some(p => p.id === id), [wishlistProducts]);

  // Backward compatibility wrappers
  const addItem = (item: WishlistProduct) => addToWishlist(item);
  const removeItem = (id: string) => { removeFromWishlist(id); };

  const value: WishlistContextType = {
    wishlistProducts,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    items: wishlistProducts,
    addItem,
    removeItem
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};