"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageLoading } from "@/components/ui/LoadingState";
import { Badge } from "@/components/ui/Badge";
import { OverviewTab } from "@/components/kit/OverviewTab";
import { RequirementsTab } from "@/components/kit/RequirementsTab";
import { QuestionsTab } from "@/components/kit/QuestionsTab";
import { FlashcardsTab } from "@/components/kit/FlashcardsTab";
import { ScheduleTab } from "@/components/kit/ScheduleTab";
import {
  IconBookOpen,
  IconBuilding,
  IconCalendar,
  IconChevronLeft,
  IconClipboardList,
  IconListChecks,
  IconTarget,
} from "@/components/ui/Icons";
import { useInterviewKit } from "@/hooks/useInterviewKit";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { getHostname } from "@/lib/utils";

const TAB_ITEMS = [
  { value: "overview", label: "Overview", icon: <IconBuilding className="h-4 w-4" /> },
  { value: "requirements", label: "Requirements", icon: <IconListChecks className="h-4 w-4" /> },
  { value: "questions", label: "Questions", icon: <IconClipboardList className="h-4 w-4" /> },
  { value: "flashcards", label: "Flashcards", icon: <IconBookOpen className="h-4 w-4" /> },
  { value: "schedule", label: "Schedule", icon: <IconCalendar className="h-4 w-4" /> },
];

function WorkspaceContent({ kitId }: { kitId: string }) {
  const {
    kit,
    loading,
    error,
    reload,
    isMutating,
    updateCompanyBrief,
    editRequirement,
    addQuestion,
    editQuestion,
    deleteQuestion,
    reorderQuestions,
    addFlashcard,
    editFlashcard,
    deleteFlashcard,
    reorderFlashcards,
    regenerate,
  } = useInterviewKit(kitId);

  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return <PageLoading label="Loading your interview kit…" />;
  }

  if (error || !kit) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <ErrorState
          title="Couldn't load this interview kit"
          message={getFriendlyErrorMessage(error)}
          onRetry={reload}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <IconChevronLeft className="h-4 w-4" />
        All kits
      </Link>

      <PageHeader
        eyebrow={getHostname(kit.source.companyUrl)}
        title={kit.role.title || "Untitled role"}
        description={`${kit.questions.length} questions · ${kit.flashcards.length} flashcards · ${kit.schedule.length}-day plan`}
        actions={
          <>
            {kit.warnings && kit.warnings.length > 0 && (
              <Badge tone="warning">{kit.warnings.length} notice(s)</Badge>
            )}
            <Link href={`/kits/${kit.id}/practice`}>
              <Button
                variant="secondary"
                leftIcon={<IconTarget className="h-4 w-4" />}
                disabled={kit.flashcards.length === 0}
              >
                Practice
              </Button>
            </Link>
          </>
        }
      />

      <div className="mt-6">
        <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mt-6">
        <TabPanel value="overview" activeValue={activeTab}>
          <OverviewTab
            kit={kit}
            updateCompanyBrief={updateCompanyBrief}
            regenerate={regenerate}
            isMutating={isMutating}
          />
        </TabPanel>

        <TabPanel value="requirements" activeValue={activeTab}>
          <RequirementsTab
            kit={kit}
            onEdit={editRequirement}
            isMutating={isMutating}
          />
        </TabPanel>

        <TabPanel value="questions" activeValue={activeTab}>
          <QuestionsTab
            kit={kit}
            addQuestion={addQuestion}
            editQuestion={editQuestion}
            deleteQuestion={deleteQuestion}
            reorderQuestions={reorderQuestions}
            regenerate={regenerate}
            isMutating={isMutating}
          />
        </TabPanel>

        <TabPanel value="flashcards" activeValue={activeTab}>
          <FlashcardsTab
            kit={kit}
            addFlashcard={addFlashcard}
            editFlashcard={editFlashcard}
            deleteFlashcard={deleteFlashcard}
            reorderFlashcards={reorderFlashcards}
            regenerate={regenerate}
            isMutating={isMutating}
          />
        </TabPanel>

        <TabPanel value="schedule" activeValue={activeTab}>
          <ScheduleTab kit={kit} />
        </TabPanel>
      </div>
    </main>
  );
}

export default function KitWorkspacePage() {
  const params = useParams<{ id: string }>();
  const kitId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col">
        <Header />
        {kitId && <WorkspaceContent kitId={kitId} />}
      </div>
    </RequireAuth>
  );
}
