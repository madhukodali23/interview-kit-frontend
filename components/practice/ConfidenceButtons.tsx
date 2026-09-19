"use client";

import { Button } from "@/components/ui/Button";
import { PracticeConfidence } from "@/lib/api/types";

interface ConfidenceButtonsProps {
  onSelect: (confidence: PracticeConfidence, covered: boolean) => void;
  disabled: boolean;
}

/**
 * The backend records `confidence` and `covered` independently, but the
 * requested flow is a single confidence choice with no separate step. High
 * confidence is treated as "covered"; medium/low are not — a reasonable
 * default rather than an extra interaction the flow doesn't call for.
 */
export const ConfidenceButtons = ({
  onSelect,
  disabled,
}: ConfidenceButtonsProps) => (
  <div className="flex w-full flex-col items-center gap-3">
    <p className="text-sm font-medium text-foreground">
      How confident were you?
    </p>
    <div className="flex w-full flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        className="flex-1 justify-center border-danger-500/30 text-danger-500 hover:bg-danger-100"
        onClick={() => onSelect("low", false)}
        disabled={disabled}
      >
        Low
        <span className="ml-1.5 text-xs text-muted-foreground">(1)</span>
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-warning-500/30 text-warning-500 hover:bg-warning-100"
        onClick={() => onSelect("medium", false)}
        disabled={disabled}
      >
        Medium
        <span className="ml-1.5 text-xs text-muted-foreground">(2)</span>
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-success-500/30 text-success-500 hover:bg-success-100"
        onClick={() => onSelect("high", true)}
        disabled={disabled}
      >
        High
        <span className="ml-1.5 text-xs text-muted-foreground">(3)</span>
      </Button>
    </div>
  </div>
);
