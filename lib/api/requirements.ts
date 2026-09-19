import { apiPatch } from "./client";
import { InterviewKit, Requirement } from "./types";

export const editRequirement = (
  kitId: string,
  requirementId: string,
  updates: Partial<
    Pick<Requirement, "text" | "category" | "priority">
  >,
) =>
  apiPatch<InterviewKit>(
    `/api/interview-kits/${kitId}/requirements/${requirementId}`,
    updates,
  );
