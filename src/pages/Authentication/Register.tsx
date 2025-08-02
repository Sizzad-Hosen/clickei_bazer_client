'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/redux/features/Users/userApi";

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [register, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    if (!value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: `${capitalize(name)} is required`,
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormState];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      if (!form[key].trim()) {
        newErrors[key] = `${capitalize(key)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      await register(form).unwrap();
      toast.success("Registration successful!");
      router.push("/");
    } catch (err: any) {
      const errorMsg =
        err?.data?.errorSources?.[0]?.message || err?.data?.message || "Registration failed";
      toast.error(errorMsg);
    }
  };

  // Utility to capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
              type="text" 
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              error={errors.name}
              touched={touched.name}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              error={errors.email}
              touched={touched.email}
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="text"
              placeholder="01725647800"
              value={form.phone}
              onChange={handleChange}
              required
              error={errors.phone}
              touched={touched.phone}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              error={errors.password}
              touched={touched.password}
            />

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
