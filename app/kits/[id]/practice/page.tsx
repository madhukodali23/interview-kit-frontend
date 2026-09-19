"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageLoading } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressIndicator";
import { PracticeCard } from "@/components/practice/PracticeCard";
import { ConfidenceButtons } from "@/components/practice/ConfidenceButtons";
import { usePractice } from "@/hooks/usePractice";
import {
  IconBookOpen,
  IconChevronLeft,
  IconTarget,
} from "@/components/ui/Icons";
import { getFriendlyErrorMessage } from "@/lib/errors";

function PracticeContent({ kitId }: { kitId: string }) {
  const {
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
    isEmpty,
    isComplete,
    reload,
  } = usePractice(kitId);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!currentCard || submitting) {
        return;
      }

      if (!revealed && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        reveal();
        return;
      }

      if (revealed) {
        if (event.key === "1") submitReview("low", false);
        if (event.key === "2") submitReview("medium", false);
        if (event.key === "3") submitReview("high", true);
      }
    },
    [currentCard, revealed, submitting, reveal, submitReview],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return <PageLoading label="Loading practice session…" />;
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16">
        <ErrorState
          message={getFriendlyErrorMessage(error)}
          onRetry={reload}
        />
      </main>
    );
  }

  if (isEmpty) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16">
        <EmptyState
          icon={<IconBookOpen className="h-5 w-5" />}
          title="No flashcards to practice"
          description="Add or generate flashcards for this kit first."
          action={
            <Link href={`/kits/${kitId}`}>
              <Button>Back to kit</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const linkedRequirements = currentCard
    ? requirements.filter((requirement) =>
        currentCard.requirementIds.includes(requirement.id),
      )
    : [];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
      <Link
        href={`/kits/${kitId}`}
        className="mb-6 inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <IconChevronLeft className="h-4 w-4" />
        Back to kit
      </Link>

      {summary && (
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm">
            <span className="font-medium text-foreground">
              Reviewed {reviewedIds.size} of {cards.length}
            </span>
            <span className="text-muted-foreground">
              {summary.covered} covered · {summary.uncovered} uncovered
            </span>
          </div>
          <ProgressBar
            value={(reviewedIds.size / Math.max(cards.length, 1)) * 100}
          />
        </div>
      )}

      {isComplete || !currentCard ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-100 text-success-500">
            <IconTarget className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Session complete
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ve reviewed every flashcard in this kit.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reload}>
              Practice again
            </Button>
            <Link href={`/kits/${kitId}`}>
              <Button>Back to kit</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <PracticeCard
            flashcard={currentCard}
            revealed={revealed}
            onReveal={reveal}
            requirements={linkedRequirements}
          />
          {revealed && (
            <ConfidenceButtons
              onSelect={submitReview}
              disabled={submitting}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default function PracticePage() {
  const params = useParams<{ id: string }>();
  const kitId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col">
        <Header />
        {kitId && <PracticeContent kitId={kitId} />}
      </div>
    </RequireAuth>
  );
}
