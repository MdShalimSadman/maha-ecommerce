"use client";

import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
import GradientButton from "@/components/common/GradientButton";
import Image from "next/image";

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
        items: cartItems.map((item) => ({
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
      const orderId = docRef.id;

      console.log("Order submitted with ID: ", orderId);
      return orderId;
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("An error occurred while placing your order. Please try again.");
      return null;
    }
  };

  const sendCustomerConfirmationEmail = async ({
    orderId,
    email,
    fullName,
    totalPrice,
  }: {
    orderId: string;
    email: string;
    fullName: string;
    totalPrice: number;
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
        Your cart is empty <br /> Please add items before checking out.
      </p>
    );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 md:gap-6 lf:gap-10 xl:gap-12 rounded-xl mx-auto max-w-6xl p-4 md:p-6 xl:p-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* === Personal Info === */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Full Name
            </Label>
            <Input
              {...register("fullName", { required: true })}
              placeholder="Enter your full name"
              className={`mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none`}
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
              className={`mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Valid email required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label className="block text-base font-medium text-[#5e5a57]">
              Phone
            </Label>
            <Input
              {...register("phone", { required: true })}
              placeholder="Enter your phone number"
              className={`mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none`}
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
              className={`mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none`}
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
                <RadioGroupItem
                  value="bkash"
                  id="bkash"
                  disabled
                  className="border-[#A6686A]"
                />
                <Image
                  src="/images/payment/bkash.png"
                  height={20}
                  width={20}
                  alt="bkash"
                />
                <Label htmlFor="bkash" className="text-gray-500">
                  bKash
                  <span className="-mt-3 bg-gradient-to-r from-[#7C4A4A] to-[#A6686A] text-[10px] text-white p-1 rounded-full">
                    Coming Soon
                  </span>
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="stripe"
                  id="stripe"
                  disabled
                  className="border-[#A6686A]"
                />
                <Image
                  src="/images/payment/visa.png"
                  height={20}
                  width={20}
                  alt="visa"
                />
                <Image
                  src="/images/payment/master-card.png"
                  height={20}
                  width={20}
                  alt="master-card"
                />
                <Label htmlFor="stripe" className="text-gray-500">
                  Visa / Mastercard
                  <span className="-mt-3 bg-gradient-to-r from-[#7C4A4A] to-[#A6686A] text-[10px] text-white p-1 rounded-full">
                    Coming Soon
                  </span>
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="cash_on_delivery"
                  id="cash_on_delivery"
                  {...register("paymentMethod")}
                  className=" 
             data-[state=checked]:border-[#A6686A] border-[#A6686A]"
                />
                 <Image
                  src="/images/payment/money.png"
                  height={20}
                  width={20}
                  alt="cash"
                />
                <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <GradientButton
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </GradientButton>
      </form>
      {/* === Order Summary === */}

      <div className="flex-1 h-full bg-[#EFD8D6]/60 rounded-lg p-6">
        <div>
          {cartItems.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between text-sm mb-2"
            >
              {/* 💡 Use item.itemId as key for unique cart items (product + size) */}

              <div className="flex-1 flex gap-4 text-gray-700">
                <div className="relative">
                  <p className="absolute -top-1 -right-1 z-30 rounded-full h-5 w-5 text-xs flex items-center justify-center bg-[#A6686A] text-white">
                    {item.quantity}
                  </p>
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={50}
                      height={40}
                      className="rounded-md"
                    />
                  )}
                </div>
                <div>
                  <p>{item.title}</p>

                  {item.selectedSize !== null && (
                    <p className="text-gray-500"> Size: {item.selectedSize}</p>
                  )}
                </div>
              </div>

              {/* Use sale price if available */}
              <span>
                BDT {((item.sale || item.price) * item.quantity).toFixed(2)}
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
      </div>
    </div>
  );
}
