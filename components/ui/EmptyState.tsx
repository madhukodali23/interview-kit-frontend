import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface-muted/50 px-6 py-14 text-center",
      className,
    )}
  >
    {icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
    )}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">
        {title}
      </p>
      {description && (
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);
