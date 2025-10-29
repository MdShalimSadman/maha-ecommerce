// components/cart/AddToCartButton.tsx

"use client"

import { useCart, CartItem } from "@/context/CartContext" // Assuming CartItem is now exported
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/types"

// Interface for the component props
interface AddToCartButtonProps {
  product: Product;
  selectedSize: number | null; // The size selected by the user on the product page
  disabled?: boolean;          // Passed from ProductInteraction to disable if no size is picked
}

// Utility function to create the unique ID (must match the one in CartContext)
const getCartItemId = (product: Product, selectedSize: number | null): string => {
  const sizeKey = selectedSize !== null && selectedSize !== undefined ? selectedSize : 'NOSIZE';
  return `${product._id}-${sizeKey}`;
};


export default function AddToCartButton({ 
  product, 
  selectedSize, 
  disabled = false 
}: AddToCartButtonProps) {
  
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems } = useCart()

  // 1. Calculate the unique ID for this specific product/size instance
  const itemId = getCartItemId(product, selectedSize);

  // 2. Find the specific item in the cart using the unique itemId
  // This ensures we only track the quantity for the item with the correct size.
  const cartItem = cartItems.find((item) => item.itemId === itemId);
  const quantity = cartItem?.quantity || 0;

  return (
    <div>
      <Button 
        className="mt-6 bg-[#A6686A] text-white hover:bg-[#91585A]" 
        // 3. Call addToCart with the product AND the selected size
        onClick={() => addToCart(product, selectedSize)}
        disabled={disabled}
      >
        Add to Cart
      </Button>
      
      {/* Quantity adjustment controls */}
      {quantity > 0 && (
        <div className="flex items-center gap-2 mt-1">
          <Button 
            size="icon" 
            variant="outline" 
            // 4. Pass the unique itemId to decrease the quantity
            onClick={() => decreaseQuantity(itemId)} 
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button 
            size="icon" 
            variant="outline" 
            // 5. Pass the unique itemId to increase the quantity
            onClick={() => increaseQuantity(itemId)}
          >
            +
          </Button>
        </div>
      )}
    </div>
  )
}