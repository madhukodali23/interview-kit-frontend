import { cn } from "@/lib/utils";
import { IconLoader } from "./Icons";

export const Spinner = ({ className }: { className?: string }) => (
  <IconLoader className={cn("h-5 w-5 text-brand-600", className)} />
);

export const PageLoading = ({
  label = "Loading…",
}: {
  label?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center gap-3 py-24 text-sm text-muted-foreground"
  >
    <Spinner className="h-6 w-6" />
    <span>{label}</span>
  </div>
);

export const Skeleton = ({
  className,
}: {
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={cn(
      "animate-pulse rounded-md bg-surface-muted",
      className,
    )}
  />
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-border bg-surface p-5">
    <Skeleton className="mb-3 h-4 w-1/3" />
    <Skeleton className="mb-2 h-3 w-full" />
    <Skeleton className="mb-2 h-3 w-5/6" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const KitCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-surface p-5">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <Skeleton className="mb-2 h-3 w-4/5" />
    <Skeleton className="mb-4 h-3 w-3/5" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  </div>
);
