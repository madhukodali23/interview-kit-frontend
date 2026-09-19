"use client";

import { useState } from "react";
import { Flashcard, PracticeConfidence, Requirement } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconPencil,
  IconPin,
  IconTrash,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const CONFIDENCE_TONES: Record<PracticeConfidence, BadgeTone> = {
  low: "danger",
  medium: "warning",
  high: "success",
};

interface FlashcardListCardProps {
  flashcard: Flashcard;
  requirements: Requirement[];
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  busy: boolean;
}

export const FlashcardListCard = ({
  flashcard,
  requirements,
  onEdit,
  onDelete,
  onTogglePin,
  onMoveUp,
  onMoveDown,
  busy,
}: FlashcardListCardProps) => {
  const [revealed, setRevealed] = useState(false);

  const linkedRequirements = requirements.filter((requirement) =>
    flashcard.requirementIds.includes(requirement.id),
  );

  return (
    <Card
      className={cn(
        "p-4",
        flashcard.isPinned && "border-brand-300 bg-brand-50/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col gap-1 pt-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Move flashcard up"
            className="rounded p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
          >
            <IconArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Move flashcard down"
            className="rounded p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
          >
            <IconArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {flashcard.front}
          </p>
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            <IconChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                revealed && "rotate-180",
              )}
            />
            {revealed ? "Hide answer" : "Show answer"}
          </button>
          {revealed && (
            <p className="animate-fade-in mt-2 rounded-lg bg-surface-muted px-3 py-2 text-sm text-muted-foreground">
              {flashcard.back}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {flashcard.practice && (
              <Badge tone={CONFIDENCE_TONES[flashcard.practice.confidence]}>
                {flashcard.practice.confidence} confidence
              </Badge>
            )}
            {flashcard.practice?.covered && (
              <Badge tone="success">Covered</Badge>
            )}
            {linkedRequirements.map((requirement) => (
              <Badge
                key={requirement.id}
                tone="neutral"
                title={requirement.text}
                className="max-w-[10rem] truncate"
              >
                {requirement.text}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              flashcard.isPinned ? "Unpin flashcard" : "Pin flashcard"
            }
            aria-pressed={flashcard.isPinned}
            onClick={onTogglePin}
            disabled={busy}
            className={flashcard.isPinned ? "text-brand-600" : undefined}
          >
            <IconPin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit flashcard"
            onClick={onEdit}
          >
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete flashcard"
            onClick={onDelete}
            disabled={busy}
            className="hover:bg-danger-100 hover:text-danger-500"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
