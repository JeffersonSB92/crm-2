"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Phone,
  Clock,
  MoveRight,
  MoreVertical,
  Trash2,
  Edit,
  Info,
  BellOff
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"

export interface CardKanbanProps {
  nome: string
  empresa: string
  ultima_atualizacao: string
  atividade: string
  iniciais: string
  lead_id: string
  step_id: string
  onMoveLead?: (leadId: string, currentStepId: string) => void
  onDeleteLead?: (leadId: string) => void
  onEditLead?: (leadId: string, updatedData: { nome: string; empresa: string; atividade: string }) => void
  canMoveForward?: boolean
  isMoving?: boolean
}

export function CardKanban({
  nome,
  empresa,
  ultima_atualizacao,
  atividade,
  iniciais,
  lead_id,
  step_id,
  onMoveLead,
  onDeleteLead,
  onEditLead,
  canMoveForward = true,
  isMoving = false,
}: CardKanbanProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedNome, setEditedNome] = useState(nome)
  const [editedEmpresa, setEditedEmpresa] = useState(empresa)
  const [editedAtividade, setEditedAtividade] = useState(atividade)
  const [infoSheetOpen, setInfoSheetOpen] = useState(false)

  const handleMoveForward = () => {
    if (onMoveLead && canMoveForward && !isMoving) {
      onMoveLead(lead_id, step_id)
    }
  }

  const handleDelete = () => {
    if (onDeleteLead && !isMoving) {
      onDeleteLead(lead_id)
    }
  }

  const handleSave = () => {
    if (onEditLead) {
      onEditLead(lead_id, {
        nome: editedNome,
        empresa: editedEmpresa,
        atividade: editedAtividade,
      })
      setEditDialogOpen(false)
    }
  }

  return (
    <Card className={`w-full max-w-sm bg-[#293b4a] ${isMoving ? "opacity-50 animate-pulse" : ""}`}>
      <CardHeader>
        <CardTitle className="text-white">{nome}</CardTitle>
        <CardDescription className="text-white">{empresa}</CardDescription>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white">
              {/* === SHEET DE INFORMAÇÕES === */}
              <Sheet open={infoSheetOpen} onOpenChange={setInfoSheetOpen}>
                <SheetTrigger asChild>
                  <DropdownMenuItem
                    className="hover:bg-blue-50 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Info size={16} className="mr-2" />
                    Infos
                  </DropdownMenuItem>
                </SheetTrigger>

                <SheetContent className="bg-[#1e293b] sm:max-w-[850px] text-white flex flex-col">
                  <div className="flex-1 px-6 flex flex-col">
                    <SheetHeader className="mt-6" />

                    {/* Card com avatar e informações */}
                    <div className="flex items-center bg-[#0d1b2a] p-4 ml-4 mr-4 rounded-xl border-2 border-zinc-900">
                      <Avatar className="ml-4 h-50 w-50 border-2 border-zinc-500">
                        <AvatarImage src="profile.png" />
                        <AvatarFallback className="bg-[#293b4a] font-bold text-4xl">
                          {iniciais}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-6">
                        <p className="font-bold text-2xl text-white">{nome}</p>
                        <p className="text-sm font-medium text-zinc-400">{empresa}</p>
                        <Badge className="text-white border-1 border-zinc-500">
                          {atividade}
                        </Badge>
                        <p className="text-xs text-zinc-400 mt-16">
                          Última atualização: {ultima_atualizacao}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-1 border-zinc-600 mt-4" />

                    {/* Botões superiores */}
                    <div className="flex justify-center mt-4">
                      <Button className="mr-4 hover:bg-[#0d1b2a6b]">Criar Atividade</Button>
                      <Button className="mr-4 hover:bg-[#0d1b2a6b]">Ver Agenda</Button>
                      <Button className="mr-4 hover:bg-[#0d1b2a6b]">Timeline</Button>
                    </div>

                    {/* 🔽 Container flex que centraliza o Empty verticalmente */}
                    <div className="flex-1 flex items-center justify-center mt-6 mb-6">
                      <Empty className="bg-[#0d1b2a] py-12 px-6 rounded-xl w-full max-w-md">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <BellOff />
                          </EmptyMedia>
                          <EmptyTitle>No Notifications</EmptyTitle>
                          <EmptyDescription>
                            You&apos;re all caught up. New notifications will appear here.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  </div>

                  {/* Rodapé fixo no final */}
                  <SheetFooter className="px-6 pb-6">
                    <SheetClose asChild>
                      <Button className="w-full">Fechar</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>

              </Sheet>

              {/* === MODAL DE EDIÇÃO === */}
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="hover:bg-blue-50 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Edit size={16} className="mr-2" />
                    Editar
                  </DropdownMenuItem>
                </DialogTrigger>

                <DialogContent className="bg-white sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar Lead</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="nome"
                        value={editedNome}
                        onChange={(e) => setEditedNome(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empresa" className="text-right">
                        Empresa
                      </Label>
                      <Input
                        id="empresa"
                        value={editedEmpresa}
                        onChange={(e) => setEditedEmpresa(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="atividade" className="text-right">
                        Atividade
                      </Label>
                      <Input
                        id="atividade"
                        value={editedAtividade}
                        onChange={(e) => setEditedAtividade(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* === MODAL DE EXCLUSÃO === */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 hover:!text-red-600 hover:bg-red-50 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 size={16} className="mr-2 text-red-600" />
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Excluir Lead</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Tem certeza que deseja excluir o lead{" "}
                      <strong className="text-gray-900">&quot;{nome}&quot;</strong>?
                      <br />
                      <br />
                      Esta ação não pode ser desfeita e o lead será removido permanentemente do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div>
          <p className="text-sm mt-4 text-white flex items-center gap-1">
            <Clock size={12} />
            {ultima_atualizacao}
          </p>
          <p className="text-sm text-white flex items-center gap-1">
            <MoveRight size={12} />
            {atividade}
          </p>
        </div>
      </CardContent>

      <CardFooter className="grid-col-2 justify-between">
        <div className="grid grid-cols-3 items-center">
          <Avatar className="mr-2">
            <AvatarImage src="profile.png" />
            <AvatarFallback className="bg-white text-black">{iniciais}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" className="text-white hover:text-black">
            <Phone size={18} />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="justify-end text-white"
          onClick={handleMoveForward}
          disabled={!canMoveForward || isMoving}
        >
          {isMoving ? "Movendo..." : "Avançar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
