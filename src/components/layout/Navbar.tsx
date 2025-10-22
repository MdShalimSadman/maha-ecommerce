"use client";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CartSheet from "../cart/CartSheet";
import LogoutButton from "../auth/LogoutButton";
import Image from "next/image";
import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
  return (
    <div className="flex sticky z-50 top-0 w-full items-center bg-[#FDF7F2] justify-between p-2 px-6">
      <div className="flex-1">
       <GlobalSearch />
      </div>

      <Link href={"/"}>
        <div className="flex-1 flex items-center justify-center">
         <Image
          src="/images/logo/logo.png"
          priority
          width={120}
          height={120}
          alt="logo"
         />
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
