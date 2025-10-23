"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/types"

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems } = useCart()

  const cartItem = cartItems.find((item) => item._id === product._id)
  const quantity = cartItem?.quantity || 0

  return (
    <div>
      <Button className="mt-6 bg-[#A6686A] text-white hover:bg-[#91585A]" onClick={() => addToCart(product)}>
        Add to Cart
      </Button>
      {quantity > 0 && (
        <div className="flex items-center gap-2 mt-1">
          <Button size="icon" variant="outline" onClick={() => decreaseQuantity(product._id)}>
            -
          </Button>
          <span>{quantity}</span>
          <Button size="icon" variant="outline" onClick={() => increaseQuantity(product._id)}>
            +
          </Button>
        </div>
      )}
    </div>
  )
}
