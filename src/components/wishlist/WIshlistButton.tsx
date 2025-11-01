"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/types";

interface WishlistButtonProps {
  product: Product;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <button
      onClick={() => toggleWishlist(product)}
      title="Add to Wishlist"
      className={`border-none p-0 cursor-pointer transition-all duration-300 `}
    >
      <Heart
        className={`w-8 h-8 transition-all text-[#A6686A] ${
          wishlisted ? "fill-[#A6686A]" : "fill-none"
        }`}
      />
    </button>
  );
}