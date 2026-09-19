/**
 * Domain types mirroring the backend's exact response shapes
 * (backend/src/types/interviewKit/*, backend/src/repositories/interviewKit.model.ts).
 * Field names and casing intentionally match the API byte-for-byte.
 */

export type QuestionCategory =
  | "technical"
  | "behavioral"
  | "system-design"
  | "company-fit";

export type Difficulty = "easy" | "medium" | "hard";

export type Priority = "must" | "nice";

export type PracticeConfidence = "low" | "medium" | "high";

export type RegenerateSection =
  | "questions"
  | "flashcards"
  | "company-brief";

export interface User {
  id: string;
  email: string;
}

export interface Requirement {
  id: string;
  text: string;
  category: string;
  priority: Priority;
  isUserEdited?: boolean;
}

export interface Question {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  requirementIds: string[];
  isUserEdited?: boolean;
  isPinned?: boolean;
}

export interface FlashcardPracticeState {
  confidence: PracticeConfidence;
  covered: boolean;
  reviewCount: number;
  lastReviewedAt: string;
}

export interface Flashcard {
  id: string;
  questionId: string;
  front: string;
  back: string;
  requirementIds: string[];
  isUserEdited?: boolean;
  isPinned?: boolean;
  practice?: FlashcardPracticeState;
}

export interface ScheduleDay {
  day: number;
  focus: string;
  questionIds: string[];
  durationMinutes: number;
}

export interface CompanyBrief {
  overview: string;
  products: string[];
  industry: string;
  culture: string[];
  engineering: string[];
  isUserEdited?: boolean;
}

export interface CoverageItem {
  requirementId: string;
  covered: boolean;
}

export interface InterviewKit {
  id: string;
  source: {
    jobDescription: string;
    companyUrl: string;
  };
  companyBrief: CompanyBrief;
  role: {
    title: string;
    requirements: Requirement[];
  };
  questions: Question[];
  flashcards: Flashcard[];
  schedule: ScheduleDay[];
  coverage: CoverageItem[];
  warnings?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInterviewKitInput {
  jobDescription: string;
  companyUrl: string;
  days: number;
}

export interface PracticeSummary {
  total: number;
  reviewed: number;
  covered: number;
  uncovered: number;
  confidenceBreakdown: Record<PracticeConfidence, number>;
}

export interface PracticeSession {
  cards: Flashcard[];
  summary: PracticeSummary;
}

export interface PracticeReviewInput {
  confidence: PracticeConfidence;
  covered: boolean;
}

export interface PracticeReviewResult {
  flashcard: Flashcard;
  next: Flashcard | null;
  summary: PracticeSummary;
}
