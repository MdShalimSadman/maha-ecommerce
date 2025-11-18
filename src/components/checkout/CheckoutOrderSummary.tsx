"use client";

import { FC } from "react";
import Image from "next/image";
import { ICartItem } from "@/types/cart";

type CheckoutOrderSummaryProps = {
  cartItems: ICartItem[];
  getTotalPrice: () => number;
};

const CheckoutOrderSummary: FC<CheckoutOrderSummaryProps> = ({
  cartItems,
  getTotalPrice,
}) => {
  return (
    <div className="flex-1 bg-[#EFD8D6]/60 rounded-lg p-6">

      {cartItems.map((item) => (
        <div key={item.itemId} className="flex justify-between text-sm mb-2">

          <div className="flex-1 flex gap-4 text-gray-700">
            <div className="relative">
              <p className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-[#A6686A] text-white flex items-center justify-center rounded-full">
                {item.quantity}
              </p>

              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  width={50}
                  height={40}
                  className="rounded-md"
                  alt={item.title}
                />
              )}
            </div>

            <div>
              <p>{item.title}</p>
              {item.selectedSize && (
                <p className="text-gray-500">Size: {item.selectedSize}</p>
              )}
            </div>
          </div>

          <span>
            BDT {((item.sale ?? item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}

      <div className="flex justify-between font-normal mt-9 text-base text-gray-900">
        <span>Sub Total:</span>
        <span>BDT {getTotalPrice().toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-semibold mt-1 text-lg text-gray-900">
        <span>Total:</span>
        <span>BDT {getTotalPrice().toFixed(2)}</span>
      </div>

    </div>
  );
};

export default CheckoutOrderSummary;
