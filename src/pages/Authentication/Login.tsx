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

const LoginPage = () => {   // <-- remove async here

  const router = useRouter();
  const [addLogin] = useLoginMutation();
const dispatch = useDispatch();


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

        const res = await addLogin(form);

       console.log('result', res);

        const token = res?.data?.data?.accessToken;

      console.log(token)
     const user = verifyToken(res?.data?.data?.accessToken) as TUser;

      if (!user) {
      throw new Error('Invalid token');
       }

      dispatch(setUser({ user, token }));
      
      console.log('user',user);

      console.log('token',token);
      

      if (res?.data.success) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error(res?.data.message || 'Login failed');
      }

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
