"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/types";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product._id);

  return (
    <Link href={`/products/${product.slug.current}`}>
      <div
        className="p-1 mb-2 transition-all duration-300 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Heart
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-4 left-4 z-40 cursor-pointer transition-colors ${
            wishlisted
              ? "fill-[#A6686A] text-[#A6686A]"
              : "text-gray-400 hover:text-[#A6686A]"
          }`}
        />

        <div className="relative w-full h-[500px] overflow-hidden cursor-pointer">
          <Image
            src={product.imageUrl || "/images/categories/hijab"}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-300 ${
              hovered ? "brightness-75 scale-105" : "brightness-100"
            }`}
          />

          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              variant="secondary"
              className="rounded-full bg-[#C08387] text-white hover:bg-[#A6686A] transition-colors shadow-md cursor-pointer w-28"
            >
              <ShoppingCart className="w-16 h-16" />
            </Button>
          </motion.div>
        </div>

        <h2 className="text-lg font-semibold mt-3">{product.title}</h2>
        <p className="text-gray-600">${product.price}</p>
        <p className="text-sm text-gray-400">{product.category?.name}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
