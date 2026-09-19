"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField, TextareaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  ProgressBar,
  ProgressIndicator,
  ProgressStage,
} from "@/components/ui/ProgressIndicator";
import { IconSparkles } from "@/components/ui/Icons";
import { interviewKitsApi } from "@/lib/api";
import { getFriendlyErrorMessage, isRetryableError } from "@/lib/errors";
import { isValidUrl, MAX_DAYS, MIN_DAYS } from "@/lib/validation";

const STAGES: ProgressStage[] = [
  {
    label: "Analyzing job description",
    description: "Extracting the role, requirements, and priorities",
  },
  {
    label: "Researching the company",
    description: "Crawling the company's own site for real information",
  },
  {
    label: "Building the company brief",
    description: "Summarizing overview, products, culture, and engineering",
  },
  {
    label: "Generating interview questions",
    description: "Technical, behavioral, system design, and company-fit",
  },
  {
    label: "Checking requirement coverage",
    description: "Making sure every must-have requirement has a question",
  },
  {
    label: "Creating flashcards",
    description: "One per question, ready for focused practice",
  },
  {
    label: "Building your schedule",
    description: "A deterministic day-by-day preparation plan",
  },
];

const STAGE_INTERVAL_MS = 6000;
const SLOW_NOTICE_MS = 45000;

interface FieldErrors {
  jobDescription?: string;
  companyUrl?: string;
  days?: string;
}

type Mode = "form" | "generating" | "error";

function CreateKitContent() {
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [days, setDays] = useState(7);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [mode, setMode] = useState<Mode>("form");
  const [activeStage, setActiveStage] = useState(0);
  const [slowNotice, setSlowNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorRetryable, setErrorRetryable] = useState(false);

  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);
    };
  }, []);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (jobDescription.trim().length < 20) {
      errors.jobDescription =
        "Add a bit more detail — at least 20 characters.";
    }

    if (!isValidUrl(companyUrl)) {
      errors.companyUrl =
        "Enter a valid URL, e.g. https://www.example.com";
    }

    if (!Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
      errors.days = `Choose a number of days between ${MIN_DAYS} and ${MAX_DAYS}.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startGeneration = async () => {
    setMode("generating");
    setActiveStage(0);
    setSlowNotice(false);

    stageTimer.current = setInterval(() => {
      setActiveStage((current) =>
        Math.min(current + 1, STAGES.length - 1),
      );
    }, STAGE_INTERVAL_MS);

    slowTimer.current = setTimeout(
      () => setSlowNotice(true),
      SLOW_NOTICE_MS,
    );

    try {
      const kit = await interviewKitsApi.createInterviewKit({
        jobDescription: jobDescription.trim(),
        companyUrl: companyUrl.trim(),
        days,
      });

      if (stageTimer.current) clearInterval(stageTimer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);

      setActiveStage(STAGES.length);
      router.push(`/kits/${kit.id}`);
    } catch (error) {
      if (stageTimer.current) clearInterval(stageTimer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);

      setErrorMessage(getFriendlyErrorMessage(error));
      setErrorRetryable(isRetryableError(error));
      setMode("error");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    startGeneration();
  };

  if (mode === "generating") {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-16 text-center">
        <div className="animate-pulse-ring mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <IconSparkles className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Building your interview kit…
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          This usually takes 30–90 seconds. The steps below explain
          what&apos;s happening — they&apos;re shown for context, not
          as live backend progress.
        </p>

        <div className="mt-8 w-full">
          <ProgressBar
            value={((activeStage + 1) / STAGES.length) * 100}
          />
        </div>

        <Card className="mt-6 w-full p-2 text-left">
          <ProgressIndicator stages={STAGES} activeIndex={activeStage} />
        </Card>

        {slowNotice && (
          <p className="mt-4 text-xs text-muted-foreground">
            Still working — company research and AI generation can
            occasionally take a little longer than usual.
          </p>
        )}
      </main>
    );
  }

  if (mode === "error") {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16">
        <ErrorState
          title="We couldn't build your interview kit"
          message={errorMessage}
          onRetry={errorRetryable ? startGeneration : undefined}
          retryLabel="Try again"
        />
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setMode("form")}
        >
          Edit details instead
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="New kit"
        title="Create an interview kit"
        description="We'll research the company from its own website and build questions, flashcards, and a schedule around the job description — grounded only in what we actually find."
      />

      <Card className="mt-6">
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <TextareaField
              label="Job description"
              required
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              error={fieldErrors.jobDescription}
              placeholder="Paste the full job description here…"
              charCount={jobDescription.length}
            />

            <InputField
              label="Company URL"
              required
              type="url"
              value={companyUrl}
              onChange={(event) => setCompanyUrl(event.target.value)}
              error={fieldErrors.companyUrl}
              placeholder="https://www.example.com"
              hint="We'll crawl this site for real company information"
            />

            <InputField
              label="Preparation days"
              required
              type="number"
              min={MIN_DAYS}
              max={MAX_DAYS}
              value={days}
              onChange={(event) => {
                const value = event.target.valueAsNumber;
                setDays(Number.isNaN(value) ? 0 : value);
              }}
              error={fieldErrors.days}
              hint={`${MIN_DAYS}–${MAX_DAYS} days`}
            />

            <Button
              type="submit"
              size="lg"
              leftIcon={<IconSparkles className="h-4 w-4" />}
              className="justify-center"
            >
              Generate interview kit
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function CreateKitPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col">
        <Header />
        <CreateKitContent />
      </div>
    </RequireAuth>
  );
}
