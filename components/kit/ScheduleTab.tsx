import { InterviewKit } from "@/lib/api/types";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCalendar, IconClock } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface ScheduleTabProps {
  kit: InterviewKit;
}

export const ScheduleTab = ({ kit }: ScheduleTabProps) => {
  if (kit.schedule.length === 0) {
    return (
      <EmptyState
        icon={<IconCalendar className="h-5 w-5" />}
        title="No schedule yet"
        description="A schedule appears once questions have been generated."
      />
    );
  }

  const questionMap = new Map(
    kit.questions.map((question) => [question.id, question]),
  );

  const mustRequirementIds = new Set(
    kit.role.requirements
      .filter((requirement) => requirement.priority === "must")
      .map((requirement) => requirement.id),
  );

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        title={`Schedule (${kit.schedule.length} day${
          kit.schedule.length === 1 ? "" : "s"
        })`}
        description="A deterministic day-by-day plan built from your questions."
      />

      <div className="flex flex-col gap-3">
        {kit.schedule.map((day) => {
          const dayQuestions = day.questionIds
            .map((id) => questionMap.get(id))
            .filter((question): question is NonNullable<typeof question> =>
              Boolean(question),
            );

          const hasMust = dayQuestions.some((question) =>
            question.requirementIds.some((id) => mustRequirementIds.has(id)),
          );

          return (
            <Card
              key={day.day}
              className={cn("p-5", hasMust && "border-brand-200")}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                    {day.day}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {day.focus}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconClock className="h-3 w-3" />
                      {day.durationMinutes} minutes
                    </p>
                  </div>
                </div>
                {hasMust && (
                  <Badge tone="brand">Includes must-haves</Badge>
                )}
              </div>

              {dayQuestions.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  {dayQuestions.map((question) => (
                    <li
                      key={question.id}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                          question.requirementIds.some((id) =>
                            mustRequirementIds.has(id),
                          )
                            ? "bg-brand-500"
                            : "bg-border-strong",
                        )}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        {question.question}
                      </span>
                      <Badge tone="neutral" className="shrink-0 capitalize">
                        {question.difficulty}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                  No questions scheduled for this day.
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
