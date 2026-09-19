"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { TextareaField } from "@/components/ui/Field";
import { InlineAlert } from "@/components/ui/ErrorState";
import { Flashcard, Question, Requirement } from "@/lib/api/types";
import { FlashcardInput } from "@/lib/api/flashcards";
import { generateId } from "@/lib/utils";
import { getFriendlyErrorMessage } from "@/lib/errors";

interface FlashcardFormDialogProps {
  open: boolean;
  onClose: () => void;
  questions: Question[];
  requirements: Requirement[];
  initialFlashcard?: Flashcard;
  onSubmit: (input: FlashcardInput) => Promise<unknown>;
  saving: boolean;
}

export const FlashcardFormDialog = ({
  open,
  onClose,
  questions,
  requirements,
  initialFlashcard,
  onSubmit,
  saving,
}: FlashcardFormDialogProps) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [requirementIds, setRequirementIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFront(initialFlashcard?.front ?? "");
      setBack(initialFlashcard?.back ?? "");
      setQuestionId(
        initialFlashcard?.questionId ?? questions[0]?.id ?? "",
      );
      setRequirementIds(initialFlashcard?.requirementIds ?? []);
      setError(null);
    }
  }, [open, initialFlashcard, questions]);

  const toggleRequirement = (id: string) => {
    setRequirementIds((current) =>
      current.includes(id)
        ? current.filter((requirementId) => requirementId !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async () => {
    if (!front.trim() || !back.trim()) {
      setError("Fill in both the front and back of the card.");
      return;
    }

    if (!questionId) {
      setError("Link this flashcard to a question.");
      return;
    }

    setError(null);

    try {
      await onSubmit({
        id: initialFlashcard?.id ?? generateId("flashcard"),
        front: front.trim(),
        back: back.trim(),
        questionId,
        requirementIds,
        isPinned: initialFlashcard?.isPinned,
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
      title={initialFlashcard ? "Edit flashcard" : "Add flashcard"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {initialFlashcard ? "Save changes" : "Add flashcard"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <InlineAlert message={error} />}

        <TextareaField
          label="Front (question)"
          value={front}
          onChange={(event) => setFront(event.target.value)}
          className="min-h-20"
          required
        />
        <TextareaField
          label="Back (answer)"
          value={back}
          onChange={(event) => setBack(event.target.value)}
          className="min-h-24"
          required
        />

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-foreground"
            htmlFor="flashcard-question"
          >
            Linked question
          </label>
          <select
            id="flashcard-question"
            value={questionId}
            onChange={(event) => setQuestionId(event.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            {questions.length === 0 && (
              <option value="">No questions available</option>
            )}
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.question.slice(0, 70)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">
            Linked requirements (optional)
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
                <span>{requirement.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
