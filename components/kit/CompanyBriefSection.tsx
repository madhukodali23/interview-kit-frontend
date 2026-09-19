"use client";

import { useState } from "react";
import { CompanyBrief } from "@/lib/api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { IconBuilding, IconCheck, IconPencil } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";

const NOT_AVAILABLE = "Not available from the provided sources.";

const isMissing = (value?: string) =>
  !value || value.trim().length === 0 || value.trim() === NOT_AVAILABLE;

const toLines = (items: string[]) => items.join("\n");
const fromLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

interface CompanyBriefSectionProps {
  companyBrief: CompanyBrief;
  onSave: (updates: Partial<CompanyBrief>) => Promise<unknown>;
  saving: boolean;
}

export const CompanyBriefSection = ({
  companyBrief,
  onSave,
  saving,
}: CompanyBriefSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [overview, setOverview] = useState(companyBrief.overview);
  const [industry, setIndustry] = useState(companyBrief.industry);
  const [products, setProducts] = useState(
    toLines(companyBrief.products),
  );
  const [culture, setCulture] = useState(toLines(companyBrief.culture));
  const [engineering, setEngineering] = useState(
    toLines(companyBrief.engineering),
  );
  const { showToast } = useToast();

  const startEditing = () => {
    setOverview(companyBrief.overview);
    setIndustry(companyBrief.industry);
    setProducts(toLines(companyBrief.products));
    setCulture(toLines(companyBrief.culture));
    setEngineering(toLines(companyBrief.engineering));
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await onSave({
        overview: overview.trim(),
        industry: industry.trim(),
        products: fromLines(products),
        culture: fromLines(culture),
        engineering: fromLines(engineering),
      });
      setEditing(false);
      showToast({ tone: "success", title: "Company brief updated" });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't save company brief",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit company brief</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TextareaField
            label="Overview"
            value={overview}
            onChange={(event) => setOverview(event.target.value)}
            className="min-h-24"
          />
          <InputField
            label="Industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          />
          <TextareaField
            label="Products"
            hint="One per line"
            value={products}
            onChange={(event) => setProducts(event.target.value)}
            className="min-h-20"
          />
          <TextareaField
            label="Culture"
            hint="One per line"
            value={culture}
            onChange={(event) => setCulture(event.target.value)}
            className="min-h-20"
          />
          <TextareaField
            label="Engineering"
            hint="One per line"
            value={engineering}
            onChange={(event) => setEngineering(event.target.value)}
            className="min-h-20"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              leftIcon={<IconCheck className="h-4 w-4" />}
            >
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuilding className="h-4 w-4 text-brand-600" />
          Company overview
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={startEditing}
          leftIcon={<IconPencil className="h-3.5 w-3.5" />}
        >
          Edit
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Overview
          </p>
          <p
            className={
              isMissing(companyBrief.overview)
                ? "text-sm italic text-muted-foreground"
                : "text-sm leading-relaxed text-foreground"
            }
          >
            {isMissing(companyBrief.overview)
              ? NOT_AVAILABLE
              : companyBrief.overview}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Industry
          </p>
          <p
            className={
              isMissing(companyBrief.industry)
                ? "text-sm italic text-muted-foreground"
                : "text-sm text-foreground"
            }
          >
            {isMissing(companyBrief.industry)
              ? NOT_AVAILABLE
              : companyBrief.industry}
          </p>
        </div>
        <BriefList title="Products" items={companyBrief.products} />
        <BriefList title="Culture" items={companyBrief.culture} />
        <BriefList
          title="Engineering"
          items={companyBrief.engineering}
        />
      </CardContent>
    </Card>
  );
};

const BriefList = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div>
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </p>
    {items.length === 0 ? (
      <p className="text-sm italic text-muted-foreground">
        {NOT_AVAILABLE}
      </p>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <Badge key={index} tone="neutral">
            {item}
          </Badge>
        ))}
      </div>
    )}
  </div>
);
