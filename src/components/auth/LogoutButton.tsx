"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CircleUser, LogOut, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LogoutDropdown() {
  const { currentUser, handleLogout, loading } = useAuth();
  const router = useRouter();

  if (loading || !currentUser) return null;

  const onClickLogout = async () => {
    await handleLogout();
    router.push("/login");
  };

  const onClickResetPassword = () => {
    router.push("/dashboard/reset-password");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 border rounded-full border-[#7C4A4A] px-2 py-1 items-center justify-center cursor-pointer">
          <CircleUser className="text-[#7C4A4A]" size={30} />
          <div>
            <p className="truncate text-[#7C4A4A] font-medium text-base max-w-full md:max-w-32">
              {currentUser.email}
            </p>
            <p className="text-xs font-normal text-gray-600">Admin</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onClickResetPassword} className="hover:!border-none hover:!bg-transparent font-semibold cursor-pointer text-[#7C4A4A] hover:!text-[#A6686A]">
          <Key className="mr-2 h-4 w-4 text-[#7C4A4A]" />
          Reset Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClickLogout} className="hover:!border-none hover:!bg-transparent font-semibold cursor-pointer text-[#7C4A4A] hover:!text-[#A6686A]">
          <LogOut className="mr-2 h-4 w-4 text-[#7C4A4A]" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
