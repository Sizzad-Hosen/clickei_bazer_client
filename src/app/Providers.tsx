// app/Providers.tsx
"use client";


import { store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: ReactNode }) {

  if (!store) {
    console.error("Redux store is null");
    return <>{children}</>;
  }

  return <Provider store={store}>{children}</Provider>;
}
