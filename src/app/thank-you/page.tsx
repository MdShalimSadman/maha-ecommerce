// app/thank-you/page.tsx
"use client";

import { useAtom } from "jotai";
import { orderIdAtom } from "@/atoms/orderAtom"; // <--- Adjust path as needed
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  // Get the order ID from the Jotai atom
  const [orderId] = useAtom(orderIdAtom);
  
  // NOTE: If the user refreshes this page, the orderId will be lost (Jotai is in-memory state).
  // A robust application would re-fetch order details based on the URL or redirect if no ID is found.

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-[#FDF7F2] rounded-xl shadow-lg text-center">
      <h1 className="text-4xl font-bold text-[#A6686A] mb-4">
        Thank You! 🎉
      </h1>
      <p className="text-xl text-[#5e5a57] mb-6">
        Your order has been successfully placed.
      </p>

      {orderId ? (
        <div className="mb-8 p-4 bg-white border border-[#A6686A] rounded-lg">
          <p className="font-semibold text-lg text-[#5e5a57] mb-1">
            Your Order ID:
          </p>
          <p className="text-2xl font-mono text-gray-800 break-all">
            {orderId}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            A confirmation email will be sent to you shortly.
          </p>
        </div>
      ) : (
        // Fallback for cases where the user refreshes the page or navigates directly
        <p className="text-lg text-red-500 mb-8">
          We couldn&apos;t retrieve your order ID. Please check your email for the confirmation details.
        </p>
      )}

      <Link href="/">
        <Button className="w-full bg-[#A6686A] text-white hover:bg-[#91585A] text-lg py-6">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}