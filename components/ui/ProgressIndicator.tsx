import { cn } from "@/lib/utils";
import { IconCheck, IconLoader } from "./Icons";

export interface ProgressStage {
  label: string;
  description?: string;
}

interface ProgressIndicatorProps {
  stages: ProgressStage[];
  /** -1 = not started, stages.length = all complete */
  activeIndex: number;
}

export const ProgressIndicator = ({
  stages,
  activeIndex,
}: ProgressIndicatorProps) => (
  <ol className="flex flex-col gap-0.5">
    {stages.map((stage, index) => {
      const isDone = index < activeIndex;
      const isActive = index === activeIndex;

      return (
        <li key={stage.label} className="flex items-start gap-3 py-2">
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
              isDone &&
                "border-success-500/40 bg-success-100 text-success-500",
              isActive &&
                "border-brand-500 bg-brand-50 text-brand-600",
              !isDone &&
                !isActive &&
                "border-border text-muted-foreground",
            )}
          >
            {isDone ? (
              <IconCheck className="h-3.5 w-3.5" />
            ) : isActive ? (
              <IconLoader className="h-3.5 w-3.5" />
            ) : (
              index + 1
            )}
          </span>
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                isActive || isDone
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {stage.label}
            </p>
            {stage.description && (
              <p className="text-xs text-muted-foreground">
                {stage.description}
              </p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
    <div
      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-700 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
