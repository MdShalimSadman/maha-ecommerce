// components/cart/AddToCartButton.tsx

"use client";

import { useCart, CartItem } from "@/context/CartContext"; // Assuming CartItem is now exported
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/types";
import GradientButton from "../common/GradientButton";

// Interface for the component props
interface AddToCartButtonProps {
  product: Product;
  selectedSize: number | null; // The size selected by the user on the product page
  disabled?: boolean; // Passed from ProductInteraction to disable if no size is picked
}

// Utility function to create the unique ID (must match the one in CartContext)
const getCartItemId = (
  product: Product,
  selectedSize: number | null
): string => {
  const sizeKey =
    selectedSize !== null && selectedSize !== undefined
      ? selectedSize
      : "NOSIZE";
  return `${product._id}-${sizeKey}`;
};

export default function AddToCartButton({
  product,
  selectedSize,
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems } =
    useCart();

  const itemId = getCartItemId(product, selectedSize);

  const cartItem = cartItems.find((item) => item.itemId === itemId);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="flex flex-row gap-4">
      {quantity > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-[#A6686A]">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
            onClick={() => decreaseQuantity(itemId)}
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
            onClick={() => increaseQuantity(itemId)}
          >
            +
          </Button>
        </div>
      )}
      <GradientButton
      className="cursor-pointer"
        onClick={() => addToCart(product, selectedSize)}
        disabled={disabled}
      >
        Add to Cart
      </GradientButton>
    </div>
  );
}
