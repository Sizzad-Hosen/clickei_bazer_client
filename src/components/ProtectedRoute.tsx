// components/ProtectedRoute.tsx
"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Spinner from "./Spinner";


export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g., ['admin']
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useGetMeQuery({});

  useEffect(() => {
    
    if (!isLoading) {

      if (!user || isError) {
   
        
        router.replace("/login");
      } else if (
        allowedRoles &&
        !allowedRoles.includes(
        

          (user as any)?.role 
        )
      ) {
   
        router.replace("/unauthorized");
      }
    }
  }, [user, isLoading, isError, pathname]);

  if (isLoading || !user) return <Spinner></Spinner>

  return <>{children}</>;
}
