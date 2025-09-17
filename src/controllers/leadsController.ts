// controllers/leadController.ts
import { supabase } from "../lib/supabaseClient"
import { LeadSupabase, LeadCard, Step } from "../models/LeadCard"

// Buscar steps do Kanban
export async function getLeadsSteps(kanbanId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from("kanban_steps")
    .select("step_id, name")
    .eq("kanban_id", kanbanId)

  if (error) {
    console.error("Erro ao buscar steps:", error)
    return []
  }

  return data ?? []
}

// Buscar leads de um step
export async function getLeadsByStep(stepId: string): Promise<LeadCard[]> {
  const { data, error } = await supabase
    .from("lead")
    .select(`
      lead_id,
      step_id,
      ultima_atualizacao,
      pessoa:pessoa_id (
        nome,
        iniciais,
        empresa:empresa_id (
          nome
        )
      ),
      atividade:atividade_id (
        titulo
      )
    `)
    .eq("step_id", stepId)

  if (error) {
    console.error("Erro ao buscar leads:", error)
    return []
  }

  return (data ?? []).map((lead: LeadSupabase) => {
  const pessoa = lead.pessoa?.[0];       // pega o primeiro objeto da pessoa
  const atividade = lead.atividade?.[0]; // pega o primeiro objeto da atividade
  const empresa = pessoa?.empresa?.[0];  // pega o primeiro objeto da empresa

  return {
    lead_id: lead.lead_id,
    step_id: lead.step_id,
    nome: pessoa?.nome ?? "",
    iniciais: pessoa?.iniciais ?? "",
    empresa: empresa?.nome ?? "",
    ultima_atualizacao: lead.ultima_atualizacao ?? "",
    atividade: atividade?.titulo ?? "",
  };
});

}
