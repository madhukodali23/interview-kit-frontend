"use client";

import { ReactNode } from "react";
import { SessionProvider } from "@/context/SessionContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToastViewport } from "@/components/ui/ToastViewport";

export const Providers = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  </SessionProvider>
);
