import { Question, Requirement } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  IconArrowDown,
  IconArrowUp,
  IconPencil,
  IconPin,
  IconTrash,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export const QUESTION_CATEGORY_LABELS: Record<
  Question["category"],
  string
> = {
  technical: "Technical",
  behavioral: "Behavioral",
  "system-design": "System Design",
  "company-fit": "Company Fit",
};

const CATEGORY_TONES: Record<Question["category"], BadgeTone> = {
  technical: "brand",
  behavioral: "info",
  "system-design": "neutral",
  "company-fit": "success",
};

const DIFFICULTY_TONES: Record<Question["difficulty"], BadgeTone> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

interface QuestionCardProps {
  question: Question;
  requirements: Requirement[];
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  busy: boolean;
}

export const QuestionCard = ({
  question,
  requirements,
  onEdit,
  onDelete,
  onTogglePin,
  onMoveUp,
  onMoveDown,
  busy,
}: QuestionCardProps) => {
  const linkedRequirements = requirements.filter((requirement) =>
    question.requirementIds.includes(requirement.id),
  );

  return (
    <Card
      className={cn(
        "p-4",
        question.isPinned && "border-brand-300 bg-brand-50/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col gap-1 pt-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Move question up"
            className="rounded p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
          >
            <IconArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Move question down"
            className="rounded p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
          >
            <IconArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">{question.question}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={CATEGORY_TONES[question.category]}>
              {QUESTION_CATEGORY_LABELS[question.category]}
            </Badge>
            <Badge tone={DIFFICULTY_TONES[question.difficulty]}>
              {question.difficulty}
            </Badge>
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
              question.isPinned ? "Unpin question" : "Pin question"
            }
            aria-pressed={question.isPinned}
            onClick={onTogglePin}
            disabled={busy}
            className={question.isPinned ? "text-brand-600" : undefined}
          >
            <IconPin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit question"
            onClick={onEdit}
          >
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete question"
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
