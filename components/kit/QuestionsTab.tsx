"use client";

import { useState } from "react";
import { InterviewKit, Question, RegenerateSection } from "@/lib/api/types";
import { QuestionInput } from "@/lib/api/questions";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QuestionCard } from "@/components/kit/QuestionCard";
import { QuestionFormDialog } from "@/components/kit/QuestionFormDialog";
import { RegenerateButton } from "@/components/kit/RegenerateButton";
import { IconClipboardList, IconPlus } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";

interface QuestionsTabProps {
  kit: InterviewKit;
  addQuestion: (input: QuestionInput) => Promise<unknown>;
  editQuestion: (
    id: string,
    updates: Partial<QuestionInput>,
  ) => Promise<unknown>;
  deleteQuestion: (id: string) => Promise<unknown>;
  reorderQuestions: (ids: string[]) => Promise<unknown>;
  regenerate: (section: RegenerateSection) => Promise<unknown>;
  isMutating: (key: string) => boolean;
}

export const QuestionsTab = ({
  kit,
  addQuestion,
  editQuestion,
  deleteQuestion,
  reorderQuestions,
  regenerate,
  isMutating,
}: QuestionsTabProps) => {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    question?: Question;
  }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Question | null>(
    null,
  );
  const { showToast } = useToast();

  const questions = kit.questions;

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= questions.length) {
      return;
    }

    const reordered = [...questions];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    try {
      await reorderQuestions(reordered.map((question) => question.id));
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't reorder questions",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleTogglePin = async (question: Question) => {
    try {
      await editQuestion(question.id, { isPinned: !question.isPinned });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't update question",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await deleteQuestion(pendingDelete.id);
      showToast({ tone: "success", title: "Question deleted" });
      setPendingDelete(null);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't delete question",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  const handleFormSubmit = async (input: QuestionInput) => {
    if (dialogState.question) {
      await editQuestion(dialogState.question.id, input);
      showToast({ tone: "success", title: "Question updated" });
    } else {
      await addQuestion(input);
      showToast({ tone: "success", title: "Question added" });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        title={`Questions (${questions.length})`}
        description="Technical, behavioral, system design, and company-fit questions, each linked to a requirement."
        actions={
          <>
            <RegenerateButton
              section="questions"
              label="Questions"
              description="Regenerates questions from your requirements and company research. Anything you've pinned or manually edited is preserved."
              onRegenerate={regenerate}
              isMutating={isMutating("regenerate:questions")}
            />
            <Button
              size="sm"
              leftIcon={<IconPlus className="h-3.5 w-3.5" />}
              onClick={() => setDialogState({ open: true })}
            >
              Add question
            </Button>
          </>
        }
      />

      {questions.length === 0 ? (
        <EmptyState
          icon={<IconClipboardList className="h-5 w-5" />}
          title="No questions yet"
          description="Add a question manually, or regenerate this section."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              requirements={kit.role.requirements}
              onEdit={() => setDialogState({ open: true, question })}
              onDelete={() => setPendingDelete(question)}
              onTogglePin={() => handleTogglePin(question)}
              onMoveUp={index > 0 ? () => handleMove(index, -1) : undefined}
              onMoveDown={
                index < questions.length - 1
                  ? () => handleMove(index, 1)
                  : undefined
              }
              busy={isMutating(`question:${question.id}`)}
            />
          ))}
        </div>
      )}

      <QuestionFormDialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false })}
        requirements={kit.role.requirements}
        initialQuestion={dialogState.question}
        onSubmit={handleFormSubmit}
        saving={
          dialogState.question
            ? isMutating(`question:${dialogState.question.id}`)
            : isMutating("add-question")
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete this question?"
        description="This also removes any flashcards linked to this question. This can't be undone."
        confirmLabel="Delete question"
        tone="danger"
        loading={
          pendingDelete
            ? isMutating(`question:${pendingDelete.id}`)
            : false
        }
      />
    </div>
  );
};
