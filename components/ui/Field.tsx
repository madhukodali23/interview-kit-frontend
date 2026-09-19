import {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

const FieldShell = ({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: FieldShellProps) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-baseline justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span
            className="ml-0.5 text-danger-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
      {hint && !error && (
        <span className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
    {children}
    {error && (
      <p
        role="alert"
        className="text-xs font-medium text-danger-500"
      >
        {error}
      </p>
    )}
  </div>
);

const inputBaseClasses =
  "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none disabled:cursor-not-allowed disabled:opacity-60";

interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
  error?: string;
}

export const InputField = forwardRef<
  HTMLInputElement,
  InputFieldProps
>(({ label, hint, error, required, id, className, ...props }, ref) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
    >
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          inputBaseClasses,
          error
            ? "border-danger-500 focus-visible:outline-danger-500"
            : "border-border-strong focus-visible:outline-brand-500",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
});

InputField.displayName = "InputField";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
  error?: string;
  charCount?: number;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      hint,
      error,
      required,
      id,
      className,
      charCount,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FieldShell
        label={label}
        htmlFor={fieldId}
        hint={
          hint ??
          (charCount !== undefined
            ? `${charCount.toLocaleString()} characters`
            : undefined)
        }
        error={error}
        required={required}
      >
        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn(
            inputBaseClasses,
            "min-h-[10rem] resize-y leading-relaxed",
            error
              ? "border-danger-500 focus-visible:outline-danger-500"
              : "border-border-strong focus-visible:outline-brand-500",
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);

TextareaField.displayName = "TextareaField";
