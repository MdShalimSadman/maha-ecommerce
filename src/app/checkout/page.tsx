"use client";

import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 1. Import Firestore functions and your Firebase instance
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    // Set default value for the radio group field
    defaultValues: {
      paymentMethod: "cash_on_delivery",
    },
  });

  // 2. Function to save the order data to Firestore
  const saveOrderToFirestore = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare the order object
      const orderData = {
        ...data,
        items: cartItems.map(item => ({
          _id: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
        orderDate: serverTimestamp(), // Use Firebase's server timestamp
        status: "Pending",
      };

      // Add a new document to the "orders" collection
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order submitted with ID: ", docRef.id);
      
      return true; // Success
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("An error occurred while placing your order. Please try again.");
      return false; // Failure
    } finally {
      setIsSubmitting(false);
    }
  };


  // 3. Update onSubmit to handle async data saving
  const onSubmit = async (data: CheckoutFormData) => {
    const success = await saveOrderToFirestore(data);

    if (success) {
      clearCart();
      router.push("/thank-you");
    }
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

        {/* === Payment Methods (Updated to use register) === */}
        <div>
          <Label className="block text-base font-medium text-[#5e5a57] mb-2">
            Payment Method
          </Label>

          <RadioGroup 
            defaultValue="cash_on_delivery" 
            // The value is read by react-hook-form using the register prop on the RadioGroupItem
          >
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
                  // NOTE: Use the register prop on the RadioGroupItem that you want to be selected by default and pass its name.
                  {...register("paymentMethod")} 
                />
                <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
              </div>
              {/* Optional: Add validation error for payment method if needed, though with default value it's unlikely */}
            </div>
          </RadioGroup>
        </div>

        {/* === Order Summary (Unchanged) === */}
        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm mb-2">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold mt-3 text-lg">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        {/* === Submit Button (Updated for loading state) === */}
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