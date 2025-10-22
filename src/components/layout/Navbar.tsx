"use client";

import Link from "next/link";
import Image from "next/image";
import CartSheet from "../cart/CartSheet";
import LogoutButton from "../auth/LogoutButton";
import GlobalSearch from "./GlobalSearch";
import SlidingWishlistSheet from "../wishlist/SlidingWishlistSheet";

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
        <LogoutButton />
        <SlidingWishlistSheet />
        <CartSheet />
      </div>
    </div>
  );
};

export default Navbar;
