import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  onSnapshot, 
  Timestamp,
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from 'firebase/auth';

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  originalPrice?: number;
  displayPrice?: string;
  addedAt: Timestamp;
}

// Cart document structure in Firestore
export interface UserCart {
  userId: string;
  items: CartItem[];
  lastUpdated: Timestamp;
  totalItems: number;
  totalPrice: number;
}

/**
 * Get the current authenticated user
 * Throws error if user is not authenticated
 */
const getCurrentUser = (): User => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to access cart');
  }
  return user;
};

/**
 * Initialize an empty cart for a new user
 */
export const initializeUserCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const emptyCart: UserCart = {
      userId,
      items: [],
      lastUpdated: Timestamp.now(),
      totalItems: 0,
      totalPrice: 0
    };
    
    await setDoc(cartRef, emptyCart);
    console.log('Cart initialized for user:', userId);
  } catch (error) {
    console.error('Error initializing cart:', error);
    throw error;
  }
};

/**
 * Get user's cart from Firestore
 * Creates cart if it doesn't exist
 */
export const getUserCart = async (): Promise<UserCart> => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      // Create empty cart if it doesn't exist
      await initializeUserCart(user.uid);
      return {
        userId: user.uid,
        items: [],
        lastUpdated: Timestamp.now(),
        totalItems: 0,
        totalPrice: 0
      };
    }
    
    return cartSnap.data() as UserCart;
  } catch (error) {
    console.error('Error getting user cart:', error);
    throw error;
  }
};

/**
 * Add item to user's cart
 */
export const addToCart = async (item: Omit<CartItem, 'addedAt' | 'id'>): Promise<void> => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    const cart = await getUserCart();
    
    // Generate unique ID for cart item (combination of productId and variant)
    const itemId = item.variant ? `${item.productId}_${item.variant}` : item.productId;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.productId === item.productId && cartItem.variant === item.variant
    );
    
    const newItem: CartItem = {
      ...item,
      id: itemId,
      addedAt: Timestamp.now()
    };
    
    let updatedItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedItems = cart.items.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      // Add new item
      updatedItems = [...cart.items, newItem];
    }
    
    // Calculate totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart in Firestore
    await updateDoc(cartRef, {
      items: updatedItems,
      lastUpdated: Timestamp.now(),
      totalItems,
      totalPrice
    });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update item quantity in cart
 */
export const updateCartItemQuantity = async (
  productId: string, 
  quantity: number, 
  variant?: string
): Promise<void> => {
  try {
    if (quantity < 1) {
      await removeFromCart(productId, variant);
      return;
    }
    
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    const cart = await getUserCart();
    
    const updatedItems = cart.items.map(item => 
      item.productId === productId && item.variant === variant
        ? { ...item, quantity }
        : item
    );
    
    // Calculate totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await updateDoc(cartRef, {
      items: updatedItems,
      lastUpdated: Timestamp.now(),
      totalItems,
      totalPrice
    });
    
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId: string, variant?: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    const cart = await getUserCart();
    
    const updatedItems = cart.items.filter(
      item => !(item.productId === productId && item.variant === variant)
    );
    
    // Calculate totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await updateDoc(cartRef, {
      items: updatedItems,
      lastUpdated: Timestamp.now(),
      totalItems,
      totalPrice
    });
    
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    
    await updateDoc(cartRef, {
      items: [],
      lastUpdated: Timestamp.now(),
      totalItems: 0,
      totalPrice: 0
    });
    
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Set up real-time listener for cart updates
 */
export const subscribeToCart = (
  callback: (cart: UserCart) => void,
  onError?: (error: Error) => void
): (() => void) => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    
    const unsubscribe = onSnapshot(
      cartRef,
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as UserCart);
        } else {
          // Cart doesn't exist, initialize it
          initializeUserCart(user.uid).then(() => {
            callback({
              userId: user.uid,
              items: [],
              lastUpdated: Timestamp.now(),
              totalItems: 0,
              totalPrice: 0
            });
          });
        }
      },
      (error) => {
        console.error('Cart listener error:', error);
        if (onError) onError(error);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up cart listener:', error);
    throw error;
  }
};

/**
 * Transfer cart items from anonymous session to authenticated user
 * Used when user logs in and has items in local storage
 */
export const mergeLocalCartWithUserCart = async (localItems: CartItem[]): Promise<void> => {
  try {
    if (!localItems.length) return;
    
    const user = getCurrentUser();
    const cart = await getUserCart();
    
    // Merge local items with existing cart items
    const mergedItems = [...cart.items];
    
    for (const localItem of localItems) {
      const existingIndex = mergedItems.findIndex(
        item => item.productId === localItem.productId && item.variant === localItem.variant
      );
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        mergedItems[existingIndex].quantity += localItem.quantity;
      } else {
        // Add new item with fresh timestamp
        mergedItems.push({
          ...localItem,
          addedAt: Timestamp.now()
        });
      }
    }
    
    // Calculate totals
    const totalItems = mergedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart in Firestore
    const cartRef = doc(db, 'carts', user.uid);
    await updateDoc(cartRef, {
      items: mergedItems,
      lastUpdated: Timestamp.now(),
      totalItems,
      totalPrice
    });
    
  } catch (error) {
    console.error('Error merging local cart with user cart:', error);
    throw error;
  }
};

/**
 * Clear cart after successful checkout
 */
export const clearCartAfterCheckout = async (orderId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    const cartRef = doc(db, 'carts', user.uid);
    
    // Clear cart and add reference to order
    await updateDoc(cartRef, {
      items: [],
      lastUpdated: Timestamp.now(),
      totalItems: 0,
      totalPrice: 0,
      lastOrderId: orderId
    });
    
    console.log('Cart cleared after successful checkout, order:', orderId);
  } catch (error) {
    console.error('Error clearing cart after checkout:', error);
    throw error;
  }
};

/**
 * Get cart item count for display purposes
 */
export const getCartItemCount = async (): Promise<number> => {
  try {
    const cart = await getUserCart();
    return cart.totalItems;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
};

