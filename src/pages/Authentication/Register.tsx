'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/redux/features/Users/userApi";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [register, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // mark field as touched and validate
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    for (const key in form) {
      if (!form[key as keyof typeof form].trim()) {
        newErrors[key] = `${key} is required`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      const res = await register(form).unwrap();
      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      const errorMsg =
        err?.data?.errorSources?.[0]?.message || err?.data?.message || "Registration failed";
      toast.error(errorMsg);
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
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
            {touched.name && errors.name && (
              <p className="text-sm text-red-500 -mt-3">{errors.name}</p>
            )}

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-500 -mt-3">{errors.email}</p>
            )}

            <FormInput
              label="Phone Number"
              name="phone"
              type="text"
              placeholder="01725647800"
              value={form.phone}
              onChange={handleChange}
              required
            />
            {touched.phone && errors.phone && (
              <p className="text-sm text-red-500 -mt-3">{errors.phone}</p>
            )}

            <div className="relative">
              <FormInput
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-sm text-red-500 -mt-3">{errors.password}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
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
