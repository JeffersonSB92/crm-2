// models/Lead.ts

// Tipo que representa o retorno do Supabase (aninhado)
export interface LeadSupabase {
  lead_id: string;
  step_id: string;
  ultima_atualizacao: string | null;
  pessoa: {
    nome: string;
    iniciais: string;
    empresa: { nome: string }[];
  }[] | null;
  atividade: { titulo: string }[] | null;
}

// Tipo flat que o CardKanban vai usar
export interface LeadCard {
  lead_id: string
  step_id: string
  nome: string
  iniciais: string
  empresa: string
  ultima_atualizacao: string
  atividade: string
}

// Tipo para Step do Kanban (se ainda não tiver)
export interface Step {
  step_id: string
  name: string
}