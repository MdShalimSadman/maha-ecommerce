"use client";

import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { orderIdAtom } from "@/atoms/orderAtom";
import emailjs from "@emailjs/browser";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import GradientButton from "@/components/common/GradientButton";

import CheckoutPersonalInfo from "./CheckoutPersonalInfo";
import CheckoutAddressInfo from "./CheckoutAddressInfo";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import { ICheckoutFormData } from "@/types/checkout";
import { toast } from "sonner";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_ADMIN_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type CustomerEmailProps = {
  orderId: string;
  email: string;
  fullName: string;
  totalPrice: number;
};

const CheckoutIndex = () => {
  const { cartItems, getTotalPrice } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setOrderId = useSetAtom(orderIdAtom);

  const { register, handleSubmit, formState: { errors } } = useForm<ICheckoutFormData>({
    defaultValues: { paymentMethod: "ssl_commerz" },
  });

  const saveOrderToFirestore = async (data: ICheckoutFormData): Promise<string | null> => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: cartItems.map(item => ({
          _id: item._id,
          itemId: item.itemId,
          title: item.title,
          price: item.sale || item.price,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
        orderDate: serverTimestamp(),
        status: "Pending",
      };
      const docRef = await addDoc(collection(db, "orders"), orderData);
      return docRef.id;
    } catch {
      toast.error("Something went wrong");
      return null;
    }
  };

  const sendCustomerConfirmationEmail = async ({ orderId, email, fullName, totalPrice }: CustomerEmailProps) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_CUSTOMER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) return;
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CUSTOMER_TEMPLATE_ID,
        { order_id: orderId, to_email: email, customer_name: fullName, total_price: totalPrice.toFixed(2) },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Customer email error:", error);
    }
  };

  const sendAdminNotification = async (data: ICheckoutFormData, orderId: string, totalPrice: number) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_ADMIN_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) return;
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        {
          order_id: orderId,
          customer_name: data.fullName,
          to_email: data.email,
          customer_phone: data.phone,
          customer_address: data.address,
          total_price: totalPrice.toFixed(2),
          payment_method: data.paymentMethod.replace(/_/g, " "),
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Admin email error:", error);
    }
  };

  // Redirect to SSLCommerz payment page
  const handlePaymentRedirect = async (orderId: string, data: ICheckoutFormData) => {
    const paymentDetails = {
      amount: getTotalPrice(),
      customer_name: data.fullName,
      customer_email: data.email,
      order_id: orderId,
      // set your redirect URLs here
      success_url: `${window.location.origin}/thank-you`,
      fail_url: `${window.location.origin}/checkout`, 
    };

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Server error" }));
        toast.error("Payment initiation failed: " + (errorData.message || response.statusText));
        return;
      }

      const result = await response.json();

      if (result.status === "success" && result.GatewayPageURL) {
        // 🔹 Redirect in the same tab
        window.location.href = result.GatewayPageURL;
      } else {
        toast.error("Payment initiation failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred during payment.");
    }
  };

  const onSubmit = async (data: ICheckoutFormData) => {
    const orderId = await saveOrderToFirestore(data);
    const totalPrice = getTotalPrice();

    if (!orderId) {
      setIsSubmitting(false);
      return;
    }

    setOrderId(orderId);

    await Promise.allSettled([
      sendCustomerConfirmationEmail({ orderId, email: data.email, fullName: data.fullName, totalPrice }),
      sendAdminNotification(data, orderId, totalPrice),
    ]);

    // Always redirect to SSLCommerz
    await handlePaymentRedirect(orderId, data);
    setIsSubmitting(false);
  };

  if (cartItems.length === 0) {
    return (
      <p className="text-center mt-10 text-lg">
        Your cart is empty <br /> Please add items before checking out.
      </p>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "50px auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>🛒 Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <CheckoutPersonalInfo register={register} errors={errors} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <CheckoutAddressInfo register={register} errors={errors} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <CheckoutPaymentMethods register={register} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <CheckoutOrderSummary cartItems={cartItems} getTotalPrice={getTotalPrice} />
        </div>
        <GradientButton
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </GradientButton>
      </form>
    </div>
  );
};

export default CheckoutIndex;
