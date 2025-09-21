export interface Step {
  step_id: string
  name: string
}

export interface LeadCard {
  lead_id: string
  step_id: string
  nome: string
  iniciais: string
  empresa: string
  ultima_atualizacao: string
  atividade: string
}

export interface StepWithLeads extends Step {
  leads: LeadCard[]
}