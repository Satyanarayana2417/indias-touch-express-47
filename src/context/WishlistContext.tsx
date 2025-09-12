import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db, hasValidConfig } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating?: number;
  reviews?: number;
  badges?: string[];
  description?: string;
  category?: string;
  inStock?: boolean;
}

interface WishlistContextType {
  wishlist: string[];
  wishlistProducts: Product[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  fetchWishlistProducts: () => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Mock wishlist data for development mode
const mockWishlistData: { [key: string]: string[] } = {};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Check if we're in development mode
  const isDevMode = !hasValidConfig;

  // Fetch user's wishlist from Firestore
  const fetchWishlist = async () => {
    if (!currentUser) {
      setWishlist([]);
      setWishlistProducts([]);
      return;
    }

    if (isDevMode) {
      // Use mock data in development mode
      const userWishlist = mockWishlistData[currentUser.uid] || [];
      setWishlist(userWishlist);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userWishlist = userData.wishlist || [];
        setWishlist(userWishlist);
      } else {
        // Create user document with empty wishlist if it doesn't exist
        await setDoc(userDocRef, {
          email: currentUser.email,
          wishlist: [],
          createdAt: new Date().toISOString(),
        });
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch full product details for wishlist items
  const fetchWishlistProducts = async () => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }

    setLoading(true);
    
    if (isDevMode) {
      // Use mock product data in development mode
      const mockProducts: Product[] = wishlist.map(id => ({
        id,
        name: `Mock Product ${id}`,
        price: '₹999',
        originalPrice: '₹1,299',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: 4.5,
        reviews: 123,
        badges: ['Popular'],
        description: 'This is a mock product for development.',
        category: 'general',
        inStock: true
      }));
      setWishlistProducts(mockProducts);
      setLoading(false);
      return;
    }

    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('__name__', 'in', wishlist));
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data() as Omit<Product, 'id'>
        });
      });
      
      setWishlistProducts(products);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  // Add product to wishlist
  const addToWishlist = async (productId: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist(productId)) {
      return; // Already in wishlist
    }

    // Update local state immediately for better UX
    setWishlist(prev => [...prev, productId]);

    if (isDevMode) {
      // Update mock data in development mode
      mockWishlistData[currentUser.uid] = [...(mockWishlistData[currentUser.uid] || []), productId];
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist.",
      });
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayUnion(productId)
      });
      
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist.",
      });
    } catch (error) {
      // Revert local state on error
      setWishlist(prev => prev.filter(id => id !== productId));
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!currentUser) {
      return;
    }

    if (!isInWishlist(productId)) {
      return; // Not in wishlist
    }

    // Update local state immediately for better UX
    setWishlist(prev => prev.filter(id => id !== productId));

    if (isDevMode) {
      // Update mock data in development mode
      mockWishlistData[currentUser.uid] = (mockWishlistData[currentUser.uid] || []).filter(id => id !== productId);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayRemove(productId)
      });
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      // Revert local state on error
      setWishlist(prev => [...prev, productId]);
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle product in wishlist
  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!currentUser) {
      return;
    }

    setWishlist([]);

    if (isDevMode) {
      mockWishlistData[currentUser.uid] = [];
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: []
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch wishlist when user changes
  useEffect(() => {
    fetchWishlist();
  }, [currentUser]);

  // Fetch wishlist products when wishlist changes
  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const value: WishlistContextType = {
    wishlist,
    wishlistProducts,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlistProducts,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};