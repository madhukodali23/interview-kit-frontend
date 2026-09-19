"use client";

import Link from "next/link";
import { useState } from "react";
import { Flashcard, InterviewKit, RegenerateSection } from "@/lib/api/types";
import { FlashcardInput } from "@/lib/api/flashcards";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FlashcardListCard } from "@/components/kit/FlashcardListCard";
import { FlashcardFormDialog } from "@/components/kit/FlashcardFormDialog";
import { RegenerateButton } from "@/components/kit/RegenerateButton";
import { IconBookOpen, IconPlus } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";

interface FlashcardsTabProps {
  kit: InterviewKit;
  addFlashcard: (input: FlashcardInput) => Promise<unknown>;
  editFlashcard: (
    id: string,
    updates: Partial<FlashcardInput>,
  ) => Promise<unknown>;
  deleteFlashcard: (id: string) => Promise<unknown>;
  reorderFlashcards: (ids: string[]) => Promise<unknown>;
  regenerate: (section: RegenerateSection) => Promise<unknown>;
  isMutating: (key: string) => boolean;
}

export const FlashcardsTab = ({
  kit,
  addFlashcard,
  editFlashcard,
  deleteFlashcard,
  reorderFlashcards,
  regenerate,
  isMutating,
}: FlashcardsTabProps) => {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    flashcard?: Flashcard;
  }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Flashcard | null>(
    null,
  );
  const { showToast } = useToast();

  const flashcards = kit.flashcards;

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= flashcards.length) {
      return;
    }

    const reordered = [...flashcards];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    try {
      await reorderFlashcards(reordered.map((flashcard) => flashcard.id));
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't reorder flashcards",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleTogglePin = async (flashcard: Flashcard) => {
    try {
      await editFlashcard(flashcard.id, {
        isPinned: !flashcard.isPinned,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't update flashcard",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await deleteFlashcard(pendingDelete.id);
      showToast({ tone: "success", title: "Flashcard deleted" });
      setPendingDelete(null);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't delete flashcard",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleFormSubmit = async (input: FlashcardInput) => {
    if (dialogState.flashcard) {
      await editFlashcard(dialogState.flashcard.id, input);
      showToast({ tone: "success", title: "Flashcard updated" });
    } else {
      await addFlashcard(input);
      showToast({ tone: "success", title: "Flashcard added" });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        title={`Flashcards (${flashcards.length})`}
        description="One card per question, ready for focused practice."
        actions={
          <>
            <RegenerateButton
              section="flashcards"
              label="Flashcards"
              description="Regenerates flashcards from your current questions. Anything you've pinned or manually edited is preserved."
              onRegenerate={regenerate}
              isMutating={isMutating("regenerate:flashcards")}
            />
            <Button
              size="sm"
              leftIcon={<IconPlus className="h-3.5 w-3.5" />}
              onClick={() => setDialogState({ open: true })}
              disabled={kit.questions.length === 0}
            >
              Add flashcard
            </Button>
            {flashcards.length > 0 && (
              <Link href={`/kits/${kit.id}/practice`}>
                <Button size="sm" variant="secondary">
                  Practice
                </Button>
              </Link>
            )}
          </>
        }
      />

      {flashcards.length === 0 ? (
        <EmptyState
          icon={<IconBookOpen className="h-5 w-5" />}
          title="No flashcards yet"
          description="Add a flashcard manually, or regenerate this section from your questions."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {flashcards.map((flashcard, index) => (
            <FlashcardListCard
              key={flashcard.id}
              flashcard={flashcard}
              requirements={kit.role.requirements}
              onEdit={() => setDialogState({ open: true, flashcard })}
              onDelete={() => setPendingDelete(flashcard)}
              onTogglePin={() => handleTogglePin(flashcard)}
              onMoveUp={index > 0 ? () => handleMove(index, -1) : undefined}
              onMoveDown={
                index < flashcards.length - 1
                  ? () => handleMove(index, 1)
                  : undefined
              }
              busy={isMutating(`flashcard:${flashcard.id}`)}
            />
          ))}
        </div>
      )}

      <FlashcardFormDialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false })}
        questions={kit.questions}
        requirements={kit.role.requirements}
        initialFlashcard={dialogState.flashcard}
        onSubmit={handleFormSubmit}
        saving={
          dialogState.flashcard
            ? isMutating(`flashcard:${dialogState.flashcard.id}`)
            : isMutating("add-flashcard")
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete this flashcard?"
        description="This can't be undone."
        confirmLabel="Delete flashcard"
        tone="danger"
        loading={
          pendingDelete
            ? isMutating(`flashcard:${pendingDelete.id}`)
            : false
        }
      />
    </div>
  );
};
