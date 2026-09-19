import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { CreateInterviewKitInput, InterviewKit } from "./types";

export const createInterviewKit = (input: CreateInterviewKitInput) =>
  apiPost<InterviewKit>("/api/interview-kits", input);

export const listInterviewKits = () =>
  apiGet<InterviewKit[]>("/api/interview-kits");

export const getInterviewKit = (id: string) =>
  apiGet<InterviewKit>(`/api/interview-kits/${id}`);

export const updateInterviewKit = (
  id: string,
  updates: Partial<InterviewKit>,
) => apiPut<InterviewKit>(`/api/interview-kits/${id}`, updates);

export const deleteInterviewKit = (id: string) =>
  apiDelete<void>(`/api/interview-kits/${id}`);
