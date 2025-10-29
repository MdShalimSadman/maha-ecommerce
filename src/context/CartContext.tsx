// /context/CartContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/types/types";

// -----------------------------------------------------------
// 1. UPDATED INTERFACES
// -----------------------------------------------------------

// A utility function to generate a unique ID for a cart item
// based on product ID and selected size.
const getCartItemId = (product: Product, selectedSize: number | null): string => {
  // Use a fallback like "NOSIZE" if size is null or undefined
  const sizeKey = selectedSize !== null && selectedSize !== undefined ? selectedSize : 'NOSIZE';
  return `${product._id}-${sizeKey}`;
};

// CartItem now includes the selectedSize and a unique composite ID (itemId)
export interface CartItem extends Product {
  quantity: number;
  selectedSize: number | null; // The selected size
  itemId: string;              // The unique identifier for this item instance (ID + Size)
}

interface CartContextType {
  cartItems: CartItem[];
  // 💡 Updated to accept the product and the required size
  addToCart: (product: Product, selectedSize: number | null) => void; 
  // 💡 Updated to accept the unique itemId
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  // 💡 Updated to accept the unique itemId
  increaseQuantity: (itemId: string) => void; 
  // 💡 Updated to accept the unique itemId
  decreaseQuantity: (itemId: string) => void; 
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// -----------------------------------------------------------
// 2. UPDATED CartProvider LOGIC
// -----------------------------------------------------------

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Persistence Logic (Remains the same) ---
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);
  // ---------------------------------------------

  /**
   * 💡 AddToCart: Now uses the unique itemId (product ID + size)
   */
  const addToCart = (product: Product, selectedSize: number | null) => {
    // Generate the unique ID for this specific product/size combination
    const itemId = getCartItemId(product, selectedSize);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.itemId === itemId);

      if (existing) {
        // If item exists (same ID AND same size), just increase quantity
        return prev.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // If item is new (or is the same product but different size), add it
      return [...prev, { ...product, quantity: 1, selectedSize, itemId }];
    });

    setIsCartOpen(true);
  };

  /**
   * 💡 RemoveFromCart: Uses the unique itemId
   */
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const clearCart = () => setCartItems([]);

  /**
   * 💡 IncreaseQuantity: Uses the unique itemId
   */
  const increaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  /**
   * 💡 DecreaseQuantity: Uses the unique itemId
   */
  const decreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } // Allow quantity to drop to 0
            : item
        )
        // Filter out items where quantity is 0 (fully removed)
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      // Use sale price if available, otherwise use regular price
      const price = item.sale || item.price;
      return total + price * item.quantity;
    }, 0);

  // --- Context Provider (Remains the same) ---
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        increaseQuantity,
        decreaseQuantity,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};