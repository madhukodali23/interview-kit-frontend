import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    "bg-surface-muted text-muted-foreground border border-border",
  brand: "bg-brand-50 text-brand-700 border border-brand-200",
  success:
    "bg-success-100 text-success-500 border border-success-500/20",
  warning:
    "bg-warning-100 text-warning-500 border border-warning-500/20",
  danger:
    "bg-danger-100 text-danger-500 border border-danger-500/20",
  info: "bg-info-100 text-info-500 border border-info-500/20",
};

export const Badge = ({
  tone = "neutral",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
      toneClasses[tone],
      className,
    )}
    {...props}
  />
);
