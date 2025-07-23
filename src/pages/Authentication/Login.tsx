'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const LoginPage = () => {   // <-- remove async here

  const router = useRouter();
  const [addLogin] = useLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Register form:", form);

    try {
      const res = await addLogin(form).unwrap();

      console.log("Login successful:", res);
      toast.success("Login successfully");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
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
            Already have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-primary underline"
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
