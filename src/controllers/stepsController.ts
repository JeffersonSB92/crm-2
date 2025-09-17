import { supabase } from "../lib/supabaseClient"
import { Step } from "../models/Steps"

export async function getStepsByKanban(kanbanId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from("kanban_steps")
    .select(`
      step_id,
      name
    `)
    .eq("kanban_id", kanbanId)

  if (error) {
    console.error("Erro ao buscar leads por steps:", error)
    return []
  }

  return data as Step[]
}
