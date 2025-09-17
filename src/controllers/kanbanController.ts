// controllers/kanbanController.ts
import { supabase } from "../lib/supabaseClient"

export interface LeadCard {
  lead_id: string
  step_id: string
  nome: string
  iniciais: string
  empresa: string
  ultima_atualizacao: string
  atividade: string
}

export interface Step {
  step_id: string
  name: string
  leads: LeadCard[]
}

export async function getKanbanData(kanbanId: string): Promise<Step[]> {
  // Buscar todos os steps do kanban
  const { data: steps, error: stepsError } = await supabase
    .from("kanban_steps")
    .select("step_id, name, posicao")
    .eq("kanban_id", kanbanId)
    .order("posicao", { ascending: true })

  if (stepsError) {
    console.error("Erro ao buscar steps:", stepsError)
    return []
  }

  // Buscar todos os leads ligados a esses steps
  const { data: leads, error: leadsError } = await supabase
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
    .in("step_id", steps.map(s => s.step_id))

  if (leadsError) {
    console.error("Erro ao buscar leads:", leadsError)
    return []
  }

  // Transformar leads para o formato flat
  const leadsFlat: LeadCard[] = (leads ?? []).map((lead: any) => {
    const pessoa = lead.pessoa?.[0]
    const empresa = pessoa?.empresa?.[0]
    const atividade = lead.atividade?.[0]

    return {
      lead_id: lead.lead_id,
      step_id: lead.step_id,
      nome: pessoa?.nome ?? "",
      iniciais: pessoa?.iniciais ?? "",
      empresa: empresa?.nome ?? "",
      ultima_atualizacao: lead.ultima_atualizacao ?? "",
      atividade: atividade?.titulo ?? "",
    }
  })

  // Agrupar leads por step
  const stepsWithLeads: Step[] = steps.map(step => ({
    ...step,
    leads: leadsFlat.filter(lead => lead.step_id === step.step_id),
  }))

  return stepsWithLeads
}
