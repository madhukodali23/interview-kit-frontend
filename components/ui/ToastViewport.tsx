"use client";

import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfo,
  IconX,
} from "./Icons";

const toneConfig = {
  success: {
    Icon: IconCheck,
    classes: "border-success-500/30 bg-success-100 text-success-500",
  },
  error: {
    Icon: IconAlertTriangle,
    classes: "border-danger-500/30 bg-danger-100 text-danger-500",
  },
  info: {
    Icon: IconInfo,
    classes: "border-info-500/30 bg-info-100 text-info-500",
  },
} as const;

export const ToastViewport = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
    >
      {toasts.map((toast) => {
        const { Icon, classes } = toneConfig[toast.tone];

        return (
          <div
            key={toast.id}
            role="status"
            className="animate-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg"
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                classes,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
