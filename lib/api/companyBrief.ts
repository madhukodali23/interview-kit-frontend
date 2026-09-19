import { apiPatch } from "./client";
import { CompanyBrief, InterviewKit } from "./types";

export const editCompanyBrief = (
  kitId: string,
  updates: Partial<CompanyBrief>,
) =>
  apiPatch<InterviewKit>(
    `/api/interview-kits/${kitId}/company-brief`,
    updates,
  );
