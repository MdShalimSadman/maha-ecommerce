"use client";

import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { ICheckoutFormData } from "@/types/checkout";



interface ICheckoutPaymentMethodsProps {
  register: UseFormRegister<ICheckoutFormData>;
};

const CheckoutPaymentMethods: FC<ICheckoutPaymentMethodsProps> = ({ register }) => {
  return (
    <div>
      <Label className="text-base font-medium text-[#5e5a57] mb-2">
        Payment Method
      </Label>

      <RadioGroup defaultValue="cash_on_delivery">
        <div className="flex flex-col gap-3">

          {/* bKash */}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="bkash" id="bkash" disabled />
            <Image src="/images/payment/bkash.png" width={20} height={20} alt="bkash" />
            <Label htmlFor="bkash" className="text-gray-500">bKash</Label>
          </div>

          {/* Stripe */}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="stripe" id="stripe" disabled />
            <Image src="/images/payment/visa.png" width={20} height={20} alt="visa" />
            <Image src="/images/payment/master-card.png" width={20} height={20} alt="master" />
            <Label htmlFor="stripe" className="text-gray-500">Visa / Mastercard</Label>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="cash_on_delivery"
              id="cash_on_delivery"
              {...register("paymentMethod")}
            />
            <Image src="/images/payment/money.png" width={20} height={20} alt="cash" />
            <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
          </div>

        </div>
      </RadioGroup>
    </div>
  );
};

export default CheckoutPaymentMethods;
