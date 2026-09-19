import { apiPost } from "./client";
import { InterviewKit, RegenerateSection } from "./types";

export const regenerateSection = (
  kitId: string,
  section: RegenerateSection,
) =>
  apiPost<InterviewKit>(
    `/api/interview-kits/${kitId}/regenerate/${section}`,
  );
