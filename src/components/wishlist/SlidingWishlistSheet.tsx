"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

const SlidingWishlistSheet = () => {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <Heart className="text-[#7C4A4A] hover:text-[#A6686A]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#A6686A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="bg-[#FDF7F2] w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-[#A6686A] text-lg">
            Your Wishlist
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[80vh]">
          {wishlist.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">
              Your wishlist is empty 💔
            </p>
          ) : (
            wishlist.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-[#A6686A]/10 transition"
              >
                <Link
                  href={`/products/${product.slug.current}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={product.imageUrl || "/images/categories/hijab"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </Link>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 rounded-full hover:bg-red-100 transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="text-red-500 w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SlidingWishlistSheet;
