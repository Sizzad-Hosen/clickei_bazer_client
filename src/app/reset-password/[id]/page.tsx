"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";

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
      setMessage("✅ Password reset successful. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err?.data?.message || "❌ Reset failed");
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
