"use client";

import Link from "next/link";
import Image from "next/image";
import CartSheet from "../cart/CartSheet";
import LogoutButton from "../auth/LogoutButton";
import GlobalSearch from "./GlobalSearch";
import SlidingWishlistSheet from "../wishlist/SlidingWishlistSheet";
import SecondaryNav from "./SecondaryNav";

const Navbar = () => {
  return (
    <div className="sticky z-50 top-0 w-full bg-white">
      <div className="flex w-full items-center justify-between p-1 px-6 border-b-[0.5px] border-[#7C4A4A]/15">
        <div className="flex-1">
          <GlobalSearch />
        </div>

        <Link href={"/"}>
          <div className="flex-1 flex items-center justify-center p-2">
            <Image
              src="/images/logo/logo.png"
              priority
              width={90}
              height={90}
              alt="logo"
            />
            {/* <p className="p-5 text-[#7C4A4A] text-4xl font-bold">MAHAA</p> */}
          </div>
        </Link>

        <div className="flex flex-1 gap-4 justify-end items-center">
          <LogoutButton />
          <SlidingWishlistSheet />
          <CartSheet />
        </div>
      </div>
      <SecondaryNav />
    </div>
  );
};

export default Navbar;
