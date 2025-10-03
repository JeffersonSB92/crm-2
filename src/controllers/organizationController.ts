import { supabase } from "../lib/supabaseClient"

export interface CreateOrgData {
  nome: string
  email: string
  segmento: string
  num_colaboradores: number
}

export interface OrgResponse {
  empresa_id: string
  nome: string
  email: string
  segmento: string
  num_colaboradores: number
}

/**
 * Buscar uma organização pelo ID
 */
export async function getOrgData(orgId: string): Promise<OrgResponse | null> {
  const { data, error } = await supabase
    .from("empresa")
    .select("empresa_id, nome, email, segmento, num_colaboradores")
    .eq("empresa_id", orgId)
    .single()

  if (error) {
    console.error("Erro ao buscar empresa:", error)
    return null
  }

  return {
    empresa_id: data.empresa_id,
    nome: data.nome ?? "",
    email: data.email ?? "",
    segmento: data.segmento ?? "Não informado",
    num_colaboradores: data.num_colaboradores ?? 0,
  }
}

/**
 * Criar uma nova organização
 */
export async function createOrg(orgData: CreateOrgData): Promise<OrgResponse | null> {
  const { data, error } = await supabase
    .from("empresa")
    .insert({
      nome: orgData.nome,
      email: orgData.email,
      segmento: orgData.segmento,
      num_colaboradores: orgData.num_colaboradores,
    })
    .select("empresa_id, nome, email, segmento, num_colaboradores")
    .single()

  if (error) {
    console.error("Erro ao criar empresa:", error)
    return null
  }

  return {
    empresa_id: data.empresa_id,
    nome: data.nome,
    email: data.email,
    segmento: data.segmento,
    num_colaboradores: data.num_colaboradores,
  }
}

/**
 * Listar todas as organizações
 */
export async function getAllOrgs(): Promise<OrgResponse[]> {
  const { data, error } = await supabase
    .from("empresa")
    .select("empresa_id, nome, email, segmento, num_colaboradores")
    .order("nome", { ascending: true })

  if (error) {
    console.error("Erro ao buscar empresas:", error)
    return []
  }

  return data.map((org) => ({
    empresa_id: org.empresa_id,
    nome: org.nome ?? "",
    email: org.email ?? "",
    segmento: org.segmento ?? "Não informado",
    num_colaboradores: org.num_colaboradores ?? 0,
  }))
}

/**
 * Deletar organização pelo ID
 */
export async function deleteOrg(orgId: string): Promise<boolean> {
  const { error } = await supabase
    .from("empresa")
    .delete()
    .eq("empresa_id", orgId)

  if (error) {
    console.error("Erro ao excluir empresa:", error)
    return false
  }

  return true
}

/**
 * Atualizar organização
 */
export async function updateOrg(orgId: string, data: Partial<CreateOrgData>): Promise<OrgResponse | null> {
  const { data: updateData, error } = await supabase
    .from("empresa")
    .update(data)
    .eq("empresa_id", orgId)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar empresa: ", error)
    return null
  }

  return updateData as OrgResponse
}
