"use client";

import { useState } from "react";
import { Button, ButtonVariant } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IconRefresh } from "@/components/ui/Icons";
import { RegenerateSection } from "@/lib/api/types";
import { useToast } from "@/context/ToastContext";
import { getFriendlyErrorMessage } from "@/lib/errors";

interface RegenerateButtonProps {
  section: RegenerateSection;
  label: string;
  description: string;
  onRegenerate: (section: RegenerateSection) => Promise<unknown>;
  isMutating: boolean;
  variant?: ButtonVariant;
}

/**
 * Confirms, then regenerates a single kit section. The backend preserves
 * any question/flashcard the user pinned or edited (see
 * backend/src/services/interviewKit.service.ts regenerateQuestions/
 * regenerateFlashcards) — the confirmation copy says so explicitly rather
 * than silently relying on it.
 */
export const RegenerateButton = ({
  section,
  label,
  description,
  onRegenerate,
  isMutating,
  variant = "outline",
}: RegenerateButtonProps) => {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = async () => {
    try {
      await onRegenerate(section);
      setOpen(false);
      showToast({ tone: "success", title: `${label} regenerated` });
    } catch (error) {
      showToast({
        tone: "error",
        title: `Couldn't regenerate ${label.toLowerCase()}`,
        description: getFriendlyErrorMessage(error),
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isMutating}
        leftIcon={<IconRefresh className="h-3.5 w-3.5" />}
      >
        Regenerate
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title={`Regenerate ${label.toLowerCase()}?`}
        description={description}
        confirmLabel="Regenerate"
        loading={isMutating}
      />
    </>
  );
};
