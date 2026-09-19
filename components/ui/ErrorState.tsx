import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { IconAlertTriangle, IconRefresh } from "./Icons";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
}

/**
 * A full-block error state for a section/page that failed to load.
 * For inline form/action errors, use `InlineAlert` instead.
 */
export const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
  compact = false,
}: ErrorStateProps) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-500/20 bg-danger-100/40 text-center",
      compact ? "px-4 py-6" : "px-6 py-14",
      className,
    )}
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-100 text-danger-500">
      <IconAlertTriangle className="h-5 w-5" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">
        {title}
      </p>
      <p className="mx-auto max-w-sm text-sm text-muted-foreground">
        {message}
      </p>
    </div>
    {onRetry && (
      <Button
        variant="secondary"
        size="sm"
        onClick={onRetry}
        leftIcon={<IconRefresh className="h-4 w-4" />}
      >
        {retryLabel}
      </Button>
    )}
  </div>
);

export const InlineAlert = ({
  message,
  tone = "danger",
}: {
  message: string;
  tone?: "danger" | "warning" | "info";
}) => {
  const toneClasses = {
    danger: "border-danger-500/20 bg-danger-100/50 text-danger-500",
    warning:
      "border-warning-500/20 bg-warning-100/50 text-warning-500",
    info: "border-info-500/20 bg-info-100/50 text-info-500",
  } as const;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3.5 py-2.5 text-sm",
        toneClasses[tone],
      )}
    >
      <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
