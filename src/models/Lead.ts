export interface Pessoa {
  nome: string
  empresa?: string
}

export interface Lead {
  lead_id: string
  pessoa: Pessoa[]
  ultima_atualizacao: string | null
}

export interface Step {
  step_id: string
  name: string
  leads: Lead[]
}
