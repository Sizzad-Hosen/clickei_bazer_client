'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { setUser, TUser } from "@/redux/features/auth/authSlices";
import { useDispatch } from "react-redux";
import { verifyToken } from "@/utils/verifyToken";

const LoginPage = () => {
  const router = useRouter();
  const [addLogin] = useLoginMutation();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addLogin(form);
      const token = res?.data?.data?.accessToken;
      const user = verifyToken(token) as TUser;

      if (!user) throw new Error("Invalid token");

      dispatch(setUser({ user, token }));

      if (res?.data.success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(res?.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg border border-blue-300 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            <span className="text-gray-900">Doesn&apos;t have an account?{" "}</span>
            <button
              onClick={() => router.push("/register")}
              className="text-primary underline hover:text-primary/80 active:text-primary/60 transform hover:scale-105 active:scale-95 transition duration-150"
            >
              Register
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
