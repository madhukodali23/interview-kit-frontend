"use client";

import { useCallback, useEffect, useState } from "react";
import { interviewKitsApi, practiceApi } from "@/lib/api";
import {
  Flashcard,
  PracticeConfidence,
  PracticeSummary,
  Requirement,
} from "@/lib/api/types";

/**
 * Drives one card at a time. After every review, `currentCard` becomes
 * whatever the backend's `next` pointer says (see
 * backend/src/services/practice.service.ts submitPracticeReview), which is
 * re-prioritized after each submission — never-practiced and low-confidence
 * cards first, "covered" cards last. This is what actually implements
 * "prioritize least-confident items", not a fixed local sequence.
 */
export const usePractice = (kitId: string) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [summary, setSummary] = useState<PracticeSummary | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [session, kit] = await Promise.all([
        practiceApi.getPracticeSession(kitId),
        interviewKitsApi.getInterviewKit(kitId),
      ]);

      setCards(session.cards);
      setSummary(session.summary);
      setCurrentCard(session.cards[0] ?? null);
      setRequirements(kit.role.requirements);
      setReviewedIds(new Set());
      setRevealed(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [kitId]);

  useEffect(() => {
    load();
  }, [load]);

  const reveal = useCallback(() => setRevealed(true), []);

  const submitReview = useCallback(
    async (confidence: PracticeConfidence, covered: boolean) => {
      if (!currentCard || submitting) {
        return;
      }

      setSubmitting(true);

      try {
        const result = await practiceApi.submitPracticeReview(
          kitId,
          currentCard.id,
          { confidence, covered },
        );

        setSummary(result.summary);
        setCards((current) =>
          current.map((card) =>
            card.id === result.flashcard.id ? result.flashcard : card,
          ),
        );
        setReviewedIds((current) => {
          const next = new Set(current);
          next.add(result.flashcard.id);
          return next;
        });
        setCurrentCard(result.next);
        setRevealed(false);
      } finally {
        setSubmitting(false);
      }
    },
    [kitId, currentCard, submitting],
  );

  return {
    cards,
    currentCard,
    summary,
    requirements,
    reviewedIds,
    revealed,
    loading,
    error,
    submitting,
    reveal,
    submitReview,
    reload: load,
    isEmpty: !loading && !error && cards.length === 0,
    isComplete:
      !loading && !error && cards.length > 0 && currentCard === null,
  };
};
