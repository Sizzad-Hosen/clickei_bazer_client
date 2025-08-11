"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "./Spinner";

interface User {
  role: string;
  // add other fields if needed
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g., ['admin']
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMeQuery({});

  useEffect(() => {
    if (!isLoading) {
      if (!user || isError) {
        router.replace("/login");
      } else if (
        allowedRoles &&
        !allowedRoles.includes((user as User).role)
      ) {
        router.replace("/unauthorized");
      }
    }
  }, [user, isLoading, isError, allowedRoles, router]);

  if (isLoading || !user) return <Spinner />;

  return <>{children}</>;
}
