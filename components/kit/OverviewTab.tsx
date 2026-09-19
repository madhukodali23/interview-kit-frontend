import {
  CompanyBrief,
  InterviewKit,
  RegenerateSection,
} from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/Card";
import { CompanyBriefSection } from "@/components/kit/CompanyBriefSection";
import { RegenerateButton } from "@/components/kit/RegenerateButton";
import { InlineAlert } from "@/components/ui/ErrorState";
import { IconBuilding, IconExternalLink } from "@/components/ui/Icons";
import { getHostname } from "@/lib/utils";

interface OverviewTabProps {
  kit: InterviewKit;
  updateCompanyBrief: (updates: Partial<CompanyBrief>) => Promise<unknown>;
  regenerate: (section: RegenerateSection) => Promise<unknown>;
  isMutating: (key: string) => boolean;
}

export const OverviewTab = ({
  kit,
  updateCompanyBrief,
  regenerate,
  isMutating,
}: OverviewTabProps) => {
  const mustRequirementIds = new Set(
    kit.role.requirements
      .filter((requirement) => requirement.priority === "must")
      .map((requirement) => requirement.id),
  );

  const coveredMust = kit.coverage.filter(
    (item) => item.covered && mustRequirementIds.has(item.requirementId),
  ).length;

  return (
    <div className="flex flex-col gap-5">
      {kit.warnings && kit.warnings.length > 0 && (
        <div className="flex flex-col gap-2">
          {kit.warnings.map((warning, index) => (
            <InlineAlert key={index} tone="warning" message={warning} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Questions" value={kit.questions.length} />
        <StatCard label="Flashcards" value={kit.flashcards.length} />
        <StatCard label="Prep days" value={kit.schedule.length} />
        <StatCard
          label="Must-haves covered"
          value={`${coveredMust}/${mustRequirementIds.size}`}
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <IconBuilding className="h-4 w-4 text-brand-600" />
            Source
          </p>
          <a
            href={kit.source.companyUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-1 text-sm text-brand-600 hover:underline"
          >
            {getHostname(kit.source.companyUrl)}
            <IconExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <RegenerateButton
          section="company-brief"
          label="Company brief"
          description="Re-researches the company and rebuilds the overview, industry, products, culture, and engineering fields. Manual edits are replaced by the new research."
          onRegenerate={regenerate}
          isMutating={isMutating("regenerate:company-brief")}
        />
      </div>

      <CompanyBriefSection
        companyBrief={kit.companyBrief}
        onSave={updateCompanyBrief}
        saving={isMutating("company-brief")}
      />
    </div>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Card className="p-4">
    <p className="text-2xl font-semibold text-foreground">{value}</p>
    <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
  </Card>
);
