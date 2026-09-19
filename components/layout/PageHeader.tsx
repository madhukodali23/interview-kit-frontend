import { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
}

export const PageHeader = ({
  title,
  description,
  actions,
  eyebrow,
}: PageHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
    <div className="min-w-0">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-2">
        {actions}
      </div>
    )}
  </div>
);
