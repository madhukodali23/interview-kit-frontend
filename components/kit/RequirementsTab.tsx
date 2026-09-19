"use client";

import { useState } from "react";
import { InterviewKit, Priority, Requirement } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCheck, IconListChecks, IconPencil } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

type RequirementUpdates = Partial<
  Pick<Requirement, "text" | "category" | "priority">
>;

interface RequirementsTabProps {
  kit: InterviewKit;
  onEdit: (
    requirementId: string,
    updates: RequirementUpdates,
  ) => Promise<unknown>;
  isMutating: (key: string) => boolean;
}

export const RequirementsTab = ({
  kit,
  onEdit,
  isMutating,
}: RequirementsTabProps) => {
  if (kit.role.requirements.length === 0) {
    return (
      <EmptyState
        icon={<IconListChecks className="h-5 w-5" />}
        title="No requirements found"
        description="We couldn't extract any requirements from this job description."
      />
    );
  }

  const coverageMap = new Map(
    kit.coverage.map((item) => [item.requirementId, item.covered]),
  );

  return (
    <div className="flex flex-col gap-3">
      {kit.role.requirements.map((requirement) => (
        <RequirementRow
          key={requirement.id}
          requirement={requirement}
          covered={coverageMap.get(requirement.id) ?? false}
          onEdit={onEdit}
          saving={isMutating(`requirement:${requirement.id}`)}
        />
      ))}
    </div>
  );
};

const RequirementRow = ({
  requirement,
  covered,
  onEdit,
  saving,
}: {
  requirement: Requirement;
  covered: boolean;
  onEdit: RequirementsTabProps["onEdit"];
  saving: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(requirement.text);
  const [category, setCategory] = useState(requirement.category);
  const [priority, setPriority] = useState<Priority>(
    requirement.priority,
  );
  const { showToast } = useToast();

  const startEditing = () => {
    setText(requirement.text);
    setCategory(requirement.category);
    setPriority(requirement.priority);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await onEdit(requirement.id, {
        text: text.trim(),
        category: category.trim(),
        priority,
      });
      setEditing(false);
      showToast({ tone: "success", title: "Requirement updated" });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Couldn't update requirement",
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  if (editing) {
    return (
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <InputField
            label="Requirement"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Priority
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={priority === "must" ? "primary" : "outline"}
                  onClick={() => setPriority("must")}
                >
                  Must-have
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={priority === "nice" ? "primary" : "outline"}
                  onClick={() => setPriority("nice")}
                >
                  Nice-to-have
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              loading={saving}
              leftIcon={<IconCheck className="h-3.5 w-3.5" />}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex items-start justify-between gap-3 p-4",
        requirement.priority === "must" &&
          !covered &&
          "border-warning-500/40",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{requirement.text}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{requirement.category}</Badge>
          <Badge tone={requirement.priority === "must" ? "brand" : "neutral"}>
            {requirement.priority === "must"
              ? "Must-have"
              : "Nice-to-have"}
          </Badge>
          <Badge tone={covered ? "success" : "warning"}>
            {covered ? "Covered" : "Uncovered"}
          </Badge>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit requirement: ${requirement.text}`}
        onClick={startEditing}
      >
        <IconPencil className="h-4 w-4" />
      </Button>
    </Card>
  );
};
