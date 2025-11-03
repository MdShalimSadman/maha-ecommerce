"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/common/GradientButton";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred.";

      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof err.code === "string" 
      ) {
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found"
        ) {
          errorMessage = "Invalid email or password.";
          toast.error("Invalid email or password.");
        } else if (err.code === "auth/wrong-password") {
          errorMessage = "Invalid password.";
          toast.error("Invalid password");
        } else {
          toast.error("Something went wrong!");
        }
      }

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
            Sign In to Dashboard
          </CardTitle>
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
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pl-0 pr-10 w-full bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A6686A] hover:text-[#7C4A4A] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
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
              disabled={loading}
              className="w-full mt-4 cursor-pointer"
            >
              {loading ? "Logging In..." : "Log In"}
            </GradientButton>
          </form>

          {/* Forgot Password */}
          <div className="text-sm mt-4">
            <Link
              href="/forgot-password"
              className="font-medium text-[#A6686A] hover:text-[#7C4A4A]"
            >
              Forgot Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
