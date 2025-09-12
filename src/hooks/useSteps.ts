"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Step = {  
  step_id: string;
  kanban_id: string;
  name: string;
  posicao: number;
  deadline?: string | null;
};

export function useSteps(kanbanId: string) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSteps() {
      setLoading(true);
      const { data, error } = await supabase
        .from("kanban_steps")
        .select("*")
        .eq("kanban_id", kanbanId)
        .order("posicao", { ascending: true });

      if (error) {
        console.error("Erro ao buscar steps:", error.message);
      } else {
        setSteps(data || []);
      }
      setLoading(false);
    }

    fetchSteps();
  }, [kanbanId]);

  return { steps, loading };
}   