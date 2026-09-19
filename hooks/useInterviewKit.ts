"use client";

import { useCallback, useEffect, useState } from "react";
import {
  companyBriefApi,
  flashcardsApi,
  interviewKitsApi,
  questionsApi,
  regenerateApi,
  requirementsApi,
} from "@/lib/api";
import {
  CompanyBrief,
  InterviewKit,
  RegenerateSection,
  Requirement,
} from "@/lib/api/types";
import { QuestionInput } from "@/lib/api/questions";
import { FlashcardInput } from "@/lib/api/flashcards";

/**
 * Owns a single interview kit's state and every mutation the workspace can
 * perform on it. Every mutation replaces local state with the backend's
 * returned kit (the source of truth), and tracks which single action is in
 * flight via `actionKey` so the UI can disable/label just that control.
 */
export const useInterviewKit = (kitId: string) => {
  const [kit, setKit] = useState<InterviewKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await interviewKitsApi.getInterviewKit(kitId);
      setKit(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [kitId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = useCallback(
    async (key: string, action: () => Promise<InterviewKit>) => {
      setActionKey(key);

      try {
        const updated = await action();
        setKit(updated);
        return updated;
      } finally {
        setActionKey((current) => (current === key ? null : current));
      }
    },
    [],
  );

  return {
    kit,
    loading,
    error,
    reload: load,
    actionKey,
    isMutating: (key: string) => actionKey === key,

    updateCompanyBrief: (updates: Partial<CompanyBrief>) =>
      run("company-brief", () =>
        companyBriefApi.editCompanyBrief(kitId, updates),
      ),

    editRequirement: (
      requirementId: string,
      updates: Partial<Pick<Requirement, "text" | "category" | "priority">>,
    ) =>
      run(`requirement:${requirementId}`, () =>
        requirementsApi.editRequirement(kitId, requirementId, updates),
      ),

    addQuestion: (input: QuestionInput) =>
      run("add-question", () => questionsApi.addQuestion(kitId, input)),

    editQuestion: (questionId: string, updates: Partial<QuestionInput>) =>
      run(`question:${questionId}`, () =>
        questionsApi.editQuestion(kitId, questionId, updates),
      ),

    deleteQuestion: (questionId: string) =>
      run(`question:${questionId}`, () =>
        questionsApi.deleteQuestion(kitId, questionId),
      ),

    reorderQuestions: (questionIds: string[]) =>
      run("reorder-questions", () =>
        questionsApi.reorderQuestions(kitId, questionIds),
      ),

    addFlashcard: (input: FlashcardInput) =>
      run("add-flashcard", () => flashcardsApi.addFlashcard(kitId, input)),

    editFlashcard: (
      flashcardId: string,
      updates: Partial<FlashcardInput>,
    ) =>
      run(`flashcard:${flashcardId}`, () =>
        flashcardsApi.editFlashcard(kitId, flashcardId, updates),
      ),

    deleteFlashcard: (flashcardId: string) =>
      run(`flashcard:${flashcardId}`, () =>
        flashcardsApi.deleteFlashcard(kitId, flashcardId),
      ),

    reorderFlashcards: (flashcardIds: string[]) =>
      run("reorder-flashcards", () =>
        flashcardsApi.reorderFlashcards(kitId, flashcardIds),
      ),

    regenerate: (section: RegenerateSection) =>
      run(`regenerate:${section}`, () =>
        regenerateApi.regenerateSection(kitId, section),
      ),
  };
};

export type UseInterviewKitResult = ReturnType<typeof useInterviewKit>;
