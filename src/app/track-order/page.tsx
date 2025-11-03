"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/common/GradientButton";
import ProgressBar from "@/components/track-order/ProgressBar";

interface OrderItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

interface FirestoreOrder {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  orderDate: Timestamp;
}

interface OrderDetailDialogProps {
  order: FirestoreOrder | null;
}

const OrderDetailDialog = ({ order }: OrderDetailDialogProps) => {
  if (!order) return null;

  const statusColors: Record<FirestoreOrder["status"], string> = {
    Pending: "#FBBF24",
    Processing: "#60A5FA",
    Shipped: "#34D399",
    Delivered: "#10B981",
    Cancelled: "#EF4444",
  };

  const statusColor = statusColors[order.status] || "#6B7280";

  return (
    <Card className="px-6 mt-4 shadow-lg">
      <CardTitle className="text-2xl font-bold text-[#A6686A] mb-2">
        Order Detail
      </CardTitle>

      <div className="text-gray-700 text-sm space-y-1">
        <p className="text-base font-semibold">{order.fullName}</p>
        <p>Total: BDT {order.totalPrice.toFixed(2)}</p>
        <p>Order ID: {order.id}</p>

        <div className="flex items-center gap-2 mt-1">
          <p className="font-medium">Status:</p>
          <span className="font-semibold" style={{ color: statusColor }}>
            {order.status}
          </span>
        </div>
      </div>
    </Card>
  );
};

interface FormValues {
  orderId: string;
  email: string;
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");
  const urlEmail = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      orderId: urlOrderId || "",
      email: urlEmail || "",
    },
  });

  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const orderDetailRef = useRef<HTMLDivElement | null>(null);

  const fetchOrder = async (id: string, customerEmail: string) => {
    const trimmedEmail = customerEmail.trim().toLowerCase();
    if (!id || !trimmedEmail) return;

    setFetchError(null);
    setOrder(null);

    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedOrderData = docSnap.data();
        if (fetchedOrderData.email.toLowerCase() === trimmedEmail) {
          const fetchedOrder = {
            id: docSnap.id,
            ...fetchedOrderData,
          } as FirestoreOrder;
          setOrder(fetchedOrder);
        } else {
          setFetchError(`No order found matching the provided ID and Email.`);
        }
      } else {
        setFetchError(`No order found matching the provided ID and Email.`);
      }
    } catch (e) {
      console.error("Error fetching order:", e);
      setFetchError(
        "An error occurred while fetching the order. Please try again."
      );
    }
  };

  // Scroll to order detail when loaded
  useEffect(() => {
    if (order && orderDetailRef.current) {
      orderDetailRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [order]);

  useEffect(() => {
    if (urlOrderId && urlEmail) {
      fetchOrder(urlOrderId, urlEmail);
    }
  }, [urlOrderId, urlEmail]);

  const onSubmit = async (data: FormValues) => {
    await fetchOrder(data.orderId.trim(), data.email.trim());
  };

  // Progress bar config
  const sections = [
    { id: "1", title: "Pending", iconColor: "#FBBF24" },
    { id: "2", title: "Processing", iconColor: "#60A5FA" },
    { id: "3", title: "Shipped", iconColor: "#34D399" },
    { id: "4", title: "Delivered", iconColor: "#10B981" },
  ];

  const getProgressInfo = (status: FirestoreOrder["status"]) => {
    switch (status) {
      case "Pending":
        return { index: 0, percent: 25 };
      case "Processing":
        return { index: 1, percent: 50 };
      case "Shipped":
        return { index: 2, percent: 75 };
      case "Delivered":
        return { index: 3, percent: 100 };
      case "Cancelled":
        return { index: -1, percent: 100 };
      default:
        return { index: 0, percent: 0 };
    }
  };

  const progress =
    order && order.status
      ? getProgressInfo(order.status)
      : { index: 0, percent: 0 };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#A6686A]">
              Track Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-700">
              Please enter your unique Order ID and the Email Address used for
              the order.
            </p>

            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter Order ID (e.g., V4XkL8qZ)"
                  className="pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                  {...register("orderId", { required: "Order ID is required" })}
                  aria-label="Order ID Input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(onSubmit)();
                  }}
                />
                {errors.orderId && (
                  <p className="text-red-500 text-sm">
                    {errors.orderId.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Enter Email Address"
                   className="pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  aria-label="Email Address Input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(onSubmit)();
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <GradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 cursor-pointer"
              >
                {isSubmitting ? "Tracking..." : "Track Order"}
              </GradientButton>
            </div>

            {fetchError && (
              <div className="p-2 mt-4 rounded-md bg-red-200">
                <p className="text-sm text-red-500 font-normal">{fetchError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      <div ref={orderDetailRef}>
        <OrderDetailDialog order={order} />
      </div>

      {order && order.status !== "Cancelled" && (
        <ProgressBar
          sections={sections}
          visibleSections={progress.index + 1}
          currentIndex={progress.index}
          progressPercentage={progress.percent}
        />
      )}

      {order && order.status === "Cancelled" && (
        <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-lg text-center font-semibold">
          This order has been cancelled.
        </div>
      )}
    </div>
  );
}
