"use client";

import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICheckoutFormData } from "@/types/checkout";


type CheckoutPersonalInfoProps = {
  register: UseFormRegister<ICheckoutFormData>;
  errors: FieldErrors<ICheckoutFormData>;
};

const CheckoutPersonalInfo: FC<CheckoutPersonalInfoProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label className="text-[#5e5a57]">Full Name</Label>
        <Input
          {...register("fullName", { required: true })}
          placeholder="Enter your full name"
          className="mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] rounded-none"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">Full name is required</p>
        )}
      </div>

      <div>
        <Label className="text-[#5e5a57]">Email</Label>
        <Input
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          placeholder="Enter your email"
          className="mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] rounded-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">Valid email required</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPersonalInfo;
