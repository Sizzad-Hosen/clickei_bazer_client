"use client";

import { Button } from "@/components/ui/button";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { toast } from "sonner";
; // adjust your import

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
const [forgetPassword] = useForgetPasswordMutation();

  // Handle forgot password
  const handleForgetPassword = async () => {
    if (!form.email) {
      toast.error("Please enter your email before resetting password");
      return;
    }

  try {
    setLoading(true);
    const res = await forgetPassword({ email: form.email }).unwrap();

    if (res?.success) {
      toast.success(
        "Password reset link sent. Please check your email and SMS."
      );
      console.log(res);
    } else {
      toast.error(res?.message || "Failed to send reset link");
    }
  } catch (err: unknown) {
  console.error("Forgot password error:", err);

  let message = "Error sending reset link";

  if (typeof err === "string") {
    message = err;
  } else if (err && typeof err === "object") {
    const anyErr = err as { data?: { message?: string }; message?: string };
    message = anyErr?.data?.message || anyErr?.message || message;
  }

  toast.error(message);
}

 finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <Button
            onClick={handleForgetPassword}
            disabled={loading}
            variant={"secondary"}
            className="w-full "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
