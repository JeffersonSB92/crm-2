// controllers/kanbanController.ts
import { supabase } from "../lib/supabaseClient"
import { LeadCard, StepWithLeads } from "../models/Steps"

export interface CreateLeadData {
  nome: string
  email: string
  telefone: string
  empresa_id: string
  cargo: string
  step_id: string
}

export interface LeadResponse {
  lead_id: string
  step_id: string
  ultima_atualizacao: string
  pessoa: {
    nome: string
    iniciais: string
    empresa: {
      nome: string
    }
  }
  atividade: {
    titulo: string
  } | null
}

export interface UpdateLeadData {
  nome?: string
  email?: string
  telefone?: string
  cargo?: string
  empresa_id?: string
  step_id?: string
  atividade_id?: string | null
}

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
        email,
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
    const email = lead.email
    const valor = 0
    const atividade = lead.atividade

    return {
      lead_id: lead.lead_id,
      step_id: lead.step_id,
      nome: pessoa?.nome ?? "Nome não informado",
      iniciais: pessoa?.iniciais ?? "NI",
      empresa: empresa?.nome ?? "Empresa não informada",
      email: pessoa.email ?? "Pessoa não informada",
      valor: lead.valor ?? 0,
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

// Função para criar um novo lead
export async function createLead(leadData: CreateLeadData): Promise<LeadResponse | null> {
  try {
    // A empresa já deve existir (empresa_id foi selecionado)

    // Criar a pessoa
    const iniciais = leadData.nome
      .split(" ")
      .map(nome => nome.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const { data: pessoaData, error: pessoaError } = await supabase
      .from("pessoa")
      .insert({
        nome: leadData.nome,
        email: leadData.email,
        telefone: leadData.telefone,
        cargo: leadData.cargo,
        iniciais: iniciais,
        empresa_id: leadData.empresa_id
      })
      .select("pessoa_id")
      .single()

    if (pessoaError) {
      console.error("Erro ao criar pessoa:", pessoaError)
      return null
    }

    // Criar o lead
    const { data: leadDataResult, error: leadError } = await supabase
      .from("lead")
      .insert({
        pessoa_id: pessoaData.pessoa_id,
        step_id: leadData.step_id,
        ultima_atualizacao: new Date().toISOString()
      })
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
      .single()

    if (leadError) {
      console.error("Erro ao criar lead:", leadError)
      return null
    }

    // --- Normalização ---
    const pessoaRaw = Array.isArray(leadDataResult.pessoa)
      ? leadDataResult.pessoa[0]
      : leadDataResult.pessoa

    const atividadeRaw = Array.isArray(leadDataResult.atividade)
      ? leadDataResult.atividade[0]
      : leadDataResult.atividade

    const empresaRaw = pessoaRaw
      ? (Array.isArray(pessoaRaw.empresa) ? pessoaRaw.empresa[0] : pessoaRaw.empresa)
      : null

    const normalizedLead: LeadResponse = {
      lead_id: leadDataResult.lead_id,
      step_id: leadDataResult.step_id,
      ultima_atualizacao: leadDataResult.ultima_atualizacao,
      pessoa: pessoaRaw
        ? {
          nome: pessoaRaw.nome ?? "",
          iniciais: pessoaRaw.iniciais ?? "",
          empresa: {
            nome: empresaRaw?.nome ?? ""
          }
        }
        : { nome: "", iniciais: "", empresa: { nome: "" } }, // fallback seguro
      atividade: atividadeRaw
        ? { titulo: atividadeRaw.titulo ?? "" }
        : null
    }

    return normalizedLead

  } catch (error) {
    console.error("Erro geral ao criar lead:", error)
    return null
  }
}

export async function deleteLead(leadId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("lead")
      .delete()
      .eq("lead_id", leadId)

    if (error) {
      console.error("Erro ao excluir lead:", error)
      return false
    }

    console.log(`Lead ${leadId} excluído com sucesso`)
    return true

  } catch (error) {
    console.error("Erro geral ao excluir lead:", error)
    return false
  }
}

// Função para buscar empresas existentes
export async function getEmpresas(): Promise<{ empresa_id: string, nome: string }[]> {
  try {
    const { data, error } = await supabase
      .from("empresa")
      .select("empresa_id, nome")
      .order("nome", { ascending: true })

    if (error) {
      console.error("Erro ao buscar empresas:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro geral ao buscar empresas:", error)
    return []
  }
}

// Função para criar uma nova empresa
export async function createEmpresa(nome: string): Promise<{ empresa_id: string } | null> {
  try {
    const { data, error } = await supabase
      .from("empresa")
      .insert({ nome })
      .select("empresa_id")
      .single()

    if (error) {
      console.error("Erro ao criar empresa:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro geral ao criar empresa:", error)
    return null
  }
}

export async function updateLead(leadId: string, updateData: UpdateLeadData): Promise<LeadResponse | null> {
  try {
    // 🔹 Buscar o lead original para pegar o pessoa_id
    const { data: leadData, error: fetchError } = await supabase
      .from("lead")
      .select("pessoa_id")
      .eq("lead_id", leadId)
      .single()

    if (fetchError || !leadData) {
      console.error("Erro ao buscar lead:", fetchError)
      return null
    }

    const pessoaId = leadData.pessoa_id

    // 🔹 Atualizar dados da pessoa (caso existam campos de pessoa)
    if (updateData.nome || updateData.email || updateData.telefone || updateData.cargo || updateData.empresa_id) {
      const { error: pessoaError } = await supabase
        .from("pessoa")
        .update({
          nome: updateData.nome,
          email: updateData.email,
          telefone: updateData.telefone,
          cargo: updateData.cargo,
          empresa_id: updateData.empresa_id
        })
        .eq("pessoa_id", pessoaId)

      if (pessoaError) {
        console.error("Erro ao atualizar pessoa:", pessoaError)
        return null
      }
    }

    // 🔹 Atualizar dados do lead
    const { data: updatedLead, error: leadError } = await supabase
      .from("lead")
      .update({
        step_id: updateData.step_id,
        atividade_id: updateData.atividade_id,
        ultima_atualizacao: new Date().toISOString()
      })
      .eq("lead_id", leadId)
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
      .single()

    if (leadError) {
      console.error("Erro ao atualizar lead:", leadError)
      return null
    }

    // --- Normalização ---
    const pessoaRaw = Array.isArray(updatedLead.pessoa)
      ? updatedLead.pessoa[0]
      : updatedLead.pessoa

    const atividadeRaw = Array.isArray(updatedLead.atividade)
      ? updatedLead.atividade[0]
      : updatedLead.atividade

    const empresaRaw = pessoaRaw
      ? (Array.isArray(pessoaRaw.empresa) ? pessoaRaw.empresa[0] : pessoaRaw.empresa)
      : null

    const normalizedLead: LeadResponse = {
      lead_id: updatedLead.lead_id,
      step_id: updatedLead.step_id,
      ultima_atualizacao: updatedLead.ultima_atualizacao,
      pessoa: pessoaRaw
        ? {
          nome: pessoaRaw.nome ?? "",
          iniciais: pessoaRaw.iniciais ?? "",
          empresa: { nome: empresaRaw?.nome ?? "" },
        }
        : { nome: "", iniciais: "", empresa: { nome: "" } },
      atividade: atividadeRaw
        ? { titulo: atividadeRaw.titulo ?? "" }
        : null
    }

    console.log(`Lead ${leadId} atualizado com sucesso!`)
    return normalizedLead

  } catch (error) {
    console.error("Erro geral ao atualizar lead:", error)
    return null
  }
}