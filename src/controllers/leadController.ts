import { supabase } from "../lib/supabaseClient"
import { Step } from "../models/Lead"

export async function getLeadsBySteps(kanbanId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from("kanban_steps")
    .select(`
      step_id,
      name,
      leads:lead (
        lead_id,
        ultima_atualizacao,
        atividade:atividade_id ( 
          titulo, 
          data, 
          hora_inicio, 
          hora_fim
          ),
        pessoa:pessoa_id ( 
          nome, 
          iniciais,
          empresa:empresa_id (
            nome             
          )
        )
      )
    `)
    .eq("kanban_id", kanbanId)

  if (error) {
    console.error("Erro ao buscar leads por steps:", error)
    return []
  }

  return data as Step[]
}
