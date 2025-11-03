"use client";

import { useAtom } from "jotai";
import { orderIdAtom } from "@/atoms/orderAtom";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import GradientButton from "@/components/common/GradientButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThankYouPage() {
  const [orderId] = useAtom(orderIdAtom);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give atom time to hydrate
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    if (orderId) {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-[#A6686A] animate-spin mb-4" />
          <p className="text-lg text-[#5e5a57]">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#A6686A]">
            Thank You!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-700">
            Your order has been successfully placed.
          </p>

          {orderId ? (
            <div>
              <p className="font-semibold text-sm mb-1">Your Order ID:</p>
              <div className=" p-2 bg-[#A6686A]/10 border border-[#A6686A] rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm lg:text-base xl:text-lg truncate font-mono text-gray-600 break-all">
                    {orderId}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-[#A6686A] hover:text-[#8a5557] transition cursor-pointer"
                    aria-label="Copy order ID"
                  >
                    {copied ? (
                      <Check size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-5 mt-3">
                A confirmation email will be sent to you shortly.
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-500 mb-4">
              We couldn&apos;t retrieve your order ID. Please check your email
              for the confirmation details.
            </p>
          )}

          <Link href="/">
            <GradientButton className="w-full cursor-pointer">
              Continue Shopping
            </GradientButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
