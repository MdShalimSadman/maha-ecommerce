// components/checkout/CheckoutPage.tsx (or app/checkout/page.tsx)

"use client";

import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Jotai Imports
import { useSetAtom } from "jotai";
import { orderIdAtom } from "@/atoms/orderAtom";
// Mail.js Import
import emailjs from "@emailjs/browser";

// Firebase Imports
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

// Environment variables for Mail.js (must be NEXT_PUBLIC_ for client-side use)
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_ADMIN_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function CheckoutPage() {
  // cartItems now includes: _id, title, price, quantity, selectedSize, itemId
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the setter for the order ID atom
  const setOrderId = useSetAtom(orderIdAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "cash_on_delivery",
    },
  });

  // Function to save the order data to Firestore and return the ID
  const saveOrderToFirestore = async (
    data: CheckoutFormData
  ): Promise<string | null> => {
    setIsSubmitting(true);

    try {
      const orderData = {
        ...data,
        // 🟢 UPDATED: Include selectedSize and itemId in the saved item data
        items: cartItems.map((item) => ({
          _id: item._id,
          itemId: item.itemId, // Unique ID for tracking
          title: item.title,
          price: item.sale || item.price, // Save final price
          selectedSize: item.selectedSize, // Save the selected size
          quantity: item.quantity,
        })),

        totalPrice: getTotalPrice(),
        orderDate: serverTimestamp(),
        status: "Pending",
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = docRef.id;

      console.log("Order submitted with ID: ", orderId);
      return orderId;
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("An error occurred while placing your order. Please try again.");
      return null;
    }
  };

  // Function to send confirmation email to the Customer (logic remains the same as requested)
  const sendCustomerConfirmationEmail = async ({
    orderId,
    email,
    fullName,
    totalPrice,
  }) => {
    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_CUSTOMER_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      console.error(
        "Mail.js Customer variables are not fully set. Skipping customer email."
      );
      return;
    }

    const templateParams = {
      order_id: orderId,
      to_email: email,
      customer_name: fullName,
      total_price: totalPrice.toFixed(2),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CUSTOMER_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log("Order email sent to Customer successfully.");
    } catch (error) {
      console.error("Error sending email to customer with Mail.js:", error);
    }
  };

  // Function to send notification email to the Admin (logic remains the same as requested)
  const sendAdminNotification = async (
    data: CheckoutFormData,
    orderId: string,
    totalPrice: number
  ) => {
    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_ADMIN_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      console.error(
        "Mail.js Admin variables are not fully set. Skipping admin email."
      );
      return;
    }

    // You could manually format the cart items into a string here if you wanted to send it to the admin email,
    // but per request, we keep the template params as they were.
    const templateParams = {
      order_id: orderId,
      customer_name: data.fullName,
      to_email: data.email,
      customer_phone: data.phone,
      customer_address: data.address,
      total_price: totalPrice.toFixed(2),
      payment_method: data.paymentMethod.replace(/_/g, " "),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log("Order notification sent to Admin successfully.");
    } catch (error) {
      console.error("Error sending admin email with Mail.js:", error);
    }
  };

  // Main submission handler
  const onSubmit = async (data: CheckoutFormData) => {
    // 1. Save order to Firestore and set loading
    const orderId = await saveOrderToFirestore(data);
    const totalPrice = getTotalPrice();

    if (orderId) {
      // 2. Set the order ID in the Jotai atom
      setOrderId(orderId);

      // 3. Prepare email promises
      const customerEmailPromise = sendCustomerConfirmationEmail({
        orderId,
        email: data.email,
        fullName: data.fullName,
        totalPrice: totalPrice,
      });

      const adminEmailPromise = sendAdminNotification(
        data,
        orderId,
        totalPrice
      );

      // 4. Wait for both emails to attempt sending
      await Promise.allSettled([customerEmailPromise, adminEmailPromise]);

      // 5. Clean up and redirect
      clearCart();
      router.push("/thank-you");
    }

    // Always stop loading after attempting submission and redirection
    setIsSubmitting(false);
  };

  if (cartItems.length === 0)
    return (
      <p className="text-center mt-10 text-lg">
        Your cart is empty 🛒 <br /> Please add items before checking out.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#FDF7F2] rounded-xl shadow-sm">
      <h1 className="text-3xl font-semibold text-[#A6686A] mb-6 text-center">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* === Personal Info === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Full Name
            </Label>
            <Input
              {...register("fullName", { required: true })}
              placeholder="Enter your full name"
              className="mt-1"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">Full name is required</p>
            )}
          </div>

          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Email
            </Label>
            <Input
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              placeholder="Enter your email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Valid email required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Phone
            </Label>
            <Input
              {...register("phone", { required: true })}
              placeholder="Enter your phone number"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">Phone is required</p>
            )}
          </div>

          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Address
            </Label>
            <Input
              {...register("address", { required: true })}
              placeholder="Enter your delivery address"
              className="mt-1"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                Delivery address required
              </p>
            )}
          </div>
        </div>

        {/* === Payment Methods === */}
        <div>
          <Label className="block text-base font-medium text-[#5e5a57] mb-2">
            Payment Method
          </Label>
          <RadioGroup defaultValue="cash_on_delivery">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bkash" id="bkash" disabled />
                <Label htmlFor="bkash" className="text-gray-500">
                  bKash (Coming soon)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="stripe" id="stripe" disabled />
                <Label htmlFor="stripe" className="text-gray-500">
                  Visa / Mastercard (Coming soon)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="cash_on_delivery"
                  id="cash_on_delivery"
                  {...register("paymentMethod")}
                />
                <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* === Order Summary === */}
        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.itemId} className="flex justify-between text-sm mb-2"> 
              {/* 💡 Use item.itemId as key for unique cart items (product + size) */}
              
              <span className="flex-1">
                {item.title} 
                {/* 🟢 NEW: Display Size if available */}
                {item.selectedSize !== null && (
                    <span className="text-gray-500 ml-1"> (Size: {item.selectedSize})</span>
                )}
                 × {item.quantity}
              </span>

              {/* Use sale price if available */}
              <span>
                ${((item.sale || item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-semibold mt-3 text-lg">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        {/* === Submit Button === */}
        <Button
          type="submit"
          className="w-full bg-[#A6686A] text-white hover:bg-[#91585A]"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}