// app/Providers.tsx
"use client";


import { store } from "@/redux/store";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";
import Spinner from "@/components/Spinner";

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    localStorage.removeItem('persist:auth');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
