// controllers/leadsController.ts
import { supabase } from "../lib/supabaseClient"

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

// Função para buscar empresas existentes
export async function getEmpresas(): Promise<{empresa_id: string, nome: string}[]> {
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
export async function createEmpresa(nome: string): Promise<{empresa_id: string} | null> {
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

    return leadDataResult as LeadResponse

  } catch (error) {
    console.error("Erro geral ao criar lead:", error)
    return null
  }
}

// Função para excluir um lead
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