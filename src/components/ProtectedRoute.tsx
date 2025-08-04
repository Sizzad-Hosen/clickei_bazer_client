"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlices";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);

  console.log("Allowed roles:", allowedRoles);
  console.log("User role:", user?.role);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (
      allowedRoles &&
      !allowedRoles.map(r => r.toLowerCase().trim()).includes(user.role?.toLowerCase().trim())
    ) {
      router.replace("/unauthorized");
    }
  }, [user, pathname, allowedRoles, router]);

  if (!user || typeof user.role === "undefined") return <Spinner />;

  return <>{children}</>;
}
