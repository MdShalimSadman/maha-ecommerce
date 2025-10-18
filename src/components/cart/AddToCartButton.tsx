"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button
      className="mt-6 bg-[#A6686A] text-white hover:bg-[#91585A]"
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
