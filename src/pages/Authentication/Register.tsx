'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FromInput";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/redux/features/Users/userApi";
import { TErrorSources, TGenericErrorResponse } from "@/types/error";

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// Fix: Extend TErrorSources to include message if your backend returns it
// Or create a new interface here for error shape you expect
interface TErrorSourcesWithMessage extends TErrorSources {
  message?: string;
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [name]: `${capitalize(name)} is required` }));
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

  function hasDataProperty(obj: unknown): obj is { data: unknown } {
    return typeof obj === 'object' && obj !== null && 'data' in obj;
  }

  // Adjusted type guard to support optional message
  function isErrorData(obj: unknown): obj is TErrorSourcesWithMessage {
    return (
      typeof obj === 'object' && obj !== null && (
        'message' in obj || 'errorSources' in obj
      )
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      await register(form).unwrap();
      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: unknown) {
      const isGenericError = (error): error is TGenericErrorResponse => {
        return (
          error &&
          typeof error === 'object' &&
          'errorSources' in error &&
          Array.isArray(error.errorSources)
        );
      };

      let errorMsg = "Registration failed";

      if (hasDataProperty(err)) {
        const errData = err.data;

        if (isGenericError(errData)) {
          errorMsg = errData.errorSources?.[0]?.message || errorMsg;
        } else if (
          isErrorData(errData) && 
          typeof errData.message === 'string'
        ) {
          errorMsg = errData.message;
        }
      }

      toast.error(errorMsg);
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg border border-blue-300 shadow-xl rounded-2xl">
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

            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            <span className="text-gray-900">Already have an account?{" "}</span>
            <button
              onClick={() => router.push("/login")}
              className="text-primary underline hover:text-primary/80 active:text-primary/60 transform hover:scale-105 active:scale-95 transition duration-150"
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
