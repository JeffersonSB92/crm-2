import { supabase } from "../lib/supabaseClient"
import { Step } from "../models/Lead"

export async function getLeadsBySteps(kanbanId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from("kanban_steps")
    .select(`
      step_id,
      nome,
      leads:lead (
        lead_id,
        ultima_atualizacao,
        pessoa:pessoa_id ( nome, empresa )
      )
    `)
    .eq("kanban_id", kanbanId)

  if (error) {
    console.error("Erro ao buscar leads por steps:", error)
    return []
  }

  return data as Step[]
}
