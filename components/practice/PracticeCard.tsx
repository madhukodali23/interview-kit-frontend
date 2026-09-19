"use client";

import { Flashcard, Requirement } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PracticeCardProps {
  flashcard: Flashcard;
  revealed: boolean;
  onReveal: () => void;
  requirements: Requirement[];
}

export const PracticeCard = ({
  flashcard,
  revealed,
  onReveal,
  requirements,
}: PracticeCardProps) => (
  <Card
    key={flashcard.id}
    className={cn(
      "animate-fade-in w-full p-8 text-center shadow-lg sm:p-10",
    )}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {revealed ? "Answer" : "Question"}
    </p>
    <p
      key={revealed ? "back" : "front"}
      className="animate-fade-in mt-4 text-lg leading-relaxed font-medium text-foreground"
    >
      {revealed ? flashcard.back : flashcard.front}
    </p>

    {requirements.length > 0 && (
      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {requirements.map((requirement) => (
          <Badge
            key={requirement.id}
            tone={requirement.priority === "must" ? "brand" : "neutral"}
          >
            {requirement.text}
          </Badge>
        ))}
      </div>
    )}

    {!revealed && (
      <>
        <Button className="mt-8" size="lg" onClick={onReveal} autoFocus>
          Reveal answer
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Press Enter or Space to reveal
        </p>
      </>
    )}
  </Card>
);
