// components/cart/CartSheet.tsx

"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
// 💡 We use the updated useCart where CartItem includes selectedSize and itemId
import { useCart } from "@/context/CartContext"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
          <ShoppingCart className="text-[#5e5a57] hover:text-[#A6686A]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#A6686A] text-white text-xs rounded-full px-1.5">
              {/* NOTE: You might want to display the total quantity of items (sum of all item.quantity) 
                  instead of cartItems.length (which is the count of unique item types/sizes) */}
              {cartItems.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[500px] overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">Your cart is empty</p>
        ) : (
          <div className="mt-6 space-y-4">
            {cartItems.map((item) => (
              <div
                // 💡 Use the unique itemId as the key for reliable rendering
                key={item.itemId} 
                className="flex justify-between items-center border-b pb-3"
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
                    {item.selectedSize !== null && item.selectedSize !== undefined && (
                        <p className="text-gray-700 text-xs">
                           Size: <span className="font-semibold">{item.selectedSize}</span>
                        </p>
                    )}

                    {/* Display Price (Use sale price if available, based on CartContext logic) */}
                    <p className="text-gray-500 text-sm">
                      ${(item.sale || item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="icon"
                        variant="outline"
                        // 💡 Use item.itemId for decreaseQuantity
                        onClick={() => decreaseQuantity(item.itemId)} 
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        // 💡 Use item.itemId for increaseQuantity
                        onClick={() => increaseQuantity(item.itemId)} 
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-sm">
                    {/* Calculation uses sale price if present (assuming getTotalPrice does this) */}
                    ${((item.sale || item.price) * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    // 💡 Use item.itemId for removeFromCart
                    onClick={() => removeFromCart(item.itemId)} 
                    className="text-xs mt-1"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}> {/* Close cart on navigation */}
                <Button className="w-full mt-4 bg-[#A6686A] text-white hover:bg-[#91585A]">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}