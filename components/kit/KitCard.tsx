import Link from "next/link";
import { InterviewKit } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  IconBookOpen,
  IconBuilding,
  IconCalendar,
  IconChevronRight,
  IconClipboardList,
  IconTrash,
} from "@/components/ui/Icons";
import { formatDate, getHostname } from "@/lib/utils";

interface KitCardProps {
  kit: InterviewKit;
  onDelete: () => void;
}

export const KitCard = ({ kit, onDelete }: KitCardProps) => {
  const mustRequirementIds = new Set(
    kit.role.requirements
      .filter((requirement) => requirement.priority === "must")
      .map((requirement) => requirement.id),
  );

  const coveredMust = kit.coverage.filter(
    (item) => item.covered && mustRequirementIds.has(item.requirementId),
  ).length;

  return (
    <Card className="group relative flex flex-col p-5 transition hover:border-brand-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/kits/${kit.id}`}
          className="min-w-0 focus-visible:outline-none"
        >
          <h3 className="truncate text-sm font-semibold text-foreground">
            {kit.role.title || "Untitled role"}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <IconBuilding className="h-3.5 w-3.5 shrink-0" />
            {getHostname(kit.source.companyUrl)}
          </p>
        </Link>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            onDelete();
          }}
          aria-label={`Delete ${kit.role.title || "interview kit"}`}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-danger-100 hover:text-danger-500"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </div>

      <Link
        href={`/kits/${kit.id}`}
        tabIndex={-1}
        className="mt-4 flex flex-1 flex-col focus-visible:outline-none"
      >
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="brand">
            <IconClipboardList className="h-3 w-3" />
            {kit.questions.length} questions
          </Badge>
          <Badge tone="neutral">
            <IconBookOpen className="h-3 w-3" />
            {kit.flashcards.length} flashcards
          </Badge>
          <Badge tone="neutral">
            <IconCalendar className="h-3 w-3" />
            {kit.schedule.length} day{kit.schedule.length === 1 ? "" : "s"}
          </Badge>
        </div>

        {mustRequirementIds.size > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {coveredMust}/{mustRequirementIds.size} must-have
            requirements covered
          </p>
        )}

        <div className="mt-4 flex flex-1 items-end justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            Created {formatDate(kit.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:underline">
            Open
            <IconChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </Card>
  );
};
