"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrg, CreateOrgData, updateOrg, OrgResponse } from "@/controllers/organizationController"

interface OrgDialogProps {
  mode: "create" | "update"
  onOrgSaved: () => void
  org?: OrgResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewOrgButton({
  mode,
  org,
  onOrgSaved,
  open,
  onOpenChange,
}: OrgDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-100">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Organização" : "Editar Organização"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações para criação da organização."
              : "Altere as informações da organização e salve as mudanças."}
          </DialogDescription>
        </DialogHeader>
        <OrgForm
          mode={mode}
          org={org}
          onOrgSaved={() => {
            onOrgSaved()
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface OrgFormProps {
  className?: string
  mode: "create" | "update"
  org?: OrgResponse
  onOrgSaved?: () => void
}

function OrgForm({ className, mode, org, onOrgSaved }: OrgFormProps) {
  const [formData, setFormData] = React.useState({
    nome: org?.nome ?? "",
    email: org?.email ?? "",
    segmento: org?.segmento ?? "",
    numero_colaboradores: org?.numero_colaboradores?.toString() ?? "",
  })

  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email) {
      alert("Por favor, preencha pelo menos Nome e Email")
      return
    }

    setLoading(true)

    try {
      const orgData: CreateOrgData = {
        nome: formData.nome,
        email: formData.email,
        segmento: formData.segmento,
        numero_colaboradores: Number(formData.numero_colaboradores) || 0,
      }

      let result
      if (mode === "create") {
        result = await createOrg(orgData)
      } else if (mode === "update" && org?.empresa_id) {
        result = await updateOrg(org.empresa_id, orgData)
      }

      if (result) {
        onOrgSaved?.()
      } else {
        alert("Erro ao salvar organização. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao salvar organização:", error)
      alert("Erro ao salvar organização. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          placeholder="Insira o nome da organização..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          placeholder="Insira o email da organização..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="segmento">Segmento</Label>
        <Input
          id="segmento"
          placeholder="Ex: Tecnologia, Saúde, Educação..."
          value={formData.segmento}
          onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="numero_colaboradores">Número de Colaboradores</Label>
        <Input
          type="number"
          id="numero_colaboradores"
          placeholder="Ex: 50"
          value={formData.numero_colaboradores}
          onChange={(e) =>
            setFormData({ ...formData, numero_colaboradores: e.target.value })
          }
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? mode === "create"
            ? "Criando..."
            : "Salvando..."
          : mode === "create"
          ? "Criar Organização"
          : "Salvar Alterações"}
      </Button>
    </form>
  )
}
