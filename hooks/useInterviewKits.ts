"use client";

import { useCallback, useEffect, useState } from "react";
import { interviewKitsApi } from "@/lib/api";
import { InterviewKit } from "@/lib/api/types";

export const useInterviewKits = () => {
  const [kits, setKits] = useState<InterviewKit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await interviewKitsApi.listInterviewKits();
      setKits(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(async (id: string) => {
    await interviewKitsApi.deleteInterviewKit(id);
    setKits((current) =>
      current ? current.filter((kit) => kit.id !== id) : current,
    );
  }, []);

  return { kits, loading, error, reload: load, remove };
};
