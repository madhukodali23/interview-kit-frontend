import { apiDelete, apiPatch, apiPost, apiPut } from "./client";
import { Flashcard, InterviewKit } from "./types";

export interface FlashcardInput {
  id: string;
  questionId: string;
  front: string;
  back: string;
  requirementIds: string[];
  isPinned?: boolean;
}

export const addFlashcard = (
  kitId: string,
  flashcard: FlashcardInput,
) =>
  apiPost<InterviewKit>(
    `/api/interview-kits/${kitId}/flashcards`,
    flashcard,
  );

export const editFlashcard = (
  kitId: string,
  flashcardId: string,
  updates: Partial<FlashcardInput>,
) =>
  apiPatch<InterviewKit>(
    `/api/interview-kits/${kitId}/flashcards/${flashcardId}`,
    updates,
  );

export const deleteFlashcard = (
  kitId: string,
  flashcardId: string,
) =>
  apiDelete<InterviewKit>(
    `/api/interview-kits/${kitId}/flashcards/${flashcardId}`,
  );

export const reorderFlashcards = (
  kitId: string,
  flashcardIds: string[],
) =>
  apiPut<InterviewKit>(
    `/api/interview-kits/${kitId}/flashcards/reorder`,
    { flashcardIds },
  );

export type { Flashcard };
