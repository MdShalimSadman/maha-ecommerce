"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/types/product";
import { ICartItem } from "@/types/cart";

const getCartItemId = (product: Product, selectedSize: number | null): string => {
  const sizeKey = selectedSize !== null && selectedSize !== undefined ? selectedSize : 'NOSIZE';
  return `${product._id}-${sizeKey}`;
};



interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (product: Product, selectedSize: number | null) => void; 
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  increaseQuantity: (itemId: string) => void; 
  decreaseQuantity: (itemId: string) => void; 
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const addToCart = (product: Product, selectedSize: number | null) => {
    const itemId = getCartItemId(product, selectedSize);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.itemId === itemId);

      if (existing) {
        return prev.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, selectedSize, itemId }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const clearCart = () => setCartItems([]);


  const increaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };


  const decreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = item.sale || item.price;
      return total + price * item.quantity;
    }, 0);

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