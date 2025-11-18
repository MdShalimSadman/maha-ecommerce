"use client";

import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICheckoutFormData } from "@/types/checkout";

type ICheckoutAddressInfoFields = {
  phone: string;
  address: string;
};

type CheckoutAddressInfoProps = {
  register: UseFormRegister<ICheckoutFormData>;
  errors: FieldErrors<ICheckoutAddressInfoFields>;
};

const CheckoutAddressInfo: FC<CheckoutAddressInfoProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 gap-6">

      <div>
        <Label className="text-[#5e5a57]">Phone</Label>
        <Input
          {...register("phone", { required: true })}
          placeholder="Enter your phone number"
          className="mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] rounded-none"
        />
        {errors.phone && <p className="text-red-500 text-sm">Phone is required</p>}
      </div>

      <div>
        <Label className="text-[#5e5a57]">Address</Label>
        <Input
          {...register("address", { required: true })}
          placeholder="Enter your delivery address"
          className="mt-1 pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] rounded-none"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">Delivery address required</p>
        )}
      </div>

    </div>
  );
};

export default CheckoutAddressInfo;
