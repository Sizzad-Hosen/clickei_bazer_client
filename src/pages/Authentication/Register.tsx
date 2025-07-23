'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";

const RegisterPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.phone) {
      alert("Passwords do not match");
      return;
    }

    // TODO: Submit data to API
    console.log("Register form:", form);

    // redirect to login or dashboard
    router.push("/login");
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
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />

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
              label="Phone Number"
              name="phone"
              type="text"
              placeholder="01725647800"
              value={form.phone}
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
              Register
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-primary underline"
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
