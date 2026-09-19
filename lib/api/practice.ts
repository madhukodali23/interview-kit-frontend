import { apiGet, apiPost } from "./client";
import {
  PracticeReviewInput,
  PracticeReviewResult,
  PracticeSession,
} from "./types";

export const getPracticeSession = (kitId: string) =>
  apiGet<PracticeSession>(`/api/interview-kits/${kitId}/practice`);

export const submitPracticeReview = (
  kitId: string,
  flashcardId: string,
  input: PracticeReviewInput,
) =>
  apiPost<PracticeReviewResult>(
    `/api/interview-kits/${kitId}/practice/${flashcardId}/review`,
    input,
  );
