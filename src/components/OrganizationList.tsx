"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NewOrgButton } from "./NewOrg"
import { getAllOrgs, OrgResponse, deleteOrg } from "@/controllers/organizationController"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

export const columns: ColumnDef<OrgResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-1" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "responsavel",
    header: "Responsável",
    cell: ({ row }) => <div className="capitalize">{row.getValue("responsavel")}</div>,
  },
  {
    accessorKey: "segmento",
    header: "Segmento",
    cell: ({ row }) => <div className="capitalize">{row.getValue("segmento")}</div>,
  },
  {
    accessorKey: "numero_colaboradores",
    header: "Colaboradores",
    cell: ({ row }) => <div>{row.getValue("numero_colaboradores")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const org = row.original

      const handleDelete = async () => {
        const success = await deleteOrg(org.empresa_id)
        if (success) {
          // depois de excluir, recarregar a lista
          // você pode emitir um evento ou chamar fetchOrgs se passar por prop
          window.location.reload() // solução rápida
        }

      }
      return (
        <div className="flex justify-end gap-2 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
            onClick={() => console.log("Editar:", org.nome)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-zinc-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir empresa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação vai excluir a empresa e <strong>todas as pessoas vinculadas</strong>.
                  Deseja realmente continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Sim, excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

export function OrganizationList() {
  const [data, setData] = React.useState<OrgResponse[]>([])
  const [loading, setLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const fetchOrgs = async () => {
    setLoading(true)
    const orgs = await getAllOrgs()
    setData(orgs)
    setLoading(false)
  }

  React.useEffect(() => {
    fetchOrgs()
  }, [])

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtre por organização..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center justify-end space-x-2 py-4">
          <NewOrgButton onOrgCreated={fetchOrgs} />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#293b4a]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black bg-[#EBEBEB]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-200">
                  Carregando organizações...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-[#293b4a] text-zinc-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-200">
                  Nenhuma organização encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm text-zinc-100">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length}{" "}
          {table.getFilteredRowModel().rows.length === 1 ? "linha selecionada" : "linhas selecionadas"}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-zinc-200"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
