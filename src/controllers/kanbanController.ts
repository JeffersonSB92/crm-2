// controllers/kanbanController.ts
import { supabase } from "../lib/supabaseClient"
import { LeadCard, StepWithLeads } from "../models/Steps"

export async function getKanbanData(kanbanId: string): Promise<StepWithLeads[]> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadsFlat: LeadCard[] = (leads ?? []).map((lead: any) => {
    const pessoa = lead.pessoa
    const empresa = pessoa?.empresa
    const atividade = lead.atividade

    return {
      lead_id: lead.lead_id,
      step_id: lead.step_id,
      nome: pessoa?.nome ?? "Nome não informado",
      iniciais: pessoa?.iniciais ?? "NI",
      empresa: empresa?.nome ?? "Empresa não informada",
      ultima_atualizacao: lead.ultima_atualizacao ?? "Sem atualização",
      atividade: atividade?.titulo ?? "Sem atividade",
    }
  })

  // Agrupar leads por step
  const stepsWithLeads: StepWithLeads[] = steps.map(step => ({
    ...step,
    leads: leadsFlat.filter(lead => lead.step_id === step.step_id),
  }))

  return stepsWithLeads
}

// Função para mover lead para próxima etapa
export async function moveLeadToNextStep(leadId: string, currentStepId: string, steps: StepWithLeads[]): Promise<boolean> {
  try {
    // Encontrar o índice da etapa atual
    const currentStepIndex = steps.findIndex(step => step.step_id === currentStepId)
    
    // Verificar se existe próxima etapa
    if (currentStepIndex === -1 || currentStepIndex >= steps.length - 1) {
      console.log("Não há próxima etapa disponível")
      return false
    }
    
    // Obter o ID da próxima etapa
    const nextStepId = steps[currentStepIndex + 1].step_id
    
    // Atualizar no banco de dados
    const { error } = await supabase
      .from("lead")
      .update({ 
        step_id: nextStepId,
        ultima_atualizacao: new Date().toISOString()
      })
      .eq("lead_id", leadId)
    
    if (error) {
      console.error("Erro ao mover lead:", error)
      return false
    }
    
    console.log(`Lead ${leadId} movido da etapa ${currentStepId} para ${nextStepId}`)
    return true
    
  } catch (error) {
    console.error("Erro ao mover lead:", error)
    return false
  }
}

// Função para mover lead para etapa específica
export async function moveLeadToStep(leadId: string, targetStepId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("lead")
      .update({ 
        step_id: targetStepId,
        ultima_atualizacao: new Date().toISOString()
      })
      .eq("lead_id", leadId)
    
    if (error) {
      console.error("Erro ao mover lead:", error)
      return false
    }
    
    console.log(`Lead ${leadId} movido para etapa ${targetStepId}`)
    return true
    
  } catch (error) {
    console.error("Erro ao mover lead:", error)
    return false
  }
}
