"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  IconBookOpen,
  IconBuilding,
  IconCalendar,
  IconClipboardList,
  IconListChecks,
  IconSparkles,
  IconTarget,
} from "@/components/ui/Icons";

const FEATURES = [
  {
    icon: IconBuilding,
    title: "Real company research",
    description:
      "We crawl the company's own site and surface what's actually there — overview, products, culture, and engineering signals.",
  },
  {
    icon: IconListChecks,
    title: "Requirement coverage",
    description:
      "Every must-have requirement from the job description is tracked and guaranteed a matching question.",
  },
  {
    icon: IconClipboardList,
    title: "Categorized questions",
    description:
      "Technical, behavioral, system design, and company-fit questions, each linked back to the requirement it tests.",
  },
  {
    icon: IconBookOpen,
    title: "Practice mode",
    description:
      "Work through flashcards one at a time, rate your confidence, and let low-confidence cards resurface first.",
  },
  {
    icon: IconCalendar,
    title: "A real schedule",
    description:
      "A deterministic day-by-day plan sized to exactly the number of days you have before the interview.",
  },
  {
    icon: IconTarget,
    title: "Editable, not fixed",
    description:
      "Edit, pin, reorder, or regenerate any section — your edits and pinned items are preserved.",
  },
];

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <IconSparkles className="h-3.5 w-3.5" />
              Personalized interview preparation
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Turn a job posting into a complete interview prep kit
            </h1>
            <p className="mt-4 text-balance text-base text-muted-foreground sm:text-lg">
              Paste a job description and a company URL. We research the
              company, extract the real requirements, and build questions,
              flashcards, and a study schedule around them &mdash; grounded
              in what we actually find, never invented.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Create your first kit</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <feature.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        AI Interview Prep Kit
      </footer>
    </div>
  );
}
