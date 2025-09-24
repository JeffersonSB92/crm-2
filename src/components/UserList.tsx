"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"

// Interface do lead que será passada via props
export interface LeadListItem {
  lead_id: string
  nome: string
  iniciais: string
  empresa: string
  status: string
  valor?: number
  email: string
}

export interface UserListProps {
  data: LeadListItem[];
}

export default function UserList({ data }: UserListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Definição das colunas da tabela
  const columns: ColumnDef<LeadListItem>[] = [
    {
      accessorKey: "nome",
      header: "Lead",
      cell: ({ row }: { row: Row<LeadListItem> }) => (
        <div className="flex">
          <Avatar className="mr-2">
            <AvatarFallback className="bg-white text-black">{row.original.iniciais}</AvatarFallback>
          </Avatar>
          <div>
            <div>{row.original.nome}</div>
            <div className="text-xs text-zinc-400">{row.original.empresa}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<LeadListItem> }) => (
        <Badge className="bg-zinc-200 text-black"> {row.original.status} </Badge>
      )
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ row }: { row: Row<LeadListItem> }) => {
        const value = row.original.valor ?? 0
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2
        }).format(value)
      },
    },
    {
      accessorKey: "email",
      header: "Contato",
      cell: ({ row }: { row: Row<LeadListItem> }) => <div>{row.original.email}</div>,
    },
  ]


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <div className="w-full text-white">
      <div className="overflow-hidden rounded-md border-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black bg-[#EBEBEB]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="bg-[#293b4a]">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
