"use client";

import Link from "next/link";
import { useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { KitCardSkeleton } from "@/components/ui/LoadingState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { KitCard } from "@/components/kit/KitCard";
import { useInterviewKits } from "@/hooks/useInterviewKits";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { IconPlus, IconSparkles } from "@/components/ui/Icons";

function DashboardContent() {
  const { kits, loading, error, reload, remove } = useInterviewKits();
  const { showToast } = useToast();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const pendingKit = kits?.find((kit) => kit.id === pendingDeleteId);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    setDeleting(true);

    try {
      await remove(pendingDeleteId);
      showToast({ tone: "success", title: "Interview kit deleted" });
      setPendingDeleteId(null);
    } catch (deleteError) {
      showToast({
        tone: "error",
        title: "Couldn't delete kit",
        description: getFriendlyErrorMessage(deleteError),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Your interview kits"
          description="Generate a new kit or pick up where you left off."
          actions={
            <Link href="/kits/new">
              <Button leftIcon={<IconPlus className="h-4 w-4" />}>
                Create interview kit
              </Button>
            </Link>
          }
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <KitCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              message={getFriendlyErrorMessage(error)}
              onRetry={reload}
            />
          ) : !kits || kits.length === 0 ? (
            <EmptyState
              icon={<IconSparkles className="h-5 w-5" />}
              title="No interview kits yet"
              description="Create your first kit from a job description and a company URL — we'll research the company and build the rest."
              action={
                <Link href="/kits/new">
                  <Button leftIcon={<IconPlus className="h-4 w-4" />}>
                    Create your first kit
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kits.map((kit) => (
                <KitCard
                  key={kit.id}
                  kit={kit}
                  onDelete={() => setPendingDeleteId(kit.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this interview kit?"
        description={`This permanently removes "${
          pendingKit?.role.title ?? "this kit"
        }", including all questions, flashcards, and practice progress. This can't be undone.`}
        confirmLabel="Delete kit"
        tone="danger"
        loading={deleting}
      />
    </>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col">
        <DashboardContent />
      </div>
    </RequireAuth>
  );
}
