"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlices";
import type { UserRole } from "@/types/user";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/unauthorized");
    }
  }, [user, pathname, allowedRoles, router]);

  if (
    !user ||
    typeof user.role === "undefined" ||
    (allowedRoles && !allowedRoles.includes(user.role))
  ) return <Spinner />;

  return <>{children}</>;
}
