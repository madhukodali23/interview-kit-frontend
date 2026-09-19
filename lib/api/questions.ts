import { apiDelete, apiPatch, apiPost, apiPut } from "./client";
import { InterviewKit, Question } from "./types";

export interface QuestionInput {
  id: string;
  question: string;
  category: Question["category"];
  difficulty: Question["difficulty"];
  requirementIds: string[];
  isPinned?: boolean;
}

export const addQuestion = (kitId: string, question: QuestionInput) =>
  apiPost<InterviewKit>(
    `/api/interview-kits/${kitId}/questions`,
    question,
  );

export const editQuestion = (
  kitId: string,
  questionId: string,
  updates: Partial<QuestionInput>,
) =>
  apiPatch<InterviewKit>(
    `/api/interview-kits/${kitId}/questions/${questionId}`,
    updates,
  );

export const deleteQuestion = (kitId: string, questionId: string) =>
  apiDelete<InterviewKit>(
    `/api/interview-kits/${kitId}/questions/${questionId}`,
  );

export const reorderQuestions = (
  kitId: string,
  questionIds: string[],
) =>
  apiPut<InterviewKit>(
    `/api/interview-kits/${kitId}/questions/reorder`,
    { questionIds },
  );
