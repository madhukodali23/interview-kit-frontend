import { ApiError } from "./api/client";

/**
 * Maps the backend's structured error codes (see backend/src/errors/errorCodes.ts)
 * to end-user-friendly copy. Never surfaces raw backend messages/stack traces.
 */
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_REQUEST:
    "Please check the information you entered and try again.",
  UNAUTHORIZED: "You need to sign in to do that.",
  NOT_FOUND: "We couldn't find what you were looking for.",
  COMPANY_UNREACHABLE:
    "We couldn't reach that company's website. Double-check the URL and try again.",
  LLM_RATE_LIMITED:
    "Our AI service is busy right now. Please try again in a moment.",
  LLM_INVALID_RESPONSE:
    "The AI service returned something we couldn't use. Please try again.",
  LLM_UNAVAILABLE:
    "The AI service is temporarily unavailable. Please try again shortly.",
  KIT_VALIDATION_FAILED:
    "We couldn't build a valid interview kit from that input. Please try again.",
  COVERAGE_INCOMPLETE:
    "We couldn't generate questions covering every must-have requirement. Please try again.",
  DUPLICATE_REQUEST:
    "This request is already being processed. Please wait a moment.",
  EMAIL_ALREADY_REGISTERED:
    "An account with this email already exists.",
};

export const getFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return error.message;
    }

    if (error.code && ERROR_MESSAGES[error.code]) {
      return ERROR_MESSAGES[error.code];
    }

    return error.message || "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

/**
 * Errors worth telling the user "you can try again" for, as opposed to
 * something structurally wrong with their input.
 */
export const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) {
    return false;
  }

  return (
    error.status === 0 ||
    error.status >= 500 ||
    error.code === "LLM_RATE_LIMITED" ||
    error.code === "LLM_UNAVAILABLE" ||
    error.code === "DUPLICATE_REQUEST"
  );
};

export { ApiError };
