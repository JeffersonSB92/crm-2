import { ColumnDef } from "@tanstack/react-table"

export type Lead = {
  id: string
  nome: string
  empresa: string
  status: string
  valor: number
  contato: string
}

export const data: Lead[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    empresa: "TechSolutions",
    status: "Novo",
    valor: 15000,
    contato: "carlos@techsolutions.com",
  },
  {
    id: "2",
    nome: "Ana Oliveira",
    empresa: "Saúde Integral",
    status: "Em Contato",
    valor: 8500,
    contato: "ana@saudeintegral.com",
  },
  {
    id: "3",
    nome: "Roberto Almeida",
    empresa: "Educação Plus",
    status: "Proposta",
    valor: 12000,
    contato: "roberto@educacaoplus.com",
  },
]

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "nome",
    header: "Lead",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("nome")}</div>
        <div className="text-xs text-muted-foreground">{row.original.empresa}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "valor",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"))
      const formatted = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "contato",
    header: "Contato",
    cell: ({ row }) => <div className="lowercase">{row.getValue("contato")}</div>,
  },
]
