import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  CartItem as FirebaseCartItem, 
  UserCart,
  addToCart as firebaseAddToCart,
  updateCartItemQuantity as firebaseUpdateQuantity,
  removeFromCart as firebaseRemoveFromCart,
  clearCart as firebaseClearCart,
  subscribeToCart,
  initializeUserCart,
  mergeLocalCartWithUserCart
} from '@/lib/cart';

// Extended cart item to support variant & original price tracking
export interface CartItem {
  id: string;                 // product id
  name: string;               // product name
  price: number;              // numeric price used for totals
  quantity: number;           // quantity added
  image: string;              // image url
  variant?: string;           // optional variant identifier/name
  originalPrice?: number;     // for showing discount vs current price
  displayPrice?: string;      // cached formatted or original string (?299 etc.)
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    item: CartItem | (
      string | number
    ),
    name?: string,
    priceOrDisplay?: string | number,
    image?: string,
    variant?: string,
    originalPrice?: string | number
  ) => void; // flexible overload style
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  total: number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  isAuthenticated: boolean;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const STORAGE_KEY = 'cartItems_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('offline');
  const [user, setUser] = useState<User | null>(null);
  const [cartUnsubscribe, setCartUnsubscribe] = useState<(() => void) | null>(null);

  // Convert Firebase cart item to local cart item format
  const convertFirebaseItem = useCallback((firebaseItem: FirebaseCartItem): CartItem => ({
    id: firebaseItem.productId,
    name: firebaseItem.name,
    price: firebaseItem.price,
    quantity: firebaseItem.quantity,
    image: firebaseItem.image,
    variant: firebaseItem.variant,
    originalPrice: firebaseItem.originalPrice,
    displayPrice: firebaseItem.displayPrice
  }), []);

  // Convert local cart item to Firebase format
  const convertToFirebaseItem = useCallback((item: CartItem): Omit<FirebaseCartItem, 'addedAt' | 'id'> => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    variant: item.variant,
    originalPrice: item.originalPrice,
    displayPrice: item.displayPrice
  }), []);

  // Load cart from localStorage (for unauthenticated users)
  const loadLocalCart = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed)) {
            return parsed.filter(p => p && p.id);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
    return [];
  }, []);

  // Save cart to localStorage (for unauthenticated users)
  const saveLocalCart = useCallback((cartItems: CartItem[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      }
    } catch (e) {
      console.warn('Failed to persist cart', e);
    }
  }, []);

  // Clear localStorage cart
  const clearLocalCart = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to clear local cart', e);
    }
  }, []);

  // Handle Firebase cart updates
  const handleCartUpdate = useCallback((cart: UserCart) => {
    const convertedItems = cart.items.map(convertFirebaseItem);
    setItems(convertedItems);
    setSyncStatus('synced');
    setIsLoading(false);
  }, [convertFirebaseItem]);

  // Handle cart errors
  const handleCartError = useCallback((error: Error) => {
    console.error('Cart sync error:', error);
    setSyncStatus('error');
    setIsLoading(false);
  }, []);

  // Set up Firebase auth listener
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);

      // Clean up existing cart subscription
      if (cartUnsubscribe) {
        cartUnsubscribe();
        setCartUnsubscribe(null);
      }

      if (firebaseUser) {
        // User is authenticated - switch to Firebase cart
        setIsLoading(true);
        setSyncStatus('syncing');

        try {
          // Get any existing local cart items
          const localItems = loadLocalCart();
          
          // If there are local items, merge them with user's cart
          if (localItems.length > 0) {
            const firebaseItems = localItems.map(convertToFirebaseItem);
            await mergeLocalCartWithUserCart(firebaseItems.map(item => ({
              ...item,
              id: item.variant ? `${item.productId}_${item.variant}` : item.productId,
              addedAt: new Date() as any // Will be converted to Timestamp in the function
            })));
            clearLocalCart();
          }

          // Set up real-time cart subscription
          const unsubscribe = subscribeToCart(handleCartUpdate, handleCartError);
          setCartUnsubscribe(() => unsubscribe);

        } catch (error) {
          console.error('Error setting up authenticated cart:', error);
          handleCartError(error as Error);
        }
      } else {
        // User is not authenticated - use local storage
        setIsLoading(false);
        setSyncStatus('offline');
        const localItems = loadLocalCart();
        setItems(localItems);
      }
    });

    return () => {
      unsubscribeAuth();
      if (cartUnsubscribe) {
        cartUnsubscribe();
      }
    };
  }, [loadLocalCart, convertToFirebaseItem, handleCartUpdate, handleCartError, clearLocalCart, cartUnsubscribe]);

  // Persist to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      saveLocalCart(items);
    }
  }, [items, isAuthenticated, isLoading, saveLocalCart]);

  const parsePrice = useCallback((value: string | number | undefined): number => {
    if (value === undefined) return 0;
    if (typeof value === 'number') return value;
    const cleaned = value.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }, []);

  const compositeMatch = (a: CartItem, id: string, variant?: string) => {
    return a.id === id && (a.variant || '') === (variant || '');
  };

  const addItem: CartContextType['addItem'] = async (
    first: CartItem | (string | number),
    name?: string,
    priceOrDisplay?: string | number,
    image?: string,
    variant?: string,
    originalPrice?: string | number
  ) => {
    let item: CartItem | null = null;
    if (typeof first === 'object' && first !== null && 'id' in first) {
      // Provided full object
      item = { ...first } as CartItem;
      item.price = parsePrice((first as any).price);
      if (!item.quantity) item.quantity = 1;
    } else {
      // Provided positional args
      const id = String(first);
      const numericPrice = parsePrice(priceOrDisplay);
      const displayPrice = typeof priceOrDisplay === 'string' ? priceOrDisplay : undefined;
      const numericOriginal = parsePrice(originalPrice);
      item = {
        id,
        name: name || 'Unknown Item',
        price: numericPrice,
        quantity: 1,
        image: image || '/placeholder.svg',
        variant,
        originalPrice: numericOriginal || undefined,
        displayPrice
      };
    }

    if (isAuthenticated && user) {
      // Add to Firebase
      try {
        setSyncStatus('syncing');
        const firebaseItem = convertToFirebaseItem(item);
        await firebaseAddToCart(firebaseItem);
        // Firebase listener will update the state
      } catch (error) {
        console.error('Error adding item to Firebase cart:', error);
        setSyncStatus('error');
      }
    } else {
      // Add to local state
      setItems(prev => {
        const existing = prev.find(p => compositeMatch(p, item!.id, item!.variant));
        if (existing) {
          return prev.map(p => compositeMatch(p, item!.id, item!.variant)
            ? { ...p, quantity: p.quantity + (item!.quantity || 1), price: item!.price }
            : p);
        }
        return [...prev, item!];
      });
    }
  };

  const removeItem = async (id: string, variant?: string) => {
    if (isAuthenticated && user) {
      // Remove from Firebase
      try {
        setSyncStatus('syncing');
        await firebaseRemoveFromCart(id, variant);
        // Firebase listener will update the state
      } catch (error) {
        console.error('Error removing item from Firebase cart:', error);
        setSyncStatus('error');
      }
    } else {
      // Remove from local state
      setItems(prev => prev.filter(p => !compositeMatch(p, id, variant)));
    }
  };

  const updateQuantity = async (id: string, quantity: number, variant?: string) => {
    if (quantity < 1) return;
    
    if (isAuthenticated && user) {
      // Update in Firebase
      try {
        setSyncStatus('syncing');
        await firebaseUpdateQuantity(id, quantity, variant);
        // Firebase listener will update the state
      } catch (error) {
        console.error('Error updating quantity in Firebase cart:', error);
        setSyncStatus('error');
      }
    } else {
      // Update local state
      setItems(prev => prev.map(p => compositeMatch(p, id, variant) ? { ...p, quantity } : p));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      // Clear Firebase cart
      try {
        setSyncStatus('syncing');
        await firebaseClearCart();
        // Firebase listener will update the state
      } catch (error) {
        console.error('Error clearing Firebase cart:', error);
        setSyncStatus('error');
      }
    } else {
      // Clear local state
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTotalItems = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => total;

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    getTotalItems,
    getTotalPrice,
    isLoading,
    isAuthenticated,
    syncStatus
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
