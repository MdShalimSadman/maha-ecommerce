"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import GradientButton from "@/components/common/GradientButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const { clearCart } = useCart();
  
  const [copiedField, setCopiedField] = useState<string | null>(null);


  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 2000);
  };

useEffect(() => {
  clearCart();
}, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#A6686A]">
            Payment Successful! 
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-sm text-gray-700">
            Your payment has been processed successfully.
          </p>

          {orderId || transactionId ? (
            <div className="space-y-4">
              {orderId && (
                <div>
                  <p className="font-semibold text-sm mb-1">Order ID:</p>
                  <div className="p-2 bg-[#A6686A]/10 border border-[#A6686A] rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs md:text-sm lg:text-base font-mono truncate text-gray-600 break-all">
                        {orderId}
                      </p>
                      <button
                        onClick={() => handleCopy(orderId, "orderId")}
                        className="p-1 text-[#A6686A] hover:text-[#8a5557] transition cursor-pointer"
                        aria-label="Copy Order ID"
                      >
                        {copiedField === "orderId" ? (
                          <Check size={20} className="text-green-600" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {transactionId && (
                <div>
                  <p className="font-semibold text-sm mb-1">Transaction ID:</p>
                  <div className="p-2 bg-[#A6686A]/10 border border-[#A6686A] rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs md:text-sm lg:text-base font-mono text-gray-600 break-all">
                        {transactionId}
                      </p>
                      <button
                        onClick={() => handleCopy(transactionId, "transactionId")}
                        className="p-1 text-[#A6686A] hover:text-[#8a5557] transition cursor-pointer"
                        aria-label="Copy Transaction ID"
                      >
                        {copiedField === "transactionId" ? (
                          <Check size={20} className="text-green-600" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {amount && (
                <p className="text-sm text-gray-700">
                  <strong>Amount:</strong> {amount} BDT
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">
              Could not retrieve payment details. Please check your email.
            </p>
          )}

          <Link href="/" className="block mt-6">
            <GradientButton className="w-full cursor-pointer">
              Continue Shopping
            </GradientButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
