"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { TextareaField } from "@/components/ui/Field";
import { InlineAlert } from "@/components/ui/ErrorState";
import { Question, Requirement } from "@/lib/api/types";
import { QuestionInput } from "@/lib/api/questions";
import { QUESTION_CATEGORY_LABELS } from "./QuestionCard";
import { generateId } from "@/lib/utils";
import { getFriendlyErrorMessage } from "@/lib/errors";

const CATEGORIES: Question["category"][] = [
  "technical",
  "behavioral",
  "system-design",
  "company-fit",
];

const DIFFICULTIES: Question["difficulty"][] = [
  "easy",
  "medium",
  "hard",
];

interface QuestionFormDialogProps {
  open: boolean;
  onClose: () => void;
  requirements: Requirement[];
  initialQuestion?: Question;
  onSubmit: (input: QuestionInput) => Promise<unknown>;
  saving: boolean;
}

export const QuestionFormDialog = ({
  open,
  onClose,
  requirements,
  initialQuestion,
  onSubmit,
  saving,
}: QuestionFormDialogProps) => {
  const [text, setText] = useState("");
  const [category, setCategory] =
    useState<Question["category"]>("technical");
  const [difficulty, setDifficulty] =
    useState<Question["difficulty"]>("medium");
  const [requirementIds, setRequirementIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setText(initialQuestion?.question ?? "");
      setCategory(initialQuestion?.category ?? "technical");
      setDifficulty(initialQuestion?.difficulty ?? "medium");
      setRequirementIds(initialQuestion?.requirementIds ?? []);
      setError(null);
    }
  }, [open, initialQuestion]);

  const toggleRequirement = (id: string) => {
    setRequirementIds((current) =>
      current.includes(id)
        ? current.filter((requirementId) => requirementId !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Enter the question text.");
      return;
    }

    if (requirementIds.length === 0) {
      setError("Link at least one requirement.");
      return;
    }

    setError(null);

    try {
      await onSubmit({
        id: initialQuestion?.id ?? generateId("question"),
        question: text.trim(),
        category,
        difficulty,
        requirementIds,
        isPinned: initialQuestion?.isPinned,
      });
      onClose();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initialQuestion ? "Edit question" : "Add question"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {initialQuestion ? "Save changes" : "Add question"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <InlineAlert message={error} />}

        <TextareaField
          label="Question"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What would you ask a candidate about…?"
          className="min-h-24"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Category
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={category === value ? "primary" : "outline"}
                  onClick={() => setCategory(value)}
                >
                  {QUESTION_CATEGORY_LABELS[value]}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Difficulty
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={difficulty === value ? "primary" : "outline"}
                  onClick={() => setDifficulty(value)}
                  className="capitalize"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">
            Linked requirements
          </p>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-2">
            {requirements.map((requirement) => (
              <label
                key={requirement.id}
                className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-muted"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                  checked={requirementIds.includes(requirement.id)}
                  onChange={() => toggleRequirement(requirement.id)}
                />
                <span>
                  {requirement.text}{" "}
                  <span className="text-xs text-muted-foreground">
                    (
                    {requirement.priority === "must"
                      ? "must-have"
                      : "nice-to-have"}
                    )
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
