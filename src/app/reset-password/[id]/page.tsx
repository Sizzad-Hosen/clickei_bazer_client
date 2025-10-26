"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams?.get("token"); // from ?token=...

console.log("Token:", token)

  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(token)
      const res = await resetPassword({ ...form, token }).unwrap();
      console.log("Response:", res);
      toast.success("✅ Password reset successful. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
  if (err && typeof err === "object" && "data" in err) {
    const error = err as { data?: { message?: string } };
    setMessage(error.data?.message || "❌ Reset failed");
  } else {
    setMessage("❌ Reset failed");
  }
}

  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />

        {/* Old Password */}
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Enter old password"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-md pr-10"
            required
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-md pr-10"
            required
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <Button
          type="submit"
          variant={"secondary"}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </Button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
