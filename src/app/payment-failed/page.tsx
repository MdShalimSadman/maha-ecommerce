"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GradientButton from "@/components/common/GradientButton";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const error = searchParams.get("error");

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!transactionId) return;
    await navigator.clipboard.writeText(transactionId);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed 
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-sm text-gray-700">
            Unfortunately, your payment could not be processed.
          </p>

          {transactionId ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-1">Transaction ID:</p>
                <div className="p-2 bg-red-50 border border-red-500 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs md:text-sm lg:text-base font-mono text-gray-700 truncate break-all">
                      {transactionId}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="p-1 text-red-500 hover:text-red-600 transition cursor-pointer"
                      aria-label="Copy Transaction ID"
                    >
                      {copied ? (
                        <Check size={20} className="text-green-600" />
                      ) : (
                        <Copy size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-gray-700">
                  <strong>Error:</strong> {error}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">
              Could not retrieve transaction information.
            </p>
          )}

          <Link href="/checkout" className="block mt-6">
            <GradientButton className="w-full cursor-pointer">
              Try Again
            </GradientButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
