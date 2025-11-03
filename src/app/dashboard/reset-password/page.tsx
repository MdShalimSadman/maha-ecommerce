"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/common/GradientButton";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ResetPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!user) {
      toast.error("You must be logged in to change your password.");
      router.push("/login");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success("Password successfully updated!");
      router.push("/dashboard");
      reset();
    } catch (err) {
      const error = err as AuthError;

      switch (error.code) {
        case "auth/wrong-password":
          toast.error("Incorrect current password.");
          break;
        case "auth/requires-recent-login":
          toast.error(
            "Please log out and log in again to update your password."
          );
          break;
        case "auth/weak-password":
          toast.error("Password is too weak. Choose a stronger one.");
          break;
        default:
          toast.error("Failed to update password. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#A6686A]">
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                className="pl-0 pr-10 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A6686A] hover:text-[#7C4A4A] cursor-pointer"
              >
                {showCurrent ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.currentPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                className="pl-0 pr-10 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A6686A] hover:text-[#7C4A4A] cursor-pointer"
              >
                {showNew ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                className="pl-0 pr-10 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A6686A] hover:text-[#7C4A4A] cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <GradientButton
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Processing..." : "Change Password"}
            </GradientButton>
          </form>

          <div className="mt-4">
            <Link
              href="/dashboard"
              className="text-sm text-[#A6686A] hover:text-[#7C4A4A] cursor-pointer"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
