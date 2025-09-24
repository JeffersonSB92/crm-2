"use client";

import { useEffect, useState } from "react";
import { getKanbanData } from "../controllers/kanbanController";
import { Step } from "@/models/Steps";

export function useKanban(kanbanId: string) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getKanbanData(kanbanId);
      setSteps(data);
      setLoading(false);
    }

    fetchData();
  }, [kanbanId]);

  return { steps, loading };
}
