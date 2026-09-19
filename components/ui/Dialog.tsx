"use client";

import {
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import { IconX } from "./Icons";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-2xl",
};

/**
 * Built on the native <dialog> element: gives us focus-trapping, Escape to
 * close, and top-layer stacking for free, no dependency required.
 */
export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (open && !node.open) {
      node.showModal();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        "m-auto w-full max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-0 text-foreground shadow-lg backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm",
        sizeClasses[size],
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      {children && (
        <div className="max-h-[65vh] overflow-y-auto px-5 py-4">
          {children}
        </div>
      )}

      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          {footer}
        </div>
      )}
    </dialog>
  );
};
