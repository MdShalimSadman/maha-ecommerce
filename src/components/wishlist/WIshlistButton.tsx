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
      className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
        wishlisted
          ? "bg-[#A6686A] text-white border-[#A6686A] hover:bg-[#8B5456]"
          : "bg-white text-gray-700 border-gray-300 hover:border-[#A6686A] hover:text-[#A6686A]"
      }`}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          wishlisted ? "fill-white" : "fill-none"
        }`}
      />
      <span className="font-medium">
        {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </span>
    </button>
  );
}