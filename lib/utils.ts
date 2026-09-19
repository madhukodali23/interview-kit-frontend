export const cn = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");

/**
 * Client-generated IDs for user-created questions/flashcards, since the
 * backend's add-question/add-flashcard endpoints expect the caller to
 * supply the `id` (see backend/src/services/interviewKit.service.ts).
 */
export const generateId = (prefix: string): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

export const formatDate = (value?: string): string => {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`,
): string => `${count} ${count === 1 ? singular : plural}`;

export const truncate = (value: string, maxLength: number): string =>
  value.length > maxLength
    ? `${value.slice(0, maxLength - 1).trimEnd()}…`
    : value;

export const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
