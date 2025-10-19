"use client";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CartSheet from "../cart/CartSheet";
import LogoutButton from "../auth/LogoutButton";

const Navbar = () => {
  return (
    <div className="flex w-full items-center bg-[#FDF7F2] justify-between p-4 px-6">
      <div className="flex-1">
        <Input
          placeholder="SEARCH"
          className="w-40 placeholder:text-sm !placeholder:text-[#5e5a57] text-black border-none border-b border-b-[#5e5a57]"
        />
      </div>

      <Link href={"/"}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#A6686A] text-3xl font-semibold">MAHA LOGO</p>
        </div>
      </Link>

      <div className="flex flex-1 gap-4 justify-end items-center">
        <LogoutButton/>
        <Star className="text-[#5e5a57] hover:text-[#A6686A] cursor-pointer" />
        <CartSheet /> 
      </div>
    </div>
  );
};

export default Navbar;
