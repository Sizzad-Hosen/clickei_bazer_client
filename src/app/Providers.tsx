// app/Providers.tsx
"use client";


import { store } from "@/redux/store";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    localStorage.removeItem('persist:auth');
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
