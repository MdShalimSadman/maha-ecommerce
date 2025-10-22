"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/types";

interface Props {
  product: Product;
}

const AddToWishlistButton = ({ product }: Props) => {
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product._id);

  return (
    <button
      onClick={() => toggleWishlist(product)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        wishlisted
          ? "bg-[#A6686A] text-white"
          : "bg-gray-200 text-gray-700 hover:bg-[#C08387]"
      }`}
    >
      <Heart className={`${wishlisted ? "fill-white" : ""} w-5 h-5`} />
      {wishlisted ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
};

export default AddToWishlistButton;
