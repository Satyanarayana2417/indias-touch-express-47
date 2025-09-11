import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string; // Changed to string to match product IDs
  name: string;
  price: string;
  quantity: number;
  image?: string;
  variant?: string; // Add variant information
  originalPrice?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (id: string, name: string, price: string, image?: string, variant?: string, originalPrice?: string) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper functions for localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('venkatExpressCart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('venkatExpressCart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = (id: string, name: string, price: string, image?: string, variant?: string, originalPrice?: string) => {
    setItems(prevItems => {
      // Create unique identifier that includes variant
      const itemKey = variant ? `${id}-${variant}` : id;
      const existingItem = prevItems.find(item => {
        const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
        return existingKey === itemKey;
      });
      
      if (existingItem) {
        return prevItems.map(item => {
          const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
          return existingKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item;
        });
      }
      return [...prevItems, { id, name, price, quantity: 1, image, variant, originalPrice }];
    });
  };

  const removeItem = (id: string, variant?: string) => {
    setItems(prevItems => {
      const itemKey = variant ? `${id}-${variant}` : id;
      return prevItems.filter(item => {
        const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
        return existingKey !== itemKey;
      });
    });
  };

  const updateQuantity = (id: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(id, variant);
      return;
    }
    setItems(prevItems => {
      const itemKey = variant ? `${id}-${variant}` : id;
      return prevItems.map(item => {
        const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
        return existingKey === itemKey ? { ...item, quantity } : item;
      });
    });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Handle both $ and ₹ symbols, remove commas and parse
      const cleanPrice = item.price.replace(/[$₹,]/g, '');
      const price = parseFloat(cleanPrice);
      const validPrice = isNaN(price) ? 0 : price;
      return total + (validPrice * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
