"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/common/GradientButton";
import Link from "next/link";
import { toast } from "sonner";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);

      const message =
        "If that email is registered, a reset link has been sent to your inbox. Check your spam folder too.";

      toast.success(message);
      setSuccessMessage(message);

      // Disable button for 60 seconds
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 60000); // 60 seconds

      reset();
    } catch (err: unknown) {
      console.error("Forgot Password Error:", err);

      let errorMessage = "Failed to send password reset link. Please try again.";

      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof err.code === "string"
      ) {
        if (err.code === "auth/user-not-found") {
          errorMessage =
            "If that email is registered, a reset link has been sent to your inbox.";
        } else {
          errorMessage = "Something went wrong. Please try again.";
        }
      }

      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#A6686A]">
            Reset Your Password
          </CardTitle>
          <p className="text-gray-700 text-sm">
            Enter the email address you use to sign in.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                autoComplete="email"
                className="pl-0 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
              {successMessage && (
                <p className="text-sm bg-green-100 rounded-md p-3 mt-3 text-green-600 font-medium">
                  {successMessage}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <GradientButton
              type="submit"
              disabled={loading || isButtonDisabled}
              className="w-full mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending Request..." : "Send Reset Link"}
            </GradientButton>
          </form>

          {/* Back to Login */}
          <div className="text-sm  mt-4">
            <Link
              href="/login"
              className="font-medium text-[#A6686A] hover:text-[#7C4A4A]"
            >
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}