// components/cart/CartSheet.tsx

"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
// 💡 We use the updated useCart where CartItem includes selectedSize and itemId
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "../common/GradientButton";

export default function CartSheet() {
  const {
    cartItems,
    removeFromCart,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart className="text-[#7C4A4A] hover:text-[#A6686A]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#A6686A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-[#A6686A] text-lg">Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">Your cart is empty</p>
        ) : (
          <div className="flex flex-col gap-4 p-4 h-full">
            <div className="flex-1 h-full overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between border-b mb-2 pb-3"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>

                      {/* 🟢 NEW: Display the Selected Size */}
                      {item.selectedSize !== null &&
                        item.selectedSize !== undefined && (
                          <p className="text-gray-700 text-xs">
                            Size:{" "}
                            <span className="font-semibold">
                              {item.selectedSize}
                            </span>
                          </p>
                        )}

                      {/* Display Price (Use sale price if available, based on CartContext logic) */}
                      <p className="text-gray-500 text-sm">
                        BDT {(item.sale || item.price).toFixed(2)}
                      </p>

                      <div className="mt-1 flex items-center gap-2 rounded-full border border-[#A6686A]">
                        <Button
                          size="icon"
                          variant="outline"
                          // 💡 Use item.itemId for decreaseQuantity
                          className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
                          onClick={() => decreaseQuantity(item.itemId)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
                          onClick={() => increaseQuantity(item.itemId)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between !h-full">
                    {/* <div className="flex-1 !h-full">
                      <p className="font-semibold text-sm">
                        BDT{" "}
                        {((item.sale || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div> */}
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="p-2 cursor-pointer rounded-full hover:bg-red-100 transition"
                    >
                      <Trash2 className="text-[#7C4A4A] w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg text-gray-700">
                <span>Total:</span>
                <span>BDT {getTotalPrice().toFixed(2)}</span>
              </div>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                {" "}
                {/* Close cart on navigation */}
                <GradientButton className="w-full mt-4 cursor-pointer">
                  Checkout
                </GradientButton>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
